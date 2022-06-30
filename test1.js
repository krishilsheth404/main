const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
// const axios = require('axios')
// const got = require('got');
const cheerio = require('cheerio')
const puppeteer = require('puppeteer');
const request = require('request');
const { link } = require('fs');
const ejs = require("ejs");
const superagent = require('superagent')
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
    var data;
    // console.log(area, restaurant, foodItem);
    var areaSplit = area;
    var areaSplit = areaSplit.trim().split(',');
    // console.log(areaSplit)
    // console.log(area);
    async function getData(url) {
        try {
            const response = await superagent(url);
            return response.text;
        } catch (error) {
            return error;
        }
    };

    if (areaSplit.length == 2 && areaSplit[0] != areaSplit[1]) {
        urlForZomato = `https://google.com/search?q=zomato+${restaurant}+${area}+order+online`;
        urlForZomato = urlForZomato.split(' ').join('+')

        extractLinksOfZomato = async(url) => {
            try {
                // Fetching HTML
                console.log(url);
                // const { data } = await axios.get(url)

                data = await getData(url);
                console.log('Data: ', data)

                // Using cheerio to extract <a> tags
                const $ = cheerio.load(data);

                rawUrl = $('.kCrYT>a').first().attr('href');
                url = rawUrl.split("/url?q=")[1].split("&")[0];
                console.log(url);

                if (url.includes("zomato") && !url.includes("/order")) {
                    url = url + "/order"
                }

                tempurl = url;
                tempurl = tempurl.split('/');
                console.log(tempurl);

                for (var i = 0; i < tempurl.length - 1; i++) {
                    linkOld += tempurl[i];
                    linkOld += '/';
                }
                console.log('linkOld ', linkOld);
                console.log('url ', url);

                return url;

            } catch (error) {
                // res.sendFile(__dirname + '/try.html');
                res.sendFile(__dirname + '/error.html');
            }
        };
        z = await extractLinksOfZomato(urlForZomato);
        console.log(z);

        extractAddress = async(url) => {
            try {
                // Fetching HTML

                data = await getData(url);
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
                return addr;
            }
        };

        addr = await extractAddress(linkOld);

        urlForSwiggy = `https://google.com/search?q=swiggy+${restaurant}+${addr}`;
        urlForSwiggy = urlForSwiggy.split(' ').join('+')
        console.log("urlForSwiggy: ", urlForSwiggy)

        extractLinksOfSwiggy = async(url) => {
            try {
                // Fetching HTML

                data = await getData(url);

                const $ = cheerio.load(data);
                // console.log(data);

                rawUrl = $('.kCrYT>a').attr('href');
                console.log('Here => ', rawUrl);
                url = rawUrl.split("/url?q=")[1].split("&")[0];

                if (url.includes('www.swiggy.com')) {
                    return url;
                } else {
                    // res.sendFile(__dirname + '/try.html');
                    console.log('errorInUrl');

                    // rawUrl = $('.kCrYT>a:nth-child(2)').attr('href');
                    // console.log('SecondTry Url==>>', rawUrl);

                }
            } catch (error) {
                // res.sendFile(__dirname + '/try.html');
                res.sendFile(__dirname + '/error.html');
            }
        };

        s = await extractLinksOfSwiggy(urlForSwiggy);

        console.log(z + '\n' + s);

        if (z != '' && s != '') {
            const scrapeDishesForZomato = async(url, dish) => {
                data = await getData(url);

                const $ = cheerio.load(data)
                toMatch = dish.toLowerCase()
                matchedDishes = {}

                //sc-jKVCRD
                final.push({ restaurantName: restaurant });
                // final.push({ area: area });
                final.push({ urlForZomato: z });
                final.push({ urlForSwiggy: s });
                // if (($('.iYoYyT').text()) == 'Closed') {
                //     Offers = 0;
                // } else if (($('.iYoYyT').text()) == 'Open now') {
                //     console.log("open!!");
                //     Offers = 1;
                // } else {
                //     Offers = 1;
                // }

                // if (Offers == 1) {
                console.log("Zomato Offers");

                try {
                    $('.GyojG').map((i, elm) => {
                        final.push({
                            zomatoOffers: $(elm).text()
                        });
                        console.log($(elm).text());

                    })
                } catch (error) {
                    console.log(error);
                }
                // }

                $('[class^=sc-1s0saks-13]').each((_idx, el) => {
                    item = $($('[class^=sc-1s0saks-15]', el)).text()
                    price = $($('[class^=sc-17hyc2s-1]', el)).text()
                        // console.log('zomato ' + item + ' ' + price);

                    if (item.toString().toLowerCase().includes(toMatch)) {
                        matchedDishes[item] = price
                        matchedDishes[item] = price;
                    }
                })

                return matchedDishes;
            }

            const scrapeDishesForSwiggy = async(url, dish) => {
                data = await getData(url);
                const $ = cheerio.load(data)
                toMatch = dish.toLowerCase()
                matchedDishes = {}
                    //_3F2Nk

                // if (Offers == 1) {
                console.log("\nSwiggy Offers");
                $('.DM5zR').map((i, elm) => {
                        checkForOffer = $(elm).text();
                        // console.log(checkForOffer);
                        final.push({
                            swiggyOffers: $(elm).text()
                        }); //undefined   
                    })
                    // }

                $('[class^=styles_detailsContainer]').each((_idx, el) => {
                    item = $($('[class^=styles_itemNameText]', el)).text()
                    price = $($('[class^=styles_itemPortionContainer]', el)).text()

                    if (item.toString().toLowerCase().includes(toMatch)) {
                        matchedDishes[item] = price
                        matchedDishes[item] = price;

                    }
                })
                return matchedDishes;
            }

            showDishes = async() => {
                matchedDishesForZomato = await scrapeDishesForZomato(z, foodItem);
                matchedDishesForSwiggy = await scrapeDishesForSwiggy(s, foodItem);
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
                    // console.log(dishName)
                    final.push({
                        'dishName': matchedDishes[dishName]['Swiggy'] != undefined ? matchedDishes[dishName]['Swiggy']['dishName'] : matchedDishes[dishName]['Zomato']['dishName'],
                        'priceOnSwiggy': matchedDishes[dishName]['Swiggy'] == undefined ? 'N.A.' : matchedDishes[dishName]['Swiggy']['price'],
                        'priceOnZomato': matchedDishes[dishName]['Zomato'] == undefined ? 'N.A.' : matchedDishes[dishName]['Zomato']['price']
                    });
                }

                console.log(final);
                if (final.length == 0) {
                    console.log('The Item Is Not Available In The Restaurant !')
                    res.send('The Item Is Not Available In The Restaurant !')
                } else {

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
            // res.sendFile(__dirname + '/output.html');
            console.log('online delivery is not available in the restaurant');
        }
    } else {
        res.sendFile(__dirname + '/addressError.html');
    }

});

const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));

// app.listen(port, () => console.log(`This app is listening on port ${port}`));