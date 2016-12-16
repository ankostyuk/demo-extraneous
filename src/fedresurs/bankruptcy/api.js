var request = require('request'),
    util    = require('util'),
    _       = require('lodash');

var parser  = require('./parser');

// Company
var fedresursCompanyBankruptcyDefaultForm = {
    'ctl00$PrivateOffice1$tbLogin': '',
    'ctl00$PrivateOffice1$tbPassword': '',
    'ctl00$PrivateOffice1$tbEmailForPassword': '',
    'ctl00_PrivateOffice1_RadToolTip1_ClientState': '',
    'ctl00$DebtorSearch1$inputDebtor': '',
    'ctl00$News1$hfMaxSize': '3',
    'ctl00$cphBody$rblDebtorType': 'Organizations',
    'ctl00$cphBody$tbOrgName': '',
    'ctl00$cphBody$tbOrgAddress': '',
    'ctl00$cphBody$ucOrgRegionList$ddlBoundList': '',
    'ctl00$cphBody$ucOrgCategoryList$ddlBoundList': '',
    'ctl00$cphBody$OrganizationCode1$CodeTextBox': '',
    'ctl00$cphBody$ucOrgOkopfList$ddlBoundList': '',
    'ctl00$cphBody$tbPrsLastName': '',
    'ctl00$cphBody$tbPrsFirstName': '',
    'ctl00$cphBody$tbPrsMiddleName': '',
    'ctl00$cphBody$tbPrsAddress': '',
    'ctl00$cphBody$ucPrsRegionList$ddlBoundList': '',
    'ctl00$cphBody$ucPrsCategoryList$ddlBoundList': '',
    'ctl00$cphBody$PersonCode1$CodeTextBox': '',
    'ctl00$cphBody$btnSearch.x': '5',
    'ctl00$cphBody$btnSearch.y': '5'
};

var fedresursCompanyBankruptcyDefaultHeaders = {
    'Host': 'bankrot.fedresurs.ru',
    'Origin': 'http://bankrot.fedresurs.ru',
    'Referer': 'http://bankrot.fedresurs.ru/DebtorsSearch.aspx',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.155 Safari/537.36',
    // Cookie template '...&orgogrn=<company_ogrn>...'
    'Cookie': 'ASP.NET_SessionId=raqv4el1mvq23mly3v3bwp2r; __utma=228152846.2011045371.1428062566.1439793552.1439796000.5; __utmc=228152846; __utmz=228152846.1428062566.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); debtorsearch=typeofsearch=Organizations&orgname=&orgaddress=&orgregionid=&orgokopfid=&orgogrn=<company_ogrn>&orginn=&orgokpo=&OrgCategory=&prslastname=&prsfirstname=&prsmiddlename=&prsaddress=&prsregionid=&prsinn=&prsogrn=&PrsCategory=&pagenumber=0'
};

var bankruptcyConfig = {
    'company': {
        // url: 'http://bankrot.fedresurs-xxx.ru/DebtorsSearch.aspx',
        url: 'http://bankrot.fedresurs.ru/DebtorsSearch.aspx',
        defaultForm: _.extend({}, fedresursCompanyBankruptcyDefaultForm, {}),
        defaultHeaders: _.extend({}, fedresursCompanyBankruptcyDefaultHeaders, {}),
        emptyResponseData: {
            messages: {}
        },
        report: {
            // baseUrl: 'http://bankrot.fedresurs-xxx.ru'
            baseUrl: 'http://bankrot.fedresurs.ru'
        }
    }
};

function doBankruptcy(req, success, error, config, form, headers, parseListHtml, parseBankruptcyHtml) {
    var url = config.url;

    request.post({
        url: url,
        form: form,
        headers: headers
    }, function(err, httpResponse, body) {
        if (err) {
            error(util.format('POST %s with data %j failed...\n%s', url, form, err));
            return;
        }

        var listData = parseListHtml(body),
            listSize = _.size(listData.list);

        if (listData.error === 'REQUEST_BLOCKING') {
            error(util.format('REQUEST_BLOCKING: POST %s; params: %s', url, JSON.stringify(req.params)));
        } else if (listSize === 1) {
            var item    = listData.list[0],
                baseUrl = config.report.baseUrl,
                itemUrl = baseUrl + item.link;

            request.get({
                url: itemUrl,
            }, function(err, httpResponse, body) {
                if (err) {
                    error(util.format('GET %s failed...\n%s', itemUrl, err));
                    return;
                }

                var data = parseBankruptcyHtml(body, {
                    baseUrl: baseUrl
                });

                success(data);
            });
        } else {
            success(config.emptyResponseData);
        }
    });
}


// req: {
//     params: {
//         ogrn: (String)
//     }
// }
exports.getCompanyBankruptcy = function(req, success, error) {
    var config = bankruptcyConfig['company'];

    var form = _.extend({}, config.defaultForm, {
        'ctl00$cphBody$OrganizationCode1$CodeTextBox': req.params.ogrn
    });

    var headers = _.extend({}, config.defaultHeaders, {
        'Cookie': config.defaultHeaders['Cookie'].replace(/<company_ogrn>/, req.params.ogrn)
    });

    doBankruptcy(req, success, error, config, form, headers, parser.parseCompanyListHtml, parser.parseCompanyBankruptcyHtml);
};
