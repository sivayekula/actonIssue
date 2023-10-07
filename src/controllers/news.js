"use strict";
const axios= require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");
const url = "https://www.globalissues.org/news"

const getNews= async (req, res) => {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const listItems = $("#content ol li");
    const countries = [];
    listItems.each((idx, el) => {
      const country = { heading: "", date: "", img: "", content: "" };
      country.heading = $(el).children("h2").text();
      country.date = $(el).children("p").text();
      country.img = $(el).find("img").attr("src")
      country.content = $(el).find(".summary-with-thumbnail p").text()
      countries.push(country);
    });
    res.status(200).json(countries)
}

module.exports = {
    getNews: getNews
}