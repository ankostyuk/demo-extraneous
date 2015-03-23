var parser = require('../../../src/fns/reg_docs/parser.js');

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
        data        = parser.parseHtml(html);

    console.log('parseFile...', filePath, '\n', data);

    return data;
}

//
describe('parser test', function(){
    it('1063704009324.html', function(){
        var data = parseFile('data/demo/1063704009324.html');

        assert.strictEqual(data.total, 4);
    })
})
