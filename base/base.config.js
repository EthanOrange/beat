exports.C5 = {
    baseUrl: 'https://www.c5game.com/',
    saleUrl: 'https://www.c5game.com/api/product/sale.html',
    paymentUrl: 'https://www.c5game.com/api/order/payment.html',
    dotaUrl: 'https://www.c5game.com/dota.html',
    detailUrl: 'https://www.c5game.com/steam/item/detail.html',
    item: 'https://www.c5game.com/api/product/sale.html',
    purchaseUrl: 'https://www.c5game.com/api/product/purchase.html',
    purchaseItemInfo: 'https://www.c5game.com/api/purchase/item.html',
    purchaseSubmit: 'https://www.c5game.com/api/purchase/submit.html',
    purchaseList: 'https://www.c5game.com/user/purchase/index.html',
    purchaseCancel: 'https://www.c5game.com/api/purchase/cancel.html',
    inventoryList: 'https://www.c5game.com/user/inventory.html',
    quickUrl: 'https://www.c5game.com/user/sell/quick.html?appid=570',
    onsaleUrl: 'https://www.c5game.com/api/sell/onsale.html?appid=570',
    courierUrl: 'https://www.c5game.com/dota.html?only=on&quality=unusual&type=courier',
    effectUrl: 'https://www.c5game.com/dota.html?only=on&type=socket_gem'
};

exports.Time = {
    fetchInterval: 2000
}

exports.FetchOption = {
    only: 'on'
}

exports.PurchaseOption = {
    price: '0.1'
}

exports.User = {
    id: 12301508
}

exports.GemFilter = ['永恒矩阵', '远行之宝', '安详荣耀', '亡冬之魂', '芳林飞溪', '克萝贝露丝']


global.cookie = null;

global.TaskHash = {};

global.PurchaseSaleSwitch = false;
global.PurchaseSale = null;

global.UserList = {};