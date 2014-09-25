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

var irClient = new IR(your_key, your_secret);

irClient.getMarketSummary("Xbt", "Usd", 
	function(err, data){
		console.log('bid ' + data.CurrentHighestBidPrice + ' ask ' + data.CurrentLowestOfferPrice);
});

irClient.placeLimitOrder("Xbt", "Usd", "LimitBid", 500.12, 1.12345678,
	function(err, data){
		console.log('orderGuid ' + data.OrderGuid);
});

irClient.placeMarketOrder("Xbt", "Usd", "MarketOffer", 0.87654321,
	function(err, data){
		console.log(data);
});

irClient.cancelOrder(orderGuid,
	function(err, data){
		console.log(data);
});
```