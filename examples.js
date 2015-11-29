var IR = require('independentreserve');

var publicClient = new IR();

// get ticker for BTCUSD
publicClient.getMarketSummary("Xbt", "Usd", console.log);

// get order book for BTCAUD
publicClient.getOrderBook("Xbt", "Aud", console.log);

// get last 20 BTCAUD trades
publicClient.getRecentTrades("Xbt", "Aud", 20, console.log);

// Either pass your API key and secret as the first and second parameters to examples.js. eg
// node examples.js your-api-key your-api-secret
//
// Or enter them below.
// WARNING never commit your API keys into a public repository.
var key = process.argv[2] || 'your-api-key';
var secret = process.argv[3] || 'your-api-secret';

var privateClient = new IR(key, secret);

// the following will execute orders against the IR exchange. Uncomment and be sure you are happy with the parameters before executing

//// buy limit order against BTCUSD
//privateClient.placeLimitOrder("Xbt", "Usd", "LimitBid", 123.12, 0.12345678, function(err, data)
//{
//    console.log('orderGuid ' + data.OrderGuid);
//});
//
//// sell limit order against BTCAUD
//privateClient.placeLimitOrder("Xbt", "Aud", "LimitOffer", 567.12, 0.01, function(err, data)
//{
//    console.log('orderGuid ' + data.OrderGuid);
//});
//
//// sell market order
//privateClient.placeMarketOrder("Xbt", "Usd", "MarketOffer", 0.87654321, function(err, data)
//{
//    console.log(data);
//});
//
//// get first 20 open BTCAUD orders
//privateClient.getOpenOrders("Xbt", "Aud", 1, 20, function(err, data)
//{
//    console.log(data);
//});
//
//// enter a Guid returned in one of the above placeLimitOrder calls
//var orderGuid = '';
//
////get first 20 open BTCAUD orders
//privateClient.getOrderDetails(orderGuid, function(err, data)
//{
//    console.log(data);
//});
//
//// cancel limit order
//privateClient.cancelOrder(orderGuid, function(err, data)
//{
//    console.log(data);
//});
//
//// get the first 50 trades executed by the account the API key is linked to
//privateClient.getTrades(1, 50, function(err, data)
//{
//    console.log(data);
//});

