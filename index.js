var _ = require('underscore'),
    request	= require('request'),
    crypto = require('crypto'),
    VError = require('verror');

var IndependentReserve = function(key, secret, server)
{
    this.key = key;
    this.secret = secret;

    this.url = server || 'https://api.independentreserve.com';

    // initialize nonce to current unix time in seconds
    this.nonce = Math.round((new Date()).getTime() / 1000);
};

IndependentReserve.prototype._nonce = function() {
    return this.nonce++;
};

IndependentReserve.prototype.postReq = function(action, callback, params)
{
    var functionName = 'IndependentReserve.postReq()',
        self = this;

    // Set custom User-Agent string
    var headers = {"User-Agent": "Independent Reserve Javascript API Client"}

    var path = '/Private/' + action;

    if(!this.key || !this.secret)
        return callback('Must provide key and secret to make this API request.');

    var nonce = this._nonce();
    var message = nonce + this.key;
    var signer = crypto.createHmac('sha256', new Buffer(this.secret, 'utf8'));
    var signature = signer.update(message).digest('hex').toUpperCase();

    params = _.extend({
        apiKey: this.key,
        signature: signature,
        nonce: nonce
    }, params);

    var options = {
        url: this.url + path,
        method: 'POST',
        headers: headers,
        json: params
    };

    var req = request.post(options, function(err, response, body)
    {
        if(typeof callback === 'function')
        {
            if(err)
            {
                var error = new VError(err, '%s failed to call url %s with nonce %s', functionName,
                    options.url, self.nonce);
                return callback(error);
            }
            else if (body.Message)
            {
                var error = new Error(body.Message);
                return callback(error);
            }

            var data;

            try
            {
                // need to strip out the first character if it is a byte order mark (BOM)
                if (body.charAt(0) == '\uFEFF')
                {
                    body = body.slice(1);
                }

                data = JSON.parse(body);
            }
            catch(err)
            {
                var error = new VError(err, '%s could not parse response body from url %s: %s', functionName,
                    options.url, body);
                return callback(error);
            }

            callback(null, data);
        }
    });

    return req;
};

IndependentReserve.prototype.getReq = function(action, callback, params)
{
    var functionName = 'IndependentReserve.getReq()';

    // Set custom User-Agent string
    var headers = {};
    headers['User-Agent'] = 'Independent Reserve Javascript API Client';

    var path = '/Public/' + action;

    var options = {
        url: this.url + path,
        method: 'GET',
        headers: headers,
        qs: params,
        timeout: 15000
    };

    var req = request.get(options, function(err, response, body)
    {
        if(typeof callback === 'function')
        {
            var data;

            if (err)
            {
                var error = new VError(err, '%s failed to call url %s with nonce %s', functionName,
                    options.url, self.nonce);
                return callback(error);
            }

            try
            {
                // need to strip out the first character if it is a byte order mark (BOM)
                if (body.charAt(0) == '\uFEFF')
                {
                    body = body.slice(1);
                }

                data = JSON.parse(body);
            }
            catch(err)
            {
                var error = new VError(err, '%s could not parse response body from url %s: %s', functionName,
                    options.url, body);
                return callback(error);
            }

            if (data.Message)
            {
                var error = new Error(data.Message);
                return callback(error);
            }

            callback(null, data);
        }
    });

    return req;
};

//
// Public Functions
//

IndependentReserve.prototype.getValidPrimaryCurrencyCodes = function getValidPrimaryCurrencyCodes(callback)
{
    this.getReq('getValidPrimaryCurrencyCodes', callback);
};

IndependentReserve.prototype.getValidSecondaryCurrencyCodes = function getValidSecondaryCurrencyCodes(callback)
{
    this.getReq('GetValidSecondaryCurrencyCodes', callback);
};

IndependentReserve.prototype.getValidLimitOrderTypes = function getValidLimitOrderTypes(callback)
{
    this.getReq('GetValidLimitOrderTypes', callback);
};

IndependentReserve.prototype.getValidMarketOrderTypes = function getValidMarketOrderTypes(callback)
{
    this.getReq('getValidMarketOrderTypes', callback);
};

IndependentReserve.prototype.getMarketSummary = function getMarketSummary(primaryCurrencyCode, secondaryCurrencyCode, callback)
{
    this.getReq('getMarketSummary', callback, {
        primaryCurrencyCode: primaryCurrencyCode,
        secondaryCurrencyCode: secondaryCurrencyCode}
    );
};

IndependentReserve.prototype.getOrderBook = function getOrderBook(primaryCurrencyCode, secondaryCurrencyCode, callback)
{
    this.getReq('GetOrderBook', callback, {
        primaryCurrencyCode: primaryCurrencyCode,
        secondaryCurrencyCode: secondaryCurrencyCode}
    );
};

IndependentReserve.prototype.GetRecentTrades = function(primaryCurrencyCode, secondaryCurrencyCode, numberOfRecentTradesToRetrieve, callback)
{
    this.getReq('getRecentTrades', callback, {
        primaryCurrencyCode: primaryCurrencyCode,
        secondaryCurrencyCode: secondaryCurrencyCode,
        numberOfHoursInThePastToRetrieve: numberOfHoursInThePastToRetrieve}
    );
};

//
// Private Functions
//

IndependentReserve.prototype.placeLimitOrder = function placeLimitOrder(primaryCurrencyCode, secondaryCurrencyCode, orderType, price, volume, callback)
{
    this.postReq('PlaceLimitOrder', callback, {
        primaryCurrencyCode: primaryCurrencyCode,
        secondaryCurrencyCode: secondaryCurrencyCode,
        orderType: orderType,
        price: price,
        volume: volume}
    );
};

IndependentReserve.prototype.placeMarketOrder = function placeMarketOrder(primaryCurrencyCode, secondaryCurrencyCode, orderType, volume, callback)
{
    this.postReq('PlaceMarketOrder', callback, {
            primaryCurrencyCode: primaryCurrencyCode,
            secondaryCurrencyCode: secondaryCurrencyCode,
            orderType: orderType,
            volume: volume}
    );
};

IndependentReserve.prototype.cancelOrder = function cancelOrder(orderGuid, callback)
{
    this.postReq('CancelOrder', callback, {orderGuid: orderGuid});
};

IndependentReserve.prototype.getOpenOrders = function getOpenOrders(primaryCurrencyCode, secondaryCurrencyCode, pageIndex, pageSize, callback)
{
    var functionName = 'IndependentReserve.getOpenOrders()';

    if ( !(pageIndex >= 1) )
    {
        var error = new VError('%s pageIndex %s is not >= 1', functionName);
        return callback(error);
    }
    else if ( !(pageSize >= 1 && pageSize <= 50) )
    {
        var error = new VError('%s pageSize %s is not >= 1 and <= 50', functionName);
        return callback(error);
    }

    this.postReq('GetOpenOrders', callback, {
            primaryCurrencyCode: primaryCurrencyCode,
            secondaryCurrencyCode: secondaryCurrencyCode,
            pageIndex: pageIndex,
            pageSize: pageSize}
    );
};

IndependentReserve.prototype.getClosedOrders = function getClosedOrders(primaryCurrencyCode, secondaryCurrencyCode, pageIndex, pageSize, callback)
{
    var functionName = 'IndependentReserve.getClosedOrders()';

    if ( !(pageIndex >= 1) )
    {
        var error = new VError('%s pageIndex %s is not >= 1', functionName);
        return callback(error);
    }
    else if ( !(pageSize >= 1 && pageSize <= 50) )
    {
        var error = new VError('%s pageSize %s is not >= 1 and <= 50', functionName);
        return callback(error);
    }

    this.postReq('GetClosedOrders', callback, {
            primaryCurrencyCode: primaryCurrencyCode,
            secondaryCurrencyCode: secondaryCurrencyCode,
            pageIndex: pageIndex,
            pageSize: pageSize}
    );
};

IndependentReserve.prototype.getAccounts = function getAccounts(callback)
{
    this.postReq('GetAccounts', callback);
};


IndependentReserve.prototype.getTransactions = function getTransactions(accountGuid, fromTimestampUtc, toTimestampUtc, pageIndex, pageSize, callback)
{
    var functionName = 'IndependentReserve.getTransactions()';

    if ( !(pageIndex >= 1) )
    {
        var error = new VError('%s pageIndex %s is not >= 1', functionName);
        return callback(error);
    }
    else if ( !(pageSize >= 1 && pageSize <= 50) )
    {
        var error = new VError('%s pageSize %s is not >= 1 and <= 50', functionName);
        return callback(error);
    }

    this.postReq('GetTransactions', callback, {
        accountGuid: accountGuid,
        fromTimestampUtc: fromTimestampUtc,
        toTimestampUtc: toTimestampUtc,
        pageIndex: pageIndex,
        pageSize: pageSize}
    );
};

IndependentReserve.prototype.getBitcoinDepositAddress = function(callback)
{
    this.postReq('GetBitcoinDepositAddress', callback);
};

module.exports = IndependentReserve;