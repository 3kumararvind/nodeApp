const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Role schema

const userSchema = new Schema({
  name:{
    type:String,
  },
  email:{
      type: String,
      lowercase: true,
      unique: true,
      required: 'Email address is mandatory'
  },
  phone:{
    type:String,
    minlength:10,
    maxlength:10
  },
  password:{
    type:String,
    minlength:6,
    required:true,

  },
  roleId:{
    type:String,
    required:true
  }
});

userSchema.plugin(AutoIncrement, {inc_field: 'id'});

//add roles model
const users_models = new mongoose.model("users_models", userSchema);

module.exports = users_models;
