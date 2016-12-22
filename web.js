//
var express = require('express'),
    nconf   = require('nconf');

var regDocs             = require('./src/fns/reg_docs/api'),
    bankruptcy          = require('./src/fedresurs/bankruptcy/api'),
    dishonestSupplier   = require('./src/zakupki.gov/dishonest_supplier/api');

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

app.get('/fedresurs/company/bankruptcy', function(req, res, next) {
    var ogrn = req.query.ogrn;

    if (!ogrn) {
        badRequestError(res, 'Параметр ogrn обязателен');
        return;
    }

    bankruptcy.getCompanyBankruptcy({
        params: {
            ogrn: ogrn
        }
    }, function(data) {
        res.json(data);
    }, function(message) {
        next(message);
    });
});

app.get('/fedresurs/individual/bankruptcy', function(req, res, next) {
    var inn =   req.query.inn,
        name =  req.query.name;

    if (!inn && !name) {
        badRequestError(res, 'Параметр inn или name обязателен');
        return;
    }

    bankruptcy.getIndividualBankruptcy({
        params: {
            inn: inn,
            name: name
        }
    }, function(data) {
        res.json(data);
    }, function(message) {
        next(message);
    });
});

app.get('/purchase/company/dishonest_supplier', function(req, res, next) {
    var inn     = req.query.inn,
        debug   = req.query.debug === 'true';

    if (!inn) {
        badRequestError(res, 'Параметр inn обязателен');
        return;
    }

    dishonestSupplier.getCompanyDishonestSupplier({
        inn: inn
    }, function(data) {
        res.json(data);
    }, function(message) {
        next(message);
    }, debug);
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
