const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Role schema

const roleSchema = new Schema({
  name:{
    type:String,
  }
});

roleSchema.plugin(AutoIncrement, {inc_field: 'role_id'});

//add roles model
const roles_model = new mongoose.model("roles_model", roleSchema);

module.exports = roles_model;
