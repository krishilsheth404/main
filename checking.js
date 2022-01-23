const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const axios = require('axios')
const path = require('path');
const cheerio = require('cheerio')

urlForPharmEasy = `https://pharmeasy.in/search/all?name=${document.getElementById('foodItem').value}`;

extractDataOfPharmEasy = async(url) => {
    try {
        // Fetching HTML
        const {
            data
        } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        var temp;
        // BreadCrumb_peBreadCrumb__2CyhJ
        $('.ooufh').map((i, elm) => {
            final.push($(elm).text());
            console.log($(elm).text())
        })
        final.sort();
        final.push(document.getElementById('foodItem').value);
        console.log(final)

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        console.log(error);

        // console.log(error);
        return {};
    }
};
extractDataOfPharmEasy(urlForPharmEasy);