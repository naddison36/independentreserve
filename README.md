Independent Reserve Javascript API Client
===============

This is a node.js wrapper for the private and public methods exposed by the [Independent Reserve API](https://www.independentreserve.com/API).
You will need have a registered account with [Independent Reserve](https://www.independentreserve.com) and generated API keys to access the private methods.

Please contact support@independentreserve.com if you are having trouble opening and account or generating an API key. 

### Install

`npm install independentreserve`

### Examples

```js
var IR = require('independentreserve');

// Test public data APIs
var publicClient = new IR();

// get ticker for BTCUSD
publicClient.getMarketSummary("Xbt", "Usd", console.log);

// get order book for BTCAUD
publicClient.getOrderBook("Xbt", "Aud", console.log);

// get last 20 BTCAUD trades
publicClient.getRecentTrades("Xbt", "Aud", 20, console.log);

var privateClient = new IR(your_key, your_secret);

privateClient.getMarketSummary("Xbt", "Usd",
	function(err, data){
		console.log('bid ' + data.CurrentHighestBidPrice + ' ask ' + data.CurrentLowestOfferPrice);
});

privateClient.placeLimitOrder("Xbt", "Usd", "LimitBid", 500.12, 1.12345678,
	function(err, data){
		console.log('orderGuid ' + data.OrderGuid);
});

privateClient.placeMarketOrder("Xbt", "Usd", "MarketOffer", 0.87654321,
	function(err, data){
		console.log(data);
});

// enter a Guid returned in one of the above placeLimitOrder calls
var orderGuid = '';

// get order details for specified Guid
privateClient.getOrderDetails(orderGuid, function(err, data)
{
    console.log(data);
});

// cancel limit order
privateClient.cancelOrder(orderGuid, function(err, data)
{
    console.log(data);
});

// get the first 50 trades executed by the account the API key is linked to
privateClient.getTrades(1, 50, function(err, data)
{
    console.log(data);
});
```