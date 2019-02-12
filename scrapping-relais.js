//const rp = require('request-promise');
const cheerio = require('cheerio');
const request = require('request-promise');

var hotelLinks = [];
var restaurantLinks = [];
var restaurantNames = [];

var restaurantNames = [];

/*rp(url)
.then(function(html){
//success!
console.log($('big > a', html).length);
console.log($('big > a', html));
})
.catch(function(err){
//handle error
console.log(err);
});
*/


/*function getLinks(){
request({
method: 'GET',
url: url
}, (err, res, body) => {

if (err) return console.error(err);

var $ =  cheerio.load(body);



$('#countryF+#countryF li').each(function (i, e) {
tempLink = $(this).children('a').first().attr('href');
links.push(tempLink);
});
console.log(links);
console.log(links.length);
});
}*/



async function getHotelLinks(url) {
  var options = {
    uri: url,
    method: "GET",
    transform: function(body){
      return  cheerio.load(body);
    }
  }
  try {
    var $ = await request(options);
    $('#countryF+#countryF li').each(function (i, e) {
      tempLink = $(this).children('a').first().attr('href');
      hotelLinks.push(tempLink);
    });
    console.log(hotelLinks);
  } catch (err) {
    console.error(err);
  }
}





async function getRestaurantLink(url){
  var options = {
    uri: url,
    method: "GET",
    transform: function(body){
      return  cheerio.load(body);
    }
  }
  try {
    var $ = await request(options);
    let hotel = $('.jsSecondNavMain li').children('a').attr('data-id');
    if(hotel === 'isProperty')
    {
      let restaurant = $('.jsSecondNavMain li').slice(1,2).children('a').attr('data-id');
      if(restaurant.includes('isRestaurant')){
        let restaurantlink = $('.jsSecondNavMain li').slice(1,2).children('a').attr('href');
        restaurantLinks.push(restaurantlink);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function getAllRestaurantLinks(){
  for(var i=0; i<10; i++)
  {
    await getRestaurantLink(hotelLinks[i]);
    process.stdout.write("Fetching " + i + " / " + hotelLinks.length + "\r");
  }
  console.log(restaurantLinks);
  console.log(restaurantLinks.length);
}




async function getRestaurantName(url){
  var options = {
    uri: url,
    method: "GET",
    transform: function(body){
      return  cheerio.load(body);
    }
  }
  try {
    var $ = await request(options);
    let restaurants = $('.jsSecondNavSub li').each(function (i, e) {
      resto = $(this).children('a').text();
      resto = resto.replace(/(\r\n|\n|\r)/gm," ");
      resto = resto.replace(/\s+/g," ");
      resto = resto.replace(/\\/g, "");
      restaurantNames.push(resto);
    });
  } catch (err) {
    console.error(err);
  }
}

async function getAllRestaurantNames(){
  for(var i=0; i<restaurantLinks.length; i++)
  {
    await getRestaurantName(restaurantLinks[i]);
    process.stdout.write("Fetching " + i + " / " + restaurantLinks.length + "\r");
  }
  console.log(restaurantNames);
  console.log(restaurantNames.length);
}





async function test(){
  try {
    await getHotelLinks('https://www.relaischateaux.com/fr/site-map/etablissements');
    await getAllRestaurantLinks();
    await getAllRestaurantNames();
  } catch (e) {
    console.log(e);
  }
}

test();
//getLinks('https://www.relaischateaux.com/fr/site-map/etablissements');
//getRestaurantLink('https://www.relaischateaux.com/fr/france/bussiere-cote-d-or-la-bussiere-sur-ouche');
//getRestaurantName('https://www.relaischateaux.com/fr/france/restaurant/l-oustau-de-baumaniere-bouches-du-rhone-les-baux-de-provence');
