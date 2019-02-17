//const rp = require('request-promise');
const cheerio = require('cheerio');
const request = require('request-promise');

var hotelLinks = [];
var restaurantLinks = [];
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
        restaurantLinks.push({restoLink : restaurantlink, hotelLink: url});
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function getAllRestaurantLinks(){
  for(var i=0; i<hotelLinks.length; i++)
  {
    await getRestaurantLink(hotelLinks[i]);
    process.stdout.write("\t\tAnalysing " + (i+1) + " / " + hotelLinks.length + " hotel links\r");
  }
}




async function getRestaurantName(url){
  var options = {
    uri: url.restoLink,
    method: "GET",
    transform: function(body){
      return  cheerio.load(body);
    }
  }
  try {
    var $ = await request(options);
    if($('.jsSecondNavSub').length)
    {
      let restaurants = $('.jsSecondNavSub li').each(function (i, e) {
        resto = $(this).children('a').text();
        resto = resto.replace(/(\r\n|\n|\r)/gm," ");
        resto = resto.replace(/\s+/g," ");
        resto = resto.replace(/\\/g, "");
        resto = resto.replace(/[*]/gm,"");
        resto = resto.substring(1,resto.length-1)
        restaurantNames.push({restoName : resto, hotelLink: url.hotelLink});
      });
    }
    else{
      let resto = $('.ajaxPages .hotelTabsHeaderTitle .mainTitle2').text();
      resto = resto.replace(/(\r\n|\n|\r)/gm," ");
      resto = resto.replace(/\s+/g," ");
      resto = resto.replace(/\\/g, "");
      resto = resto.replace(/[*]/gm,"");
      resto = resto.substring(1,resto.length-1)
      restaurantNames.push({restoName : resto, hotelLink: url.hotelLink});
    }
  } catch (err) {
    console.error(err);
  }
}

async function getAllRestaurantNames(){
  for(var i=0; i<restaurantLinks.length; i++)
  {
    await getRestaurantName(restaurantLinks[i]);
    process.stdout.write("\t\tAnalysing " + (i+1) + " / " + restaurantLinks.length + " restaurant links\r");
  }
}





exports.getPropertiesAndRestaurants = async function getPropertiesAndRestaurants(){
  try {
    console.log('\tGetting hotels link...');
    await getHotelLinks('https://www.relaischateaux.com/fr/site-map/etablissements');
    await console.log("\t\tFound: "+hotelLinks.length+" hotel links");

    console.log('\tGetting restaurants link...');
    await getAllRestaurantLinks();
    await console.log("\n\t\tFound: "+restaurantLinks.length+" restaurant links");

    console.log('\tGetting restaurants name...')
    await getAllRestaurantNames();
    await console.log("\n\t\tFound: "+restaurantNames.length+" restaurant names");

    return restaurantNames;
  } catch (e) {
    console.log(e);
  }
}


async function getHotelInformation(url){
  var options = {
    uri: url,
    method: "GET",
    transform: function(body){
      return  cheerio.load(body);
    }
  }
  try {
    var $ = await request(options);
    let price = $('.hotelHeader .innerHotelHeader .priceTag .price').text();
    price = price.replace(/,/g, ".");
    if(price != '')
    {
      let hotelName = $('.hotelHeader .headings .mainTitle2').text();
      hotelName = hotelName.replace(/(\r\n|\n|\r)/gm," ");
      hotelName = hotelName.replace(/\s+/g," ");
      hotelName = hotelName.replace(/\\/g, "");
      hotelName = hotelName.replace(/[*]/gm,"");
      hotelName = hotelName.substring(1,hotelName.length-1)
      let result = {price, hotelName}
      return result;
    }
    return null;
  }
  catch (e) {
    console.log(e);
  }
}

exports.getHotelsSortedByPrice = async function getHotelsSortedByPrice(hotelLinks){
  var hotelsInformation = [];
  for(var i=0; i<hotelLinks.length; i++){
    process.stdout.write("\t\tFetching hotel information: " + (i+1) + " / " + hotelLinks.length + " hotels\r");
    var hotelInfo = await getHotelInformation(hotelLinks[i]);
    if(hotelInfo != null)
    {
      var hotel = {name: hotelInfo.hotelName, price: hotelInfo.price};
      hotelsInformation.push(hotel);
    }
  }

  await hotelsInformation.sort(function (a, b) {
    return a.price - b.price;
  });
  console.log(hotelsInformation);
}

//getPrice("https://www.relaischateaux.com/fr/france/restaurant/bistrot-des-moines-cote-d-or-la-bussiere-sur-ouche");
/*var hotelLinks = [ 'https://www.relaischateaux.com/fr/france/bussiere-cote-d-or-la-bussiere-sur-ouche',
'https://www.relaischateaux.com/fr/france/annedebretagne-loire-atlantique-la-plaine-sur-mer',
'https://www.relaischateaux.com/fr/france/assiette-champenoise-champagne-ardenne-tinqueux',
'https://www.relaischateaux.com/fr/france/crocodile-bas-rhin',
'https://www.relaischateaux.com/fr/france/coeurduvillage-rhone-alpes-la-clusaz',
'https://www.relaischateaux.com/fr/france/aubergedelile-rhone-lyon',
'https://www.relaischateaux.com/fr/france/auberge-des-glazicks-plomodiern'];
getHotelsSortedByPrice(hotelLinks)*/
//test();
//getLinks('https://www.relaischateaux.com/fr/site-map/etablissements');
//getRestaurantLink('https://www.relaischateaux.com/fr/france/bussiere-cote-d-or-la-bussiere-sur-ouche');
//getRestaurantName('https://www.relaischateaux.com/fr/france/restaurant/l-oustau-de-baumaniere-bouches-du-rhone-les-baux-de-provence');
