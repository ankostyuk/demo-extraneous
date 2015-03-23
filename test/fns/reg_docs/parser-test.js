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
        data        = parser.parseCompanyRegDocsHtml(html);

    console.log('parseFile...', filePath, '\n', data);

    return data;
}

//
describe('parser test', function(){
    it('1057747690890.html', function(){
        var data = parseFile('data/demo/1057747690890.html');

        assert.strictEqual(data.total, 1);
        expect(data.list).to.have.length(1);

        assert.deepEqual({
            // Сведения о юридическом лице
            name: 'ЗАКРЫТОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО "НАЦИОНАЛЬНОЕ КРЕДИТНОЕ БЮРО"',
            ogrn: '1057747690890',

            // Сведения о поданном заявлении
            // Форма заявления
            form: 'Р14001',
            // Вид изменений
            type: 'Изменение сведений, не связанных с учредительными документами (Р14001)',

            // Сведения о представлении документов
            // Дата представления
            submissionDate: '13.01.2015',
            // Способ представления
            submissionType: 'Почтовым отправлением',
            // Входящий номер
            submissionId: '1327А',

            // Наименование налогового органа
            ifns: 'Межрайонная ИФНС России № 46 по г.Москве',

            // Сведения о решении
            // Вид решения
            decision: 'Решение о государственной регистрации. ГРН внесенной записи 2157746343742',
            // Дата готовности документов:
            readyDate: '21.01.2015'
        }, data.list[0]);
    })

    it('1063704009324.html', function(){
        var data = parseFile('data/demo/1063704009324.html');

        assert.strictEqual(data.total, 4);
    })

    it('1127746519900.html', function(){
        var data = parseFile('data/demo/1127746519900.html');

        assert.strictEqual(data.total, 0);
    })
})
