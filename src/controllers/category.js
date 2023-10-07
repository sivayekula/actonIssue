"use strict";
const { saveCategory, getCategories } = require("../models/category");


const createCategory= async (req, res)=> {
    try {
        if(req.body.categoryName && req.body.categoryName.length > 3) {
            let category= await saveCategory({name: req.body.categoryName})
            res.status(200).json({success: true, message: "Category created successfully", data: category})
        } else {
            res.status(400).json({success: false, message: "Category name is required"})
        }
    }catch(err){
        res.status(400).json({success: false, message: err.message})
    }
}

const getCategory= async (req, res)=> {
    try {
        let catId= req.params.id 
        if(catId) {
            let category= await getCategories(catId)
            res.status(200).json({success: true, message: "Category details", data: category})
        } else {
            res.status(400).json({success: false, message: "Category id is required"})
        }
    }catch(err){
        res.status(400).json({success: false, message: err.message})
    }
}

const categories= async (req, res)=> {
    try {
        let category= await getCategories()
        res.status(200).json({success: true, message: "Category details", data: category})
    }catch(err){
        res.status(400).json({success: false, message: err.message})
    }
}

module.exports= {
    createCategory: createCategory,
    getCategory: getCategory,
    categories: categories
}