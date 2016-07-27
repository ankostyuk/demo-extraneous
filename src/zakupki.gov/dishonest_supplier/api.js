var request = require('request'),
    util    = require('util'),
    _       = require('lodash');

var parser  = require('./parser');

//
var dishonestSupplierConfig = {
    'company': {
        // url template '?searchText=<company_inn>...'
        url: 'http://zakupki.gov.ru/epz/dishonestsupplier/quicksearch/search.html?searchString=<company_inn>&strictEqual=on&pageNumber=1&sortDirection=false&recordsPerPage=_10&fz_44=on&fz_223=on&inclusionDateFrom=&inclusionDateTo=&lastUpdateDateFrom=&lastUpdateDateTo=&sortBy=UPDATE_DATE'
    }
};

function errorThrow(error, url, e) {
    error(util.format('GET %s failed...\n%s', url, e));
}

//
// req: {
//      inn: (String)
// }
exports.getCompanyDishonestSupplier = function(req, success, error) {
    var config  = dishonestSupplierConfig['company'],
        url     = config.url.replace(/<company_inn>/, req.inn);

    request.get({
        url: url
    }, function(err, httpResponse, body) {
        if (err) {
            errorThrow(error, url, err);
            return;
        }

        var data = parser.parseCompanyDishonestSupplierHtml(body);

        if (data.error) {
            errorThrow(error, url, data.error);
            return;
        }

        success(data);
    });
};
