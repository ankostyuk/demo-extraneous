var parser = require('../../../src/zakupki.gov/dishonest_supplier/parser.js');

var _           = require('lodash'),
    _s          = require('underscore.string'),
    fs          = require('fs-extra'),
    path        = require('path'),
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should();

var readFileOptions = {
    encoding: 'utf8'
};

function parseFile(htmlFile) {
    var filePath    = path.resolve(__dirname, htmlFile),
        html        = fs.readFileSync(filePath, readFileOptions),
        data        = parser.parseCompanyDishonestSupplierHtml(html);

    console.log('parseFile...', filePath, '\n', data);

    return data;
}

//
describe('Реестр недобросовестных поставщиков http://zakupki.gov.ru/epz/dishonestsupplier/', function(){
    it('3811143830.html', function(){
        var data = parseFile('data/demo/3811143830.html');

        assert.strictEqual(data.total, 1);
    })

    it('5190188445.html', function(){
        var data = parseFile('data/demo/5190188445.html');

        assert.strictEqual(data.total, 3);
    })

    it('empty_result.html', function(){
        var data = parseFile('data/demo/empty_result.html');

        assert.strictEqual(data.total, 0);
    })
})
