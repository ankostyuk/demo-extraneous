//
var cheerio = require('cheerio'),
    _       = require('lodash'),
    _s      = require('underscore.string');

//
function text(element) {
    return _s.clean(element.text());
}

//
exports.parseCompanyListHtml = function(html) {
    var $       = cheerio.load(html),
        list    = [];

    $('#ctl00_cphBody_gvDebtors tr').each(function(i, el){
        // Пропустить первую строку-заголовок
        if (i === 0) {
            return;
        }

        var cols    = $(this).children(),
            col_2   = $(cols[1]);

        var entry = {
            name: text(col_2),
            link: col_2.find('a').attr('href')
        };

        list.push(entry);
    });

    return {
        list: list,
        total: _.size(list) // TODO при постраничном выводе?
    };
};

exports.parseCompanyBankruptcyHtml = function(html) {
    // console.log('parsing...', html);

    var $       = cheerio.load(html),
        list    = [];

    return {
        list: list,
        total: _.size(list)
    };
};
