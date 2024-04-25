const joi = require('joi');

module.exports = {
  createProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      brand: joi.string().min(1).max(100).required().label('Brand'),
      price: joi.number().positive().required().label('Price'),
    },
  },

  updatePrice: {
    body: {
      new_price: joi.number().positive().required().label('Price'),
    },
  },
};
