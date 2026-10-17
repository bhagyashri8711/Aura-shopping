const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide product title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide product description']
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be positive']
    },
    compareAtPrice: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: [
        'Mobiles & Tablets',
        'Electronics & Gadgets',
        'Audio & Sound',
        'Wearables & Watches',
        'Fashion & Apparel',
        'Beauty & Personal Care',
        'Home & Kitchen',
        'Sports & Fitness',
        'Books & Stationery',
        'Groceries & Essentials'
      ]
    },
    image: {
      type: String,
      required: [true, 'Please provide product image URL']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 10
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 12
    },
    featured: {
      type: Boolean,
      default: false
    },
    badge: {
      type: String,
      default: '' // 'Best Seller', 'New Arrival', 'Sale', etc.
    },
    specs: [
      {
        label: { type: String },
        value: { type: String }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
