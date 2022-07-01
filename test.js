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

var urlForSwiggy, urlForZomato;
var extractLinksOfSwiggy, extractLinksOfZomato, matchedDishes = {};
var matchedDishesForSwiggy, matchedDishesForZomato, tempAddress, discCodesForZomato, addr, linkOld = '';
var z, s, w;
var sdfd, tempurl, tempurl2;
var Offers = 0;
var final = [];
app.set('view engine', 'ejs');
app.set('views', './');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route to Login Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/result', async(req, res) => {
    // Insert Login Code Here


    let restaurant = req.body.restaurant;
    let area = req.body.area;
    let foodItem = req.body.foodItem;
    console.log(area, restaurant, foodItem);
    var areaSplit = area;
    var areaSplit = areaSplit.split(',');
    // console.log(areaSplit)
    // console.log(area);

    if (areaSplit.length == 2 && areaSplit[0] != areaSplit[1]) {
        urlForZomato = `https://in.search.yahoo.com/search;_ylt=?p=site:zomato.com+${restaurant}+${area}+order+online&ad=dirN&o=0`;
        urlForZomato = urlForZomato.split(' ').join('+')

        extractLinksOfZomato = async(url) => {
            try {
                // Fetching HTML
                console.log(url);
                const { data } = await axios.get(url)

                // Using cheerio to extract <a> tags
                const $ = cheerio.load(data);

                url = $('li[class=first] .compTitle h3 a').first().attr('href');
                console.log(url);


                if (url.includes("zomato") && !url.includes("/order")) {
                    url = url + "/order"
                }

                tempurl = url;
                tempurl = tempurl.split('/');

                for (var i = 0; i < tempurl.length - 1; i++) {
                    linkOld += tempurl[i];
                    linkOld += '/';
                }
                console.log('linkOld ', linkOld);
                console.log('url ', url);

                return url;

            } catch (error) {
                // res.sendFile(__dirname + '/try.html');
                console.log('hey');
            }
        };

        z = await extractLinksOfZomato(urlForZomato);
        extractAddress = async(url) => {
            try {
                // Fetching HTML
                const { data } = await axios.get(url)

                const $ = cheerio.load(data);


                tempAddress = $.html('.clKRrC');
                console.log(tempAddress);
                tempAddress = tempAddress.split('>');
                tempAddress = tempAddress[1].split('<');
                // a = a.split('"');
                tempAddress = tempAddress[0];
                tempAddress = tempAddress.split(',');
                tempAddress = tempAddress[tempAddress.length - 2] + tempAddress[tempAddress.length - 1];
                console.log(tempAddress);
                linkOld = '';

                // var discountcodes;
                // discountcodes = $.html('.evmswu');
                // console.log(discountcodes);
                return tempAddress;


            } catch (error) {
                // res.sendFile(__dirname + '/try.html');
                console.log('hey2');
            }
        };

        addr = await extractAddress(linkOld);

        urlForSwiggy = `https://in.search.yahoo.com/search;_ylt=?p=site:swiggy.com+${restaurant}+${addr}&ad=dirN&o=0`;
        urlForSwiggy = urlForSwiggy.split(' ').join('+')
        console.log("urlForSwiggy: ", urlForSwiggy)

        extractLinksOfSwiggy = async(url) => {
            try {
                // Fetching HTML
                const { data } = await axios.get(url)

                const $ = cheerio.load(data);
                // console.log(data);

                rawUrl = $('li[class=first] .compTitle h3 a').first().attr('href');
                console.log(rawUrl);
                return rawUrl


            } catch (error) {
                // res.sendFile(__dirname + '/try.html');
                console.log('hey3');
                console.log(error)
            }
        };

        s = await extractLinksOfSwiggy(urlForSwiggy);

        console.log(z + '\n' + s);

        if (z != '' && s != '') {
            const scrapeDishesForZomato = async(url, dish) => {
                const { data } = await axios.get(url)
                const $ = cheerio.load(data)
                    // console.log($.html());
                toMatch = dish.toLowerCase()
                matchedDishes = {}

                //sc-jKVCRD
                final.push({ restaurantName: restaurant });
                // final.push({ area: area });
                final.push({ urlForZomato: z });
                final.push({ urlForSwiggy: s });
                // final.push({ restaurantName: restaurant });
                if (($('.iYoYyT').text()) == 'Closed') {
                    Offers = 0;
                } else if (($('.iYoYyT').text()) == 'Open now') {
                    console.log("yes it is open!!");
                    Offers = 1;
                } else {
                    Offers = 1;
                }
                // final.push($('.sc-ebFjAB').text());
                // final.push($('.sc-jKVCRD').text());

                if (Offers == 1) {
                    console.log("Zomato Offers");
                    $('.sc-1a03l6b-3').map((i, elm) => {
                        final.push({
                            zomatoOffers: $(elm).text()
                        });
                        // console.log($(elm).text());

                    })
                }

                $('[class^=sc-1s0saks-13]').each((_idx, el) => {
                        item = $($('[class^=sc-1s0saks-15]', el)).text()
                        price = $($('[class^=sc-17hyc2s-1]', el)).text()
                            // console.log('zomato ' + item + ' ' + price);

                        if (item.toString().toLowerCase().includes(toMatch)) {
                            matchedDishes[item] = price
                            matchedDishes[item] = price;
                        }
                    })
                    // console.log(matchedDishes);

                return matchedDishes;
            }

            const scrapeDishesForSwiggy = async(url, dish) => {
                try {
                    console.log('started web scraping from swiggy');
                    const browser = await puppeteer.launch({ headless: true });
                    const page = await browser.newPage();
                    await page.goto(url, { waitUntil: 'networkidle2' });
                    const data = await page.evaluate(() => document.querySelector('*').outerHTML);
                    console.log("got the data from swiggy");
                    await browser.close();
                    const $ = cheerio.load(data)
                        // console.log($.html());
                    toMatch = dish.toLowerCase()
                    matchedDishes = {}

                    if (($('.iYoYyT').text()) == 'Closed') {
                        Offers = 0;
                    } else if (($('.iYoYyT').text()) == 'Open now') {
                        console.log("yes it is open!!");
                        Offers = 1;
                    } else {
                        Offers = 1;
                    }
                    console.log($('.iYoYyT').text());
                    //_3F2Nk

                    if (Offers == 1) {
                        console.log("\nSwiggy Offers");
                        $('._3F2Nk').map((i, elm) => {
                            checkForOffer = $(elm).text();
                            try {
                                checkForOffer = checkForOffer.split('|');
                            } catch (e) {
                                console.log(checkForOffer);
                            }
                            final.push({
                                swiggyOffers: checkForOffer
                            }); //undefined   
                        })
                    }

                    $('[class^=styles_detailsContainer]').each((_idx, el) => {
                        item = $($('[class^=styles_itemNameText]', el)).text()
                        price = $($('[class^=styles_itemPortionContainer]', el)).text()

                        if (item.toString().toLowerCase().includes(toMatch)) {
                            matchedDishes[item] = price
                            matchedDishes[item] = price;

                        }
                    })
                    console.log(matchedDishes);
                    return matchedDishes;
                } catch (e) {
                    console.log('try again');
                }
            }

            showDishes = async() => {
                matchedDishesForSwiggy = await scrapeDishesForSwiggy(s, foodItem);
                matchedDishesForZomato = await scrapeDishesForZomato(z, foodItem);
                // console.log(matchedDishesForZomato);
                matchedDishes = {}


                for (const dishName in matchedDishesForZomato) {
                    lowerDishName = dishName.toLowerCase().split(' ').sort().join(' ')
                    if (matchedDishes[lowerDishName]) {
                        matchedDishes[lowerDishName]['Zomato'] = {
                            'dishName': dishName,
                            'price': matchedDishesForZomato[dishName].substring(1)
                        }
                    } else {
                        matchedDishes[lowerDishName] = {
                            'Zomato': {
                                'dishName': dishName,
                                'price': matchedDishesForZomato[dishName].substring(1)
                            }
                        }
                    }
                }

                for (const dishName in matchedDishesForSwiggy) {
                    lowerDishName = dishName.toLowerCase().split(' ').sort().join(' ')
                    if (matchedDishes[lowerDishName]) {
                        matchedDishes[lowerDishName]['Swiggy'] = {
                            'dishName': dishName,
                            'price': matchedDishesForSwiggy[dishName]
                        }
                    } else {
                        matchedDishes[lowerDishName] = {
                            'Swiggy': {
                                'dishName': dishName,
                                'price': matchedDishesForSwiggy[dishName]
                            }
                        }
                    }
                }

                for (const dishName in matchedDishes) {
                    console.log(dishName)
                    final.push({
                        'dishName': matchedDishes[dishName]['Swiggy'] != undefined ? matchedDishes[dishName]['Swiggy']['dishName'] : matchedDishes[dishName]['Zomato']['dishName'],
                        'priceOnSwiggy': matchedDishes[dishName]['Swiggy'] == undefined ? 'N.A.' : matchedDishes[dishName]['Swiggy']['price'],
                        'priceOnZomato': matchedDishes[dishName]['Zomato'] == undefined ? 'N.A.' : matchedDishes[dishName]['Zomato']['price']
                    });
                }

                if (final.length == 0) {
                    console.log('The Item Is Not Available In The Restaurant !')
                    res.send('The Item Is Not Available In The Restaurant !')
                } else {
                    console.log(final);

                    // res.send(final);
                    res.render('index', { final: final });
                }
                final = [];
                // console.log(final);
                // for (var i = 0; i < 10; i++) {
                //     res.send(i);
                // }
            }
            await showDishes();
        } else {
            res.sendFile(__dirname + '/error.html');
            console.log('online delivery is not available in either or both the restaurant');
        }
    } else {
        res.sendFile(__dirname + '/error.html');
    }

});

const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));

// app.listen(port, () => console.log(`This app is listening on port ${port}`));
