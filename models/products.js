const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Role schema

const productSchema = new Schema({
  name:{
    type:String,
  },
  price:{
    type:Number
  },
  quantity:{
    type:Number
  }
});

productSchema.plugin(AutoIncrement, {inc_field: 'product_id'});

//add roles model
const product_model = new mongoose.model("product_model", productSchema);

module.exports = product_model;
