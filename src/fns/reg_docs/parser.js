//
var cheerio = require('cheerio'),
    _       = require('lodash'),
    _s      = require('underscore.string');

//
function getNumber(text) {
    var n = parseInt(_s.trim(text));
    return _.isNaN(n) ? null : n;
}

//
exports.parseHtml = function(html) {
    console.log('parsing...');

    var $ = cheerio.load(html),
        total;

    //
    total = getNumber($('#uwsfound span').text());

    return {
        total: total
    };
};
