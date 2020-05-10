const request = require('request-promise');
const cheerio = require('cheerio');

function crawlWebsite() {
    var options = {
        uri: 'http://www.google.com',
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    rp(options)
        .then(function ($) {
            // Process html like you would with jQuery...
        })
        .catch(function (err) {
            // Crawling failed or Cheerio choked...
        });

}
