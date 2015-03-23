var express = require('express'),
    nconf   = require('nconf');

var app = express();

nconf.argv().file({
    file: 'defaults.json'
});

console.log('Config: ', JSON.stringify(nconf.get()));

app.get('/fns/reg_docs', function(req, res) {
    res.status(501).json({
        error: 'API_NOT_IMPLEMENTED',
        message: 'API не поддерживается'
    });
});

var server = app.listen(nconf.get('port'), function(){
    var host = server.address().address,
        port = server.address().port;

    console.log('extraneous web listening at http://%s:%s', host, port)
});
