const chateaux = require('./scrapping-relais');
const michelin = require('./scrapping-michelin');

//const properties = chateaux.getProperties();
//const prices = chateaux.getPrices(property);

//michelin.getAllStarredRestaurants();

async function main(){
  try {
    console.log('-----------------------------------------------------------')
    console.log('\nStep 1: Getting Michelin starred restaurants...')
    var starredRestaurants = await michelin.get();
    console.log('\n-----------------------------------------------------------')
    console.log('\nStep 2: Getting Relais & Chateaux properties that are hotel/restaurant...')
    var chateauxRestaurants = await chateaux.getPropertiesAndRestaurants();
    console.log('\n-----------------------------------------------------------')
    console.log("\nStep 3: Keep hotels/restaurants in Relais & Chateaux that are Michelin starred restaurants")
    var hotelLinks = await comparaison(chateauxRestaurants,starredRestaurants);
    console.log('Found: '+hotelLinks.length + ' hotels');
    console.log('\n-----------------------------------------------------------')

    console.log("\nRESULTS:\n\tAscending price of hotels that have Michelin starred restaurants"+
                "\nTOTAL number of hotels: "+hotelLinks.length +"\n");
    await chateaux.getHotelsSortedByPrice(hotelLinks);
    console.log('\n-----------------------------------------------------------')

  }
  catch(err) {
    console.error(err);
  }
}

function comparaison(chateauxRestaurants, starredRestaurants)
{
  var hotelLinks = [];
  for(var i=0; i<chateauxRestaurants.length; i++)
  {
    for(var j=0; j<starredRestaurants.length; j++)
    {
      var restoRegExp1 = new RegExp(chateauxRestaurants[i].restoName);
      var restoRegExp2 = new RegExp(starredRestaurants[j]);
      if(restoRegExp1.test(starredRestaurants[j]) || restoRegExp2.test(chateauxRestaurants[i].restoName))
      {
        if(hotelLinks.includes(chateauxRestaurants[i].hotelLink)) {}
        else {
          hotelLinks.push(chateauxRestaurants[i].hotelLink);
        }
      }
    }
  }
  return hotelLinks;
}

main();
