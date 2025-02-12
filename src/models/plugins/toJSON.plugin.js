/* eslint-disable no-param-reassign */

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

const deleteAtPath = (obj, path, index) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const toJSON = (schema) => {
  let transform;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split("."), 0);
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      if (transform) {
        return transform(doc, ret, options);
      }
      return ret;
    },
  });
};

module.exports = toJSON;

/*
  extremely useful plugin... once connected with any model 
  whenver any document will be sent over http request it will make 
  modifications in the response.
  example: it will replace the _id with id and delete the __v field
  it will not reflect in the actual database but when sent over api response
  it will reflect the changes there
  for reference, refer the below code

const mongoose = require("mongoose");

const deleteAtPath = (obj, path, index) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const toJSON = (schema) => {
  let transform;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split("."), 0);
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.plugin(toJSON);

const Product = mongoose.model('Product', productSchema);

Product.create({
  name: "manthan"
}).then((product) => {
    console.log(product.id);
    // console.log(product.toJSON());
    console.log(product);
  console.log("Product created");
    const express = require('express');
    const app = express();
    app.get('/', async (req, res) => {
        res.json(product);
    });
    app.listen(5000, (err) => {
        console.log(err);
    });
}).catch(err => {
  console.log(err);
});

mongoose.connect('mongodb+srv://manthan:manthan@cluster0.dpkdn.mongodb.net/test69?retryWrites=true&w=majority&appName=Cluster0').then(() => {
  console.log("server connected");
}).catch(err => {
  console.log(err);
});
*/
