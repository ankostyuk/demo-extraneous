//
var cheerio = require('cheerio'),
    _       = require('lodash'),
    _s      = require('underscore.string');

//
function text(element) {
    return _s.clean(element.text());
}

function date(element) {
    return _s.clean(element.text());
}

//
exports.parseCompanyListHtml = function(html) {
    var $       = cheerio.load(html),
        list    = [];

    $('#ctl00_cphBody_gvDebtors tr').each(function(i){
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

exports.parseCompanyBankruptcyHtml = function(html, dataOptions) {
    var $           = cheerio.load(html),
        messagelist = [];

    $('#ctl00_cphBody_gvMessages tr').each(function(i){
        // Пропустить первую строку-заголовок
        if (i === 0) {
            return;
        }

        var cols    = $(this).children(),
            col_1   = $(cols[0]);
            col_2   = $(cols[1]);

        var entry = {
            date: date(col_1),
            type: text(col_2),
            link: dataOptions.baseUrl + col_2.find('a').attr('href')
        };

        messagelist.push(entry);
    });

    return {
        messages: {
            list: messagelist,
            total: _.size(messagelist)
        }
    };
};
