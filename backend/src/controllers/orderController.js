const Order = require('../models/Order');
const Product = require('../models/Product');

// Helper to generate unique order number
const generateOrderNumber = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${randomNum}`;
};

// Helper to generate unique tracking number
const generateTrackingNumber = () => {
  const part1 = Math.floor(1000 + Math.random() * 9000);
  const part2 = Math.floor(1000 + Math.random() * 9000);
  return `TRK-${part1}-${part2}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponApplied
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full shipping address details'
      });
    }

    // Verify items and calculate pricing
    let itemsPrice = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.title || item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}. Only ${product.stock} available.`
        });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      const itemTotal = product.price * item.quantity;
      itemsPrice += itemTotal;

      verifiedItems.push({
        product: product._id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: item.quantity
      });
    }

    // Shipping: Free over ₹999, else ₹99
    const shippingPrice = itemsPrice >= 999 ? 0 : 99;
    // Estimated GST 5%
    const taxPrice = Math.round(itemsPrice * 0.05);
    
    // Discounts
    let discountPrice = 0;
    if (couponApplied) {
      const upperCoupon = couponApplied.toUpperCase().trim();
      if (upperCoupon === 'SAVE20') {
        discountPrice = Math.round(itemsPrice * 0.20);
      } else if (upperCoupon === 'WELCOME10') {
        discountPrice = Math.round(itemsPrice * 0.10);
      }
    }

    const totalPrice = Math.max(0, Math.round(itemsPrice + shippingPrice + taxPrice - discountPrice));

    const orderNumber = generateOrderNumber();
    const trackingNumber = generateTrackingNumber();

    // Set estimated delivery 4 business days ahead
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);

    const initialHistory = [
      {
        status: 'Placed',
        note: 'Order confirmed and registered in processing center.',
        timestamp: new Date(),
        location: 'Apex Central Fulfillment Hub'
      }
    ];

    const order = await Order.create({
      user: req.user._id,
      orderNumber,
      trackingNumber,
      carrier: 'BlueDart Express Priority',
      items: verifiedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountPrice,
      totalPrice,
      couponApplied: couponApplied || '',
      status: 'Placed',
      statusHistory: initialHistory,
      estimatedDelivery
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('[Order Creation Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating order'
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user orders'
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization: must be the order owner or an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching order details'
    });
  }
};

// @desc    Track order by Order Number or Tracking Number
// @route   GET /api/orders/track/:query
// @access  Public
exports.trackOrder = async (req, res) => {
  try {
    const query = req.params.query.trim().toUpperCase();

    const order = await Order.findOne({
      $or: [
        { orderNumber: query },
        { trackingNumber: query }
      ]
    }).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `No active order found with identifier: ${query}`
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error tracking order'
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { trackingNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching all orders'
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note, location } = req.body;

    const validStatuses = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Choose from: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    
    // Add to history
    order.statusHistory.push({
      status,
      note: note || `Status updated to ${status}`,
      location: location || 'Sorting & Dispatch Center',
      timestamp: new Date()
    });

    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status successfully updated to ${status}`,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating order status'
    });
  }
};

// @desc    Cancel order (Customer or Admin)
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    if (order.status === 'Shipped' || order.status === 'Out for Delivery' || order.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order after dispatch (current status: ${order.status})`
      });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    order.status = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      note: req.body.reason || 'Cancelled by user request',
      location: 'Customer Care & Return Management',
      timestamp: new Date()
    });

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order successfully cancelled. Stock has been restored.',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error cancelling order'
    });
  }
};
