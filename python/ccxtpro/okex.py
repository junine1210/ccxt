# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

from ccxtpro.base.exchange import Exchange
import ccxt.async_support as ccxt
from ccxtpro.base.cache import ArrayCache, ArrayCacheByTimestamp
import hashlib
from ccxt.base.errors import AuthenticationError


class okex(Exchange, ccxt.okex):

    def describe(self):
        return self.deep_extend(super(okex, self).describe(), {
            'has': {
                'ws': True,
                'watchTicker': True,
                # 'watchTickers': False,  # for now
                'watchOrderBook': True,
                'watchTrades': True,
                'watchBalance': True,
                'watchOHLCV': True,
            },
            'urls': {
                'api': {
                    'ws': {
                        'public': 'wss://ws.okex.com:8443/ws/v5/public',  # wss://wsaws.okex.com:8443/ws/v5/public
                        'private': 'wss://ws.okex.com:8443/ws/v5/private',  # wss://wsaws.okex.com:8443/ws/v5/private
                    },
                },
                'test': {
                    'ws': {
                        'public': 'wss://wspap.okex.com:8443/ws/v5/public?brokerId=9999',
                        'private': 'wss://wspap.okex.com:8443/ws/v5/private?brokerId=9999',
                    },
                },
            },
            'options': {
                'watchOrderBook': {
                    # books, 400 depth levels will be pushed in the initial full snapshot. Incremental data will be pushed every 100 ms when there is change in order book.
                    # books5, 5 depth levels will be pushed every time. Data will be pushed every 100 ms when there is change in order book.
                    # books50-l2-tbt, 50 depth levels will be pushed in the initial full snapshot. Incremental data will be pushed tick by tick, i.e. whenever there is change in order book.
                    # books-l2-tbt, 400 depth levels will be pushed in the initial full snapshot. Incremental data will be pushed tick by tick, i.e. whenever there is change in order book.
                    'depth': 'books-l2-tbt',
                },
                'watchBalance': 'spot',  # margin, futures, swap
                'ws': {
                    # 'inflate': True,
                },
            },
            'streaming': {
                # okex does not support built-in ws protocol-level ping-pong
                # instead it requires a custom text-based ping-pong
                'ping': self.ping,
                'keepAlive': 20000,
            },
        })

    async def subscribe(self, access, channel, symbol, params={}):
        await self.load_markets()
        url = self.urls['api']['ws'][access]
        messageHash = channel
        firstArgument = {
            'channel': channel,
        }
        if symbol is not None:
            market = self.market(symbol)
            messageHash += ':' + market['id']
            firstArgument['instId'] = market['id']
        request = {
            'op': 'subscribe',
            'args': [
                self.deep_extend(firstArgument, params),
            ],
        }
        return await self.watch(url, messageHash, request, messageHash)

    async def watch_trades(self, symbol, since=None, limit=None, params={}):
        trades = await self.subscribe('public', 'trades', symbol, params)
        if self.newUpdates:
            limit = trades.getLimit(symbol, limit)
        return self.filter_by_since_limit(trades, since, limit, 'timestamp', True)

    def handle_trades(self, client, message):
        #
        #     {
        #         arg: {channel: 'trades', instId: 'BTC-USDT'},
        #         data: [
        #             {
        #                 instId: 'BTC-USDT',
        #                 tradeId: '216970876',
        #                 px: '31684.5',
        #                 sz: '0.00001186',
        #                 side: 'buy',
        #                 ts: '1626531038288'
        #             }
        #         ]
        #     }
        #
        arg = self.safe_value(message, 'arg', {})
        channel = self.safe_string(arg, 'channel')
        data = self.safe_value(message, 'data', [])
        tradesLimit = self.safe_integer(self.options, 'tradesLimit', 1000)
        for i in range(0, len(data)):
            trade = self.parse_trade(data[i])
            symbol = trade['symbol']
            marketId = self.safe_string(trade['info'], 'instId')
            messageHash = channel + ':' + marketId
            stored = self.safe_value(self.trades, symbol)
            if stored is None:
                stored = ArrayCache(tradesLimit)
                self.trades[symbol] = stored
            stored.append(trade)
            client.resolve(stored, messageHash)
        return message

    async def watch_ticker(self, symbol, params={}):
        return await self.subscribe('public', 'tickers', symbol, params)

    def handle_ticker(self, client, message):
        #
        #     {
        #         arg: {channel: 'tickers', instId: 'BTC-USDT'},
        #         data: [
        #             {
        #                 instType: 'SPOT',
        #                 instId: 'BTC-USDT',
        #                 last: '31500.1',
        #                 lastSz: '0.00001754',
        #                 askPx: '31500.1',
        #                 askSz: '0.00998144',
        #                 bidPx: '31500',
        #                 bidSz: '3.05652439',
        #                 open24h: '31697',
        #                 high24h: '32248',
        #                 low24h: '31165.6',
        #                 sodUtc0: '31385.5',
        #                 sodUtc8: '32134.9',
        #                 volCcy24h: '503403597.38138519',
        #                 vol24h: '15937.10781721',
        #                 ts: '1626526618762'
        #             }
        #         ]
        #     }
        #
        arg = self.safe_value(message, 'arg', {})
        channel = self.safe_string(arg, 'channel')
        data = self.safe_value(message, 'data', [])
        for i in range(0, len(data)):
            ticker = self.parse_ticker(data[i])
            symbol = ticker['symbol']
            marketId = self.safe_string(ticker['info'], 'instId')
            messageHash = channel + ':' + marketId
            self.tickers[symbol] = ticker
            client.resolve(ticker, messageHash)
        return message

    async def watch_ohlcv(self, symbol, timeframe='1m', since=None, limit=None, params={}):
        interval = self.timeframes[timeframe]
        name = 'candle' + interval
        ohlcv = await self.subscribe('public', name, symbol, params)
        if self.newUpdates:
            limit = ohlcv.getLimit(symbol, limit)
        return self.filter_by_since_limit(ohlcv, since, limit, 0, True)

    def handle_ohlcv(self, client, message):
        #
        #     {
        #         arg: {channel: 'candle1m', instId: 'BTC-USDT'},
        #         data: [
        #             [
        #                 '1626690720000',
        #                 '31334',
        #                 '31334',
        #                 '31334',
        #                 '31334',
        #                 '0.0077',
        #                 '241.2718'
        #             ]
        #         ]
        #     }
        #
        arg = self.safe_value(message, 'arg', {})
        channel = self.safe_string(arg, 'channel')
        data = self.safe_value(message, 'data', [])
        marketId = self.safe_string(arg, 'instId')
        market = self.safe_market(marketId)
        symbol = market['id']
        interval = channel.replace('candle', '')
        # use a reverse lookup in a static map instead
        timeframe = self.find_timeframe(interval)
        for i in range(0, len(data)):
            parsed = self.parse_ohlcv(data[i], market)
            self.ohlcvs[symbol] = self.safe_value(self.ohlcvs, symbol, {})
            stored = self.safe_value(self.ohlcvs[symbol], timeframe)
            if stored is None:
                limit = self.safe_integer(self.options, 'OHLCVLimit', 1000)
                stored = ArrayCacheByTimestamp(limit)
                self.ohlcvs[symbol][timeframe] = stored
            stored.append(parsed)
            messageHash = channel + ':' + marketId
            client.resolve(stored, messageHash)

    async def watch_order_book(self, symbol, limit=None, params={}):
        options = self.safe_value(self.options, 'watchOrderBook', {})
        # books, 400 depth levels will be pushed in the initial full snapshot. Incremental data will be pushed every 100 ms when there is change in order book.
        # books5, 5 depth levels will be pushed every time. Data will be pushed every 100 ms when there is change in order book.
        # books50-l2-tbt, 50 depth levels will be pushed in the initial full snapshot. Incremental data will be pushed tick by tick, i.e. whenever there is change in order book.
        # books-l2-tbt, 400 depth levels will be pushed in the initial full snapshot. Incremental data will be pushed tick by tick, i.e. whenever there is change in order book.
        depth = self.safe_string(options, 'depth', 'books-l2-tbt')
        orderbook = await self.subscribe('public', depth, symbol, params)
        return orderbook.limit(limit)

    def handle_delta(self, bookside, delta):
        #
        #     [
        #         '31685',  # price
        #         '0.78069158',  # amount
        #         '0',  # liquidated orders
        #         '17'  # orders
        #     ]
        #
        price = self.safe_float(delta, 0)
        amount = self.safe_float(delta, 1)
        bookside.store(price, amount)

    def handle_deltas(self, bookside, deltas):
        for i in range(0, len(deltas)):
            self.handle_delta(bookside, deltas[i])

    def handle_order_book_message(self, client, message, orderbook):
        #
        #     {
        #         asks: [
        #             ['31738.3', '0.05973179', '0', '3'],
        #             ['31738.5', '0.11035404', '0', '2'],
        #             ['31739.6', '0.01', '0', '1'],
        #         ],
        #         bids: [
        #             ['31738.2', '0.67557666', '0', '9'],
        #             ['31738', '0.02466947', '0', '2'],
        #             ['31736.3', '0.01705046', '0', '2'],
        #         ],
        #         instId: 'BTC-USDT',
        #         ts: '1626537446491'
        #     }
        #
        asks = self.safe_value(message, 'asks', [])
        bids = self.safe_value(message, 'bids', [])
        self.handle_deltas(orderbook['asks'], asks)
        self.handle_deltas(orderbook['bids'], bids)
        timestamp = self.safe_integer(message, 'ts')
        orderbook['timestamp'] = timestamp
        orderbook['datetime'] = self.iso8601(timestamp)
        return orderbook

    def handle_order_book(self, client, message):
        #
        # snapshot
        #
        #     {
        #         arg: {channel: 'books-l2-tbt', instId: 'BTC-USDT'},
        #         action: 'snapshot',
        #         data: [
        #             {
        #                 asks: [
        #                     ['31685', '0.78069158', '0', '17'],
        #                     ['31685.1', '0.0001', '0', '1'],
        #                     ['31685.6', '0.04543165', '0', '1'],
        #                 ],
        #                 bids: [
        #                     ['31684.9', '0.01', '0', '1'],
        #                     ['31682.9', '0.0001', '0', '1'],
        #                     ['31680.7', '0.01', '0', '1'],
        #                 ],
        #                 ts: '1626532416403',
        #                 checksum: -1023440116
        #             }
        #         ]
        #     }
        #
        # update
        #
        #     {
        #         arg: {channel: 'books-l2-tbt', instId: 'BTC-USDT'},
        #         action: 'update',
        #         data: [
        #             {
        #                 asks: [
        #                     ['31657.7', '0', '0', '0'],
        #                     ['31659.7', '0.01', '0', '1'],
        #                     ['31987.3', '0.01', '0', '1']
        #                 ],
        #                 bids: [
        #                     ['31642.9', '0.50296385', '0', '4'],
        #                     ['31639.9', '0', '0', '0'],
        #                     ['31638.7', '0.01', '0', '1'],
        #                 ],
        #                 ts: '1626535709008',
        #                 checksum: 830931827
        #             }
        #         ]
        #     }
        #
        # books5
        #
        #     {
        #         arg: {channel: 'books5', instId: 'BTC-USDT'},
        #         data: [
        #             {
        #                 asks: [
        #                     ['31738.3', '0.05973179', '0', '3'],
        #                     ['31738.5', '0.11035404', '0', '2'],
        #                     ['31739.6', '0.01', '0', '1'],
        #                 ],
        #                 bids: [
        #                     ['31738.2', '0.67557666', '0', '9'],
        #                     ['31738', '0.02466947', '0', '2'],
        #                     ['31736.3', '0.01705046', '0', '2'],
        #                 ],
        #                 instId: 'BTC-USDT',
        #                 ts: '1626537446491'
        #             }
        #         ]
        #     }
        #
        arg = self.safe_value(message, 'arg', {})
        channel = self.safe_string(arg, 'channel')
        action = self.safe_string(message, 'action')
        data = self.safe_value(message, 'data', [])
        marketId = self.safe_string(arg, 'instId')
        market = self.safe_market(marketId)
        symbol = market['id']
        depths = {
            'books': 400,
            'books5': 5,
            'books-l2-tbt': 400,
            'books50-l2-tbt': 50,
        }
        limit = self.safe_integer(depths, channel)
        if action == 'snapshot':
            for i in range(0, len(data)):
                update = data[i]
                orderbook = self.order_book({}, limit)
                self.orderbooks[symbol] = orderbook
                self.handle_order_book_message(client, update, orderbook)
                messageHash = channel + ':' + marketId
                client.resolve(orderbook, messageHash)
        elif action == 'update':
            if symbol in self.orderbooks:
                orderbook = self.orderbooks[symbol]
                for i in range(0, len(data)):
                    update = data[i]
                    self.handle_order_book_message(client, update, orderbook)
                    messageHash = channel + ':' + marketId
                    client.resolve(orderbook, messageHash)
        elif channel == 'books5':
            orderbook = self.safe_value(self.orderbooks, symbol)
            if orderbook is None:
                orderbook = self.order_book({}, limit)
            self.orderbooks[symbol] = orderbook
            for i in range(0, len(data)):
                update = data[i]
                timestamp = self.safe_integer(update, 'ts')
                snapshot = self.parse_order_book(update, symbol, timestamp, 'bids', 'asks', 0, 1, market)
                orderbook.reset(snapshot)
                messageHash = channel + ':' + marketId
                client.resolve(orderbook, messageHash)
        return message

    async def authenticate(self, params={}):
        self.check_required_credentials()
        url = self.urls['api']['ws']['private']
        messageHash = 'login'
        client = self.client(url)
        future = self.safe_value(client.subscriptions, messageHash)
        if future is None:
            future = client.future('authenticated')
            timestamp = str(self.seconds())
            method = 'GET'
            path = '/users/self/verify'
            auth = timestamp + method + path
            signature = self.hmac(self.encode(auth), self.encode(self.secret), hashlib.sha256, 'base64')
            request = {
                'op': messageHash,
                'args': [
                    {
                        'apiKey': self.apiKey,
                        'passphrase': self.password,
                        'timestamp': timestamp,
                        'sign': signature,
                    },
                ],
            }
            self.spawn(self.watch, url, messageHash, request, messageHash, future)
        return await future

    async def watch_balance(self, params={}):
        await self.load_markets()
        await self.authenticate()
        return await self.subscribe('private', 'account', None, params)

    def handle_balance(self, client, message):
        #
        #     {
        #         arg: {channel: 'account'},
        #         data: [
        #             {
        #                 adjEq: '',
        #                 details: [
        #                     {
        #                         availBal: '',
        #                         availEq: '8.21009913',
        #                         cashBal: '8.21009913',
        #                         ccy: 'USDT',
        #                         coinUsdPrice: '0.99994',
        #                         crossLiab: '',
        #                         disEq: '8.2096065240522',
        #                         eq: '8.21009913',
        #                         eqUsd: '8.2096065240522',
        #                         frozenBal: '0',
        #                         interest: '',
        #                         isoEq: '0',
        #                         isoLiab: '',
        #                         liab: '',
        #                         maxLoan: '',
        #                         mgnRatio: '',
        #                         notionalLever: '0',
        #                         ordFrozen: '0',
        #                         twap: '0',
        #                         uTime: '1621927314996',
        #                         upl: '0'
        #                     },
        #                 ],
        #                 imr: '',
        #                 isoEq: '0',
        #                 mgnRatio: '',
        #                 mmr: '',
        #                 notionalUsd: '',
        #                 ordFroz: '',
        #                 totalEq: '22.1930992296832',
        #                 uTime: '1626692120916'
        #             }
        #         ]
        #     }
        #
        arg = self.safe_value(message, 'arg', {})
        channel = self.safe_string(arg, 'channel')
        type = 'spot'
        balance = self.parseTradingBalance(message)
        oldBalance = self.safe_value(self.balance, type, {})
        newBalance = self.deep_extend(oldBalance, balance)
        self.balance[type] = self.parse_balance(newBalance)
        client.resolve(self.balance[type], channel)

    async def watch_orders(self, symbol=None, since=None, limit=None, params={}):
        await self.load_markets()
        await self.authenticate()
        #
        #     {
        #         "op": "subscribe",
        #         "args": [
        #             {
        #                 "channel": "orders",
        #                 "instType": "FUTURES",
        #                 "uly": "BTC-USD",
        #                 "instId": "BTC-USD-200329"
        #             }
        #         ]
        #     }
        #
        defaultType = self.safe_string(self.options, 'defaultType')
        options = self.safe_string(self.options, 'watchOrders', {})
        type = self.safe_string(options, 'type', defaultType)
        type = self.safe_string(params, 'type', type)
        params = self.omit(params, 'type')
        market = None
        if symbol is not None:
            market = self.market(symbol)
            type = market['type']
        uppercaseType = type.upper()
        request = {
            'instType': uppercaseType,
        }
        return await self.subscribe('private', 'orders', symbol, self.extend(request, params))

    def handle_subscription_status(self, client, message):
        #
        #     {event: 'subscribe', arg: {channel: 'tickers', instId: 'BTC-USDT'}}
        #
        # channel = self.safe_string(message, 'channel')
        # client.subscriptions[channel] = message
        return message

    def handle_authenticate(self, client, message):
        #
        #     {event: 'login', success: True}
        #
        client.resolve(message, 'authenticated')
        return message

    def ping(self, client):
        # okex does not support built-in ws protocol-level ping-pong
        # instead it requires custom text-based ping-pong
        return 'ping'

    def handle_pong(self, client, message):
        client.lastPong = self.milliseconds()
        return message

    def handle_error_message(self, client, message):
        #
        #     {event: 'error', msg: 'Illegal request: {"op":"subscribe","args":["spot/ticker:BTC-USDT"]}', code: '60012'}
        #     {event: 'error', msg: "channel:ticker,instId:BTC-USDT doesn't exist", code: '60018'}
        #
        errorCode = self.safe_string(message, 'errorCode')
        try:
            if errorCode is not None:
                feedback = self.id + ' ' + self.json(message)
                self.throw_exactly_matched_exception(self.exceptions['exact'], errorCode, feedback)
                messageString = self.safe_value(message, 'message')
                if messageString is not None:
                    self.throw_broadly_matched_exception(self.exceptions['broad'], messageString, feedback)
        except Exception as e:
            if isinstance(e, AuthenticationError):
                client.reject(e, 'authenticated')
                method = 'login'
                if method in client.subscriptions:
                    del client.subscriptions[method]
                return False
        return message

    def handle_message(self, client, message):
        if not self.handle_error_message(client, message):
            return
        #
        #     {event: 'subscribe', arg: {channel: 'tickers', instId: 'BTC-USDT'}}
        #     {event: 'login', msg: '', code: '0'}
        #
        #     {
        #         arg: {channel: 'tickers', instId: 'BTC-USDT'},
        #         data: [
        #             {
        #                 instType: 'SPOT',
        #                 instId: 'BTC-USDT',
        #                 last: '31500.1',
        #                 lastSz: '0.00001754',
        #                 askPx: '31500.1',
        #                 askSz: '0.00998144',
        #                 bidPx: '31500',
        #                 bidSz: '3.05652439',
        #                 open24h: '31697',
        #                 high24h: '32248',
        #                 low24h: '31165.6',
        #                 sodUtc0: '31385.5',
        #                 sodUtc8: '32134.9',
        #                 volCcy24h: '503403597.38138519',
        #                 vol24h: '15937.10781721',
        #                 ts: '1626526618762'
        #             }
        #         ]
        #     }
        #
        #     {event: 'error', msg: 'Illegal request: {"op":"subscribe","args":["spot/ticker:BTC-USDT"]}', code: '60012'}
        #     {event: 'error', msg: "channel:ticker,instId:BTC-USDT doesn't exist", code: '60018'}
        #     {event: 'error', msg: 'Invalid OK_ACCESS_KEY', code: '60005'}
        #     {
        #         event: 'error',
        #         msg: 'Illegal request: {"op":"login","args":["de89b035-b233-44b2-9a13-0ccdd00bda0e","7KUcc8YzQhnxBE3K","1626691289","H57N99mBt5NvW8U19FITrPdOxycAERFMaapQWRqLaSE="]}',
        #         code: '60012'
        #     }
        #
        #
        #
        if message == 'pong':
            return self.handle_pong(client, message)
        # table = self.safe_string(message, 'table')
        # if table is None:
        event = self.safe_string(message, 'event')
        if event is not None:
            methods = {
                # 'info': self.handleSystemStatus,
                # 'book': 'handleOrderBook',
                'login': self.handle_authenticate,
                'subscribe': self.handle_subscription_status,
            }
            method = self.safe_value(methods, event)
            if method is None:
                return message
            else:
                return method(client, message)
        else:
            arg = self.safe_value(message, 'arg', {})
            channel = self.safe_string(arg, 'channel')
            methods = {
                'books': self.handle_order_book,  # 400 depth levels will be pushed in the initial full snapshot. Incremental data will be pushed every 100 ms when there is change in order book.
                'books5': self.handle_order_book,  # 5 depth levels will be pushed every time. Data will be pushed every 100 ms when there is change in order book.
                'books50-l2-tbt': self.handle_order_book,  # 50 depth levels will be pushed in the initial full snapshot. Incremental data will be pushed tick by tick, i.e. whenever there is change in order book.
                'books-l2-tbt': self.handle_order_book,  # 400 depth levels will be pushed in the initial full snapshot. Incremental data will be pushed tick by tick, i.e. whenever there is change in order book.
                'tickers': self.handle_ticker,
                'trades': self.handle_trades,
                'account': self.handle_balance,
                # 'margin_account': self.handle_balance,
            }
            method = self.safe_value(methods, channel)
            if method is None:
                if channel.find('candle') == 0:
                    self.handle_ohlcv(client, message)
                else:
                    return message
            else:
                return method(client, message)
