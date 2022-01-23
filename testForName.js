const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const axios = require('axios')
const path = require('path');
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
// app.set('views', './');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// var newItem;
// Route to Login Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/name.html');
});
app.post('/', (req, res) => {
    res.sendFile(__dirname + '/name.html');
});


app.post('/details', async(req, res) => {
    // Insert Login Code Here

    const final = []

    urlForPharmEasy = `https://www.apollopharmacy.in/search-medicines/${req.body.foodItem}`;

    extractDataOfPharmEasy = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            var temp;
            // BreadCrumb_peBreadCrumb__2CyhJ
            $('.ProductCard_productName__2LhTY').map((i, elm) => {
                final.push($(elm).text());
                console.log($(elm).text())
            })
            final.sort();
            final.push(req.body.foodItem);
            console.log(final)

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            console.log(error);

            // console.log(error);
            return {};
        }
    };
    await extractDataOfPharmEasy(urlForPharmEasy);
    res.render('name', { final: final });
});

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/name.html');
// });
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
    console.log(req.body);

    urlForPharmEasy = `https://google.com/search?q=PharmEasy+${req.body.dataOfMed}+order+online`;
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

    urlForNetMeds = `https://google.com/search?q=netmeds+${req.body.dataOfMed}+order+online`;
    z = await extractLinkFromGoogle(urlForNetMeds);

    extractDataOfNetMeds = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url);

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

    urlForApollo = `https://google.com/search?q=Apollopharmacy+${req.body.dataOfMed}+order+online`;
    z = await extractLinkFromGoogle(urlForApollo);

    extractDataOfApollo = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            console.log($.html());
            var t, m;
            t = $('.PdpWeb_productDetails__3K6Dg').text();
            if (t == '') {
                t = $('.ProductCard_productName__2LhTY').text();
            }

            m = $('.MedicineInfoWeb_medicinePrice__ynSpV').text();
            if (m == '') {
                m = $('.ProductCard_priceGroup__Xriou').text();
            }


            return {
                name: 'Apollo',
                item: t,
                // item: item,
                price: m,
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

    urlForTata = `https://google.com/search?q=tata+${req.body.dataOfMed}`;
    console.log(urlForTata);
    z = await extractLinkFromGoogle(urlForTata);

    extractDataOfTata = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url);

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            var t, m;
            console.log(url);

            if ($('.container-fluid-padded').text() != "") {

                t = $('.container-fluid-padded').text();

            } else if ($('.style__pro-title___3G3rr').first().text() != "") {

                t = $('.style__pro-title___3G3rr').first().text();
            } else if ($('.style__pro-title___3zxNC').first().text() != '') {
                t = $('.style__pro-title___3zxNC').first().text();
            } else {
                t = $('.style__pro-title___2QwJy').first().text();
            }
            // t = $('.style__pro-title___3G3rr').first().text();


            if ($('.Price__price__22Jxo').text() != "") {

                m = $('.Price__price__22Jxo').text();

            } else if ($('.style__price-tag___B2csA').first().text() != '') {

                m = $('.style__price-tag___B2csA').first().text();

            } else if ($('.style__product-pricing___1OxnE').first().text() != '') {

                m = $('.style__product-pricing___1OxnE').first().text();

            } else {
                m = $('.style__price-tag___cOxYc').first().text();

            }

            if (t == "" && m == "") {
                t = "Not Available";
            }
            return {
                name: 'Tata 1mg',

                item: t,
                // item: item,
                // price: $('.DrugPriceBox__price___dj2lv').text(),
                price: m,
            };

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            console.log(error);
            return {};
        }
    };

    final.push(await extractDataOfTata(z));


    urlFormedplusMart = `https://google.com/search?q="pulseplus"+${req.body.dataOfMed}`;
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
                item: $('#divProductTitle>h1').text(),
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