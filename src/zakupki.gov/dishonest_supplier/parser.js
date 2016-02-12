//
var cheerio = require('cheerio'),
    _       = require('lodash'),
    _s      = require('underscore.string');

//
exports.parseCompanyDishonestSupplierHtml = function(html) {
    // console.log('parsing...', html);

    var $           = cheerio.load(html),
        totalText   = $('.paginator .allRecords').text().replace(/[^0-9]/g, ''),
        total       = parseInt(totalText) || 0;

    return {
        total: total
    };
};
