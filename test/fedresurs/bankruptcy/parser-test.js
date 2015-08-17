var parser = require('../../../src/fedresurs/bankruptcy/parser.js');

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

function parseCompanyListFile(htmlFile) {
    var filePath    = path.resolve(__dirname, htmlFile),
        html        = fs.readFileSync(filePath, readFileOptions),
        data        = parser.parseCompanyListHtml(html);

    console.log('parseCompanyListFile...', filePath, '\n', data);

    return data;
}

//
describe('Банкротства http://bankrot.fedresurs.ru/', function(){
    describe('Списки компаний в результатах поиска', function(){
        it('РОСПРОДУКТ', function(){
            var data = parseCompanyListFile('data/demo/company-list/1089847090893.html');

            assert.strictEqual(data.total, 1);
            expect(data.list).to.have.length(1);

            assert.deepEqual({
                name: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "РОСПРОДУКТ"',
                link: '/OrganizationCard.aspx?ID=0A6F24B56027B2A95364A4635B57BC65',
            }, data.list[0]);
        })

        it('Метизный завод', function(){
            var data = parseCompanyListFile('data/demo/company-list/1123444006366.html');

            assert.strictEqual(data.total, 1);
            expect(data.list).to.have.length(1);

            assert.deepEqual({
                name: 'Общество с ограниченной ответственностью «Метизный завод»',
                link: '/OrganizationCard.aspx?ID=31B499678179CD88ED443BB8FFD6E570',
            }, data.list[0]);
        })

        it('Несколько компаний', function(){
            var data = parseCompanyListFile('data/demo/company-list/companies.html');

            assert.strictEqual(data.total, 4);
            expect(data.list).to.have.length(4);
        })

        it('Пустой список компаний', function(){
            var data = parseCompanyListFile('data/demo/company-list/companies_empty.html');

            assert.strictEqual(data.total, 0);
            expect(data.list).to.be.empty;
        })
    })
})
