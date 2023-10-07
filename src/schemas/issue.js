"use strict";
const mongoose= require("mongoose");
const uniqid= require("uniqid");
const IssueSchema= new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  hashId: {
    type: String,
    required: true,
    unique: true,
    default: "#"+uniqid.time()
  },
  description: {
    type: String
  },
  images: {
    type: Array,
    required: true
  },
  address: {
    type: Object,
    required: true
  },
  landmark: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  pincode: {
    type: Number
  },
  status: {
    type: String,
    default: "created"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user"
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "category"
  }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports= mongoose.model("issue", IssueSchema);