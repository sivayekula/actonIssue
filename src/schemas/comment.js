"use strict";
const mongoose= require("mongoose");

const CommentSchema= new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user"
  },
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "issue"
  }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports= mongoose.model("comment", CommentSchema);