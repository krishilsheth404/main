const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const axios = require('axios')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer');
const request = require('request');
const { link } = require('fs');
const ejs = require("ejs");
const { AddressContext } = require('twilio/lib/rest/api/v2010/account/address');
const { getElementsByTagType } = require('domutils');

// var urlForSwiggy, urlForZomato;
// var extractLinksOfSwiggy, extractLinksOfZomato, matchedDishes = {};
// var matchedDishesForSwiggy, matchedDishesForZomato, tempAddress, discCodesForZomato, addr, linkOld = '';
// var z, s, w;
// var sdfd, tempurl, tempurl2;
// var Offers = 0;
app.set('view engine', 'ejs');
app.set('views', './');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// var newItem;
// Route to Login Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

extractLinkFromGoogle = async(url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);

        rawUrl = $('.kCrYT>a').first().attr('href');
        url = rawUrl.split("/url?q=")[1].split("&")[0];
        console.log('Extracting url: ', url);

        return url;

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        console.log(error);
        return 0;
    }
};

app.post('/result', async(req, res) => {
    // Insert Login Code Here

    const final = []

    urlForPharmEasy = `https://google.com/search?q=PharmEasy+${req.body.foodItem}+order+online`;
    z = await extractLinkFromGoogle(urlForPharmEasy);

    extractDataOfPharmEasy = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            var temp;
            // BreadCrumb_peBreadCrumb__2CyhJ
            $('.BreadCrumbLink_breadCrumb__LljfJ').map((i, elm) => {
                temp = $(elm).text();
            })
            var price = $('.PriceInfo_ourPrice__P1VR1').text();
            if (price == '') {
                price = $('.ProductPriceContainer_mrp__pX-2Q').text();
            }

            return {
                name: 'PharmEasy',
                item: temp,
                price: price,
            };
        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            console.log(error);

            // console.log(error);
            return {};
        }
    };
    final.push(await extractDataOfPharmEasy(z));

    urlForNetMeds = `https://google.com/search?q=netmeds+${req.body.foodItem}+order+online`;
    z = await extractLinkFromGoogle(urlForNetMeds);

    extractDataOfNetMeds = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);

            return {
                name: 'NetMeds',
                item: $('.product-detail').text(),
                price: $('.final-price').text(),
            };

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            console.log(error);
            return {};
        }
    };

    final.push(await extractDataOfNetMeds(z));

    urlForApollo = `https://google.com/search?q=Apollo+${req.body.foodItem}+order+online`;
    z = await extractLinkFromGoogle(urlForApollo);

    extractDataOfApollo = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);

            return {
                name: 'Apollo',
                item: $('.PdpWeb_productDetails__3K6Dg').text(),
                // item: item,
                price: $('.MedicineInfoWeb_medicinePrice__ynSpV').text(),
            };

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            console.log(error);
            return {};
        }
    };
    final.push(await extractDataOfApollo(z));

    // urlForFlipcart = `https://google.com/search?q=flipkart+${req.body.foodItem}`;
    // z = await extractLinkFromGoogle(urlForFlipcart);

    // extractDataOfFlipcart = async(url) => {
    //     try {
    //         // Fetching HTML
    //         const { data } = await axios.get(url)
    //         console.log(data)

    //         // Using cheerio to extract <a> tags
    //         const $ = cheerio.load(data);

    //         return {
    //             name: 'Flipcart',
    //             item: $('.B_NuCI').text(),
    //             // item: item,
    //             price: $('._30jeq3').text(),
    //         };

    //     } catch (error) {
    //         // res.sendFile(__dirname + '/try.html');
    //         // res.sendFile(__dirname + '/error.html');
    //         console.log(error);
    //         return {};
    //     }
    // };

    // final.push(await extractDataOfFlipcart(z));

    urlForTata = `https://google.com/search?q=tata+1mg+${req.body.foodItem}`;
    z = await extractLinkFromGoogle(urlForTata);

    extractDataOfTata = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url);

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            console.log(url);
            console.log($.html())

            return {
                name: 'Tata 1mg',
                item: $('.style__pro-title___3zxNC').text() == "" ? $('.style__pro-title___3G3rr').first().text() : $('.container-fluid-padded>h1').text(),
                // item: item,
                // price: $('.DrugPriceBox__price___dj2lv').text(),
                price: $('.style__price-tag___B2csA').text() == "" ? $('.style__price-tag___KzOkY').first().text() + " " + $('.style__product-pricing___1tj_E').first().text() : $('.Price__price__22Jxo').text(),
            };

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            console.log(error);
            return {};
        }
    };

    final.push(await extractDataOfTata(z));


    urlFormedplusMart = `https://google.com/search?q=pulse+plus+${req.body.foodItem}+`;
    z = await extractLinkFromGoogle(urlFormedplusMart);

    extractDataOfmedplusMart = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            // console.log($.html());
            var t = $('span[property=price]').text();

            return {
                name: 'PulsePlus',
                item: $('#divProductTitle').text(),
                // item: item,
                // price: $('.DrugPriceBox__price___dj2lv').text(),
                // price: $('span[property=priceCurrency]').text()
                price: t
            };

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            console.log(error);
            return {};
        }
    };

    final.push(await extractDataOfmedplusMart(z));

    console.log(final);
    res.render('index', { final: final });

});

const port = process.env.PORT || 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));