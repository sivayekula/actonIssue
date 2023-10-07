"use strict";
const mongoose= require("mongoose");

const UserSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: function() { return this.mobile === ''; },
    createIndexes: { unique: true }
  },
  mobile: {
    type: String,
    required: function() { return this.email === ''; },
    createIndexes: { unique: true }
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user"
  },
  address: {
    type: String
  },
  profile_pic: {
    type: String
  },
  identity_proof: {
    type: String
  },
  meta_info: {
    type: String
  },
  status: {
    type: String,
    default: "active"
  }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports= mongoose.model("user", UserSchema);