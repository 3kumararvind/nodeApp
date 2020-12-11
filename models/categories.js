const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Role schema

const categorySchema = new Schema({
  name:{
    type:String,
  }
});

categorySchema.plugin(AutoIncrement, {inc_field: 'category_id'});

//add roles model
const category_model = new mongoose.model("category_model", categorySchema);

module.exports = category_model;
