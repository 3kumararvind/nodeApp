const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Role schema

const productSchema = new Schema({
  product_id:{
    type:Number,
    unique:true
   },
  name:{
    type:String,
  },
  price:{
    type:Number
  },
  quantity:{
    type:Number
  },
  record_creation : {
    type : Date,
    default: Date.now
  }
});

//add roles model
const product_model = new mongoose.model("product", productSchema);

module.exports = product_model;
