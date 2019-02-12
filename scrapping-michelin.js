const cheerio = require('cheerio');
const request = require('request-promise');

var starredRestaurants = [];

async function getStarredRestaurantsInUrl(url) {
  var options = {
    uri: url,
    method: "GET",
    transform: function(body){
      return  cheerio.load(body);
    }
  }
  try {
    var $ = await request(options);
    $('.poi-search-result li').each(function (i, e) {
      tempResto = $(this).children('div').attr('attr-gtm-title');
      if(tempResto !== undefined)
      {
        starredRestaurants.push(tempResto);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

async function getAllStarredRestaurants(pages){
  for(var i=1; i<=pages; i++)
  {
    await getStarredRestaurantsInUrl('https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'+i);
  }
  console.log(starredRestaurants);
}

getAllStarredRestaurants(35);
