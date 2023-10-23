"use strict";
const mongoose= require("mongoose");
const geoSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Point'
  },
  coordinates: {
    type: [Number]
  }
}); 
const IssueSchema= new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  hashId: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  images: {
    type: Array,
    required: false
  },
  address: {
    type: Object,
    required: true
  },
  location: {
    type:geoSchema,
    index: '2dsphere'
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
  },
  isActive: {
    type: Boolean,
    default: false
  }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
 
module.exports= mongoose.model("issue", IssueSchema);