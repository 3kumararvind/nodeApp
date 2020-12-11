const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Role schema

const cartSchema = new Schema({
  id:{type:Number},
  totalQuantity:{type:Number},
  netAmount:{type:Number},
  userId:{type:Number}
});



//add roles model
const cart_model = new mongoose.model("cart_model", cartSchema);

module.exports = cart_model;
