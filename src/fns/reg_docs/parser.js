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
exports.parseCompanyRegDocsHtml = function(html) {
    // console.log('parsing...', html);

    var $       = cheerio.load(html),
        list    = [];

    $('#uwsdata tbody tr').each(function(){
        var cols    = $(this).children(),
            col_1   = $(cols[0]).contents(),
            col_2   = $(cols[1]).contents(),
            col_3   = $(cols[2]).contents(),
            col_4   = $(cols[3]).contents(),
            col_5   = $(cols[4]).contents();

        var entry = {
            // Сведения о юридическом лице
            name: text($(col_1[1])),
            ogrn: text($(col_1[5])),

            // Сведения о поданном заявлении
            // Форма заявления
            form: text($(col_2[2])),
            // Вид изменений
            type: text($(col_2[5])),

            // Сведения о представлении документов
            // Дата представления
            submissionDate: date($(col_3[1])),
            // Способ представления
            submissionType: text($(col_3[5])),
            // Входящий номер
            submissionId: text($(col_3[9])),

            // Наименование налогового органа
            ifns: text($(col_4[0])),

            // Сведения о решении
            // Вид решения
            decision: text($(col_5[2])),
            // Дата готовности документов:
            readyDate: date($(col_5[6]))
        };

        list.push(entry);
    });

    return {
        list: list,
        total: _.size(list)
    };
};
