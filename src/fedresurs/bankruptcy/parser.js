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
exports.parseServiceFormHtml = function(html, params) {
    var $ = cheerio.load(html);

    _.each(_.keys(params), function(k){
        params[k] = $('input[name="' + k + '"]' + '[id="' + k + '"]').val() || '';
    });

    return params;
};

exports.parseListHtml = function(html) {
    // console.log('parsing...', html);

    var $       = cheerio.load(html),
        list    = [];

    if ($('#ctl00_cphBody_antiBot_MessageLabel').length) {
        return {
            error: 'REQUEST_BLOCKING'
        };
    }

    $('#ctl00_cphBody_gvDebtors > tr').each(function(i){
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

exports.parseMessagesHtml = function(html, dataOptions) {
    var $           = cheerio.load(html),
        messagelist = [],
        total       = null;

    $('#ctl00_cphBody_gvMessages > tr:not(.pager)').each(function(i){
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

    total = parseInt($('#ctl00_cphBody_hfMessagesCount').val()) || _.size(messagelist);

    return {
        messages: {
            list: messagelist,
            total: total
        }
    };
};
