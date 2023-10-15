"use strict";
const mongoose= require("mongoose");
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const UserSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: function() { return this.mobile === ''; },
    createIndexes: { unique: true }
  },
  mobile: {
    type: String,
    unique: true,
    required: function() { return this.email === ''; },
    createIndexes: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user"
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },
  address: {
    type: Object
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
  is_verified: {
    type: Boolean,
    default: false
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

UserSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);
          user.password = hash;
          next();
      });
  });
});

module.exports= mongoose.model("user", UserSchema);