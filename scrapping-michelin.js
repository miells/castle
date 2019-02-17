const cheerio = require('cheerio');
const request = require('request-promise');



async function getStarredRestaurantsInUrl(url, starredRestaurants) {
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

exports.get = async function getAllStarredRestaurants(){
  var starredRestaurants = [];
  for(var i=1; i<=35; i++)
  {
    process.stdout.write("\tAnalysing "+ i + " / 35 pages\r")
    await getStarredRestaurantsInUrl('https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'+i, starredRestaurants);
  }
  await console.log("\nFound: "+starredRestaurants.length+ " starred restaurants")
  return starredRestaurants;
}

//getAllStarredRestaurants(35);
