var request = require('request'),
    util    = require('util'),
    _       = require('lodash');

var parser  = require('./parser');

//
var dishonestSupplierConfig = {
    'company': {
        // url template '...&searchText=<company_inn>...'
        url: 'http://zakupki.gov.ru/epz/dishonestsupplier/dishonestSuppliersQuickSearch/search.html?placeOfSearch=FZ_44&_placeOfSearch=on&placeOfSearch=FZ_223&_placeOfSearch=on&dateOfInclusionStart=&dateOfInclusionEnd=&sortDirection=false&dishonestSupplierSimpleSorting=UPDATE_DATE&recordsPerPage=_10&pageNumber=1&searchText=<company_inn>&strictEqual=true&morphology=false'
    }
};

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
            error(util.format('GET %s failed...\n%s', url, err));
            return;
        }

        var data = parser.parseCompanyDishonestSupplierHtml(body);

        success(data);
    });
};
