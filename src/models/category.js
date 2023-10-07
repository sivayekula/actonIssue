"use strict";
const Category= require("../schemas/category")

const saveCategory= async (catObj)=>{
    try{
        let category= await new Category(catObj).save();
        return category
    }catch(err) {
        throw err
    }
}

const getCategories= async (catId)=>{
    try{
        if(catId) {
            let category = await Category.findById({_id: catId});
            return category
        } else {
            let categories= await Category.find();
            return categories
        }
    }catch(err) {
        throw err
    }
}

module.exports= {
    saveCategory: saveCategory,
    getCategories: getCategories
}