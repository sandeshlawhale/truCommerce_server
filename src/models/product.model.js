const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    }, 
    imageUrl: {
      type: String, 
      require: true, 
      trim: true
    }
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
productSchema.plugin(toJSON);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;