const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const sampleProducts = [
  // 1. Mobiles & Tablets
  {
    title: 'OnePlus Nord CE 4 5G (8GB RAM, 256GB Storage)',
    description: 'Powered by Snapdragon 7 Gen 3, 100W SuperVOOC fast charging, 120Hz Fluid AMOLED display, and 50MP Sony LYT-600 OIS camera.',
    price: 24999,
    compareAtPrice: 27999,
    category: 'Mobiles & Tablets',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    stock: 28,
    rating: 4.8,
    numReviews: 142,
    featured: true,
    badge: 'Best Seller',
    specs: [
      { label: 'Processor', value: 'Snapdragon 7 Gen 3' },
      { label: 'Display', value: '6.7" 120Hz AMOLED' },
      { label: 'Battery', value: '5500mAh + 100W Charging' },
      { label: 'Camera', value: '50MP OIS Sony Sensor' }
    ]
  },
  {
    title: 'Apple iPad 10th Gen (10.9-Inch Wi-Fi, 64GB)',
    description: 'Stunning 10.9-inch Liquid Retina display with True Tone, A14 Bionic chip, 12MP Ultra Wide front camera with Center Stage, and all-day battery life.',
    price: 34900,
    compareAtPrice: 39900,
    category: 'Mobiles & Tablets',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    stock: 15,
    rating: 4.9,
    numReviews: 98,
    featured: true,
    badge: 'Popular',
    specs: [
      { label: 'Chipset', value: 'Apple A14 Bionic' },
      { label: 'Screen', value: '10.9-inch Liquid Retina' },
      { label: 'Security', value: 'Touch ID in Top Button' },
      { label: 'Port', value: 'USB-C fast transfer' }
    ]
  },

  // 2. Electronics & Gadgets
  {
    title: 'StudioKey Custom Wireless Mechanical Keyboard',
    description: 'Gasket-mounted hot-swappable keyboard with pre-lubed linear switches, sound-dampening silicone sheets, per-key RGB backlighting, and CNC aluminum frame.',
    price: 4499,
    compareAtPrice: 5999,
    category: 'Electronics & Gadgets',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    stock: 22,
    rating: 4.9,
    numReviews: 87,
    featured: true,
    badge: 'Staff Pick',
    specs: [
      { label: 'Layout', value: '75% Compact (82 Keys)' },
      { label: 'Switches', value: 'Gateron Oil King Hot-Swap' },
      { label: 'Connectivity', value: 'Tri-Mode: 2.4GHz / BT 5.2 / Type-C' },
      { label: 'Battery', value: '4000mAh Rechargeable' }
    ]
  },
  {
    title: 'Lumix Compact 4K Creator Mirrorless Camera',
    description: 'High-speed autofocus sensor designed for content creators, uncropped 4K 60fps 10-bit video, 5-axis in-body image stabilization, and flip-out touchscreen.',
    price: 74990,
    compareAtPrice: 84990,
    category: 'Electronics & Gadgets',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    stock: 8,
    rating: 4.9,
    numReviews: 36,
    featured: false,
    badge: 'Professional',
    specs: [
      { label: 'Sensor', value: '26.1MP BSI CMOS' },
      { label: 'Video', value: '4K/60p 10-bit 4:2:2' },
      { label: 'Stabilization', value: '6.5 stops Dual I.S.' },
      { label: 'Viewfinder', value: 'OLED Live Viewfinder' }
    ]
  },
  {
    title: 'Anker PowerCore 20000mAh 65W Fast Power Bank',
    description: 'Massive capacity fast-charging portable power bank capable of charging laptops, phones, and tablets with 65W Power Delivery high output.',
    price: 3299,
    compareAtPrice: 4499,
    category: 'Electronics & Gadgets',
    image: 'https://images.unsplash.com/photo-1609592426815-56d1e4c9c107?w=800&auto=format&fit=crop&q=80',
    stock: 40,
    rating: 4.7,
    numReviews: 65,
    featured: false,
    badge: 'Fast Charge',
    specs: [
      { label: 'Capacity', value: '20,000mAh' },
      { label: 'Max Output', value: '65W Power Delivery' },
      { label: 'Ports', value: '2x USB-C + 1x USB-A' },
      { label: 'Weight', value: '380g' }
    ]
  },

  // 3. Audio & Sound
  {
    title: 'Aura Pro Active Noise Cancelling Headphones',
    description: 'Immersive spatial sound engineering with 45mm custom dynamic drivers, up to 40 hours battery endurance, plush memory foam earcups, and crystal clear transparency mode.',
    price: 9999,
    compareAtPrice: 13999,
    category: 'Audio & Sound',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    stock: 35,
    rating: 4.9,
    numReviews: 114,
    featured: true,
    badge: 'Best Seller',
    specs: [
      { label: 'ANC Type', value: 'Adaptive Hybrid Noise Cancelling' },
      { label: 'Playtime', value: 'Up to 40 Hours' },
      { label: 'Drivers', value: '45mm Titanium-Coated' },
      { label: 'Bluetooth', value: 'v5.3 with LDAC support' }
    ]
  },
  {
    title: 'EchoSphere Hi-Fi Wireless Wooden Desktop Speaker',
    description: 'Omnidirectional acoustics room-filling sound with dual passive bass radiators, Bluetooth 5.2 lossless audio, warm ambient LED ring, and walnut wood base.',
    price: 6499,
    compareAtPrice: 7999,
    category: 'Audio & Sound',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    stock: 18,
    rating: 4.7,
    numReviews: 54,
    featured: false,
    badge: 'New',
    specs: [
      { label: 'Power Output', value: '60W RMS Peak 90W' },
      { label: 'Material', value: 'Walnut Wood & Fabric Mesh' },
      { label: 'Inputs', value: 'Aux, Optical, Bluetooth' },
      { label: 'Frequency', value: '40Hz - 22,000Hz' }
    ]
  },
  {
    title: 'Boat Airdopes Pro True Wireless Earbuds',
    description: 'Beast mode low latency for gaming, ENx technology for noise-free voice calls, 50 hours of total playtime, and ASAP fast charge.',
    price: 1499,
    compareAtPrice: 2990,
    category: 'Audio & Sound',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    stock: 60,
    rating: 4.6,
    numReviews: 320,
    featured: false,
    badge: '50% Off',
    specs: [
      { label: 'Driver Size', value: '11mm Dynamic Drivers' },
      { label: 'Playback', value: '50 Hours Total' },
      { label: 'Water Rating', value: 'IPX5 Sweat Resistant' },
      { label: 'Latency', value: '65ms Beast Mode' }
    ]
  },

  // 4. Wearables & Watches
  {
    title: 'Titan Horizon Minimalist Titanium Smart Watch',
    description: 'Aerospace-grade titanium chassis with vivid AMOLED always-on display, 24/7 heart-rate and SpO2 tracking, multi-sport modes, and 7-day battery.',
    price: 4999,
    compareAtPrice: 6999,
    category: 'Wearables & Watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    stock: 24,
    rating: 4.8,
    numReviews: 78,
    featured: true,
    badge: 'Top Pick',
    specs: [
      { label: 'Display', value: '1.43" Super AMOLED 466x466' },
      { label: 'Sensors', value: 'HR, SpO2, Sleep, Stress' },
      { label: 'Water Resistance', value: '5 ATM (50m)' },
      { label: 'Battery', value: '7 Days Normal Use' }
    ]
  },
  {
    title: 'Fossil Gen 6 Classic Stainless Steel Watch',
    description: 'Timeless luxury analog and digital fusion with sapphire crystal glass, precision quartz movement, and premium stainless steel Milanese mesh bracelet.',
    price: 12495,
    compareAtPrice: 14995,
    category: 'Wearables & Watches',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    stock: 12,
    rating: 4.9,
    numReviews: 44,
    featured: false,
    badge: 'Luxury',
    specs: [
      { label: 'Case Material', value: '316L Stainless Steel' },
      { label: 'Glass', value: 'Scratch-Resistant Sapphire' },
      { label: 'Strap', value: 'Interchangeable 22mm Mesh' },
      { label: 'Water Resistance', value: '100m (10 ATM)' }
    ]
  },

  // 5. Fashion & Apparel
  {
    title: 'CloudStride Supercritical Running Athletic Shoes',
    description: 'Responsive supercritical nitrogen-infused foam midsole delivering 85% energy return. Breathable knit upper with targeted foot support for road running.',
    price: 3499,
    compareAtPrice: 4999,
    category: 'Fashion & Apparel',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    stock: 45,
    rating: 4.8,
    numReviews: 128,
    featured: true,
    badge: 'Trending',
    specs: [
      { label: 'Sole Type', value: 'High-Traction Carbon Rubber' },
      { label: 'Drop', value: '8mm Heel-to-Toe' },
      { label: 'Weight', value: '230g Ultralight' },
      { label: 'Upper', value: 'Primeknit Recycled Mesh' }
    ]
  },
  {
    title: 'Voyager Waterproof Tech Commuter Backpack 28L',
    description: 'Crafted from 100% recycled Cordura ballistic fabric with magnetic closures, dedicated 16-inch fleece laptop compartment, and hidden anti-theft passport pocket.',
    price: 2499,
    compareAtPrice: 3499,
    category: 'Fashion & Apparel',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    stock: 30,
    rating: 4.7,
    numReviews: 62,
    featured: false,
    badge: 'Eco-Friendly',
    specs: [
      { label: 'Capacity', value: '24L - 28L Expandable' },
      { label: 'Fabric', value: 'Cordura 840D Ballistic Nylon' },
      { label: 'Laptop Sleeve', value: 'Up to 16-inch MacBook / Laptop' },
      { label: 'Waterproofing', value: 'IPX4 Water-Resistant YKK Zips' }
    ]
  },
  {
    title: 'Handcrafted Genuine Tan Leather Bomber Jacket',
    description: 'Tailored from premium top-grain sheepskin leather with silky quilted interior lining, ribbed collar and cuffs, and heavy-duty antiqued brass zippers.',
    price: 6999,
    compareAtPrice: 9999,
    category: 'Fashion & Apparel',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    stock: 14,
    rating: 4.9,
    numReviews: 39,
    featured: false,
    badge: 'Winter Special',
    specs: [
      { label: 'Material', value: '100% Top-Grain Sheepskin Leather' },
      { label: 'Lining', value: 'Thermal Quilted Satin' },
      { label: 'Pockets', value: '2 Outer Welt + 2 Inner Secret' },
      { label: 'Care', value: 'Specialist Leather Clean Only' }
    ]
  },

  // 6. Beauty & Personal Care
  {
    title: 'Forest Essentials Ayurvedic Glow & Radiance Ritual Kit',
    description: 'Luxury Ayurvedic care kit with pure Kashmiri saffron facial toner, Kumkumadi night serum, raw cane sugar cleanser, and Soundarya radiance cream.',
    price: 2850,
    compareAtPrice: 3500,
    category: 'Beauty & Personal Care',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80',
    stock: 35,
    rating: 4.9,
    numReviews: 83,
    featured: false,
    badge: 'Ayurvedic',
    specs: [
      { label: 'Key Ingredients', value: 'Saffron, 24K Gold Bhasma, Sandalwood' },
      { label: 'Skin Type', value: 'All Skin Types' },
      { label: 'Formulation', value: '100% Natural, Cruelty-Free' },
      { label: 'Contents', value: '4 Full-size ritual essentials' }
    ]
  },
  {
    title: 'Philips Series 7000 Multi-Grooming Trimmer 14-in-1',
    description: 'DualCut self-sharpening blades, up to 120 minutes cordless runtime on lithium-ion power, 100% waterproof for easy tap cleaning.',
    price: 2199,
    compareAtPrice: 3195,
    category: 'Beauty & Personal Care',
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
    stock: 42,
    rating: 4.8,
    numReviews: 195,
    featured: false,
    badge: 'Best Groomer',
    specs: [
      { label: 'Attachments', value: '14 tools for beard, hair & body' },
      { label: 'Battery', value: '120 min runtime + 5 min quick charge' },
      { label: 'Blades', value: 'Self-sharpening Stainless Steel' },
      { label: 'Cleaning', value: '100% Showerproof' }
    ]
  },

  // 7. Home & Kitchen
  {
    title: 'Zenith Geometric Desk Lamp with Qi Fast Charger',
    description: 'Anodized aluminum architecture with touch slider color temperature dimming (2700K - 6500K), built-in 15W Qi wireless rapid smartphone charging pad, and USB-C output.',
    price: 2499,
    compareAtPrice: 3499,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    stock: 25,
    rating: 4.7,
    numReviews: 46,
    featured: false,
    badge: 'Sale',
    specs: [
      { label: 'Brightness', value: '800 Lumens Max' },
      { label: 'Color Modes', value: '5 Color Temperatures' },
      { label: 'Fast Charge', value: '15W Qi Wireless Pad' },
      { label: 'Material', value: 'Aircraft Grade Aluminum' }
    ]
  },
  {
    title: 'Morphy Richards Espresso & Cappuccino Coffee Machine',
    description: '15-bar Italian pressure pump for rich crema, milk frothing wand for creamy lattes, stainless steel 2-cup dual filter, and 1.2L transparent water tank.',
    price: 7899,
    compareAtPrice: 9999,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
    stock: 16,
    rating: 4.8,
    numReviews: 67,
    featured: true,
    badge: 'Barista Choice',
    specs: [
      { label: 'Pump Pressure', value: '15 Bar Italian High Pressure' },
      { label: 'Power', value: '1050 Watts' },
      { label: 'Frother', value: 'Stainless Steel Steam Wand' },
      { label: 'Tank Capacity', value: '1.2 Liters Detachable' }
    ]
  },
  {
    title: 'Apex Ergonomic Breathable Mesh High-Back Chair',
    description: 'Engineered for all-day posture support with self-adjusting lumbar curve, 4D adjustable armrests, breathable dual-layer Korean mesh, and rollerblade caster wheels.',
    price: 14999,
    compareAtPrice: 18999,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=800&auto=format&fit=crop&q=80',
    stock: 10,
    rating: 4.9,
    numReviews: 53,
    featured: true,
    badge: 'Ergonomic',
    specs: [
      { label: 'Max Load', value: '150 kg (330 lbs)' },
      { label: 'Recline', value: '90° to 135° with 3 lock positions' },
      { label: 'Armrest', value: '4D Height, Angle & Depth' },
      { label: 'Warranty', value: '3 Years Full Mechanism Warranty' }
    ]
  },

  // 8. Sports & Fitness
  {
    title: 'Boldfit Adjustable Quick-Dial Dumbbell Set (2.5kg - 24kg)',
    description: 'Space-saving smart selector dial replaces 15 sets of dumbbells. Heavy-duty cast iron molding plates with rubberized ergonomic grip.',
    price: 5999,
    compareAtPrice: 8499,
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    stock: 20,
    rating: 4.8,
    numReviews: 92,
    featured: false,
    badge: 'Home Gym',
    specs: [
      { label: 'Weight Range', value: '2.5 kg to 24 kg per dumbbell' },
      { label: 'Plate Material', value: 'Commercial Grade Cast Iron' },
      { label: 'Adjustment', value: 'Instant One-Turn Dial Mechanism' },
      { label: 'Base Tray', value: 'High-Impact Storage Tray Included' }
    ]
  },
  {
    title: 'Eco-Grip High Density Dual-Layer Yoga Mat 8mm',
    description: 'Eco-friendly TPE non-toxic material with laser-engraved alignment guides, non-slip textured grip, and free carry strap.',
    price: 1299,
    compareAtPrice: 1999,
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80',
    stock: 50,
    rating: 4.7,
    numReviews: 110,
    featured: false,
    badge: 'Eco',
    specs: [
      { label: 'Thickness', value: '8mm Extra Cushioning' },
      { label: 'Material', value: 'Bio-TPE Biodegradable' },
      { label: 'Dimensions', value: '183cm x 61cm' },
      { label: 'Grip', value: 'Dual Sided Anti-Skid' }
    ]
  },

  // 9. Books & Stationery
  {
    title: 'Atomic Habits by James Clear (Hardcover Collector Edition)',
    description: 'The definitive #1 New York Times bestseller on tiny changes, remarkable results, and how to build good habits & break bad ones.',
    price: 699,
    compareAtPrice: 899,
    category: 'Books & Stationery',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    stock: 80,
    rating: 4.9,
    numReviews: 540,
    featured: false,
    badge: 'Bestseller',
    specs: [
      { label: 'Format', value: 'Premium Hardcover with Ribbon' },
      { label: 'Pages', value: '320 Pages' },
      { label: 'Language', value: 'English' },
      { label: 'Publisher', value: 'Random House Business' }
    ]
  },
  {
    title: 'Scriveiner Luxury 24K Gold Finished Rollerball Pen',
    description: 'British luxury hand-finished brass pen coated in midnight black lacquer with 24-karat gold appointments. Schmidt liquid ink refill included.',
    price: 3499,
    compareAtPrice: 4500,
    category: 'Books & Stationery',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    stock: 25,
    rating: 4.9,
    numReviews: 63,
    featured: false,
    badge: 'Luxury Gift',
    specs: [
      { label: 'Finish', value: '24K Gold Plated Trim' },
      { label: 'Ink System', value: 'Schmidt 888 Ceramic Rollerball' },
      { label: 'Box', value: 'Luxury Velvet Presentation Box' },
      { label: 'Weight', value: '41g Balanced Weight' }
    ]
  },

  // 10. Groceries & Essentials
  {
    title: 'Himalayan Organic Raw Wildflower Honey (500g)',
    description: '100% pure raw unprocessed multi-flora honey harvested sustainably from pristine Himalayan wildflower valleys. High in natural pollen and enzymes.',
    price: 549,
    compareAtPrice: 699,
    category: 'Groceries & Essentials',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    stock: 75,
    rating: 4.8,
    numReviews: 180,
    featured: false,
    badge: '100% Organic',
    specs: [
      { label: 'Weight', value: '500 Grams Glass Jar' },
      { label: 'Processing', value: 'Unfiltered, Unpasteurized' },
      { label: 'Origin', value: 'Himachal Pradesh' },
      { label: 'Certifications', value: 'FSSAI & USDA Organic' }
    ]
  },
  {
    title: 'Blue Tokai Specialty Roasted Arabica Coffee Beans (250g)',
    description: 'Single-estate medium roast 100% Arabica whole beans with tasting notes of milk chocolate, roasted almond, and dried fruits.',
    price: 490,
    compareAtPrice: 550,
    category: 'Groceries & Essentials',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    stock: 65,
    rating: 4.9,
    numReviews: 240,
    featured: false,
    badge: 'Fresh Roast',
    specs: [
      { label: 'Roast Level', value: 'Medium Roast' },
      { label: 'Estate', value: 'Attikan Estate, Biligiriranga Hills' },
      { label: 'Altitude', value: '1500 - 1650m' },
      { label: 'Bean Type', value: '100% Arabica Whole Beans' }
    ]
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing previous data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('[Seed] Creating Indian demo users...');
    const adminUser = await User.create({
      name: 'Store Administrator',
      email: 'admin@store.com',
      password: 'admin123',
      role: 'admin',
      address: {
        street: '12th Floor, Cyber City, Bandra Kurla Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400051',
        country: 'India',
        phone: '+91 98200 12345'
      }
    });

    const standardUser = await User.create({
      name: 'Aarav Sharma',
      email: 'user@store.com',
      password: 'user123',
      role: 'user',
      address: {
        street: 'Flat 402, Shanti Niketan, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
        phone: '+91 98450 67890'
      }
    });

    console.log(`[Seed] Created Users:\n - Admin: admin@store.com / admin123\n - Customer: user@store.com / user123`);

    console.log('[Seed] Inserting sample products with Indian Rupee (INR) pricing...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`[Seed] Inserted ${insertedProducts.length} high-quality products across 10 categories.`);

    console.log('[Seed] Generating initial demo orders with INR currency...');
    const shippedOrderDate = new Date();
    shippedOrderDate.setDate(shippedOrderDate.getDate() - 1);

    const estDelivery = new Date();
    estDelivery.setDate(estDelivery.getDate() + 2);

    const initialOrder1 = await Order.create({
      user: standardUser._id,
      orderNumber: 'ORD-72941',
      trackingNumber: 'TRK-9021-4819',
      carrier: 'BlueDart Express Priority',
      items: [
        {
          product: insertedProducts[5]._id, // Aura Pro Headphones ₹9,999
          title: insertedProducts[5].title,
          image: insertedProducts[5].image,
          price: insertedProducts[5].price,
          quantity: 1
        },
        {
          product: insertedProducts[11]._id, // Backpack ₹2,499
          title: insertedProducts[11].title,
          image: insertedProducts[11].image,
          price: insertedProducts[11].price,
          quantity: 1
        }
      ],
      shippingAddress: {
        fullName: 'Aarav Sharma',
        street: 'Flat 402, Shanti Niketan, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
        phone: '+91 98450 67890'
      },
      paymentMethod: 'Credit/Debit Card',
      paymentStatus: 'Paid',
      itemsPrice: 12498,
      shippingPrice: 0,
      taxPrice: 625,
      discountPrice: 2000,
      totalPrice: 11123,
      couponApplied: 'SAVE20',
      status: 'Shipped',
      estimatedDelivery: estDelivery,
      statusHistory: [
        {
          status: 'Placed',
          note: 'Order payment received via UPI / Netbanking.',
          timestamp: new Date(Date.now() - 36 * 3600 * 1000),
          location: 'Bengaluru Central Fulfillment Hub'
        },
        {
          status: 'Processing',
          note: 'Items picked, carefully packaged, and ready for dispatch.',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000),
          location: 'Bengaluru Central Fulfillment Hub'
        },
        {
          status: 'Shipped',
          note: 'Package handed over to BlueDart Express courier. In transit to destination city.',
          timestamp: new Date(Date.now() - 10 * 3600 * 1000),
          location: 'Kempegowda Airport Air Cargo Center'
        }
      ]
    });

    // Delivered Order in INR
    await Order.create({
      user: standardUser._id,
      orderNumber: 'ORD-51928',
      trackingNumber: 'TRK-3819-2041',
      carrier: 'Delhivery Surface Express',
      items: [
        {
          product: insertedProducts[8]._id, // Titan Watch ₹4,999
          title: insertedProducts[8].title,
          image: insertedProducts[8].image,
          price: insertedProducts[8].price,
          quantity: 1
        }
      ],
      shippingAddress: {
        fullName: 'Aarav Sharma',
        street: 'Flat 402, Shanti Niketan, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
        phone: '+91 98450 67890'
      },
      paymentMethod: 'PayPal / UPI',
      paymentStatus: 'Paid',
      itemsPrice: 4999,
      shippingPrice: 0,
      taxPrice: 250,
      discountPrice: 0,
      totalPrice: 5249,
      status: 'Delivered',
      estimatedDelivery: new Date(Date.now() - 48 * 3600 * 1000),
      statusHistory: [
        {
          status: 'Placed',
          note: 'Order placed by customer.',
          timestamp: new Date(Date.now() - 120 * 3600 * 1000),
          location: 'Mumbai Depot'
        },
        {
          status: 'Processing',
          note: 'Dispatched from seller warehouse.',
          timestamp: new Date(Date.now() - 96 * 3600 * 1000),
          location: 'Mumbai Sorting Hub'
        },
        {
          status: 'Shipped',
          note: 'Arrived at regional distribution center.',
          timestamp: new Date(Date.now() - 72 * 3600 * 1000),
          location: 'Bengaluru Hub'
        },
        {
          status: 'Out for Delivery',
          note: 'Out with delivery agent for delivery.',
          timestamp: new Date(Date.now() - 52 * 3600 * 1000),
          location: 'Indiranagar Delivery Station'
        },
        {
          status: 'Delivered',
          note: 'Package handed over to recipient with OTP verification.',
          timestamp: new Date(Date.now() - 48 * 3600 * 1000),
          location: 'Customer Address'
        }
      ]
    });

    console.log(`[Seed] Seeded INR demo orders! Tracking: ${initialOrder1.trackingNumber} or ${initialOrder1.orderNumber}`);
    console.log('[Seed] Database seeding completed successfully! ✨');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]:`, error);
    process.exit(1);
  }
};

seedDB();
