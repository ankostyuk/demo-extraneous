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
        data        = parser.parseListHtml(html);

    console.log('parseCompanyListFile...', filePath, '\n', data);

    return data;
}

function parseCompanyBankruptcyFile(htmlFile) {
    var filePath    = path.resolve(__dirname, htmlFile),
        html        = fs.readFileSync(filePath, readFileOptions);

    var data = parser.parseMessagesHtml(html, {
        baseUrl: ''
    });

    console.log('parseCompanyBankruptcyFile...', filePath, '\n', 'messages:', data.messages);

    return data;
}

//
// 1089847090893 - РОСПРОДУКТ
// 1123444006366 - Метизный завод
// 1127746519900 - НАЛПОИНТЕР
// 1024701559398 - Шереметьево
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

        it('Бан запроса', function(){
            var data = parseCompanyListFile('data/demo/company-list/request_blocking.html');

            assert.deepEqual({
                error: 'REQUEST_BLOCKING',
            }, data);
        })
    })

    describe('Карточки компаний', function(){
        it('РОСПРОДУКТ', function(){
            var data = parseCompanyBankruptcyFile('data/demo/company-report/1089847090893.html');

            assert.strictEqual(data.messages.total, 16);
            expect(data.messages.list).to.have.length(16);

            assert.deepEqual({
                date: '13.08.2015 17:25:07',
                type: 'Отчет оценщика об оценке имущества должника',
                link: '/MessageWindow.aspx?ID=1536758B162F65184264FAA1F9319236'
            }, data.messages.list[0]);

            assert.deepEqual({
                date: '06.08.2014 12:27:45',
                type: 'Сообщение о судебном акте',
                link: '/MessageWindow.aspx?ID=F7892595B08F397855D42BD0D62091B8'
            }, data.messages.list[15]);
        })

        it('Шереметьево', function(){
            var data = parseCompanyBankruptcyFile('data/demo/company-report/1024701559398.html');

            assert.strictEqual(data.messages.total, 62);
            expect(data.messages.list).to.have.length(20);

            assert.deepEqual({
                date: '08.09.2015 15:07:44',
                type: 'Сведения о заключении договора купли-продажи',
                link: '/MessageWindow.aspx?ID=76A22DC6103288B983B4BBD1A4D4316F'
            }, data.messages.list[0]);

            assert.deepEqual({
                date: '15.06.2015 14:28:10',
                type: 'Сообщение о результатах проведения собрания кредиторов',
                link: '/MessageWindow.aspx?ID=A7427091D1C72AD911E4CF5B0BD8A24E'
            }, data.messages.list[19]);
        })
    })
})
