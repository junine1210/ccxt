# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

import ccxt.async_support
from ccxt.async_support.base.ws.cache import ArrayCache, ArrayCacheBySymbolById
from ccxt.async_support.base.ws.client import Client
from typing import Optional
from ccxt.base.errors import ExchangeError
from ccxt.base.errors import NotSupported


class probit(ccxt.async_support.probit):

    def describe(self):
        return self.deep_extend(super(probit, self).describe(), {
            'has': {
                'ws': True,
                'watchBalance': True,
                'watchTicker': True,
                'watchTickers': False,
                'watchTrades': True,
                'watchMyTrades': True,
                'watchOrders': True,
                'watchOrderBook': True,
                'watchOHLCV': False,
            },
            'urls': {
                'api': {
                    'ws': 'wss://api.probit.com/api/exchange/v1/ws',
                },
                'test': {
                    'ws': 'wss://demo-api.probit.com/api/exchange/v1/ws',
                },
            },
            'options': {
                'watchOrderBook': {
                    'filter': 'order_books_l2',
                    'interval': 100,  # or 500
                },
                'watchTrades': {
                    'filter': 'recent_trades',
                },
                'watchTicker': {
                    'filter': 'ticker',
                },
                'watchOrders': {
                    'channel': 'open_order',
                },
            },
            'streaming': {
            },
            'exceptions': {
            },
        })

    async def watch_balance(self, params={}):
        """
        query for balance and get the amount of funds available for trading or funds locked in orders
        see https://docs-en.probit.com/reference/balance-1
        :param dict params: extra parameters specific to the probit api endpoint
        :returns dict: a `balance structure <https://docs.ccxt.com/en/latest/manual.html?#balance-structure>`
        """
        await self.authenticate(params)
        messageHash = 'balance'
        url = self.urls['api']['ws']
        subscribe = {
            'type': 'subscribe',
            'channel': 'balance',
        }
        request = self.extend(subscribe, params)
        return await self.watch(url, messageHash, request, messageHash)

    def handle_balance(self, client: Client, message):
        #
        #     {
        #         channel: 'balance',
        #         reset: False,
        #         data: {
        #             USDT: {
        #                 available: '15',
        #                 total: '15'
        #             }
        #         }
        #     }
        #
        messageHash = 'balance'
        self.parse_ws_balance(message)
        client.resolve(self.balance, messageHash)

    def parse_ws_balance(self, message):
        #
        #     {
        #         channel: 'balance',
        #         reset: False,
        #         data: {
        #             USDT: {
        #                 available: '15',
        #                 total: '15'
        #             }
        #         }
        #     }
        #
        reset = self.safe_value(message, 'reset', False)
        data = self.safe_value(message, 'data', {})
        currencyIds = list(data.keys())
        if reset:
            self.balance = {}
        for i in range(0, len(currencyIds)):
            currencyId = currencyIds[i]
            entry = data[currencyId]
            code = self.safe_currency_code(currencyId)
            account = self.account()
            account['free'] = self.safe_string(entry, 'available')
            account['total'] = self.safe_string(entry, 'total')
            self.balance[code] = account
        self.balance = self.safe_balance(self.balance)

    async def watch_ticker(self, symbol: str, params={}):
        """
        watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        see https://docs-en.probit.com/reference/marketdata
        :param str symbol: unified symbol of the market to fetch the ticker for
        :param dict params: extra parameters specific to the probit api endpoint
        :param int|None params['interval']: Unit time to synchronize market information(ms). Available units: 100, 500
        :returns dict: a `ticker structure <https://docs.ccxt.com/en/latest/manual.html#ticker-structure>`
        """
        filter = None
        filter, params = self.handle_option_and_params(params, 'watchTicker', 'filter', 'ticker')
        return await self.subscribe_order_book(symbol, 'ticker', filter, params)

    def handle_ticker(self, client: Client, message):
        #
        #     {
        #         channel: 'marketdata',
        #         market_id: 'BTC-USDT',
        #         status: 'ok',
        #         lag: 0,
        #         ticker: {
        #             time: '2022-07-21T14:18:04.000Z',
        #             last: '22591.3',
        #             low: '22500.1',
        #             high: '39790.7',
        #             change: '-1224',
        #             base_volume: '1002.32005445',
        #             quote_volume: '23304489.385351021'
        #         },
        #         reset: True
        #     }
        #
        marketId = self.safe_string(message, 'market_id')
        symbol = self.safe_symbol(marketId)
        ticker = self.safe_value(message, 'ticker', {})
        market = self.safe_market(marketId)
        parsedTicker = self.parse_ticker(ticker, market)
        messageHash = 'ticker:' + symbol
        self.tickers[symbol] = parsedTicker
        client.resolve(parsedTicker, messageHash)

    async def watch_trades(self, symbol: str, since: Optional[int] = None, limit: Optional[int] = None, params={}):
        """
        get the list of most recent trades for a particular symbol
        see https://docs-en.probit.com/reference/trade_history
        :param str symbol: unified symbol of the market to fetch trades for
        :param int|None since: timestamp in ms of the earliest trade to fetch
        :param int|None limit: the maximum amount of trades to fetch
        :param dict params: extra parameters specific to the probit api endpoint
        :param int|None params['interval']: Unit time to synchronize market information(ms). Available units: 100, 500
        :returns [dict]: a list of `trade structures <https://docs.ccxt.com/en/latest/manual.html?#public-trades>`
        """
        filter = None
        filter, params = self.handle_option_and_params(params, 'watchTrades', 'filter', 'recent_trades')
        trades = await self.subscribe_order_book(symbol, 'trades', filter, params)
        if self.newUpdates:
            limit = trades.getLimit(symbol, limit)
        return self.filter_by_symbol_since_limit(trades, symbol, since, limit, True)

    def handle_trades(self, client: Client, message):
        #
        #     {
        #         channel: 'marketdata',
        #         market_id: 'BTC-USDT',
        #         status: 'ok',
        #         lag: 0,
        #         recent_trades: [
        #             {
        #                 id: 'BTC-USDT:8010233',
        #                 price: '22701.4',
        #                 quantity: '0.011011',
        #                 time: '2022-07-21T13:40:40.983Z',
        #                 side: 'buy',
        #                 tick_direction: 'up'
        #             }
        #             ...
        #         ]
        #         reset: True
        #     }
        #
        marketId = self.safe_string(message, 'market_id')
        symbol = self.safe_symbol(marketId)
        market = self.safe_market(marketId)
        trades = self.safe_value(message, 'recent_trades', [])
        reset = self.safe_value(message, 'reset', False)
        messageHash = 'trades:' + symbol
        stored = self.safe_value(self.trades, symbol)
        if stored is None or reset:
            limit = self.safe_integer(self.options, 'tradesLimit', 1000)
            stored = ArrayCache(limit)
            self.trades[symbol] = stored
        for i in range(0, len(trades)):
            trade = trades[i]
            parsed = self.parse_trade(trade, market)
            stored.append(parsed)
        self.trades[symbol] = stored
        client.resolve(self.trades[symbol], messageHash)

    async def watch_my_trades(self, symbol: Optional[str] = None, since: Optional[int] = None, limit: Optional[int] = None, params={}):
        """
        get the list of trades associated with the user
        :param str symbol: unified symbol of the market to fetch trades for
        :param int|None since: timestamp in ms of the earliest trade to fetch
        :param int|None limit: the maximum amount of trades to fetch
        :param dict params: extra parameters specific to the probit api endpoint
        :returns [dict]: a list of `trade structures <https://docs.ccxt.com/en/latest/manual.html?#public-trades>`
        """
        await self.load_markets()
        await self.authenticate(params)
        messageHash = 'myTrades'
        if symbol is not None:
            market = self.market(symbol)
            symbol = market['symbol']
            messageHash = messageHash + ':' + symbol
        url = self.urls['api']['ws']
        channel = 'trade_history'
        message = {
            'type': 'subscribe',
            'channel': channel,
        }
        request = self.extend(message, params)
        trades = await self.watch(url, messageHash, request, channel)
        if self.newUpdates:
            limit = trades.getLimit(symbol, limit)
        return self.filter_by_symbol_since_limit(trades, symbol, since, limit, True)

    def handle_my_trades(self, client: Client, message):
        #
        #     {
        #         channel: 'trade_history',
        #         reset: False,
        #         data: [{
        #             id: 'BTC-USDT:8010722',
        #             order_id: '4124999207',
        #             side: 'buy',
        #             fee_amount: '0.0134999868096',
        #             fee_currency_id: 'USDT',
        #             status: 'settled',
        #             price: '23136.7',
        #             quantity: '0.00032416',
        #             cost: '7.499992672',
        #             time: '2022-07-21T17:09:33.056Z',
        #             market_id: 'BTC-USDT'
        #         }]
        #     }
        #
        rawTrades = self.safe_value(message, 'data', [])
        if len(rawTrades) == 0:
            return
        reset = self.safe_value(message, 'reset', False)
        messageHash = 'myTrades'
        stored = self.myTrades
        if (stored is None) or reset:
            limit = self.safe_integer(self.options, 'tradesLimit', 1000)
            stored = ArrayCacheBySymbolById(limit)
            self.myTrades = stored
        trades = self.parse_trades(rawTrades)
        tradeSymbols = {}
        for j in range(0, len(trades)):
            trade = trades[j]
            tradeSymbols[trade['symbol']] = True
            stored.append(trade)
        unique = list(tradeSymbols.keys())
        for i in range(0, len(unique)):
            symbol = unique[i]
            symbolSpecificMessageHash = messageHash + ':' + symbol
            client.resolve(stored, symbolSpecificMessageHash)
        client.resolve(stored, messageHash)

    async def watch_orders(self, symbol: Optional[str] = None, since: Optional[int] = None, limit: Optional[int] = None, params={}):
        """
        watches information on an order made by the user
        see https://docs-en.probit.com/reference/open_order
        :param str|None symbol: unified symbol of the market the order was made in
        :param int|None since: timestamp in ms of the earliest order to watch
        :param int|None limit: the maximum amount of orders to watch
        :param dict params: extra parameters specific to the aax api endpoint
        :param str|None params['channel']: choose what channel to use. Can open_order or order_history.
        :returns dict: An `order structure <https://docs.ccxt.com/en/latest/manual.html#order-structure>`
        """
        await self.authenticate(params)
        url = self.urls['api']['ws']
        messageHash = 'orders'
        if symbol is not None:
            market = self.market(symbol)
            symbol = market['symbol']
            messageHash = messageHash + ':' + symbol
        channel = None
        channel, params = self.handle_option_and_params(params, 'watchOrders', 'channel', 'open_order')
        subscribe = {
            'type': 'subscribe',
            'channel': channel,
        }
        request = self.extend(subscribe, params)
        orders = await self.watch(url, messageHash, request, channel)
        if self.newUpdates:
            limit = orders.getLimit(symbol, limit)
        return self.filter_by_symbol_since_limit(orders, symbol, since, limit)

    def handle_orders(self, client: Client, message):
        #
        #     {
        #         channel: 'order_history',
        #         reset: True,
        #         data: [{
        #                 id: '4124999207',
        #                 user_id: '633dc56a-621b-4680-8a4e-85a823499b6d',
        #                 market_id: 'BTC-USDT',
        #                 type: 'market',
        #                 side: 'buy',
        #                 limit_price: '0',
        #                 time_in_force: 'ioc',
        #                 filled_cost: '7.499992672',
        #                 filled_quantity: '0.00032416',
        #                 open_quantity: '0',
        #                 status: 'filled',
        #                 time: '2022-07-21T17:09:33.056Z',
        #                 client_order_id: '',
        #                 cost: '7.5'
        #             },
        #             ...
        #         ]
        #     }
        #
        rawOrders = self.safe_value(message, 'data', [])
        if len(rawOrders) == 0:
            return
        messageHash = 'orders'
        reset = self.safe_value(message, 'reset', False)
        stored = self.orders
        if stored is None or reset:
            limit = self.safe_integer(self.options, 'ordersLimit', 1000)
            stored = ArrayCacheBySymbolById(limit)
            self.orders = stored
        orderSymbols = {}
        for i in range(0, len(rawOrders)):
            rawOrder = rawOrders[i]
            order = self.parse_order(rawOrder)
            orderSymbols[order['symbol']] = True
            stored.append(order)
        unique = list(orderSymbols.keys())
        for i in range(0, len(unique)):
            symbol = unique[i]
            symbolSpecificMessageHash = messageHash + ':' + symbol
            client.resolve(stored, symbolSpecificMessageHash)
        client.resolve(stored, messageHash)

    async def watch_order_book(self, symbol: str, limit: Optional[int] = None, params={}):
        """
        watches information on open orders with bid(buy) and ask(sell) prices, volumes and other data
        see https://docs-en.probit.com/reference/marketdata
        :param str symbol: unified symbol of the market to fetch the order book for
        :param int|None limit: the maximum amount of order book entries to return
        :param dict params: extra parameters specific to the probit api endpoint
        :returns dict: A dictionary of `order book structures <https://docs.ccxt.com/en/latest/manual.html#order-book-structure>` indexed by market symbols
        """
        filter = None
        filter, params = self.handle_option_and_params(params, 'watchOrderBook', 'filter', 'order_books')
        orderbook = await self.subscribe_order_book(symbol, 'orderbook', filter, params)
        return orderbook.limit()

    async def subscribe_order_book(self, symbol: str, messageHash, filter, params={}):
        await self.load_markets()
        market = self.market(symbol)
        symbol = market['symbol']
        url = self.urls['api']['ws']
        client = self.client(url)
        interval = None
        interval, params = self.handle_option_and_params(params, 'watchOrderBook', 'interval', 100)
        subscriptionHash = 'marketdata:' + symbol
        messageHash = messageHash + ':' + symbol
        filters = {}
        if subscriptionHash in client.subscriptions:
            # already subscribed
            filters = client.subscriptions[subscriptionHash]
            if not (filter in filters):
                # resubscribe
                del client.subscriptions[subscriptionHash]
        filters[filter] = True
        keys = list(filters.keys())
        message = {
            'channel': 'marketdata',
            'interval': interval,
            'market_id': market['id'],
            'type': 'subscribe',
            'filter': keys,
        }
        request = self.extend(message, params)
        return await self.watch(url, messageHash, request, messageHash, filters)

    def handle_order_book(self, client: Client, message, orderBook):
        #
        #     {
        #         channel: 'marketdata',
        #         market_id: 'BTC-USDT',
        #         status: 'ok',
        #         lag: 0,
        #         order_books: [
        #           {side: 'buy', price: '1420.7', quantity: '0.057'},
        #           ...
        #         ],
        #         reset: True
        #     }
        #
        marketId = self.safe_string(message, 'market_id')
        symbol = self.safe_symbol(marketId)
        dataBySide = self.group_by(orderBook, 'side')
        messageHash = 'orderbook:' + symbol
        storedOrderBook = self.safe_value(self.orderbooks, symbol)
        if storedOrderBook is None:
            storedOrderBook = self.order_book({})
            self.orderbooks[symbol] = storedOrderBook
        reset = self.safe_value(message, 'reset', False)
        if reset:
            snapshot = self.parse_order_book(dataBySide, symbol, None, 'buy', 'sell', 'price', 'quantity')
            storedOrderBook.reset(snapshot)
        else:
            self.handle_delta(storedOrderBook, dataBySide)
        client.resolve(storedOrderBook, messageHash)

    def handle_bid_asks(self, bookSide, bidAsks):
        for i in range(0, len(bidAsks)):
            bidAsk = bidAsks[i]
            parsed = self.parse_bid_ask(bidAsk, 'price', 'quantity')
            bookSide.storeArray(parsed)

    def handle_delta(self, orderbook, delta):
        storedBids = orderbook['bids']
        storedAsks = orderbook['asks']
        asks = self.safe_value(delta, 'sell', [])
        bids = self.safe_value(delta, 'buy', [])
        self.handle_bid_asks(storedBids, bids)
        self.handle_bid_asks(storedAsks, asks)

    def handle_error_message(self, client: Client, message):
        #
        #     {
        #         errorCode: 'INVALID_ARGUMENT',
        #         message: '',
        #         details: {
        #             interval: 'invalid'
        #         }
        #     }
        #
        code = self.safe_string(message, 'errorCode')
        errMessage = self.safe_string(message, 'message', '')
        details = self.safe_value(message, 'details')
        # todo - raise properly here
        raise ExchangeError(self.id + ' ' + code + ' ' + errMessage + ' ' + self.json(details))

    def handle_authenticate(self, client: Client, message):
        #
        #     {type: 'authorization', result: 'ok'}
        #
        result = self.safe_string(message, 'result')
        future = client.subscriptions['authenticated']
        if result == 'ok':
            future.resolve(True)
        else:
            future.reject(message)
            del client.subscriptions['authenticated']

    def handle_market_data(self, client: Client, message):
        ticker = self.safe_value(message, 'ticker')
        if ticker is not None:
            self.handle_ticker(client, message)
        trades = self.safe_value(message, 'recent_trades', [])
        if len(trades) > 0:
            self.handle_trades(client, message)
        orderBook = self.safe_value_n(message, ['order_books', 'order_books_l1', 'order_books_l2', 'order_books_l3', 'order_books_l4'], [])
        if len(orderBook) > 0:
            self.handle_order_book(client, message, orderBook)

    def handle_message(self, client: Client, message):
        #
        #     {
        #         errorCode: 'INVALID_ARGUMENT',
        #         message: '',
        #         details: {
        #             interval: 'invalid'
        #         }
        #     }
        #
        errorCode = self.safe_string(message, 'errorCode')
        if errorCode is not None:
            return self.handle_error_message(client, message)
        type = self.safe_string(message, 'type')
        if type == 'authorization':
            return self.handle_authenticate(client, message)
        handlers = {
            'marketdata': self.handle_market_data,
            'balance': self.handle_balance,
            'trade_history': self.handle_my_trades,
            'open_order': self.handle_orders,
            'order_history': self.handle_orders,
        }
        channel = self.safe_string(message, 'channel')
        handler = self.safe_value(handlers, channel)
        if handler is not None:
            return handler(client, message)
        error = NotSupported(self.id + ' handleMessage: unknown message: ' + self.json(message))
        client.reject(error)

    async def authenticate(self, params={}):
        url = self.urls['api']['ws']
        client = self.client(url)
        messageHash = 'authenticated'
        expires = self.safe_integer(self.options, 'expires', 0)
        future = self.safe_value(client.subscriptions, messageHash)
        if (future is None) or (self.milliseconds() > expires):
            response = await self.signIn()
            #
            #     {
            #         access_token: '0ttDv/2hTTn3bLi8GP1gKaneiEQ6+0hOBenPrxNQt2s=',
            #         token_type: 'bearer',
            #         expires_in: 900
            #     }
            #
            accessToken = self.safe_string(response, 'access_token')
            request = {
                'type': 'authorization',
                'token': accessToken,
            }
            future = self.watch(url, messageHash, self.extend(request, params))
            client.subscriptions[messageHash] = future
        return await future
