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


    urlForPe = `https://www.apollopharmacy.in/search-medicines/${req.body.foodItem}`;

    extractdoe = async(url) => {
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
            // console.log(error);

            // console.log(error);
            return {};
        }
    };
    await extractdoe(urlForPe);
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
        // console.log(error);
        return 0;
    }
};

app.post('/result', async(req, res) => {
    // Insert Login Code Here

    const final = [],
        linkNames = [];
    var z;
    const items = [];
    urlForPharmEasy = `https://google.com/search?q=site:pharmeasy.in+${req.body.dataOfMed}+order+online`;
    urlForNetMeds = `https://google.com/search?q=site:netmeds.com+${req.body.dataOfMed}+order+online`;
    urlForApollo = `https://google.com/search?q=site:apollopharmacy.in+${req.body.dataOfMed}+order+online`;
    // urlForHealthmug = `https://www.google.com/search?q=healthmug+${req.body.foodItem}`;
    urlForSS = `https://www.google.com/search?q=site:sastasundar.com+${req.body.foodItem}`;
    urlForTata = `https://google.com/search?q=site:1mg.com+${req.body.dataOfMed}`;
    urlFormedplusMart = `https://google.com/search?q=site:pulseplus.in+${req.body.dataOfMed}`;
    urlForMyUpChar = `https://google.com/search?q=site:myupchar.com+${req.body.dataOfMed}`;
    urlForMyMedicalShop = `https://google.com/search?q=site:mymedicalshop.com+${req.body.dataOfMed}`;



    items.push(urlForApollo);
    items.push(urlFormedplusMart);
    items.push(urlForPharmEasy);
    items.push(urlForSS);
    // items.push(urlForHealthmug);
    items.push(urlForNetMeds);
    items.push(urlForTata);
    items.push(urlForMyUpChar);
    items.push(urlForMyMedicalShop);

    // console.log(req.body);



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
            // console.log(error);

            // console.log(error);
            return {};
        }
    };
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
            // console.log(error);
            return {};
        }
    };
    extractDataOfApollo = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            // console.log($.html());
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
            // console.log(error);
            return {};
        }
    };
    extractDataOfHealthmug = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            // console.log($.html());
            var a = $('script[type=application/ld+json]')[1];
            a = JSON.parse(a);
            console.log(a);

            return {
                name: 'Healthmug',
                item: a.name,
                // item: item,
                price: $('.price-area-txt').text(),
            };

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            // console.log(error);
            return {};
        }
    };
    extractDataOfSS = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            var t, m;

            t = $('.hedertitel').text()
            if ($('.hedertitel').text() != '') {
                t = $('.hedertitel').text();
            } else {
                t = $('.DispNamePlaceHolder h1').text();
            }




            return {
                name: 'SastaSundar',
                item: t,
                // item: item,
                price: $('.pad-mar0').first().text(),
            };

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            // console.log(error);
            return {};
        }
    };
    extractDataOfTata = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url);

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            var t, m;
            // console.log($.html());

            if ($('.container-fluid-padded h1').text() != "") {

                t = $('.container-fluid-padded h1').text();

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
            // console.log(error);
            return {};
        }
    };
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
            // console.log(error);
            return {};
        }
    };
    extractDataOfMyUpChar = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            // console.log($.html());

            return {
                name: 'MyUpChar',
                item: $('.head>h1').text(),
                // item: item,
                price: $('.txt_big').text(),
            };

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            // console.log(error);
            return {};
        }
    };
    extractDataOfMyMedicalShop = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            // console.log($.html());
            var t = $('span[itemprop=name]').text();
            var m = $('.price').first().text();
            if (t == '' && m != '') {
                t = req.body.dataOfMed;
            }
            return {
                name: 'mymedicalshop',
                item: t,
                // item: item,
                price: m,
            };

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            // console.log(error);
            return {};
        }
    };


    await Promise.all(items.map(async(item) => {
        var t = await extractLinkFromGoogle(item)
        if (t != '') {
            if (t.includes('pharmeasy')) {
                final.push(await extractDataOfPharmEasy(t))
            } else if (t.includes('netmeds')) {
                final.push(await extractDataOfNetMeds(t));
            } else if (t.includes('apollo')) {
                final.push(await extractDataOfApollo(t));
            }
            // if (t.includes('healthmug')) {
            //     final.push(await extractDataOfHealthmug(t));
            // }
            else if (t.includes('sastasundar')) {
                final.push(await extractDataOfSS(t));
            } else if (t.includes('1mg')) {
                final.push(await extractDataOfTata(t));
            }
            if (t.includes('pulseplus')) {
                final.push(await extractDataOfmedplusMart(t));
            } else if (t.includes('myupchar')) {
                final.push(await extractDataOfMyUpChar(t));
            } else if (t.includes('mymedicalshop')) {
                final.push(await extractDataOfMyMedicalShop(t));
            } else {
                final.push({});
            }
        } // linkNames.push(t);
    }));




    final.push(req.body.dataOfMed);
    console.log(final);

    res.render('index', { final: final });

});

const port = process.env.PORT || 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));