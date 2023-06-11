"use strict";
const mongoose= require("mongoose");
const uniqid= require("uniqid");
console.log(uniqid(123456789))
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
    type: String
  },
  location: {
    type: String
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