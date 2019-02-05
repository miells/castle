const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://www.relaischateaux.com/fr/site-map/etablissements';
const request = require('request');

var linksChef = [];
var linksMaitreMaison = [];

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


function getLinks(){
request({
  method: 'GET',
  url: url
}, (err, res, body) => {

  if (err) return console.error(err);

  var $ = cheerio.load(body);



  $('#countryF+#countryF li').each(function (i, e) {
    var maitreRegExp = new RegExp('maitre-maison');
    var tempLink = $(this).children('a').slice(1,2).attr('href');
    if(maitreRegExp.test(tempLink)){
      tempLink = $(this).children('a').first().attr('href');
      linksMaitreMaison.push(tempLink)
    }
    else {
      linksChef.push(tempLink);
    }
  });



  console.log(linksMaitreMaison);
  console.log(linksChef);

  console.log(linksChef.length);
});
}


function getRestaurantName(url){
    request({
      method: 'GET',
      url: url
    }, (err, res, body) => {

      if (err) return console.error(err);

      let $ = cheerio.load(body);

      let title = $('.chefDetailInfo .locationContact strong');

      console.log(title.text());
    });
  }


async function test(){
  try {
    await getLinks();
    await getRestaurantName(linksChef[0]);
  } catch (e) {

  }
}

test();

//getRestaurantNames();
