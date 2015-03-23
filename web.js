//
var express = require('express'),
    nconf   = require('nconf');

var regDocs = require('./src/fns/reg_docs/api');

//
nconf.argv().file({
    file: 'defaults.json'
});

console.log('Config: ', JSON.stringify(nconf.get()));

//
var app = express();

app.get('/fns/company/reg_docs', function(req, res, next) {
    var ogrn = req.query.ogrn;

    if (!ogrn) {
        badRequestError(res, 'Параметр ogrn обязателен');
        return;
    }

    regDocs.getCompanyRegDocs({
        ogrn: ogrn
    }, function(data) {
        res.json(data);
    }, function(message) {
        next(message);
    });
});

//
app.use(internalErrorHandler);

var server = app.listen(nconf.get('port'), function(){
    var host = server.address().address,
        port = server.address().port;

    console.log('extraneous web listening at http://%s:%s', host, port)
});

function badRequestError(res, message) {
    res.status(400).json({
        error: message
    });
}

function internalErrorHandler(err, req, res, next) {
    console.warn('Internal error:', err);
    res.status(500).json({
        error: 'INTERNAL_ERROR'
    });
}
