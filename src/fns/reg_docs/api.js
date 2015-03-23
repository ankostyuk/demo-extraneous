var request = require('request'),
    util    = require('util'),
    _       = require('lodash');

var parser  = require('./parser');

//
var fnsRegDocsDefaultForm = {
    nptype: null,
    ogrn: null,
    ogrnip: null,
    name: null,
    frm: null,
    frmip: null,
    ifns: null,
    dtfrom: null,
    dtto: null
};

var regDocsConfig = {
    'company': {
        // url: 'http://service.nalog-xxx.ru/uwsfind.do',
        url: 'https://service.nalog.ru/uwsfind.do',
        defaultForm: _.extend({}, fnsRegDocsDefaultForm, {
            nptype: 'ul'
        })
    }
};

//
// req: {
//      ogrn: (String)
// }
exports.getCompanyRegDocs = function(req, success, error) {
    var config  = regDocsConfig['company'],
        url     = config.url;

    var form = _.extend({}, config.defaultForm, {
        ogrn: req.ogrn
    })

    request.post({
        url: url,
        form: form
    }, function(err, httpResponse, body) {
        if (err) {
            error(util.format('POST %s with data %j failed...\n%s', url, form, err));
            return;
        }

        var data = parser.parse(body);

        success(data);
    });
};
