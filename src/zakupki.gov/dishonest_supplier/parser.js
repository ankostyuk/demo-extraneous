//
var cheerio = require('cheerio'),
    _       = require('lodash');

//
exports.parseCompanyDishonestSupplierHtml = function(html) {
    // console.log('parsing...', html);

    var $       = cheerio.load(html),
        $totals = $('.paginator .allRecords'),
        $empty  = $('.paginator .noRecords');

    if (_.isEmpty($totals) && _.isEmpty($empty)) {
        return {
            error: 'FORMAT_NOT_SUPPORTED'
        };
    }

    var total = 0,
        text;

    if (!_.isEmpty($totals)) {
        text = $totals.first().text().replace(/[^0-9]/g, '');
        total = parseInt(text) || 0;
    }

    return {
        total: total
    };
};
