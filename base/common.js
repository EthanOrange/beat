'use strict'

let cheerio = require('cheerio');
let superagent = require('superagent');
let async = require('async');
let _ = require('lodash');
let _G = require('./base.config');

function getItemTypeIdEvent(itemId, type, callback) {
    let _urlType = type == 'sale' ? '/S.html' : '/P.html',
        _url = _G.C5.baseUrl + 'dota/' + itemId + _urlType,
        p =  type == 'sale' ? '#sale' : '#buy';

    FetchEvent(_url, (data) => {
        let $ = cheerio.load(data.text);
        let typeId = $(p).find('tbody').attr('data-url').split('=')[1].split('&')[0];

        callback && callback(null, typeId);
    })
}

exports.getItemTypeId = function (itemId, callback) {
    async.parallel([
        (_c) => {
            getItemTypeIdEvent(itemId, 'sale', _c);
        },
        (_c) => {
            getItemTypeIdEvent(itemId, 'buy', _c);
        }
    ], (err, result) => {
        callback && callback(null, result);
    })
}

function getItemTypePriceEvent(ids, callback) {
    let [saleID, purchaseID] = ids,
        _saleUrl = _G.C5.saleUrl + '?id=' + saleID,
        _purchaseUrl = _G.C5.purchaseUrl + '?id=' + purchaseID;
    
    async.parallel([
        (_c) => {
            FetchEvent({
                url: _saleUrl,
                callback: (data) => {
                    let _r = {price: null},
                    json = eval('(' + data.text + ')');

                    if (json.status == 200) {
                        _r = json.body.items[0];
                    }

                    _c(null, _r.price);
                }
            })
        },
        (_c) => {
            FetchEvent({
                url: _purchaseUrl,
                callback: (data) => {
                    let _r = {price: null},
                    json = eval('(' + data.text + ')'),
                    _t = false;

                    if (json.status == 200) {
                        _r = json.body.items[0];
                        if(_r.owner.id == _G.User.id) {
                            _t = true;
                        }
                    }

                    _c(null, {num:_r.price, isAuthor: _t, name: _r.name });
                }
            })
        }
    ], (err, result) => {
        callback && callback(null, result);
    })
}

exports.getItemTypePrice = function(itemId, callback) {
    async.waterfall([
        (_c) => {
            getItemTypeId(itemId, _c)
        },
        (ids, _c) => {
            getItemTypePriceEvent(ids, _c);
        }
    ], (err, result) => {
        // result[0] 卖一价 
        // result[1] 求一价
        callback && callback(null, result);
    })
}

exports.getPurchasingList = function({name, callback}) {
    FetchEvent({
        url: _G.C5.getPurchasingList,
        callback: (data) => {
            let $ = cheerio.load(data.text);
            let listAry = [], _list;
            if($('.sale-record-bottom').length > 0) {
                $('.sale-record-bottom').each((i, el) => {
                    listAry.push({
                        name: $(el).find('img').attr('alt'),
                        id: $(el).find('.purchase-cancel').attr('data-id')
                    });
                })
            }else {
                return callback(null, false);
            }

            _.map(listAry, (list) => {
                if(_.includes(list, name)) {
                    _list = list
                }
            })

            if (_list) {
                callback(null, _list.id);
            }else {
                callback(null, false);
            }
        }
    })
}

exports.FetchEvent = function({url, type, data, callback, cookie}) {

    if(type == 'post') {
        superagent
            .post(url)
            .type('form')
            .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36')
            .set('Cookie', cookie || _G.cookie)
            .send(data)
            .timeout(5000)
            .end((err, data) => {
                if (err) {
                    console.log(url, 'call again!');
                    return setTimeout(() => {
                        FetchEvent({url, type, callback, cookie})
                    }, 2000);
                }
                callback && callback(data);
            })
    }else {
        superagent
            .get(url)
            .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36')
            .set('Cookie', cookie ||  _G.cookie)        
            .timeout(5000)
            .end((err, data) => {
                if (err) {
                    console.log(url, 'call again!');
                    return setTimeout(() => {
                        FetchEvent({url, type, callback, cookie})
                    }, 2000);
                }
                callback && callback(data);
            })
    }
}

exports.postPurchase = function ({form, callback}) {
    FetchEvent({
        url: _G.C5.purchaseSubmit,
        type: 'post',
        data: form,
        cookie: G.cookie,
        callbacl: (data) => {
            callback(null, true);
        }
    })
}