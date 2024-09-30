'use strict';

var bingx$1 = require('./abstract/bingx.js');
var errors = require('./base/errors.js');
var Precise = require('./base/Precise.js');
var sha256 = require('./static_dependencies/noble-hashes/sha256.js');
var number = require('./base/functions/number.js');

//  ---------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
/**
 * @class bingx
 * @augments Exchange
 */
class bingx extends bingx$1 {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bingx',
            'name': 'BingX',
            'countries': ['US'],
            'rateLimit': 100,
            'version': 'v1',
            'certified': true,
            'pro': true,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': true,
                'future': false,
                'option': false,
                'addMargin': true,
                'cancelAllOrders': true,
                'cancelAllOrdersAfter': true,
                'cancelOrder': true,
                'cancelOrders': true,
                'closeAllPositions': true,
                'closePosition': true,
                'createMarketBuyOrderWithCost': true,
                'createMarketOrderWithCost': true,
                'createMarketSellOrderWithCost': true,
                'createOrder': true,
                'createOrders': true,
                'createOrderWithTakeProfitAndStopLoss': true,
                'createStopLossOrder': true,
                'createTakeProfitOrder': true,
                'createTrailingAmountOrder': true,
                'createTrailingPercentOrder': true,
                'createTriggerOrder': true,
                'fetchBalance': true,
                'fetchCanceledOrders': true,
                'fetchClosedOrders': true,
                'fetchCurrencies': true,
                'fetchDepositAddress': true,
                'fetchDepositAddressesByNetwork': true,
                'fetchDeposits': true,
                'fetchDepositWithdrawFee': 'emulated',
                'fetchDepositWithdrawFees': true,
                'fetchFundingRate': true,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': true,
                'fetchLeverage': true,
                'fetchLiquidations': false,
                'fetchMarginAdjustmentHistory': false,
                'fetchMarginMode': true,
                'fetchMarkets': true,
                'fetchMarkOHLCV': true,
                'fetchMyLiquidations': true,
                'fetchOHLCV': true,
                'fetchOpenInterest': true,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchPosition': true,
                'fetchPositionHistory': false,
                'fetchPositionMode': true,
                'fetchPositions': true,
                'fetchPositionsHistory': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTransfers': true,
                'fetchWithdrawals': true,
                'reduceMargin': true,
                'sandbox': true,
                'setLeverage': true,
                'setMargin': true,
                'setMarginMode': true,
                'setPositionMode': true,
                'transfer': true,
            },
            'hostname': 'bingx.com',
            'urls': {
                'logo': 'https://github-production-user-asset-6210df.s3.amazonaws.com/1294454/253675376-6983b72e-4999-4549-b177-33b374c195e3.jpg',
                'api': {
                    'spot': 'https://open-api.{hostname}/openApi',
                    'swap': 'https://open-api.{hostname}/openApi',
                    'contract': 'https://open-api.{hostname}/openApi',
                    'wallets': 'https://open-api.{hostname}/openApi',
                    'user': 'https://open-api.{hostname}/openApi',
                    'subAccount': 'https://open-api.{hostname}/openApi',
                    'account': 'https://open-api.{hostname}/openApi',
                    'copyTrading': 'https://open-api.{hostname}/openApi',
                    'cswap': 'https://open-api.{hostname}/openApi',
                },
                'test': {
                    'swap': 'https://open-api-vst.{hostname}/openApi', // only swap is really "test" but since the API keys are the same, we want to keep all the functionalities when the user enables the sandboxmode
                },
                'www': 'https://bingx.com/',
                'doc': 'https://bingx-api.github.io/docs/',
                'referral': 'https://bingx.com/invite/OHETOM',
            },
            'fees': {
                'tierBased': true,
                'spot': {
                    'feeSide': 'get',
                    'maker': this.parseNumber('0.001'),
                    'taker': this.parseNumber('0.001'),
                },
                'swap': {
                    'feeSide': 'quote',
                    'maker': this.parseNumber('0.0002'),
                    'taker': this.parseNumber('0.0005'),
                },
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
            },
            'api': {
                'spot': {
                    'v1': {
                        'public': {
                            'get': {
                                'server/time': 1,
                                'common/symbols': 1,
                                'market/trades': 1,
                                'market/depth': 1,
                                'market/kline': 1,
                                'ticker/24hr': 1,
                                'ticker/price': 1,
                                'ticker/bookTicker': 1,
                            },
                        },
                        'private': {
                            'get': {
                                'trade/query': 1,
                                'trade/openOrders': 1,
                                'trade/historyOrders': 1,
                                'trade/myTrades': 2,
                                'user/commissionRate': 5,
                                'account/balance': 2,
                            },
                            'post': {
                                'trade/order': 2,
                                'trade/cancel': 2,
                                'trade/batchOrders': 5,
                                'trade/order/cancelReplace': 5,
                                'trade/cancelOrders': 5,
                                'trade/cancelOpenOrders': 5,
                                'trade/cancelAllAfter': 5,
                            },
                        },
                    },
                    'v2': {
                        'public': {
                            'get': {
                                'market/depth': 1,
                                'market/kline': 1,
                            },
                        },
                    },
                    'v3': {
                        'private': {
                            'get': {
                                'get/asset/transfer': 1,
                                'asset/transfer': 1,
                                'capital/deposit/hisrec': 1,
                                'capital/withdraw/history': 1,
                            },
                            'post': {
                                'post/asset/transfer': 5,
                            },
                        },
                    },
                },
                'swap': {
                    'v1': {
                        'public': {
                            'get': {
                                'ticker/price': 1,
                                'market/historicalTrades': 1,
                            },
                        },
                        'private': {
                            'get': {
                                'positionSide/dual': 5,
                                'market/markPriceKlines': 1,
                                'trade/batchCancelReplace': 5,
                                'trade/fullOrder': 2,
                            },
                            'post': {
                                'trade/cancelReplace': 2,
                                'positionSide/dual': 5,
                                'trade/closePosition': 2,
                            },
                        },
                    },
                    'v2': {
                        'public': {
                            'get': {
                                'server/time': 1,
                                'quote/contracts': 1,
                                'quote/price': 1,
                                'quote/depth': 1,
                                'quote/trades': 1,
                                'quote/premiumIndex': 1,
                                'quote/fundingRate': 1,
                                'quote/klines': 1,
                                'quote/openInterest': 1,
                                'quote/ticker': 1,
                                'quote/bookTicker': 1,
                            },
                        },
                        'private': {
                            'get': {
                                'user/balance': 2,
                                'user/positions': 2,
                                'user/income': 2,
                                'trade/openOrders': 2,
                                'trade/openOrder': 2,
                                'trade/order': 2,
                                'trade/marginType': 5,
                                'trade/leverage': 2,
                                'trade/forceOrders': 1,
                                'trade/allOrders': 2,
                                'trade/allFillOrders': 2,
                                'user/income/export': 2,
                                'user/commissionRate': 2,
                                'quote/bookTicker': 1,
                            },
                            'post': {
                                'trade/order': 2,
                                'trade/batchOrders': 2,
                                'trade/closeAllPositions': 2,
                                'trade/cancelAllAfter': 5,
                                'trade/marginType': 5,
                                'trade/leverage': 5,
                                'trade/positionMargin': 5,
                                'trade/order/test': 2,
                            },
                            'delete': {
                                'trade/order': 2,
                                'trade/batchOrders': 2,
                                'trade/allOpenOrders': 2,
                            },
                        },
                    },
                    'v3': {
                        'public': {
                            'get': {
                                'quote/klines': 1,
                            },
                        },
                    },
                },
                'cswap': {
                    'v1': {
                        'public': {
                            'get': {
                                'market/contracts': 1,
                                'market/premiumIndex': 1,
                                'market/openInterest': 1,
                                'market/klines': 1,
                                'market/depth': 1,
                                'market/ticker': 1,
                            },
                        },
                        'private': {
                            'get': {
                                'trade/leverage': 2,
                                'trade/forceOrders': 2,
                                'trade/allFillOrders': 2,
                                'trade/openOrders': 2,
                                'trade/orderDetail': 2,
                                'trade/orderHistory': 2,
                                'trade/marginType': 2,
                                'user/commissionRate': 2,
                                'user/positions': 2,
                                'user/balance': 2,
                            },
                            'post': {
                                'trade/order': 2,
                                'trade/leverage': 2,
                                'trade/closeAllPositions': 2,
                                'trade/marginType': 2,
                                'trade/positionMargin': 2,
                            },
                            'delete': {
                                'trade/allOpenOrders': 2,
                                'trade/cancelOrder': 2,
                            },
                        },
                    },
                },
                'contract': {
                    'v1': {
                        'private': {
                            'get': {
                                'allPosition': 2,
                                'allOrders': 2,
                                'balance': 2,
                            },
                        },
                    },
                },
                'wallets': {
                    'v1': {
                        'private': {
                            'get': {
                                'capital/config/getall': 5,
                                'capital/deposit/address': 5,
                                'capital/innerTransfer/records': 1,
                                'capital/subAccount/deposit/address': 5,
                                'capital/deposit/subHisrec': 2,
                                'capital/subAccount/innerTransfer/records': 1,
                                'capital/deposit/riskRecords': 5,
                            },
                            'post': {
                                'capital/withdraw/apply': 5,
                                'capital/innerTransfer/apply': 5,
                                'capital/subAccountInnerTransfer/apply': 2,
                                'capital/deposit/createSubAddress': 2,
                            },
                        },
                    },
                },
                'subAccount': {
                    'v1': {
                        'private': {
                            'get': {
                                'list': 10,
                                'assets': 2,
                            },
                            'post': {
                                'create': 10,
                                'apiKey/create': 2,
                                'apiKey/edit': 2,
                                'apiKey/del': 2,
                                'updateStatus': 10,
                            },
                        },
                    },
                },
                'account': {
                    'v1': {
                        'private': {
                            'get': {
                                'uid': 1,
                                'apiKey/query': 2,
                            },
                            'post': {
                                'innerTransfer/authorizeSubAccount': 1,
                            },
                        },
                    },
                },
                'user': {
                    'auth': {
                        'private': {
                            'post': {
                                'userDataStream': 2,
                            },
                            'put': {
                                'userDataStream': 2,
                            },
                            'delete': {
                                'userDataStream': 2,
                            },
                        },
                    },
                },
                'copyTrading': {
                    'v1': {
                        'private': {
                            'get': {
                                'swap/trace/currentTrack': 2,
                            },
                            'post': {
                                'swap/trace/closeTrackOrder': 2,
                                'swap/trace/setTPSL': 2,
                                'spot/trader/sellOrder': 10,
                            },
                        },
                    },
                },
                'api': {
                    'v3': {
                        'private': {
                            'get': {
                                'asset/transfer': 1,
                                'capital/deposit/hisrec': 1,
                                'capital/withdraw/history': 1,
                            },
                            'post': {
                                'post/asset/transfer': 1,
                            },
                        },
                    },
                },
            },
            'timeframes': {
                '1m': '1m',
                '3m': '3m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '2h': '2h',
                '4h': '4h',
                '6h': '6h',
                '12h': '12h',
                '1d': '1d',
                '3d': '3d',
                '1w': '1w',
                '1M': '1M',
            },
            'precisionMode': number.TICK_SIZE,
            'exceptions': {
                'exact': {
                    '400': errors.BadRequest,
                    '401': errors.AuthenticationError,
                    '403': errors.PermissionDenied,
                    '404': errors.BadRequest,
                    '429': errors.DDoSProtection,
                    '418': errors.PermissionDenied,
                    '500': errors.ExchangeError,
                    '504': errors.ExchangeError,
                    '100001': errors.AuthenticationError,
                    '100412': errors.AuthenticationError,
                    '100202': errors.InsufficientFunds,
                    '100204': errors.BadRequest,
                    '100400': errors.BadRequest,
                    '100410': errors.OperationFailed,
                    '100421': errors.BadSymbol,
                    '100440': errors.ExchangeError,
                    '100500': errors.OperationFailed,
                    '100503': errors.ExchangeError,
                    '80001': errors.BadRequest,
                    '80012': errors.InsufficientFunds,
                    '80014': errors.BadRequest,
                    '80016': errors.OrderNotFound,
                    '80017': errors.OrderNotFound,
                    '100414': errors.AccountSuspended,
                    '100419': errors.PermissionDenied,
                    '100437': errors.BadRequest,
                    '101204': errors.InsufficientFunds,
                    '110425': errors.InvalidOrder, // {"code":110425,"msg":"Please ensure that the minimum nominal value of the order placed must be greater than 2u","data":{}}
                },
                'broad': {},
            },
            'commonCurrencies': {
                'SNOW': 'Snowman',
                'OMNI': 'OmniCat',
                'NAP': '$NAP', // NAP on SOL = SNAP
            },
            'options': {
                'defaultType': 'spot',
                'accountsByType': {
                    'spot': 'FUND',
                    'swap': 'PFUTURES',
                    'future': 'SFUTURES',
                },
                'accountsById': {
                    'FUND': 'spot',
                    'PFUTURES': 'swap',
                    'SFUTURES': 'future',
                },
                'recvWindow': 5 * 1000,
                'broker': 'CCXT',
                'defaultNetworks': {
                    'ETH': 'ETH',
                    'USDT': 'ERC20',
                    'USDC': 'ERC20',
                    'BTC': 'BTC',
                    'LTC': 'LTC',
                },
                'networks': {
                    'ARB': 'ARBITRUM',
                },
            },
        });
    }
    async fetchTime(params = {}) {
        /**
         * @method
         * @name bingx#fetchTime
         * @description fetches the current integer timestamp in milliseconds from the bingx server
         * @see https://bingx-api.github.io/docs/#/swapV2/base-info.html#Get%20Server%20Time
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {int} the current integer timestamp in milliseconds from the bingx server
         */
        const response = await this.swapV2PublicGetServerTime(params);
        //
        //    {
        //        "code": 0,
        //        "msg": "",
        //        "data": {
        //            "serverTime": 1675319535362
        //        }
        //    }
        //
        const data = this.safeDict(response, 'data');
        return this.safeInteger(data, 'serverTime');
    }
    async fetchCurrencies(params = {}) {
        /**
         * @method
         * @name bingx#fetchCurrencies
         * @description fetches all available currencies on an exchange
         * @see https://bingx-api.github.io/docs/#/common/account-api.html#All%20Coins
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an associative dictionary of currencies
         */
        if (!this.checkRequiredCredentials(false)) {
            return undefined;
        }
        const isSandbox = this.safeBool(this.options, 'sandboxMode', false);
        if (isSandbox) {
            return undefined;
        }
        const response = await this.walletsV1PrivateGetCapitalConfigGetall(params);
        //
        //    {
        //      "code": 0,
        //      "timestamp": 1702623271477,
        //      "data": [
        //        {
        //          "coin": "BTC",
        //          "name": "BTC",
        //          "networkList": [
        //            {
        //              "name": "BTC",
        //              "network": "BTC",
        //              "isDefault": true,
        //              "minConfirm": 2,
        //              "withdrawEnable": true,
        //              "depositEnable": true,
        //              "withdrawFee": "0.0006",
        //              "withdrawMax": "1.17522",
        //              "withdrawMin": "0.0005",
        //              "depositMin": "0.0002"
        //            },
        //            {
        //              "name": "BTC",
        //              "network": "BEP20",
        //              "isDefault": false,
        //              "minConfirm": 15,
        //              "withdrawEnable": true,
        //              "depositEnable": true,
        //              "withdrawFee": "0.0000066",
        //              "withdrawMax": "1.17522",
        //              "withdrawMin": "0.0000066",
        //              "depositMin": "0.0002"
        //            }
        //          ]
        //        }
        //      ]
        //    }
        //
        const data = this.safeList(response, 'data', []);
        const result = {};
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            const currencyId = this.safeString(entry, 'coin');
            const code = this.safeCurrencyCode(currencyId);
            const name = this.safeString(entry, 'name');
            const networkList = this.safeList(entry, 'networkList');
            const networks = {};
            let fee = undefined;
            let depositEnabled = undefined;
            let withdrawEnabled = undefined;
            let defaultLimits = {};
            for (let j = 0; j < networkList.length; j++) {
                const rawNetwork = networkList[j];
                const network = this.safeString(rawNetwork, 'network');
                const networkCode = this.networkIdToCode(network);
                const isDefault = this.safeBool(rawNetwork, 'isDefault');
                const networkDepositEnabled = this.safeBool(rawNetwork, 'depositEnable');
                if (networkDepositEnabled) {
                    depositEnabled = true;
                }
                const networkWithdrawEnabled = this.safeBool(rawNetwork, 'withdrawEnable');
                if (networkDepositEnabled) {
                    withdrawEnabled = true;
                }
                const limits = {
                    'withdraw': {
                        'min': this.safeNumber(rawNetwork, 'withdrawMin'),
                        'max': this.safeNumber(rawNetwork, 'withdrawMax'),
                    },
                };
                if (isDefault) {
                    fee = this.safeNumber(rawNetwork, 'withdrawFee');
                    defaultLimits = limits;
                }
                const networkActive = networkDepositEnabled || networkWithdrawEnabled;
                networks[networkCode] = {
                    'info': rawNetwork,
                    'id': network,
                    'network': networkCode,
                    'fee': fee,
                    'active': networkActive,
                    'deposit': networkDepositEnabled,
                    'withdraw': networkWithdrawEnabled,
                    'precision': undefined,
                    'limits': limits,
                };
            }
            const active = depositEnabled || withdrawEnabled;
            result[code] = {
                'info': entry,
                'code': code,
                'id': currencyId,
                'precision': undefined,
                'name': name,
                'active': active,
                'deposit': depositEnabled,
                'withdraw': withdrawEnabled,
                'networks': networks,
                'fee': fee,
                'limits': defaultLimits,
            };
        }
        return result;
    }
    async fetchSpotMarkets(params) {
        const response = await this.spotV1PublicGetCommonSymbols(params);
        //
        //    {
        //        "code": 0,
        //            "msg": "",
        //            "debugMsg": "",
        //            "data": {
        //              "symbols": [
        //                  {
        //                    "symbol": "GEAR-USDT",
        //                    "minQty": 735,
        //                    "maxQty": 2941177,
        //                    "minNotional": 5,
        //                    "maxNotional": 20000,
        //                    "status": 1,
        //                    "tickSize": 0.000001,
        //                    "stepSize": 1,
        //                    "apiStateSell": true,
        //                    "apiStateBuy": true,
        //                    "timeOnline": 0,
        //                    "offTime": 0,
        //                    "maintainTime": 0
        //                  },
        //                  ...
        //              ]
        //         }
        //    }
        //
        const data = this.safeDict(response, 'data');
        const markets = this.safeList(data, 'symbols', []);
        return this.parseMarkets(markets);
    }
    async fetchSwapMarkets(params) {
        const response = await this.swapV2PublicGetQuoteContracts(params);
        //
        //    {
        //        "code": 0,
        //        "msg": "",
        //        "data": [
        //            {
        //                "contractId": "100",
        //                "symbol": "BTC-USDT",
        //                "size": "0.0001",
        //                "quantityPrecision": "4",
        //                "pricePrecision": "1",
        //                "feeRate": "0.0005",
        //                "makerFeeRate": "0.0002",
        //                "takerFeeRate": "0.0005",
        //                "tradeMinLimit": "0",
        //                "tradeMinQuantity": "0.0001",
        //                "tradeMinUSDT": "2",
        //                "maxLongLeverage": "125",
        //                "maxShortLeverage": "125",
        //                "currency": "USDT",
        //                "asset": "BTC",
        //                "status": "1",
        //                "apiStateOpen": "true",
        //                "apiStateClose": "true",
        //                "ensureTrigger": true,
        //                "triggerFeeRate": "0.00020000"
        //            },
        //            ...
        //        ]
        //    }
        //
        const markets = this.safeList(response, 'data', []);
        return this.parseMarkets(markets);
    }
    async fetchInverseSwapMarkets(params) {
        const response = await this.cswapV1PublicGetMarketContracts(params);
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "timestamp": 1720074487610,
        //         "data": [
        //             {
        //                 "symbol": "BNB-USD",
        //                 "pricePrecision": 2,
        //                 "minTickSize": "10",
        //                 "minTradeValue": "10",
        //                 "minQty": "1.00000000",
        //                 "status": 1,
        //                 "timeOnline": 1713175200000
        //             },
        //         ]
        //     }
        //
        const markets = this.safeList(response, 'data', []);
        return this.parseMarkets(markets);
    }
    parseMarket(market) {
        const id = this.safeString(market, 'symbol');
        const symbolParts = id.split('-');
        const baseId = symbolParts[0];
        const quoteId = symbolParts[1];
        const base = this.safeCurrencyCode(baseId);
        const quote = this.safeCurrencyCode(quoteId);
        let currency = this.safeString(market, 'currency');
        let checkIsInverse = false;
        let checkIsLinear = true;
        const minTickSize = this.safeNumber(market, 'minTickSize');
        if (minTickSize !== undefined) {
            // inverse swap market
            currency = baseId;
            checkIsInverse = true;
            checkIsLinear = false;
        }
        const settle = this.safeCurrencyCode(currency);
        let pricePrecision = this.safeNumber(market, 'tickSize');
        if (pricePrecision === undefined) {
            pricePrecision = this.parseNumber(this.parsePrecision(this.safeString(market, 'pricePrecision')));
        }
        let quantityPrecision = this.safeNumber(market, 'stepSize');
        if (quantityPrecision === undefined) {
            quantityPrecision = this.parseNumber(this.parsePrecision(this.safeString(market, 'quantityPrecision')));
        }
        const type = (settle !== undefined) ? 'swap' : 'spot';
        const spot = type === 'spot';
        const swap = type === 'swap';
        let symbol = base + '/' + quote;
        if (settle !== undefined) {
            symbol += ':' + settle;
        }
        const fees = this.safeDict(this.fees, type, {});
        const contractSize = (swap) ? this.parseNumber('1') : undefined;
        let isActive = false;
        if ((this.safeString(market, 'apiStateOpen') === 'true') && (this.safeString(market, 'apiStateClose') === 'true')) {
            isActive = true; // swap active
        }
        else if (this.safeBool(market, 'apiStateSell') && this.safeBool(market, 'apiStateBuy') && (this.safeNumber(market, 'status') === 1)) {
            isActive = true; // spot active
        }
        const isInverse = (spot) ? undefined : checkIsInverse;
        const isLinear = (spot) ? undefined : checkIsLinear;
        let timeOnline = this.safeInteger(market, 'timeOnline');
        if (timeOnline === 0) {
            timeOnline = undefined;
        }
        return this.safeMarketStructure({
            'id': id,
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'settle': settle,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': currency,
            'type': type,
            'spot': spot,
            'margin': false,
            'swap': swap,
            'future': false,
            'option': false,
            'active': isActive,
            'contract': swap,
            'linear': isLinear,
            'inverse': isInverse,
            'taker': this.safeNumber(fees, 'taker'),
            'maker': this.safeNumber(fees, 'maker'),
            'feeSide': this.safeString(fees, 'feeSide'),
            'contractSize': contractSize,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': quantityPrecision,
                'price': pricePrecision,
            },
            'limits': {
                'leverage': {
                    'min': undefined,
                    'max': undefined,
                },
                'amount': {
                    'min': this.safeNumber2(market, 'minQty', 'tradeMinQuantity'),
                    'max': this.safeNumber(market, 'maxQty'),
                },
                'price': {
                    'min': minTickSize,
                    'max': undefined,
                },
                'cost': {
                    'min': this.safeNumberN(market, ['minNotional', 'tradeMinUSDT', 'minTradeValue']),
                    'max': this.safeNumber(market, 'maxNotional'),
                },
            },
            'created': timeOnline,
            'info': market,
        });
    }
    async fetchMarkets(params = {}) {
        /**
         * @method
         * @name bingx#fetchMarkets
         * @description retrieves data on all markets for bingx
         * @see https://bingx-api.github.io/docs/#/spot/market-api.html#Query%20Symbols
         * @see https://bingx-api.github.io/docs/#/swapV2/market-api.html#Contract%20Information
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/market-api.html#Contract%20Information
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const requests = [this.fetchSwapMarkets(params)];
        const isSandbox = this.safeBool(this.options, 'sandboxMode', false);
        if (!isSandbox) {
            requests.push(this.fetchInverseSwapMarkets(params));
            requests.push(this.fetchSpotMarkets(params)); // sandbox is swap only
        }
        const promises = await Promise.all(requests);
        const linearSwapMarkets = this.safeList(promises, 0, []);
        const inverseSwapMarkets = this.safeList(promises, 1, []);
        const spotMarkets = this.safeList(promises, 2, []);
        const swapMarkets = this.arrayConcat(linearSwapMarkets, inverseSwapMarkets);
        return this.arrayConcat(spotMarkets, swapMarkets);
    }
    async fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchOHLCV
         * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
         * @see https://bingx-api.github.io/docs/#/swapV2/market-api.html#K-Line%20Data
         * @see https://bingx-api.github.io/docs/#/spot/market-api.html#Candlestick%20chart%20data
         * @see https://bingx-api.github.io/docs/#/swapV2/market-api.html#%20K-Line%20Data
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/market-api.html#K-Line%20Data%20-%20Mark%20Price
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/market-api.html#Get%20K-line%20Data
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] timestamp in ms of the latest candle to fetch
         * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
         * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
         */
        await this.loadMarkets();
        let paginate = false;
        [paginate, params] = this.handleOptionAndParams(params, 'fetchOHLCV', 'paginate', false);
        if (paginate) {
            return await this.fetchPaginatedCallDeterministic('fetchOHLCV', symbol, since, limit, timeframe, params, 1440);
        }
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        request['interval'] = this.safeString(this.timeframes, timeframe, timeframe);
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const until = this.safeInteger2(params, 'until', 'endTime');
        if (until !== undefined) {
            params = this.omit(params, ['until']);
            request['endTime'] = until;
        }
        let response = undefined;
        if (market['spot']) {
            response = await this.spotV1PublicGetMarketKline(this.extend(request, params));
        }
        else {
            if (market['inverse']) {
                response = await this.cswapV1PublicGetMarketKlines(this.extend(request, params));
            }
            else {
                const price = this.safeString(params, 'price');
                params = this.omit(params, 'price');
                if (price === 'mark') {
                    response = await this.swapV1PrivateGetMarketMarkPriceKlines(this.extend(request, params));
                }
                else {
                    response = await this.swapV3PublicGetQuoteKlines(this.extend(request, params));
                }
            }
        }
        //
        //    {
        //        "code": 0,
        //        "msg": "",
        //        "data": [
        //          {
        //            "open": "19396.8",
        //            "close": "19394.4",
        //            "high": "19397.5",
        //            "low": "19385.7",
        //            "volume": "110.05",
        //            "time": 1666583700000
        //          },
        //          ...
        //        ]
        //    }
        //
        // fetchMarkOHLCV
        //
        //    {
        //        "code": 0,
        //        "msg": "",
        //        "data": [
        //            {
        //                "open": "42191.7",
        //                "close": "42189.5",
        //                "high": "42196.5",
        //                "low": "42189.5",
        //                "volume": "0.00",
        //                "openTime": 1706508840000,
        //                "closeTime": 1706508840000
        //            }
        //        ]
        //    }
        //
        let ohlcvs = this.safeValue(response, 'data', []);
        if (!Array.isArray(ohlcvs)) {
            ohlcvs = [ohlcvs];
        }
        return this.parseOHLCVs(ohlcvs, market, timeframe, since, limit);
    }
    parseOHLCV(ohlcv, market = undefined) {
        //
        //    {
        //        "open": "19394.4",
        //        "close": "19379.0",
        //        "high": "19394.4",
        //        "low": "19368.3",
        //        "volume": "167.44",
        //        "time": 1666584000000
        //    }
        //
        // fetchMarkOHLCV
        //
        //    {
        //        "open": "42191.7",
        //        "close": "42189.5",
        //        "high": "42196.5",
        //        "low": "42189.5",
        //        "volume": "0.00",
        //        "openTime": 1706508840000,
        //        "closeTime": 1706508840000
        //    }
        // spot
        //    [
        //        1691402580000,
        //        29093.61,
        //        29093.93,
        //        29087.73,
        //        29093.24,
        //        0.59,
        //        1691402639999,
        //        17221.07
        //    ]
        //
        if (Array.isArray(ohlcv)) {
            return [
                this.safeInteger(ohlcv, 0),
                this.safeNumber(ohlcv, 1),
                this.safeNumber(ohlcv, 2),
                this.safeNumber(ohlcv, 3),
                this.safeNumber(ohlcv, 4),
                this.safeNumber(ohlcv, 5),
            ];
        }
        return [
            this.safeInteger2(ohlcv, 'time', 'closeTime'),
            this.safeNumber(ohlcv, 'open'),
            this.safeNumber(ohlcv, 'high'),
            this.safeNumber(ohlcv, 'low'),
            this.safeNumber(ohlcv, 'close'),
            this.safeNumber(ohlcv, 'volume'),
        ];
    }
    async fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchTrades
         * @description get the list of most recent trades for a particular symbol
         * @see https://bingx-api.github.io/docs/#/spot/market-api.html#Query%20transaction%20records
         * @see https://bingx-api.github.io/docs/#/swapV2/market-api.html#The%20latest%20Trade%20of%20a%20Trading%20Pair
         * @param {string} symbol unified symbol of the market to fetch trades for
         * @param {int} [since] timestamp in ms of the earliest trade to fetch
         * @param {int} [limit] the maximum amount of trades to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = Math.min(limit, 100); // avoid API exception "limit should less than 100"
        }
        let response = undefined;
        let marketType = undefined;
        [marketType, params] = this.handleMarketTypeAndParams('fetchTrades', market, params);
        if (marketType === 'spot') {
            response = await this.spotV1PublicGetMarketTrades(this.extend(request, params));
        }
        else {
            response = await this.swapV2PublicGetQuoteTrades(this.extend(request, params));
        }
        //
        // spot
        //
        //    {
        //        "code": 0,
        //        "data": [
        //            {
        //                "id": 43148253,
        //                "price": 25714.71,
        //                "qty": 1.674571,
        //                "time": 1655085975589,
        //                "buyerMaker": false
        //            }
        //        ]
        //    }
        //
        // swap
        //
        //    {
        //      "code":0,
        //      "msg":"",
        //      "data":[
        //        {
        //          "time": 1672025549368,
        //          "isBuyerMaker": true,
        //          "price": "16885.0",
        //          "qty": "3.3002",
        //          "quoteQty": "55723.87"
        //        },
        //        ...
        //      ]
        //    }
        //
        const trades = this.safeList(response, 'data', []);
        return this.parseTrades(trades, market, since, limit);
    }
    parseTrade(trade, market = undefined) {
        //
        // spot fetchTrades
        //
        //    {
        //        "id": 43148253,
        //        "price": 25714.71,
        //        "qty": 1.674571,
        //        "time": 1655085975589,
        //        "buyerMaker": false
        //    }
        //
        // spot fetchMyTrades
        //
        //     {
        //         "symbol": "LTC-USDT",
        //         "id": 36237072,
        //         "orderId": 1674069326895775744,
        //         "price": "85.891",
        //         "qty": "0.0582",
        //         "quoteQty": "4.9988562000000005",
        //         "commission": -0.00005820000000000001,
        //         "commissionAsset": "LTC",
        //         "time": 1687964205000,
        //         "isBuyer": true,
        //         "isMaker": false
        //     }
        //
        // swap fetchTrades
        //
        //    {
        //        "time": 1672025549368,
        //        "isBuyerMaker": true,
        //        "price": "16885.0",
        //        "qty": "3.3002",
        //        "quoteQty": "55723.87"
        //    }
        //
        // swap fetchMyTrades
        //
        //    {
        //        "volume": "0.1",
        //        "price": "106.75",
        //        "amount": "10.6750",
        //        "commission": "-0.0053",
        //        "currency": "USDT",
        //        "orderId": "1676213270274379776",
        //        "liquidatedPrice": "0.00",
        //        "liquidatedMarginRatio": "0.00",
        //        "filledTime": "2023-07-04T20:56:01.000+0800"
        //    }
        //
        // ws spot
        //
        //    {
        //        "E": 1690214529432,
        //        "T": 1690214529386,
        //        "e": "trade",
        //        "m": true,
        //        "p": "29110.19",
        //        "q": "0.1868",
        //        "s": "BTC-USDT",
        //        "t": "57903921"
        //    }
        //
        // ws linear swap
        //
        //    {
        //        "q": "0.0421",
        //        "p": "29023.5",
        //        "T": 1690221401344,
        //        "m": false,
        //        "s": "BTC-USDT"
        //    }
        //
        // ws inverse swap
        //
        //     {
        //         "e": "trade",
        //         "E": 1722920589665,
        //         "s": "BTC-USD",
        //         "t": "39125001",
        //         "p": "55360.0",
        //         "q": "1",
        //         "T": 1722920589582,
        //         "m": false
        //     }
        //
        // inverse swap fetchMyTrades
        //
        //     {
        //         "orderId": "1817441228670648320",
        //         "symbol": "SOL-USD",
        //         "type": "MARKET",
        //         "side": "BUY",
        //         "positionSide": "LONG",
        //         "tradeId": "97244554",
        //         "volume": "2",
        //         "tradePrice": "182.652",
        //         "amount": "20.00000000",
        //         "realizedPnl": "0.00000000",
        //         "commission": "-0.00005475",
        //         "currency": "SOL",
        //         "buyer": true,
        //         "maker": false,
        //         "tradeTime": 1722146730000
        //     }
        //
        let time = this.safeIntegerN(trade, ['time', 'filledTm', 'T', 'tradeTime']);
        const datetimeId = this.safeString(trade, 'filledTm');
        if (datetimeId !== undefined) {
            time = this.parse8601(datetimeId);
        }
        if (time === 0) {
            time = undefined;
        }
        const cost = this.safeString(trade, 'quoteQty');
        // const type = (cost === undefined) ? 'spot' : 'swap'; this is not reliable
        const currencyId = this.safeStringN(trade, ['currency', 'N', 'commissionAsset']);
        const currencyCode = this.safeCurrencyCode(currencyId);
        const m = this.safeBool(trade, 'm');
        const marketId = this.safeString2(trade, 's', 'symbol');
        const isBuyerMaker = this.safeBoolN(trade, ['buyerMaker', 'isBuyerMaker', 'maker']);
        let takeOrMaker = undefined;
        if ((isBuyerMaker !== undefined) || (m !== undefined)) {
            takeOrMaker = (isBuyerMaker || m) ? 'maker' : 'taker';
        }
        let side = this.safeStringLower2(trade, 'side', 'S');
        if (side === undefined) {
            if ((isBuyerMaker !== undefined) || (m !== undefined)) {
                side = (isBuyerMaker || m) ? 'sell' : 'buy';
                takeOrMaker = 'taker';
            }
        }
        const isBuyer = this.safeBool(trade, 'isBuyer');
        if (isBuyer !== undefined) {
            side = isBuyer ? 'buy' : 'sell';
        }
        const isMaker = this.safeBool(trade, 'isMaker');
        if (isMaker !== undefined) {
            takeOrMaker = isMaker ? 'maker' : 'taker';
        }
        let amount = this.safeStringN(trade, ['qty', 'amount', 'q']);
        if ((market !== undefined) && market['swap'] && ('volume' in trade)) {
            // private trade returns num of contracts instead of base currency (as the order-related methods do)
            const contractSize = this.safeString(market['info'], 'tradeMinQuantity');
            const volume = this.safeString(trade, 'volume');
            amount = Precise["default"].stringMul(volume, contractSize);
        }
        return this.safeTrade({
            'id': this.safeStringN(trade, ['id', 't']),
            'info': trade,
            'timestamp': time,
            'datetime': this.iso8601(time),
            'symbol': this.safeSymbol(marketId, market, '-'),
            'order': this.safeString2(trade, 'orderId', 'i'),
            'type': this.safeStringLower(trade, 'o'),
            'side': this.parseOrderSide(side),
            'takerOrMaker': takeOrMaker,
            'price': this.safeStringN(trade, ['price', 'p', 'tradePrice']),
            'amount': amount,
            'cost': cost,
            'fee': {
                'cost': this.parseNumber(Precise["default"].stringAbs(this.safeString2(trade, 'commission', 'n'))),
                'currency': currencyCode,
            },
        }, market);
    }
    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchOrderBook
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @see https://bingx-api.github.io/docs/#/spot/market-api.html#Query%20depth%20information
         * @see https://bingx-api.github.io/docs/#/swapV2/market-api.html#Get%20Market%20Depth
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/market-api.html#Query%20Depth%20Data
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int} [limit] the maximum amount of order book entries to return
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        let response = undefined;
        let marketType = undefined;
        [marketType, params] = this.handleMarketTypeAndParams('fetchOrderBook', market, params);
        if (marketType === 'spot') {
            response = await this.spotV1PublicGetMarketDepth(this.extend(request, params));
        }
        else {
            if (market['inverse']) {
                response = await this.cswapV1PublicGetMarketDepth(this.extend(request, params));
            }
            else {
                response = await this.swapV2PublicGetQuoteDepth(this.extend(request, params));
            }
        }
        //
        // spot
        //
        //     {
        //         "code": 0,
        //         "data": {
        //           "bids": [
        //             [
        //               "26324.73",
        //               "0.37655"
        //             ],
        //             [
        //               "26324.71",
        //               "0.31888"
        //             ],
        //         ],
        //         "asks": [
        //             [
        //               "26340.30",
        //               "6.45221"
        //             ],
        //             [
        //               "26340.15",
        //               "6.73261"
        //             ],
        //         ]}
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "data": {
        //           "T": 1683914263304,
        //           "bids": [
        //             [
        //               "26300.90000000",
        //               "30408.00000000"
        //             ],
        //             [
        //               "26300.80000000",
        //               "50906.00000000"
        //             ],
        //         ],
        //         "asks": [
        //             [
        //               "26301.00000000",
        //               "43616.00000000"
        //             ],
        //             [
        //               "26301.10000000",
        //               "49402.00000000"
        //             ],
        //         ]}
        //     }
        //
        const orderbook = this.safeDict(response, 'data', {});
        const timestamp = this.safeInteger2(orderbook, 'T', 'ts');
        return this.parseOrderBook(orderbook, market['symbol'], timestamp, 'bids', 'asks', 0, 1);
    }
    async fetchFundingRate(symbol, params = {}) {
        /**
         * @method
         * @name bingx#fetchFundingRate
         * @description fetch the current funding rate
         * @see https://bingx-api.github.io/docs/#/swapV2/market-api.html#Current%20Funding%20Rate
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/market-api.html#Price%20&%20Current%20Funding%20Rate
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [funding rate structure]{@link https://docs.ccxt.com/#/?id=funding-rate-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        let response = undefined;
        if (market['inverse']) {
            response = await this.cswapV1PublicGetMarketPremiumIndex(this.extend(request, params));
        }
        else {
            response = await this.swapV2PublicGetQuotePremiumIndex(this.extend(request, params));
        }
        //
        //    {
        //        "code":0,
        //        "msg":"",
        //        "data":[
        //          {
        //            "symbol": "BTC-USDT",
        //            "markPrice": "16884.5",
        //            "indexPrice": "16886.9",
        //            "lastFundingRate": "0.0001",
        //            "nextFundingTime": 1672041600000
        //          },
        //          ...
        //        ]
        //    }
        //
        const data = this.safeList(response, 'data', []);
        return this.parseFundingRate(data, market);
    }
    async fetchFundingRates(symbols = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchFundingRates
         * @description fetch the current funding rate for multiple symbols
         * @see https://bingx-api.github.io/docs/#/swapV2/market-api.html#Current%20Funding%20Rate
         * @param {string[]} [symbols] list of unified market symbols
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-structure}
         */
        await this.loadMarkets();
        symbols = this.marketSymbols(symbols, 'swap', true);
        const response = await this.swapV2PublicGetQuotePremiumIndex(this.extend(params));
        const data = this.safeList(response, 'data', []);
        const result = this.parseFundingRates(data);
        return this.filterByArray(result, 'symbol', symbols);
    }
    parseFundingRate(contract, market = undefined) {
        //
        //     {
        //         "symbol": "BTC-USDT",
        //         "markPrice": "16884.5",
        //         "indexPrice": "16886.9",
        //         "lastFundingRate": "0.0001",
        //         "nextFundingTime": 1672041600000
        //     }
        //
        const marketId = this.safeString(contract, 'symbol');
        const nextFundingTimestamp = this.safeInteger(contract, 'nextFundingTime');
        return {
            'info': contract,
            'symbol': this.safeSymbol(marketId, market, '-', 'swap'),
            'markPrice': this.safeNumber(contract, 'markPrice'),
            'indexPrice': this.safeNumber(contract, 'indexPrice'),
            'interestRate': undefined,
            'estimatedSettlePrice': undefined,
            'timestamp': undefined,
            'datetime': undefined,
            'fundingRate': this.safeNumber(contract, 'lastFundingRate'),
            'fundingTimestamp': undefined,
            'fundingDatetime': undefined,
            'nextFundingRate': undefined,
            'nextFundingTimestamp': nextFundingTimestamp,
            'nextFundingDatetime': this.iso8601(nextFundingTimestamp),
            'previousFundingRate': undefined,
            'previousFundingTimestamp': undefined,
            'previousFundingDatetime': undefined,
            'interval': undefined,
        };
    }
    async fetchFundingRateHistory(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchFundingRateHistory
         * @description fetches historical funding rate prices
         * @see https://bingx-api.github.io/docs/#/swapV2/market-api.html#Funding%20Rate%20History
         * @param {string} symbol unified symbol of the market to fetch the funding rate history for
         * @param {int} [since] timestamp in ms of the earliest funding rate to fetch
         * @param {int} [limit] the maximum amount of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure} to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] timestamp in ms of the latest funding rate to fetch
         * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
         * @returns {object[]} a list of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchFundingRateHistory() requires a symbol argument');
        }
        await this.loadMarkets();
        let paginate = false;
        [paginate, params] = this.handleOptionAndParams(params, 'fetchFundingRateHistory', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDeterministic('fetchFundingRateHistory', symbol, since, limit, '8h', params);
        }
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const until = this.safeInteger2(params, 'until', 'startTime');
        if (until !== undefined) {
            params = this.omit(params, ['until']);
            request['startTime'] = until;
        }
        const response = await this.swapV2PublicGetQuoteFundingRate(this.extend(request, params));
        //
        //    {
        //        "code":0,
        //        "msg":"",
        //        "data":[
        //          {
        //            "symbol": "BTC-USDT",
        //            "fundingRate": "0.0001",
        //            "fundingTime": 1585684800000
        //          },
        //          ...
        //        ]
        //    }
        //
        const data = this.safeList(response, 'data', []);
        const rates = [];
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            const marketId = this.safeString(entry, 'symbol');
            const symbolInner = this.safeSymbol(marketId, market, '-', 'swap');
            const timestamp = this.safeInteger(entry, 'fundingTime');
            rates.push({
                'info': entry,
                'symbol': symbolInner,
                'fundingRate': this.safeNumber(entry, 'fundingRate'),
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
            });
        }
        const sorted = this.sortBy(rates, 'timestamp');
        return this.filterBySymbolSinceLimit(sorted, market['symbol'], since, limit);
    }
    async fetchOpenInterest(symbol, params = {}) {
        /**
         * @method
         * @name bingx#fetchOpenInterest
         * @description retrieves the open interest of a trading pair
         * @see https://bingx-api.github.io/docs/#/swapV2/market-api.html#Get%20Swap%20Open%20Positions
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/market-api.html#Get%20Swap%20Open%20Positions
         * @param {string} symbol unified CCXT market symbol
         * @param {object} [params] exchange specific parameters
         * @returns {object} an open interest structure{@link https://docs.ccxt.com/#/?id=open-interest-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        let response = undefined;
        if (market['inverse']) {
            response = await this.cswapV1PublicGetMarketOpenInterest(this.extend(request, params));
        }
        else {
            response = await this.swapV2PublicGetQuoteOpenInterest(this.extend(request, params));
        }
        //
        // linear swap
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "data": {
        //           "openInterest": "3289641547.10",
        //           "symbol": "BTC-USDT",
        //           "time": 1672026617364
        //         }
        //     }
        //
        // inverse swap
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "timestamp": 1720328247986,
        //         "data": [
        //             {
        //                 "symbol": "BTC-USD",
        //                 "openInterest": "749.1160",
        //                 "timestamp": 1720310400000
        //             }
        //         ]
        //     }
        //
        let result = {};
        if (market['inverse']) {
            const data = this.safeList(response, 'data', []);
            result = this.safeDict(data, 0, {});
        }
        else {
            result = this.safeDict(response, 'data', {});
        }
        return this.parseOpenInterest(result, market);
    }
    parseOpenInterest(interest, market = undefined) {
        //
        // linear swap
        //
        //     {
        //         "openInterest": "3289641547.10",
        //         "symbol": "BTC-USDT",
        //         "time": 1672026617364
        //     }
        //
        // inverse swap
        //
        //     {
        //         "symbol": "BTC-USD",
        //         "openInterest": "749.1160",
        //         "timestamp": 1720310400000
        //     }
        //
        const timestamp = this.safeInteger2(interest, 'time', 'timestamp');
        const id = this.safeString(interest, 'symbol');
        const symbol = this.safeSymbol(id, market, '-', 'swap');
        const openInterest = this.safeNumber(interest, 'openInterest');
        return this.safeOpenInterest({
            'symbol': symbol,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'openInterestAmount': undefined,
            'openInterestValue': openInterest,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'info': interest,
        }, market);
    }
    async fetchTicker(symbol, params = {}) {
        /**
         * @method
         * @name bingx#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/market-api.html#Get%20Ticker
         * @see https://bingx-api.github.io/docs/#/en-us/spot/market-api.html#24-hour%20price%20changes
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/market-api.html#Query%2024-Hour%20Price%20Change
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        let response = undefined;
        if (market['spot']) {
            response = await this.spotV1PublicGetTicker24hr(this.extend(request, params));
        }
        else {
            if (market['inverse']) {
                response = await this.cswapV1PublicGetMarketTicker(this.extend(request, params));
            }
            else {
                response = await this.swapV2PublicGetQuoteTicker(this.extend(request, params));
            }
        }
        //
        // spot and swap
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "timestamp": 1720647285296,
        //         "data": [
        //             {
        //                 "symbol": "SOL-USD",
        //                 "priceChange": "-2.418",
        //                 "priceChangePercent": "-1.6900%",
        //                 "lastPrice": "140.574",
        //                 "lastQty": "1",
        //                 "highPrice": "146.190",
        //                 "lowPrice": "138.586",
        //                 "volume": "1464648.00",
        //                 "quoteVolume": "102928.12",
        //                 "openPrice": "142.994",
        //                 "closeTime": "1720647284976",
        //                 "bidPrice": "140.573",
        //                 "bidQty": "372",
        //                 "askPrice": "140.577",
        //                 "askQty": "58"
        //             }
        //         ]
        //     }
        //
        const data = this.safeList(response, 'data');
        if (data !== undefined) {
            const first = this.safeDict(data, 0, {});
            return this.parseTicker(first, market);
        }
        const dataDict = this.safeDict(response, 'data', {});
        return this.parseTicker(dataDict, market);
    }
    async fetchTickers(symbols = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchTickers
         * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/market-api.html#Get%20Ticker
         * @see https://bingx-api.github.io/docs/#/en-us/spot/market-api.html#24-hour%20price%20changes
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/market-api.html#Query%2024-Hour%20Price%20Change
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets();
        let market = undefined;
        if (symbols !== undefined) {
            symbols = this.marketSymbols(symbols);
            const firstSymbol = this.safeString(symbols, 0);
            if (firstSymbol !== undefined) {
                market = this.market(firstSymbol);
            }
        }
        let type = undefined;
        [type, params] = this.handleMarketTypeAndParams('fetchTickers', market, params);
        let subType = undefined;
        [subType, params] = this.handleSubTypeAndParams('fetchTickers', market, params);
        let response = undefined;
        if (type === 'spot') {
            response = await this.spotV1PublicGetTicker24hr(params);
        }
        else {
            if (subType === 'inverse') {
                response = await this.cswapV1PublicGetMarketTicker(params);
            }
            else {
                response = await this.swapV2PublicGetQuoteTicker(params);
            }
        }
        //
        // spot and swap
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "timestamp": 1720647285296,
        //         "data": [
        //             {
        //                 "symbol": "SOL-USD",
        //                 "priceChange": "-2.418",
        //                 "priceChangePercent": "-1.6900%",
        //                 "lastPrice": "140.574",
        //                 "lastQty": "1",
        //                 "highPrice": "146.190",
        //                 "lowPrice": "138.586",
        //                 "volume": "1464648.00",
        //                 "quoteVolume": "102928.12",
        //                 "openPrice": "142.994",
        //                 "closeTime": "1720647284976",
        //                 "bidPrice": "140.573",
        //                 "bidQty": "372",
        //                 "askPrice": "140.577",
        //                 "askQty": "58"
        //             },
        //             ...
        //         ]
        //     }
        //
        const tickers = this.safeList(response, 'data');
        return this.parseTickers(tickers, symbols);
    }
    parseTicker(ticker, market = undefined) {
        //
        // spot
        //    {
        //        "symbol": "BTC-USDT",
        //        "openPrice": "26032.08",
        //        "highPrice": "26178.86",
        //        "lowPrice": "25968.18",
        //        "lastPrice": "26113.60",
        //        "volume": "1161.79",
        //        "quoteVolume": "30288466.44",
        //        "openTime": "1693081020762",
        //        "closeTime": "1693167420762",
        //  added 2023-11-10:
        //        "bidPrice": 16726.0,
        //        "bidQty": 0.05,
        //        "askPrice": 16726.0,
        //        "askQty": 0.05,
        //    }
        // swap
        //
        //    {
        //        "symbol": "BTC-USDT",
        //        "priceChange": "52.5",
        //        "priceChangePercent": "0.31%", // they started to add the percent sign in value
        //        "lastPrice": "16880.5",
        //        "lastQty": "2.2238",          // only present in swap!
        //        "highPrice": "16897.5",
        //        "lowPrice": "16726.0",
        //        "volume": "245870.1692",
        //        "quoteVolume": "4151395117.73",
        //        "openPrice": "16832.0",
        //        "openTime": 1672026667803,
        //        "closeTime": 1672026648425,
        //  added 2023-11-10:
        //        "bidPrice": 16726.0,
        //        "bidQty": 0.05,
        //        "askPrice": 16726.0,
        //        "askQty": 0.05,
        //    }
        //
        const marketId = this.safeString(ticker, 'symbol');
        const lastQty = this.safeString(ticker, 'lastQty');
        // in spot markets, lastQty is not present
        // it's (bad, but) the only way we can check the tickers origin
        const type = (lastQty === undefined) ? 'spot' : 'swap';
        market = this.safeMarket(marketId, market, undefined, type);
        const symbol = market['symbol'];
        const open = this.safeString(ticker, 'openPrice');
        const high = this.safeString(ticker, 'highPrice');
        const low = this.safeString(ticker, 'lowPrice');
        const close = this.safeString(ticker, 'lastPrice');
        const quoteVolume = this.safeString(ticker, 'quoteVolume');
        const baseVolume = this.safeString(ticker, 'volume');
        let percentage = this.safeString(ticker, 'priceChangePercent');
        if (percentage !== undefined) {
            percentage = percentage.replace('%', '');
        }
        const change = this.safeString(ticker, 'priceChange');
        let ts = this.safeInteger(ticker, 'closeTime');
        if (ts === 0) {
            ts = undefined;
        }
        const datetime = this.iso8601(ts);
        const bid = this.safeString(ticker, 'bidPrice');
        const bidVolume = this.safeString(ticker, 'bidQty');
        const ask = this.safeString(ticker, 'askPrice');
        const askVolume = this.safeString(ticker, 'askQty');
        return this.safeTicker({
            'symbol': symbol,
            'timestamp': ts,
            'datetime': datetime,
            'high': high,
            'low': low,
            'bid': bid,
            'bidVolume': bidVolume,
            'ask': ask,
            'askVolume': askVolume,
            'vwap': undefined,
            'open': open,
            'close': close,
            'last': undefined,
            'previousClose': undefined,
            'change': change,
            'percentage': percentage,
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market);
    }
    async fetchBalance(params = {}) {
        /**
         * @method
         * @name bingx#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @see https://bingx-api.github.io/docs/#/spot/trade-api.html#Query%20Assets
         * @see https://bingx-api.github.io/docs/#/swapV2/account-api.html#Get%20Perpetual%20Swap%20Account%20Asset%20Information
         * @see https://bingx-api.github.io/docs/#/standard/contract-interface.html#Query%20standard%20contract%20balance
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Query%20Account%20Assets
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {boolean} [params.standard] whether to fetch standard contract balances
         * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
         */
        await this.loadMarkets();
        let response = undefined;
        let standard = undefined;
        [standard, params] = this.handleOptionAndParams(params, 'fetchBalance', 'standard', false);
        let subType = undefined;
        [subType, params] = this.handleSubTypeAndParams('fetchBalance', undefined, params);
        const [marketType, marketTypeQuery] = this.handleMarketTypeAndParams('fetchBalance', undefined, params);
        if (standard) {
            response = await this.contractV1PrivateGetBalance(marketTypeQuery);
            //
            //     {
            //         "code": 0,
            //         "timestamp": 1721192833454,
            //         "data": [
            //             {
            //                 "asset": "USDT",
            //                 "balance": "4.72644300000000000000",
            //                 "crossWalletBalance": "4.72644300000000000000",
            //                 "crossUnPnl": "0",
            //                 "availableBalance": "4.72644300000000000000",
            //                 "maxWithdrawAmount": "4.72644300000000000000",
            //                 "marginAvailable": false,
            //                 "updateTime": 1721192833443
            //             },
            //         ]
            //     }
            //
        }
        else if (marketType === 'spot') {
            response = await this.spotV1PrivateGetAccountBalance(marketTypeQuery);
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "debugMsg": "",
            //         "data": {
            //             "balances": [
            //                 {
            //                     "asset": "USDT",
            //                     "free": "45.733046995800514",
            //                     "locked": "0"
            //                 },
            //             ]
            //         }
            //     }
            //
        }
        else {
            if (subType === 'inverse') {
                response = await this.cswapV1PrivateGetUserBalance(marketTypeQuery);
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "timestamp": 1721191833813,
                //         "data": [
                //             {
                //                 "asset": "SOL",
                //                 "balance": "0.35707951",
                //                 "equity": "0.35791051",
                //                 "unrealizedProfit": "0.00083099",
                //                 "availableMargin": "0.35160653",
                //                 "usedMargin": "0.00630397",
                //                 "freezedMargin": "0",
                //                 "shortUid": "12851936"
                //             }
                //         ]
                //     }
                //
            }
            else {
                response = await this.swapV2PrivateGetUserBalance(marketTypeQuery);
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "data": {
                //             "balance": {
                //                 "userId": "1177064765068660742",
                //                 "asset": "USDT",
                //                 "balance": "51.5198",
                //                 "equity": "50.5349",
                //                 "unrealizedProfit": "-0.9849",
                //                 "realisedProfit": "-0.2134",
                //                 "availableMargin": "49.1428",
                //                 "usedMargin": "1.3922",
                //                 "freezedMargin": "0.0000",
                //                 "shortUid": "12851936"
                //             }
                //         }
                //     }
                //
            }
        }
        return this.parseBalance(response);
    }
    parseBalance(response) {
        //
        // standard
        //
        //     {
        //         "code": 0,
        //         "timestamp": 1721192833454,
        //         "data": [
        //             {
        //                 "asset": "USDT",
        //                 "balance": "4.72644300000000000000",
        //                 "crossWalletBalance": "4.72644300000000000000",
        //                 "crossUnPnl": "0",
        //                 "availableBalance": "4.72644300000000000000",
        //                 "maxWithdrawAmount": "4.72644300000000000000",
        //                 "marginAvailable": false,
        //                 "updateTime": 1721192833443
        //             },
        //         ]
        //     }
        //
        // spot
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "debugMsg": "",
        //         "data": {
        //             "balances": [
        //                 {
        //                     "asset": "USDT",
        //                     "free": "45.733046995800514",
        //                     "locked": "0"
        //                 },
        //             ]
        //         }
        //     }
        //
        // inverse swap
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "timestamp": 1721191833813,
        //         "data": [
        //             {
        //                 "asset": "SOL",
        //                 "balance": "0.35707951",
        //                 "equity": "0.35791051",
        //                 "unrealizedProfit": "0.00083099",
        //                 "availableMargin": "0.35160653",
        //                 "usedMargin": "0.00630397",
        //                 "freezedMargin": "0",
        //                 "shortUid": "12851936"
        //             }
        //         ]
        //     }
        //
        // linear swap
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "data": {
        //             "balance": {
        //                 "userId": "1177064765068660742",
        //                 "asset": "USDT",
        //                 "balance": "51.5198",
        //                 "equity": "50.5349",
        //                 "unrealizedProfit": "-0.9849",
        //                 "realisedProfit": "-0.2134",
        //                 "availableMargin": "49.1428",
        //                 "usedMargin": "1.3922",
        //                 "freezedMargin": "0.0000",
        //                 "shortUid": "12851936"
        //             }
        //         }
        //     }
        //
        const result = { 'info': response };
        const standardAndInverseBalances = this.safeList(response, 'data');
        const firstStandardOrInverse = this.safeDict(standardAndInverseBalances, 0);
        const isStandardOrInverse = firstStandardOrInverse !== undefined;
        const spotData = this.safeDict(response, 'data', {});
        const spotBalances = this.safeList(spotData, 'balances');
        const firstSpot = this.safeDict(spotBalances, 0);
        const isSpot = firstSpot !== undefined;
        if (isStandardOrInverse) {
            for (let i = 0; i < standardAndInverseBalances.length; i++) {
                const balance = standardAndInverseBalances[i];
                const currencyId = this.safeString(balance, 'asset');
                const code = this.safeCurrencyCode(currencyId);
                const account = this.account();
                account['free'] = this.safeString2(balance, 'availableMargin', 'availableBalance');
                account['used'] = this.safeString(balance, 'usedMargin');
                account['total'] = this.safeString(balance, 'maxWithdrawAmount');
                result[code] = account;
            }
        }
        else if (isSpot) {
            for (let i = 0; i < spotBalances.length; i++) {
                const balance = spotBalances[i];
                const currencyId = this.safeString(balance, 'asset');
                const code = this.safeCurrencyCode(currencyId);
                const account = this.account();
                account['free'] = this.safeString(balance, 'free');
                account['used'] = this.safeString(balance, 'locked');
                result[code] = account;
            }
        }
        else {
            const linearSwapData = this.safeDict(response, 'data', {});
            const linearSwapBalance = this.safeDict(linearSwapData, 'balance');
            const currencyId = this.safeString(linearSwapBalance, 'asset');
            const code = this.safeCurrencyCode(currencyId);
            const account = this.account();
            account['free'] = this.safeString(linearSwapBalance, 'availableMargin');
            account['used'] = this.safeString(linearSwapBalance, 'usedMargin');
            result[code] = account;
        }
        return this.safeBalance(result);
    }
    async fetchPositions(symbols = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchPositions
         * @description fetch all open positions
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/account-api.html#Query%20position%20data
         * @see https://bingx-api.github.io/docs/#/en-us/standard/contract-interface.html#position
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Query%20warehouse
         * @param {string[]|undefined} symbols list of unified market symbols
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {boolean} [params.standard] whether to fetch standard contract positions
         * @returns {object[]} a list of [position structures]{@link https://docs.ccxt.com/#/?id=position-structure}
         */
        await this.loadMarkets();
        symbols = this.marketSymbols(symbols);
        let standard = undefined;
        [standard, params] = this.handleOptionAndParams(params, 'fetchPositions', 'standard', false);
        let response = undefined;
        if (standard) {
            response = await this.contractV1PrivateGetAllPosition(params);
        }
        else {
            let market = undefined;
            if (symbols !== undefined) {
                symbols = this.marketSymbols(symbols);
                const firstSymbol = this.safeString(symbols, 0);
                if (firstSymbol !== undefined) {
                    market = this.market(firstSymbol);
                }
            }
            let subType = undefined;
            [subType, params] = this.handleSubTypeAndParams('fetchPositions', market, params);
            if (subType === 'inverse') {
                response = await this.cswapV1PrivateGetUserPositions(params);
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "timestamp": 0,
                //         "data": [
                //             {
                //                 "symbol": "SOL-USD",
                //                 "positionId": "1813080351385337856",
                //                 "positionSide": "LONG",
                //                 "isolated": false,
                //                 "positionAmt": "1",
                //                 "availableAmt": "1",
                //                 "unrealizedProfit": "-0.00009074",
                //                 "initialMargin": "0.00630398",
                //                 "liquidationPrice": 23.968303426677032,
                //                 "avgPrice": "158.63",
                //                 "leverage": 10,
                //                 "markPrice": "158.402",
                //                 "riskRate": "0.00123783",
                //                 "maxMarginReduction": "0",
                //                 "updateTime": 1721107015848
                //             }
                //         ]
                //     }
                //
            }
            else {
                response = await this.swapV2PrivateGetUserPositions(params);
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "data": [
                //             {
                //                 "positionId": "1792480725958881280",
                //                 "symbol": "LTC-USDT",
                //                 "currency": "USDT",
                //                 "positionAmt": "0.1",
                //                 "availableAmt": "0.1",
                //                 "positionSide": "LONG",
                //                 "isolated": false,
                //                 "avgPrice": "83.53",
                //                 "initialMargin": "1.3922",
                //                 "margin": "0.3528",
                //                 "leverage": 6,
                //                 "unrealizedProfit": "-1.0393",
                //                 "realisedProfit": "-0.2119",
                //                 "liquidationPrice": 0,
                //                 "pnlRatio": "-0.7465",
                //                 "maxMarginReduction": "0.0000",
                //                 "riskRate": "0.0008",
                //                 "markPrice": "73.14",
                //                 "positionValue": "7.3136",
                //                 "onlyOnePosition": true,
                //                 "updateTime": 1721088016688
                //             }
                //         ]
                //     }
                //
            }
        }
        const positions = this.safeList(response, 'data', []);
        return this.parsePositions(positions, symbols);
    }
    async fetchPosition(symbol, params = {}) {
        /**
         * @method
         * @name bingx#fetchPosition
         * @description fetch data on a single open contract trade position
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/account-api.html#Query%20position%20data
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Query%20warehouse
         * @param {string} symbol unified market symbol of the market the position is held in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        if (!market['swap']) {
            throw new errors.BadRequest(this.id + ' fetchPosition() supports swap markets only');
        }
        const request = {
            'symbol': market['id'],
        };
        let response = undefined;
        if (market['inverse']) {
            response = await this.cswapV1PrivateGetUserPositions(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "timestamp": 0,
            //         "data": [
            //             {
            //                 "symbol": "SOL-USD",
            //                 "positionId": "1813080351385337856",
            //                 "positionSide": "LONG",
            //                 "isolated": false,
            //                 "positionAmt": "1",
            //                 "availableAmt": "1",
            //                 "unrealizedProfit": "-0.00009074",
            //                 "initialMargin": "0.00630398",
            //                 "liquidationPrice": 23.968303426677032,
            //                 "avgPrice": "158.63",
            //                 "leverage": 10,
            //                 "markPrice": "158.402",
            //                 "riskRate": "0.00123783",
            //                 "maxMarginReduction": "0",
            //                 "updateTime": 1721107015848
            //             }
            //         ]
            //     }
            //
        }
        else {
            response = await this.swapV2PrivateGetUserPositions(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "data": [
            //             {
            //                 "positionId": "1792480725958881280",
            //                 "symbol": "LTC-USDT",
            //                 "currency": "USDT",
            //                 "positionAmt": "0.1",
            //                 "availableAmt": "0.1",
            //                 "positionSide": "LONG",
            //                 "isolated": false,
            //                 "avgPrice": "83.53",
            //                 "initialMargin": "1.3922",
            //                 "margin": "0.3528",
            //                 "leverage": 6,
            //                 "unrealizedProfit": "-1.0393",
            //                 "realisedProfit": "-0.2119",
            //                 "liquidationPrice": 0,
            //                 "pnlRatio": "-0.7465",
            //                 "maxMarginReduction": "0.0000",
            //                 "riskRate": "0.0008",
            //                 "markPrice": "73.14",
            //                 "positionValue": "7.3136",
            //                 "onlyOnePosition": true,
            //                 "updateTime": 1721088016688
            //             }
            //         ]
            //     }
            //
        }
        const data = this.safeList(response, 'data', []);
        const first = this.safeDict(data, 0, {});
        return this.parsePosition(first, market);
    }
    parsePosition(position, market = undefined) {
        //
        // inverse swap
        //
        //     {
        //         "symbol": "SOL-USD",
        //         "positionId": "1813080351385337856",
        //         "positionSide": "LONG",
        //         "isolated": false,
        //         "positionAmt": "1",
        //         "availableAmt": "1",
        //         "unrealizedProfit": "-0.00009074",
        //         "initialMargin": "0.00630398",
        //         "liquidationPrice": 23.968303426677032,
        //         "avgPrice": "158.63",
        //         "leverage": 10,
        //         "markPrice": "158.402",
        //         "riskRate": "0.00123783",
        //         "maxMarginReduction": "0",
        //         "updateTime": 1721107015848
        //     }
        //
        // linear swap
        //
        //     {
        //         "positionId": "1792480725958881280",
        //         "symbol": "LTC-USDT",
        //         "currency": "USDT",
        //         "positionAmt": "0.1",
        //         "availableAmt": "0.1",
        //         "positionSide": "LONG",
        //         "isolated": false,
        //         "avgPrice": "83.53",
        //         "initialMargin": "1.3922",
        //         "margin": "0.3528",
        //         "leverage": 6,
        //         "unrealizedProfit": "-1.0393",
        //         "realisedProfit": "-0.2119",
        //         "liquidationPrice": 0,
        //         "pnlRatio": "-0.7465",
        //         "maxMarginReduction": "0.0000",
        //         "riskRate": "0.0008",
        //         "markPrice": "73.14",
        //         "positionValue": "7.3136",
        //         "onlyOnePosition": true,
        //         "updateTime": 1721088016688
        //     }
        //
        // standard position
        //
        //     {
        //         "currentPrice": "82.91",
        //         "symbol": "LTC/USDT",
        //         "initialMargin": "5.00000000000000000000",
        //         "unrealizedProfit": "-0.26464500",
        //         "leverage": "20.000000000",
        //         "isolated": true,
        //         "entryPrice": "83.13",
        //         "positionSide": "LONG",
        //         "positionAmt": "1.20365912",
        //     }
        //
        let marketId = this.safeString(position, 'symbol', '');
        marketId = marketId.replace('/', '-'); // standard return different format
        const isolated = this.safeBool(position, 'isolated');
        let marginMode = undefined;
        if (isolated !== undefined) {
            marginMode = isolated ? 'isolated' : 'cross';
        }
        return this.safePosition({
            'info': position,
            'id': this.safeString(position, 'positionId'),
            'symbol': this.safeSymbol(marketId, market, '-', 'swap'),
            'notional': this.safeNumber(position, 'positionValue'),
            'marginMode': marginMode,
            'liquidationPrice': undefined,
            'entryPrice': this.safeNumber2(position, 'avgPrice', 'entryPrice'),
            'unrealizedPnl': this.safeNumber(position, 'unrealizedProfit'),
            'realizedPnl': this.safeNumber(position, 'realisedProfit'),
            'percentage': undefined,
            'contracts': this.safeNumber(position, 'positionAmt'),
            'contractSize': undefined,
            'markPrice': this.safeNumber(position, 'markPrice'),
            'lastPrice': undefined,
            'side': this.safeStringLower(position, 'positionSide'),
            'hedged': undefined,
            'timestamp': undefined,
            'datetime': undefined,
            'lastUpdateTimestamp': this.safeInteger(position, 'updateTime'),
            'maintenanceMargin': undefined,
            'maintenanceMarginPercentage': undefined,
            'collateral': undefined,
            'initialMargin': this.safeNumber(position, 'initialMargin'),
            'initialMarginPercentage': undefined,
            'leverage': this.safeNumber(position, 'leverage'),
            'marginRatio': undefined,
            'stopLossPrice': undefined,
            'takeProfitPrice': undefined,
        });
    }
    async createMarketOrderWithCost(symbol, side, cost, params = {}) {
        /**
         * @method
         * @name bingx#createMarketOrderWithCost
         * @description create a market order by providing the symbol, side and cost
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} side 'buy' or 'sell'
         * @param {float} cost how much you want to trade in units of the quote currency
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        params['quoteOrderQty'] = cost;
        return await this.createOrder(symbol, 'market', side, cost, undefined, params);
    }
    async createMarketBuyOrderWithCost(symbol, cost, params = {}) {
        /**
         * @method
         * @name bingx#createMarketBuyOrderWithCost
         * @description create a market buy order by providing the symbol and cost
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {float} cost how much you want to trade in units of the quote currency
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        params['quoteOrderQty'] = cost;
        return await this.createOrder(symbol, 'market', 'buy', cost, undefined, params);
    }
    async createMarketSellOrderWithCost(symbol, cost, params = {}) {
        /**
         * @method
         * @name bingx#createMarketSellOrderWithCost
         * @description create a market sell order by providing the symbol and cost
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {float} cost how much you want to trade in units of the quote currency
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        params['quoteOrderQty'] = cost;
        return await this.createOrder(symbol, 'market', 'sell', cost, undefined, params);
    }
    createOrderRequest(symbol, type, side, amount, price = undefined, params = {}) {
        /**
         * @method
         * @ignore
         * @name bingx#createOrderRequest
         * @description helper function to build request
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much you want to trade in units of the base currency
         * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} request to be sent to the exchange
         */
        const market = this.market(symbol);
        let postOnly = undefined;
        let marketType = undefined;
        [marketType, params] = this.handleMarketTypeAndParams('createOrder', market, params);
        type = type.toUpperCase();
        const request = {
            'symbol': market['id'],
            'type': type,
            'side': side.toUpperCase(),
        };
        const isMarketOrder = type === 'MARKET';
        const isSpot = marketType === 'spot';
        const stopLossPrice = this.safeString(params, 'stopLossPrice');
        const takeProfitPrice = this.safeString(params, 'takeProfitPrice');
        const triggerPrice = this.safeString2(params, 'stopPrice', 'triggerPrice');
        const isTriggerOrder = triggerPrice !== undefined;
        const isStopLossPriceOrder = stopLossPrice !== undefined;
        const isTakeProfitPriceOrder = takeProfitPrice !== undefined;
        const exchangeClientOrderId = isSpot ? 'newClientOrderId' : 'clientOrderID';
        const clientOrderId = this.safeString2(params, exchangeClientOrderId, 'clientOrderId');
        if (clientOrderId !== undefined) {
            request[exchangeClientOrderId] = clientOrderId;
        }
        const timeInForce = this.safeStringUpper(params, 'timeInForce');
        [postOnly, params] = this.handlePostOnly(isMarketOrder, timeInForce === 'PostOnly', params);
        if (postOnly || (timeInForce === 'PostOnly')) {
            request['timeInForce'] = 'PostOnly';
        }
        else if (timeInForce === 'IOC') {
            request['timeInForce'] = 'IOC';
        }
        else if (timeInForce === 'GTC') {
            request['timeInForce'] = 'GTC';
        }
        if (isSpot) {
            const cost = this.safeString2(params, 'cost', 'quoteOrderQty');
            params = this.omit(params, 'cost');
            if (cost !== undefined) {
                request['quoteOrderQty'] = this.parseToNumeric(this.costToPrecision(symbol, cost));
            }
            else {
                if (isMarketOrder && (price !== undefined)) {
                    // keep the legacy behavior, to avoid  breaking the old spot-market-buying code
                    const calculatedCost = Precise["default"].stringMul(this.numberToString(amount), this.numberToString(price));
                    request['quoteOrderQty'] = this.parseToNumeric(calculatedCost);
                }
                else {
                    request['quantity'] = this.parseToNumeric(this.amountToPrecision(symbol, amount));
                }
            }
            if (!isMarketOrder) {
                request['price'] = this.parseToNumeric(this.priceToPrecision(symbol, price));
            }
            if (triggerPrice !== undefined) {
                if (isMarketOrder && this.safeString(request, 'quoteOrderQty') === undefined) {
                    throw new errors.ArgumentsRequired(this.id + ' createOrder() requires the cost parameter (or the amount + price) for placing spot market-buy trigger orders');
                }
                request['stopPrice'] = this.priceToPrecision(symbol, triggerPrice);
                if (type === 'LIMIT') {
                    request['type'] = 'TRIGGER_LIMIT';
                }
                else if (type === 'MARKET') {
                    request['type'] = 'TRIGGER_MARKET';
                }
            }
            else if ((stopLossPrice !== undefined) || (takeProfitPrice !== undefined)) {
                const stopTakePrice = (stopLossPrice !== undefined) ? stopLossPrice : takeProfitPrice;
                if (type === 'LIMIT') {
                    request['type'] = 'TAKE_STOP_LIMIT';
                }
                else if (type === 'MARKET') {
                    request['type'] = 'TAKE_STOP_MARKET';
                }
                request['stopPrice'] = this.parseToNumeric(this.priceToPrecision(symbol, stopTakePrice));
            }
        }
        else {
            if (timeInForce === 'FOK') {
                request['timeInForce'] = 'FOK';
            }
            const trailingAmount = this.safeString(params, 'trailingAmount');
            const trailingPercent = this.safeString2(params, 'trailingPercent', 'priceRate');
            const trailingType = this.safeString(params, 'trailingType', 'TRAILING_STOP_MARKET');
            const isTrailingAmountOrder = trailingAmount !== undefined;
            const isTrailingPercentOrder = trailingPercent !== undefined;
            const isTrailing = isTrailingAmountOrder || isTrailingPercentOrder;
            const stopLoss = this.safeValue(params, 'stopLoss');
            const takeProfit = this.safeValue(params, 'takeProfit');
            const isStopLoss = stopLoss !== undefined;
            const isTakeProfit = takeProfit !== undefined;
            if (((type === 'LIMIT') || (type === 'TRIGGER_LIMIT') || (type === 'STOP') || (type === 'TAKE_PROFIT')) && !isTrailing) {
                request['price'] = this.parseToNumeric(this.priceToPrecision(symbol, price));
            }
            let reduceOnly = this.safeBool(params, 'reduceOnly', false);
            if (isTriggerOrder) {
                request['stopPrice'] = this.parseToNumeric(this.priceToPrecision(symbol, triggerPrice));
                if (isMarketOrder || (type === 'TRIGGER_MARKET')) {
                    request['type'] = 'TRIGGER_MARKET';
                }
                else if ((type === 'LIMIT') || (type === 'TRIGGER_LIMIT')) {
                    request['type'] = 'TRIGGER_LIMIT';
                }
            }
            else if (isStopLossPriceOrder || isTakeProfitPriceOrder) {
                // This can be used to set the stop loss and take profit, but the position needs to be opened first
                reduceOnly = true;
                if (isStopLossPriceOrder) {
                    request['stopPrice'] = this.parseToNumeric(this.priceToPrecision(symbol, stopLossPrice));
                    if (isMarketOrder || (type === 'STOP_MARKET')) {
                        request['type'] = 'STOP_MARKET';
                    }
                    else if ((type === 'LIMIT') || (type === 'STOP')) {
                        request['type'] = 'STOP';
                    }
                }
                else if (isTakeProfitPriceOrder) {
                    request['stopPrice'] = this.parseToNumeric(this.priceToPrecision(symbol, takeProfitPrice));
                    if (isMarketOrder || (type === 'TAKE_PROFIT_MARKET')) {
                        request['type'] = 'TAKE_PROFIT_MARKET';
                    }
                    else if ((type === 'LIMIT') || (type === 'TAKE_PROFIT')) {
                        request['type'] = 'TAKE_PROFIT';
                    }
                }
            }
            else if (isTrailing) {
                request['type'] = trailingType;
                if (isTrailingAmountOrder) {
                    request['price'] = this.parseToNumeric(trailingAmount);
                }
                else if (isTrailingPercentOrder) {
                    const requestTrailingPercent = Precise["default"].stringDiv(trailingPercent, '100');
                    request['priceRate'] = this.parseToNumeric(requestTrailingPercent);
                }
            }
            if (isStopLoss || isTakeProfit) {
                const stringifiedAmount = this.numberToString(amount);
                if (isStopLoss) {
                    const slTriggerPrice = this.safeString2(stopLoss, 'triggerPrice', 'stopPrice', stopLoss);
                    const slWorkingType = this.safeString(stopLoss, 'workingType', 'MARK_PRICE');
                    const slType = this.safeString(stopLoss, 'type', 'STOP_MARKET');
                    const slRequest = {
                        'stopPrice': this.parseToNumeric(this.priceToPrecision(symbol, slTriggerPrice)),
                        'workingType': slWorkingType,
                        'type': slType,
                    };
                    const slPrice = this.safeString(stopLoss, 'price');
                    if (slPrice !== undefined) {
                        slRequest['price'] = this.parseToNumeric(this.priceToPrecision(symbol, slPrice));
                    }
                    const slQuantity = this.safeString(stopLoss, 'quantity', stringifiedAmount);
                    slRequest['quantity'] = this.parseToNumeric(this.amountToPrecision(symbol, slQuantity));
                    request['stopLoss'] = this.json(slRequest);
                }
                if (isTakeProfit) {
                    const tkTriggerPrice = this.safeString2(takeProfit, 'triggerPrice', 'stopPrice', takeProfit);
                    const tkWorkingType = this.safeString(takeProfit, 'workingType', 'MARK_PRICE');
                    const tpType = this.safeString(takeProfit, 'type', 'TAKE_PROFIT_MARKET');
                    const tpRequest = {
                        'stopPrice': this.parseToNumeric(this.priceToPrecision(symbol, tkTriggerPrice)),
                        'workingType': tkWorkingType,
                        'type': tpType,
                    };
                    const slPrice = this.safeString(takeProfit, 'price');
                    if (slPrice !== undefined) {
                        tpRequest['price'] = this.parseToNumeric(this.priceToPrecision(symbol, slPrice));
                    }
                    const tkQuantity = this.safeString(takeProfit, 'quantity', stringifiedAmount);
                    tpRequest['quantity'] = this.parseToNumeric(this.amountToPrecision(symbol, tkQuantity));
                    request['takeProfit'] = this.json(tpRequest);
                }
            }
            let positionSide = undefined;
            const hedged = this.safeBool(params, 'hedged', false);
            if (hedged) {
                params = this.omit(params, 'reduceOnly');
                if (reduceOnly) {
                    positionSide = (side === 'buy') ? 'SHORT' : 'LONG';
                }
                else {
                    positionSide = (side === 'buy') ? 'LONG' : 'SHORT';
                }
            }
            else {
                positionSide = 'BOTH';
            }
            request['positionSide'] = positionSide;
            request['quantity'] = (market['inverse']) ? amount : this.parseToNumeric(this.amountToPrecision(symbol, amount)); // precision not available for inverse contracts
        }
        params = this.omit(params, ['hedged', 'triggerPrice', 'stopLossPrice', 'takeProfitPrice', 'trailingAmount', 'trailingPercent', 'trailingType', 'takeProfit', 'stopLoss', 'clientOrderId']);
        return this.extend(request, params);
    }
    async createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        /**
         * @method
         * @name bingx#createOrder
         * @description create a trade order
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Trade%20order
         * @see https://bingx-api.github.io/docs/#/en-us/spot/trade-api.html#Create%20an%20Order
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Trade%20order
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much you want to trade in units of the base currency
         * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.clientOrderId] a unique id for the order
         * @param {bool} [params.postOnly] true to place a post only order
         * @param {string} [params.timeInForce] spot supports 'PO', 'GTC' and 'IOC', swap supports 'PO', 'GTC', 'IOC' and 'FOK'
         * @param {bool} [params.reduceOnly] *swap only* true or false whether the order is reduce only
         * @param {float} [params.triggerPrice] triggerPrice at which the attached take profit / stop loss order will be triggered
         * @param {float} [params.stopLossPrice] stop loss trigger price
         * @param {float} [params.takeProfitPrice] take profit trigger price
         * @param {float} [params.cost] the quote quantity that can be used as an alternative for the amount
         * @param {float} [params.trailingAmount] *swap only* the quote amount to trail away from the current market price
         * @param {float} [params.trailingPercent] *swap only* the percent to trail away from the current market price
         * @param {object} [params.takeProfit] *takeProfit object in params* containing the triggerPrice at which the attached take profit order will be triggered
         * @param {float} [params.takeProfit.triggerPrice] take profit trigger price
         * @param {object} [params.stopLoss] *stopLoss object in params* containing the triggerPrice at which the attached stop loss order will be triggered
         * @param {float} [params.stopLoss.triggerPrice] stop loss trigger price
         * @param {boolean} [params.test] *swap only* whether to use the test endpoint or not, default is false
         * @param {boolean} [params.hedged] *swap only* whether the order is in hedged mode or one way mode
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const test = this.safeBool(params, 'test', false);
        params = this.omit(params, 'test');
        const request = this.createOrderRequest(symbol, type, side, amount, price, params);
        let response = undefined;
        if (market['swap']) {
            if (test) {
                response = await this.swapV2PrivatePostTradeOrderTest(request);
            }
            else if (market['inverse']) {
                response = await this.cswapV1PrivatePostTradeOrder(request);
            }
            else {
                response = await this.swapV2PrivatePostTradeOrder(request);
            }
        }
        else {
            response = await this.spotV1PrivatePostTradeOrder(request);
        }
        //
        // spot
        //
        //    {
        //        "code": 0,
        //        "msg": "",
        //        "data": {
        //            "symbol": "XRP-USDT",
        //            "orderId": 1514090846268424192,
        //            "transactTime": 1649822362855,
        //            "price": "0.5",
        //            "origQty": "10",
        //            "executedQty": "0",
        //            "cummulativeQuoteQty": "0",
        //            "status": "PENDING",
        //            "type": "LIMIT",
        //            "side": "BUY"
        //        }
        //    }
        //
        // linear swap
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "data": {
        //             "order": {
        //                 "symbol": "BTC-USDT",
        //                 "orderId": 1709036527545438208,
        //                 "side": "BUY",
        //                 "positionSide": "LONG",
        //                 "type": "TRIGGER_LIMIT",
        //                 "clientOrderID": "",
        //                 "workingType": ""
        //             }
        //         }
        //     }
        //
        // inverse swap
        //
        //     {
        //         "orderId": 1809841379603398656,
        //         "symbol": "SOL-USD",
        //         "positionSide": "LONG",
        //         "side": "BUY",
        //         "type": "LIMIT",
        //         "price": 100,
        //         "quantity": 1,
        //         "stopPrice": 0,
        //         "workingType": "",
        //         "timeInForce": ""
        //     }
        //
        if (typeof response === 'string') {
            // broken api engine : order-ids are too long numbers (i.e. 1742930526912864656)
            // and JSON.parse can not handle them in JS, so we have to use .parseJson
            // however, when order has an attached SL/TP, their value types need extra parsing
            response = this.fixStringifiedJsonMembers(response);
            response = this.parseJson(response);
        }
        const data = this.safeDict(response, 'data', {});
        let result = {};
        if (market['swap']) {
            if (market['inverse']) {
                result = response;
            }
            else {
                result = this.safeDict(data, 'order', {});
            }
        }
        else {
            result = data;
        }
        return this.parseOrder(result, market);
    }
    async createOrders(orders, params = {}) {
        /**
         * @method
         * @name bingx#createOrders
         * @description create a list of trade orders
         * @see https://bingx-api.github.io/docs/#/spot/trade-api.html#Batch%20Placing%20Orders
         * @see https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Bulk%20order
         * @param {Array} orders list of orders to create, each object should contain the parameters required by createOrder, namely symbol, type, side, amount, price and params
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        const ordersRequests = [];
        let symbol = undefined;
        for (let i = 0; i < orders.length; i++) {
            const rawOrder = orders[i];
            const marketId = this.safeString(rawOrder, 'symbol');
            if (symbol === undefined) {
                symbol = marketId;
            }
            else {
                if (symbol !== marketId) {
                    throw new errors.BadRequest(this.id + ' createOrders() requires all orders to have the same symbol');
                }
            }
            const type = this.safeString(rawOrder, 'type');
            const side = this.safeString(rawOrder, 'side');
            const amount = this.safeNumber(rawOrder, 'amount');
            const price = this.safeNumber(rawOrder, 'price');
            const orderParams = this.safeDict(rawOrder, 'params', {});
            const orderRequest = this.createOrderRequest(marketId, type, side, amount, price, orderParams);
            ordersRequests.push(orderRequest);
        }
        const market = this.market(symbol);
        const request = {};
        let response = undefined;
        if (market['swap']) {
            request['batchOrders'] = this.json(ordersRequests);
            response = await this.swapV2PrivatePostTradeBatchOrders(request);
        }
        else {
            request['data'] = this.json(ordersRequests);
            response = await this.spotV1PrivatePostTradeBatchOrders(request);
        }
        //
        // spot
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "debugMsg": "",
        //         "data": {
        //             "orders": [
        //                 {
        //                     "symbol": "BTC-USDT",
        //                     "orderId": 1720661389564968960,
        //                     "transactTime": 1699072618272,
        //                     "price": "25000",
        //                     "origQty": "0.0002",
        //                     "executedQty": "0",
        //                     "cummulativeQuoteQty": "0",
        //                     "status": "PENDING",
        //                     "type": "LIMIT",
        //                     "side": "BUY"
        //                 },
        //             ]
        //         }
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "data": {
        //             "orders": [
        //                 {
        //                     "symbol": "BTC-USDT",
        //                     "orderId": 1720657081994006528,
        //                     "side": "BUY",
        //                     "positionSide": "LONG",
        //                     "type": "LIMIT",
        //                     "clientOrderID": "",
        //                     "workingType": ""
        //                 },
        //             ]
        //         }
        //     }
        //
        const data = this.safeDict(response, 'data', {});
        const result = this.safeList(data, 'orders', []);
        return this.parseOrders(result, market);
    }
    parseOrderSide(side) {
        const sides = {
            'BUY': 'buy',
            'SELL': 'sell',
            'SHORT': 'sell',
            'LONG': 'buy',
            'ask': 'sell',
            'bid': 'buy',
        };
        return this.safeString(sides, side, side);
    }
    parseOrderType(type) {
        const types = {
            'trigger_market': 'market',
            'trigger_limit': 'limit',
            'stop_limit': 'limit',
            'stop_market': 'market',
            'take_profit_market': 'market',
            'stop': 'limit',
        };
        return this.safeString(types, type, type);
    }
    parseOrder(order, market = undefined) {
        //
        // spot
        // createOrder, createOrders, cancelOrder
        //
        //    {
        //        "symbol": "XRP-USDT",
        //        "orderId": 1514090846268424192,
        //        "transactTime": 1649822362855,
        //        "price": "0.5",
        //        "origQty": "10",
        //        "executedQty": "0",
        //        "cummulativeQuoteQty": "0",
        //        "status": "PENDING",
        //        "type": "LIMIT",
        //        "side": "BUY"
        //    }
        //
        // fetchOrder
        //
        //    {
        //        "symbol": "ETH-USDT",
        //        "orderId": "1660602123001266176",
        //        "price": "1700",
        //        "origQty": "0.003",
        //        "executedQty": "0",
        //        "cummulativeQuoteQty": "0",
        //        "status": "PENDING",
        //        "type": "LIMIT",
        //        "side": "BUY",
        //        "time": "1684753373276",
        //        "updateTime": "1684753373276",
        //        "origQuoteOrderQty": "0",
        //        "fee": "0",
        //        "feeAsset": "ETH"
        //    }
        //
        // fetchOpenOrders, fetchClosedOrders
        //
        //   {
        //       "symbol": "XRP-USDT",
        //       "orderId": 1514073325788200960,
        //       "price": "0.5",
        //       "StopPrice": "0",
        //       "origQty": "20",
        //       "executedQty": "10",
        //       "cummulativeQuoteQty": "5",
        //       "status": "PENDING",
        //       "type": "LIMIT",
        //       "side": "BUY",
        //       "time": 1649818185647,
        //       "updateTime": 1649818185647,
        //       "origQuoteOrderQty": "0"
        //       "fee": "-0.01"
        //   }
        //
        //
        // linear swap
        // createOrder, createOrders
        //
        //    {
        //      "symbol": "BTC-USDT",
        //      "orderId": 1590973236294713344,
        //      "side": "BUY",
        //      "positionSide": "LONG",
        //      "type": "LIMIT"
        //    }
        //
        // inverse swap createOrder
        //
        //     {
        //         "orderId": 1809841379603398656,
        //         "symbol": "SOL-USD",
        //         "positionSide": "LONG",
        //         "side": "BUY",
        //         "type": "LIMIT",
        //         "price": 100,
        //         "quantity": 1,
        //         "stopPrice": 0,
        //         "workingType": "",
        //         "timeInForce": ""
        //     }
        //
        // fetchOrder, fetchOpenOrders, fetchClosedOrders
        //
        //     {
        //         "symbol": "BTC-USDT",
        //         "orderId": 1709036527545438208,
        //         "side": "BUY",
        //         "positionSide": "LONG",
        //         "type": "TRIGGER_LIMIT",
        //         "origQty": "0.0010",
        //         "price": "22000.0",
        //         "executedQty": "0.0000",
        //         "avgPrice": "0.0",
        //         "cumQuote": "",
        //         "stopPrice": "23000.0",
        //         "profit": "",
        //         "commission": "",
        //         "status": "NEW",
        //         "time": 1696301035187,
        //         "updateTime": 1696301035187,
        //         "clientOrderId": "",
        //         "leverage": "",
        //         "takeProfit": "",
        //         "stopLoss": "",
        //         "advanceAttr": 0,
        //         "positionID": 0,
        //         "takeProfitEntrustPrice": 0,
        //         "stopLossEntrustPrice": 0,
        //         "orderType": "",
        //         "workingType": "MARK_PRICE"
        //     }
        // with tp and sl
        //    {
        //        orderId: 1741440894764281900,
        //        symbol: 'LTC-USDT',
        //        positionSide: 'LONG',
        //        side: 'BUY',
        //        type: 'MARKET',
        //        price: 0,
        //        quantity: 1,
        //        stopPrice: 0,
        //        workingType: 'MARK_PRICE',
        //        clientOrderID: '',
        //        timeInForce: 'GTC',
        //        priceRate: 0,
        //        stopLoss: '{"stopPrice":50,"workingType":"MARK_PRICE","type":"STOP_MARKET","quantity":1}',
        //        takeProfit: '{"stopPrice":150,"workingType":"MARK_PRICE","type":"TAKE_PROFIT_MARKET","quantity":1}',
        //        reduceOnly: false
        //    }
        //
        // editOrder (swap)
        //
        //    {
        //        cancelResult: 'true',
        //        cancelMsg: '',
        //        cancelResponse: {
        //            cancelClientOrderId: '',
        //            cancelOrderId: '1755336244265705472',
        //            symbol: 'SOL-USDT',
        //            orderId: '1755336244265705472',
        //            side: 'SELL',
        //            positionSide: 'SHORT',
        //            type: 'LIMIT',
        //            origQty: '1',
        //            price: '100.000',
        //            executedQty: '0',
        //            avgPrice: '0.000',
        //            cumQuote: '0',
        //            stopPrice: '',
        //            profit: '0.0000',
        //            commission: '0.000000',
        //            status: 'PENDING',
        //            time: '1707339747860',
        //            updateTime: '1707339747860',
        //            clientOrderId: '',
        //            leverage: '20X',
        //            workingType: 'MARK_PRICE',
        //            onlyOnePosition: false,
        //            reduceOnly: false
        //        },
        //        replaceResult: 'true',
        //        replaceMsg: '',
        //        newOrderResponse: {
        //            orderId: '1755338440612995072',
        //            symbol: 'SOL-USDT',
        //            positionSide: 'SHORT',
        //            side: 'SELL',
        //            type: 'LIMIT',
        //            price: '99',
        //            quantity: '2',
        //            stopPrice: '0',
        //            workingType: 'MARK_PRICE',
        //            clientOrderID: '',
        //            timeInForce: 'GTC',
        //            priceRate: '0',
        //            stopLoss: '',
        //            takeProfit: '',
        //            reduceOnly: false
        //        }
        //    }
        //
        // editOrder (spot)
        //
        //    {
        //        cancelResult: { code: '0', msg: '', result: true },
        //        openResult: { code: '0', msg: '', result: true },
        //        orderOpenResponse: {
        //            symbol: 'SOL-USDT',
        //            orderId: '1755334007697866752',
        //            transactTime: '1707339214620',
        //            price: '99',
        //            stopPrice: '0',
        //            origQty: '0.2',
        //            executedQty: '0',
        //            cummulativeQuoteQty: '0',
        //            status: 'PENDING',
        //            type: 'LIMIT',
        //            side: 'SELL',
        //            clientOrderID: ''
        //        },
        //        orderCancelResponse: {
        //            symbol: 'SOL-USDT',
        //            orderId: '1755117055251480576',
        //            price: '100',
        //            stopPrice: '0',
        //            origQty: '0.2',
        //            executedQty: '0',
        //            cummulativeQuoteQty: '0',
        //            status: 'CANCELED',
        //            type: 'LIMIT',
        //            side: 'SELL'
        //        }
        //    }
        //
        // stop loss order
        //
        //    {
        //        "symbol": "ETH-USDT",
        //        "orderId": "1792461744476422144",
        //        "price": "2775.65",
        //        "StopPrice": "2778.42",
        //        "origQty": "0.032359",
        //        "executedQty": "0",
        //        "cummulativeQuoteQty": "0",
        //        "status": "NEW",
        //        "type": "TAKE_STOP_LIMIT",
        //        "side": "SELL",
        //        "time": "1716191156868",
        //        "updateTime": "1716191156868",
        //        "origQuoteOrderQty": "0",
        //        "fee": "0",
        //        "feeAsset": "USDT",
        //        "clientOrderID": ""
        //    }
        //
        // inverse swap cancelAllOrders, cancelOrder, fetchOrder, fetchOpenOrders, fetchClosedOrders, fetchCanceledOrders
        //
        //     {
        //         "symbol": "SOL-USD",
        //         "orderId": "1809845251327672320",
        //         "side": "BUY",
        //         "positionSide": "LONG",
        //         "type": "LIMIT",
        //         "quantity": 1,
        //         "origQty": "0",
        //         "price": "90",
        //         "executedQty": "0",
        //         "avgPrice": "0",
        //         "cumQuote": "0",
        //         "stopPrice": "",
        //         "profit": "0.0000",
        //         "commission": "0.000000",
        //         "status": "CANCELLED",
        //         "time": 1720335707872,
        //         "updateTime": 1720335707912,
        //         "clientOrderId": "",
        //         "leverage": "",
        //         "takeProfit": {
        //             "type": "",
        //             "quantity": 0,
        //             "stopPrice": 0,
        //             "price": 0,
        //             "workingType": "",
        //             "stopGuaranteed": ""
        //         },
        //         "stopLoss": {
        //             "type": "",
        //             "quantity": 0,
        //             "stopPrice": 0,
        //             "price": 0,
        //             "workingType": "",
        //             "stopGuaranteed": ""
        //         },
        //         "advanceAttr": 0,
        //         "positionID": 0,
        //         "takeProfitEntrustPrice": 0,
        //         "stopLossEntrustPrice": 0,
        //         "orderType": "",
        //         "workingType": ""
        //     }
        //
        const info = order;
        const newOrder = this.safeDict2(order, 'newOrderResponse', 'orderOpenResponse');
        if (newOrder !== undefined) {
            order = newOrder;
        }
        const positionSide = this.safeString2(order, 'positionSide', 'ps');
        const marketType = (positionSide === undefined) ? 'spot' : 'swap';
        const marketId = this.safeString2(order, 'symbol', 's');
        if (market === undefined) {
            market = this.safeMarket(marketId, undefined, undefined, marketType);
        }
        const side = this.safeStringLower2(order, 'side', 'S');
        const timestamp = this.safeIntegerN(order, ['time', 'transactTime', 'E']);
        const lastTradeTimestamp = this.safeInteger2(order, 'updateTime', 'T');
        const statusId = this.safeStringUpper2(order, 'status', 'X');
        let feeCurrencyCode = this.safeString2(order, 'feeAsset', 'N');
        const feeCost = this.safeStringN(order, ['fee', 'commission', 'n']);
        if ((feeCurrencyCode === undefined)) {
            if (market['spot']) {
                if (side === 'buy') {
                    feeCurrencyCode = market['base'];
                }
                else {
                    feeCurrencyCode = market['quote'];
                }
            }
            else {
                feeCurrencyCode = market['quote'];
            }
        }
        let stopLoss = this.safeValue(order, 'stopLoss');
        let stopLossPrice = undefined;
        if ((stopLoss !== undefined) && (stopLoss !== '')) {
            stopLossPrice = this.omitZero(this.safeString(stopLoss, 'stopLoss'));
        }
        if ((stopLoss !== undefined) && (typeof stopLoss !== 'number') && (stopLoss !== '')) {
            //  stopLoss: '{"stopPrice":50,"workingType":"MARK_PRICE","type":"STOP_MARKET","quantity":1}',
            if (typeof stopLoss === 'string') {
                stopLoss = this.parseJson(stopLoss);
            }
            stopLossPrice = this.omitZero(this.safeString(stopLoss, 'stopPrice'));
        }
        let takeProfit = this.safeValue(order, 'takeProfit');
        let takeProfitPrice = undefined;
        if (takeProfit !== undefined && (takeProfit !== '')) {
            takeProfitPrice = this.omitZero(this.safeString(takeProfit, 'takeProfit'));
        }
        if ((takeProfit !== undefined) && (typeof takeProfit !== 'number') && (takeProfit !== '')) {
            //  takeProfit: '{"stopPrice":150,"workingType":"MARK_PRICE","type":"TAKE_PROFIT_MARKET","quantity":1}',
            if (typeof takeProfit === 'string') {
                takeProfit = this.parseJson(takeProfit);
            }
            takeProfitPrice = this.omitZero(this.safeString(takeProfit, 'stopPrice'));
        }
        const rawType = this.safeStringLower2(order, 'type', 'o');
        const stopPrice = this.omitZero(this.safeString2(order, 'StopPrice', 'stopPrice'));
        let triggerPrice = stopPrice;
        if (stopPrice !== undefined) {
            if ((rawType.indexOf('stop') > -1) && (stopLossPrice === undefined)) {
                stopLossPrice = stopPrice;
                triggerPrice = undefined;
            }
            if ((rawType.indexOf('take') > -1) && (takeProfitPrice === undefined)) {
                takeProfitPrice = stopPrice;
                triggerPrice = undefined;
            }
        }
        return this.safeOrder({
            'info': info,
            'id': this.safeString2(order, 'orderId', 'i'),
            'clientOrderId': this.safeStringN(order, ['clientOrderID', 'clientOrderId', 'origClientOrderId', 'c']),
            'symbol': this.safeSymbol(marketId, market, '-', marketType),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'lastTradeTimestamp': lastTradeTimestamp,
            'lastUpdateTimestamp': this.safeInteger(order, 'updateTime'),
            'type': this.parseOrderType(rawType),
            'timeInForce': this.safeString(order, 'timeInForce'),
            'postOnly': undefined,
            'side': this.parseOrderSide(side),
            'price': this.safeString2(order, 'price', 'p'),
            'stopPrice': triggerPrice,
            'triggerPrice': triggerPrice,
            'stopLossPrice': stopLossPrice,
            'takeProfitPrice': takeProfitPrice,
            'average': this.safeString2(order, 'avgPrice', 'ap'),
            'cost': this.safeString(order, 'cummulativeQuoteQty'),
            'amount': this.safeStringN(order, ['origQty', 'q', 'quantity']),
            'filled': this.safeString2(order, 'executedQty', 'z'),
            'remaining': undefined,
            'status': this.parseOrderStatus(statusId),
            'fee': {
                'currency': feeCurrencyCode,
                'cost': Precise["default"].stringAbs(feeCost),
            },
            'trades': undefined,
            'reduceOnly': this.safeBool(order, 'reduceOnly'),
        }, market);
    }
    parseOrderStatus(status) {
        const statuses = {
            'NEW': 'open',
            'PENDING': 'open',
            'PARTIALLY_FILLED': 'open',
            'FILLED': 'closed',
            'CANCELED': 'canceled',
            'CANCELLED': 'canceled',
            'FAILED': 'canceled',
        };
        return this.safeString(statuses, status, status);
    }
    async cancelOrder(id, symbol = undefined, params = {}) {
        /**
         * @method
         * @name bingx#cancelOrder
         * @description cancels an open order
         * @see https://bingx-api.github.io/docs/#/en-us/spot/trade-api.html#Cancel%20Order
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Cancel%20Order
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Cancel%20an%20Order
         * @param {string} id order id
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.clientOrderId] a unique id for the order
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' cancelOrder() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const clientOrderId = this.safeString2(params, 'clientOrderId', 'clientOrderID');
        params = this.omit(params, ['clientOrderId']);
        if (clientOrderId !== undefined) {
            request['clientOrderID'] = clientOrderId;
        }
        else {
            request['orderId'] = id;
        }
        let response = undefined;
        let type = undefined;
        let subType = undefined;
        [type, params] = this.handleMarketTypeAndParams('cancelOrder', market, params);
        [subType, params] = this.handleSubTypeAndParams('cancelOrder', market, params);
        if (type === 'spot') {
            response = await this.spotV1PrivatePostTradeCancel(this.extend(request, params));
        }
        else {
            if (subType === 'inverse') {
                response = await this.cswapV1PrivateDeleteTradeCancelOrder(this.extend(request, params));
            }
            else {
                response = await this.swapV2PrivateDeleteTradeOrder(this.extend(request, params));
            }
        }
        //
        // spot
        //
        //   {
        //       "code": 0,
        //       "msg": "",
        //       "data": {
        //           "symbol": "XRP-USDT",
        //           "orderId": 1514090846268424192,
        //           "price": "0.5",
        //           "origQty": "10",
        //           "executedQty": "0",
        //           "cummulativeQuoteQty": "0",
        //           "status": "CANCELED",
        //           "type": "LIMIT",
        //           "side": "BUY"
        //       }
        //   }
        //
        // inverse swap
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "data": {
        //             "order": {
        //                 "symbol": "SOL-USD",
        //                 "orderId": "1816002957423951872",
        //                 "side": "BUY",
        //                 "positionSide": "Long",
        //                 "type": "Pending",
        //                 "quantity": 0,
        //                 "origQty": "0",
        //                 "price": "150",
        //                 "executedQty": "0",
        //                 "avgPrice": "0",
        //                 "cumQuote": "0",
        //                 "stopPrice": "",
        //                 "profit": "0.0000",
        //                 "commission": "0.000000",
        //                 "status": "CANCELLED",
        //                 "time": 1721803819410,
        //                 "updateTime": 1721803819427,
        //                 "clientOrderId": "",
        //                 "leverage": "",
        //                 "takeProfit": {
        //                     "type": "",
        //                     "quantity": 0,
        //                     "stopPrice": 0,
        //                     "price": 0,
        //                     "workingType": "",
        //                     "stopGuaranteed": ""
        //                 },
        //                 "stopLoss": {
        //                     "type": "",
        //                     "quantity": 0,
        //                     "stopPrice": 0,
        //                     "price": 0,
        //                     "workingType": "",
        //                     "stopGuaranteed": ""
        //                 },
        //                 "advanceAttr": 0,
        //                 "positionID": 0,
        //                 "takeProfitEntrustPrice": 0,
        //                 "stopLossEntrustPrice": 0,
        //                 "orderType": "",
        //                 "workingType": ""
        //             }
        //         }
        //     }
        //
        // linear swap
        //
        //    {
        //        "code": 0,
        //        "msg": "",
        //        "data": {
        //          "order": {
        //            "symbol": "LINK-USDT",
        //            "orderId": 1597783850786750464,
        //            "side": "BUY",
        //            "positionSide": "LONG",
        //            "type": "TRIGGER_MARKET",
        //            "origQty": "5.0",
        //            "price": "5.0000",
        //            "executedQty": "0.0",
        //            "avgPrice": "0.0000",
        //            "cumQuote": "0",
        //            "stopPrice": "5.0000",
        //            "profit": "",
        //            "commission": "",
        //            "status": "CANCELLED",
        //            "time": 1669776330000,
        //            "updateTime": 1669776330000
        //          }
        //        }
        //    }
        //
        const data = this.safeDict(response, 'data', {});
        const order = this.safeDict(data, 'order', data);
        return this.parseOrder(order, market);
    }
    async cancelAllOrders(symbol = undefined, params = {}) {
        /**
         * @method
         * @name bingx#cancelAllOrders
         * @description cancel all open orders
         * @see https://bingx-api.github.io/docs/#/en-us/spot/trade-api.html#Cancel%20orders%20by%20symbol
         * @see https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Cancel%20All%20Orders
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Cancel%20all%20orders
         * @param {string} [symbol] unified market symbol, only orders in the market of this symbol are cancelled when symbol is not undefined
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' cancelAllOrders() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        let response = undefined;
        if (market['spot']) {
            response = await this.spotV1PrivatePostTradeCancelOpenOrders(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "debugMsg": "",
            //         "data": {
            //             "orders": [{
            //                 "symbol": "ADA-USDT",
            //                 "orderId": 1740659971369992192,
            //                 "transactTime": 1703840651730,
            //                 "price": 5,
            //                 "stopPrice": 0,
            //                 "origQty": 10,
            //                 "executedQty": 0,
            //                 "cummulativeQuoteQty": 0,
            //                 "status": "CANCELED",
            //                 "type": "LIMIT",
            //                 "side": "SELL"
            //             }]
            //         }
            //     }
            //
        }
        else if (market['swap']) {
            if (market['inverse']) {
                response = await this.cswapV1PrivateDeleteTradeAllOpenOrders(this.extend(request, params));
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "timestamp": 1720501468364,
                //         "data": {
                //             "success": [
                //                 {
                //                     "symbol": "SOL-USD",
                //                     "orderId": "1809845251327672320",
                //                     "side": "BUY",
                //                     "positionSide": "LONG",
                //                     "type": "LIMIT",
                //                     "quantity": 1,
                //                     "origQty": "0",
                //                     "price": "90",
                //                     "executedQty": "0",
                //                     "avgPrice": "0",
                //                     "cumQuote": "0",
                //                     "stopPrice": "",
                //                     "profit": "0.0000",
                //                     "commission": "0.000000",
                //                     "status": "CANCELLED",
                //                     "time": 1720335707872,
                //                     "updateTime": 1720335707912,
                //                     "clientOrderId": "",
                //                     "leverage": "",
                //                     "takeProfit": {
                //                         "type": "",
                //                         "quantity": 0,
                //                         "stopPrice": 0,
                //                         "price": 0,
                //                         "workingType": "",
                //                         "stopGuaranteed": ""
                //                     },
                //                     "stopLoss": {
                //                         "type": "",
                //                         "quantity": 0,
                //                         "stopPrice": 0,
                //                         "price": 0,
                //                         "workingType": "",
                //                         "stopGuaranteed": ""
                //                     },
                //                     "advanceAttr": 0,
                //                     "positionID": 0,
                //                     "takeProfitEntrustPrice": 0,
                //                     "stopLossEntrustPrice": 0,
                //                     "orderType": "",
                //                     "workingType": ""
                //                 }
                //             ],
                //             "failed": null
                //         }
                //     }
                //
            }
            else {
                response = await this.swapV2PrivateDeleteTradeAllOpenOrders(this.extend(request, params));
                //
                //    {
                //        "code": 0,
                //        "msg": "",
                //        "data": {
                //          "success": [
                //            {
                //              "symbol": "LINK-USDT",
                //              "orderId": 1597783835095859200,
                //              "side": "BUY",
                //              "positionSide": "LONG",
                //              "type": "TRIGGER_LIMIT",
                //              "origQty": "5.0",
                //              "price": "9.0000",
                //              "executedQty": "0.0",
                //              "avgPrice": "0.0000",
                //              "cumQuote": "0",
                //              "stopPrice": "9.5000",
                //              "profit": "",
                //              "commission": "",
                //              "status": "NEW",
                //              "time": 1669776326000,
                //              "updateTime": 1669776326000
                //            }
                //          ],
                //          "failed": null
                //        }
                //    }
                //
            }
        }
        else {
            throw new errors.BadRequest(this.id + ' cancelAllOrders is only supported for spot and swap markets.');
        }
        const data = this.safeDict(response, 'data', {});
        const orders = this.safeList2(data, 'success', 'orders', []);
        return this.parseOrders(orders);
    }
    async cancelOrders(ids, symbol = undefined, params = {}) {
        /**
         * @method
         * @name bingx#cancelOrders
         * @description cancel multiple orders
         * @see https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Cancel%20a%20Batch%20of%20Orders
         * @see https://bingx-api.github.io/docs/#/spot/trade-api.html#Cancel%20a%20Batch%20of%20Orders
         * @param {string[]} ids order ids
         * @param {string} symbol unified market symbol, default is undefined
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string[]} [params.clientOrderIds] client order ids
         * @returns {object} an list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' cancelOrders() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const clientOrderIds = this.safeValue(params, 'clientOrderIds');
        params = this.omit(params, 'clientOrderIds');
        let idsToParse = ids;
        const areClientOrderIds = (clientOrderIds !== undefined);
        if (areClientOrderIds) {
            idsToParse = clientOrderIds;
        }
        const parsedIds = [];
        for (let i = 0; i < idsToParse.length; i++) {
            const id = idsToParse[i];
            const stringId = id.toString();
            parsedIds.push(stringId);
        }
        let response = undefined;
        if (market['spot']) {
            const spotReqKey = areClientOrderIds ? 'clientOrderIDs' : 'orderIds';
            request[spotReqKey] = parsedIds.join(',');
            response = await this.spotV1PrivatePostTradeCancelOrders(this.extend(request, params));
            //
            //    {
            //       "code": 0,
            //       "msg": "",
            //       "debugMsg": "",
            //       "data": {
            //           "orders": [
            //                {
            //                    "symbol": "SOL-USDT",
            //                    "orderId": 1795970045910614016,
            //                    "transactTime": 1717027601111,
            //                    "price": "180.25",
            //                    "stopPrice": "0",
            //                    "origQty": "0.03",
            //                    "executedQty": "0",
            //                    "cummulativeQuoteQty": "0",
            //                    "status": "CANCELED",
            //                    "type": "LIMIT",
            //                    "side": "SELL",
            //                    "clientOrderID": ""
            //                },
            //                ...
            //            ]
            //        }
            //    }
            //
        }
        else {
            if (areClientOrderIds) {
                request['clientOrderIDList'] = this.json(parsedIds);
            }
            else {
                request['orderIdList'] = parsedIds;
            }
            response = await this.swapV2PrivateDeleteTradeBatchOrders(this.extend(request, params));
            //
            //    {
            //        "code": 0,
            //        "msg": "",
            //        "data": {
            //          "success": [
            //            {
            //              "symbol": "LINK-USDT",
            //              "orderId": 1597783850786750464,
            //              "side": "BUY",
            //              "positionSide": "LONG",
            //              "type": "TRIGGER_MARKET",
            //              "origQty": "5.0",
            //              "price": "5.5710",
            //              "executedQty": "0.0",
            //              "avgPrice": "0.0000",
            //              "cumQuote": "0",
            //              "stopPrice": "5.0000",
            //              "profit": "0.0000",
            //              "commission": "0.000000",
            //              "status": "CANCELLED",
            //              "time": 1669776330000,
            //              "updateTime": 1672370837000
            //            }
            //          ],
            //          "failed": null
            //        }
            //    }
            //
        }
        const data = this.safeDict(response, 'data', {});
        const success = this.safeList2(data, 'success', 'orders', []);
        return this.parseOrders(success);
    }
    async cancelAllOrdersAfter(timeout, params = {}) {
        /**
         * @method
         * @name bingx#cancelAllOrdersAfter
         * @description dead man's switch, cancel all orders after the given timeout
         * @see https://bingx-api.github.io/docs/#/en-us/spot/trade-api.html#Cancel%20all%20orders%20in%20countdown
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Cancel%20all%20orders%20in%20countdown
         * @param {number} timeout time in milliseconds, 0 represents cancel the timer
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.type] spot or swap market
         * @returns {object} the api result
         */
        await this.loadMarkets();
        const isActive = (timeout > 0);
        const request = {
            'type': (isActive) ? 'ACTIVATE' : 'CLOSE',
            'timeOut': (isActive) ? (this.parseToInt(timeout / 1000)) : 0,
        };
        let response = undefined;
        let type = undefined;
        [type, params] = this.handleMarketTypeAndParams('cancelAllOrdersAfter', undefined, params);
        if (type === 'spot') {
            response = await this.spotV1PrivatePostTradeCancelAllAfter(this.extend(request, params));
        }
        else if (type === 'swap') {
            response = await this.swapV2PrivatePostTradeCancelAllAfter(this.extend(request, params));
        }
        else {
            throw new errors.NotSupported(this.id + ' cancelAllOrdersAfter() is not supported for ' + type + ' markets');
        }
        //
        //     {
        //         code: '0',
        //         msg: '',
        //         data: {
        //             triggerTime: '1712645434',
        //             status: 'ACTIVATED',
        //             note: 'All your perpetual pending orders will be closed automatically at 2024-04-09 06:50:34 UTC(+0),before that you can cancel the timer, or extend triggerTime time by this request'
        //         }
        //     }
        //
        return response;
    }
    async fetchOrder(id, symbol = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchOrder
         * @description fetches information on an order made by the user
         * @see https://bingx-api.github.io/docs/#/en-us/spot/trade-api.html#Query%20Order%20details
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Query%20Order%20details
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Query%20Order
         * @param {string} id the order id
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchOrder() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
            'orderId': id,
        };
        let type = undefined;
        let subType = undefined;
        let response = undefined;
        [type, params] = this.handleMarketTypeAndParams('fetchOrder', market, params);
        [subType, params] = this.handleSubTypeAndParams('fetchOrder', market, params);
        if (type === 'spot') {
            response = await this.spotV1PrivateGetTradeQuery(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "data": {
            //             "symbol": "XRP-USDT",
            //             "orderId": 1514087361158316032,
            //             "price": "0.5",
            //             "origQty": "10",
            //             "executedQty": "0",
            //             "cummulativeQuoteQty": "0",
            //             "status": "CANCELED",
            //             "type": "LIMIT",
            //             "side": "BUY",
            //             "time": 1649821532000,
            //             "updateTime": 1649821543000,
            //             "origQuoteOrderQty": "0",
            //             "fee": "0",
            //             "feeAsset": "XRP"
            //         }
            //     }
            //
        }
        else {
            if (subType === 'inverse') {
                response = await this.cswapV1PrivateGetTradeOrderDetail(this.extend(request, params));
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "data": {
                //             "order": {
                //                 "symbol": "SOL-USD",
                //                 "orderId": "1816342420721254400",
                //                 "side": "BUY",
                //                 "positionSide": "Long",
                //                 "type": "LIMIT",
                //                 "quantity": 1,
                //                 "origQty": "",
                //                 "price": "150",
                //                 "executedQty": "0",
                //                 "avgPrice": "0.000",
                //                 "cumQuote": "",
                //                 "stopPrice": "",
                //                 "profit": "0.0000",
                //                 "commission": "0.0000",
                //                 "status": "Pending",
                //                 "time": 1721884753767,
                //                 "updateTime": 1721884753786,
                //                 "clientOrderId": "",
                //                 "leverage": "",
                //                 "takeProfit": {
                //                     "type": "TAKE_PROFIT",
                //                     "quantity": 0,
                //                     "stopPrice": 0,
                //                     "price": 0,
                //                     "workingType": "MARK_PRICE",
                //                     "stopGuaranteed": ""
                //                 },
                //                 "stopLoss": {
                //                     "type": "STOP",
                //                     "quantity": 0,
                //                     "stopPrice": 0,
                //                     "price": 0,
                //                     "workingType": "MARK_PRICE",
                //                     "stopGuaranteed": ""
                //                 },
                //                 "advanceAttr": 0,
                //                 "positionID": 0,
                //                 "takeProfitEntrustPrice": 0,
                //                 "stopLossEntrustPrice": 0,
                //                 "orderType": "",
                //                 "workingType": "MARK_PRICE"
                //             }
                //         }
                //     }
                //
            }
            else {
                response = await this.swapV2PrivateGetTradeOrder(this.extend(request, params));
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "data": {
                //             "order": {
                //                 "symbol": "BTC-USDT",
                //                 "orderId": 1597597642269917184,
                //                 "side": "SELL",
                //                 "positionSide": "LONG",
                //                 "type": "TAKE_PROFIT_MARKET",
                //                 "origQty": "1.0000",
                //                 "price": "0.0",
                //                 "executedQty": "0.0000",
                //                 "avgPrice": "0.0",
                //                 "cumQuote": "",
                //                 "stopPrice": "16494.0",
                //                 "profit": "",
                //                 "commission": "",
                //                 "status": "FILLED",
                //                 "time": 1669731935000,
                //                 "updateTime": 1669752524000
                //             }
                //         }
                //     }
                //
            }
        }
        const data = this.safeDict(response, 'data', {});
        const order = this.safeDict(data, 'order', data);
        return this.parseOrder(order, market);
    }
    async fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchOrders
         * @description fetches information on multiple orders made by the user
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#User's%20All%20Orders
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int} [since] the earliest time in ms to fetch orders for
         * @param {int} [limit] the maximum number of order structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] the latest time in ms to fetch entries for
         * @param {int} [params.orderId] Only return subsequent orders, and return the latest order by default
         * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['symbol'] = market['id'];
        }
        let type = undefined;
        [type, params] = this.handleMarketTypeAndParams('fetchOrders', market, params);
        if (type !== 'swap') {
            throw new errors.NotSupported(this.id + ' fetchOrders() is only supported for swap markets');
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        const until = this.safeInteger(params, 'until'); // unified in milliseconds
        const endTime = this.safeInteger(params, 'endTime', until); // exchange-specific in milliseconds
        params = this.omit(params, ['endTime', 'until']);
        if (endTime !== undefined) {
            request['endTime'] = endTime;
        }
        const response = await this.swapV1PrivateGetTradeFullOrder(this.extend(request, params));
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "data": {
        //         "orders": [
        //           {
        //             "symbol": "PYTH-USDT",
        //             "orderId": 1736007506620112100,
        //             "side": "SELL",
        //             "positionSide": "SHORT",
        //             "type": "LIMIT",
        //             "origQty": "33",
        //             "price": "0.3916",
        //             "executedQty": "33",
        //             "avgPrice": "0.3916",
        //             "cumQuote": "13",
        //             "stopPrice": "",
        //             "profit": "0.0000",
        //             "commission": "-0.002585",
        //             "status": "FILLED",
        //             "time": 1702731418000,
        //             "updateTime": 1702731470000,
        //             "clientOrderId": "",
        //             "leverage": "15X",
        //             "takeProfit": {
        //                 "type": "TAKE_PROFIT",
        //                 "quantity": 0,
        //                 "stopPrice": 0,
        //                 "price": 0,
        //                 "workingType": ""
        //             },
        //             "stopLoss": {
        //                 "type": "STOP",
        //                 "quantity": 0,
        //                 "stopPrice": 0,
        //                 "price": 0,
        //                 "workingType": ""
        //             },
        //             "advanceAttr": 0,
        //             "positionID": 0,
        //             "takeProfitEntrustPrice": 0,
        //             "stopLossEntrustPrice": 0,
        //             "orderType": "",
        //             "workingType": "MARK_PRICE",
        //             "stopGuaranteed": false,
        //             "triggerOrderId": 1736012449498123500
        //           }
        //         ]
        //       }
        //     }
        //
        const data = this.safeDict(response, 'data', {});
        const orders = this.safeList(data, 'orders', []);
        return this.parseOrders(orders, market, since, limit);
    }
    async fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchOpenOrders
         * @description fetch all unfilled currently open orders
         * @see https://bingx-api.github.io/docs/#/en-us/spot/trade-api.html#Current%20Open%20Orders
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Current%20All%20Open%20Orders
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Query%20all%20current%20pending%20orders
         * @param {string} symbol unified market symbol
         * @param {int} [since] the earliest time in ms to fetch open orders for
         * @param {int} [limit] the maximum number of open order structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        let market = undefined;
        const request = {};
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['symbol'] = market['id'];
        }
        let type = undefined;
        let subType = undefined;
        let response = undefined;
        [type, params] = this.handleMarketTypeAndParams('fetchOpenOrders', market, params);
        [subType, params] = this.handleSubTypeAndParams('fetchOpenOrders', market, params);
        if (type === 'spot') {
            response = await this.spotV1PrivateGetTradeOpenOrders(this.extend(request, params));
        }
        else {
            if (subType === 'inverse') {
                response = await this.cswapV1PrivateGetTradeOpenOrders(this.extend(request, params));
            }
            else {
                response = await this.swapV2PrivateGetTradeOpenOrders(this.extend(request, params));
            }
        }
        //
        //  spot
        //
        //    {
        //        "code": 0,
        //        "msg": "",
        //        "data": {
        //            "orders": [
        //                {
        //                    "symbol": "XRP-USDT",
        //                    "orderId": 1514073325788200960,
        //                    "price": "0.5",
        //                    "origQty": "20",
        //                    "executedQty": "0",
        //                    "cummulativeQuoteQty": "0",
        //                    "status": "PENDING",
        //                    "type": "LIMIT",
        //                    "side": "BUY",
        //                    "time": 1649818185647,
        //                    "updateTime": 1649818185647,
        //                    "origQuoteOrderQty": "0"
        //                }
        //            ]
        //        }
        //    }
        //
        // inverse swap
        //
        //     {
        //         "code": 0,
        //         "msg": "",
        //         "data": {
        //             "orders": [
        //                 {
        //                     "symbol": "SOL-USD",
        //                     "orderId": "1816013900044320768",
        //                     "side": "BUY",
        //                     "positionSide": "Long",
        //                     "type": "LIMIT",
        //                     "quantity": 1,
        //                     "origQty": "",
        //                     "price": "150",
        //                     "executedQty": "0",
        //                     "avgPrice": "0.000",
        //                     "cumQuote": "",
        //                     "stopPrice": "",
        //                     "profit": "0.0000",
        //                     "commission": "0.0000",
        //                     "status": "Pending",
        //                     "time": 1721806428334,
        //                     "updateTime": 1721806428352,
        //                     "clientOrderId": "",
        //                     "leverage": "",
        //                     "takeProfit": {
        //                         "type": "TAKE_PROFIT",
        //                         "quantity": 0,
        //                         "stopPrice": 0,
        //                         "price": 0,
        //                         "workingType": "MARK_PRICE",
        //                         "stopGuaranteed": ""
        //                     },
        //                     "stopLoss": {
        //                         "type": "STOP",
        //                         "quantity": 0,
        //                         "stopPrice": 0,
        //                         "price": 0,
        //                         "workingType": "MARK_PRICE",
        //                         "stopGuaranteed": ""
        //                     },
        //                     "advanceAttr": 0,
        //                     "positionID": 0,
        //                     "takeProfitEntrustPrice": 0,
        //                     "stopLossEntrustPrice": 0,
        //                     "orderType": "",
        //                     "workingType": "MARK_PRICE"
        //                 }
        //             ]
        //         }
        //     }
        //
        // linear swap
        //
        //    {
        //        "code": 0,
        //        "msg": "",
        //        "data": {
        //          "orders": [
        //            {
        //              "symbol": "LINK-USDT",
        //              "orderId": 1585839271162413056,
        //              "side": "BUY",
        //              "positionSide": "LONG",
        //              "type": "TRIGGER_MARKET",
        //              "origQty": "5.0",
        //              "price": "9",
        //              "executedQty": "0.0",
        //              "avgPrice": "0",
        //              "cumQuote": "0",
        //              "stopPrice": "5",
        //              "profit": "0.0000",
        //              "commission": "0.000000",
        //              "status": "CANCELLED",
        //              "time": 1667631605000,
        //              "updateTime": 1667631605000
        //            },
        //          ]
        //        }
        //    }
        //
        const data = this.safeDict(response, 'data', {});
        const orders = this.safeList(data, 'orders', []);
        return this.parseOrders(orders, market, since, limit);
    }
    async fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchClosedOrders
         * @description fetches information on multiple closed orders made by the user
         * @see https://bingx-api.github.io/docs/#/en-us/spot/trade-api.html#Query%20Order%20history
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Query%20Order%20history
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#User's%20History%20Orders
         * @see https://bingx-api.github.io/docs/#/standard/contract-interface.html#Historical%20order
         * @param {string} symbol unified market symbol of the closed orders
         * @param {int} [since] timestamp in ms of the earliest order
         * @param {int} [limit] the max number of closed orders to return
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] the latest time in ms to fetch orders for
         * @param {boolean} [params.standard] whether to fetch standard contract orders
         * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        const orders = await this.fetchCanceledAndClosedOrders(symbol, since, limit, params);
        return this.filterBy(orders, 'status', 'closed');
    }
    async fetchCanceledOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchCanceledOrders
         * @description fetches information on multiple canceled orders made by the user
         * @see https://bingx-api.github.io/docs/#/en-us/spot/trade-api.html#Query%20Order%20history
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Query%20Order%20history
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#User's%20History%20Orders
         * @see https://bingx-api.github.io/docs/#/standard/contract-interface.html#Historical%20order
         * @param {string} symbol unified market symbol of the canceled orders
         * @param {int} [since] timestamp in ms of the earliest order
         * @param {int} [limit] the max number of canceled orders to return
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] the latest time in ms to fetch orders for
         * @param {boolean} [params.standard] whether to fetch standard contract orders
         * @returns {object} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        const orders = await this.fetchCanceledAndClosedOrders(symbol, since, limit, params);
        return this.filterBy(orders, 'status', 'canceled');
    }
    async fetchCanceledAndClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchCanceledAndClosedOrders
         * @description fetches information on multiple closed orders made by the user
         * @see https://bingx-api.github.io/docs/#/en-us/spot/trade-api.html#Query%20Order%20history
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Query%20Order%20history
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#User's%20History%20Orders
         * @see https://bingx-api.github.io/docs/#/standard/contract-interface.html#Historical%20order
         * @param {string} [symbol] unified market symbol of the market orders were made in
         * @param {int} [since] the earliest time in ms to fetch orders for
         * @param {int} [limit] the maximum number of order structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] the latest time in ms to fetch orders for
         * @param {boolean} [params.standard] whether to fetch standard contract orders
         * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchClosedOrders() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        let type = undefined;
        let subType = undefined;
        let standard = undefined;
        let response = undefined;
        [type, params] = this.handleMarketTypeAndParams('fetchClosedOrders', market, params);
        [subType, params] = this.handleSubTypeAndParams('fetchClosedOrders', market, params);
        [standard, params] = this.handleOptionAndParams(params, 'fetchClosedOrders', 'standard', false);
        if (standard) {
            response = await this.contractV1PrivateGetAllOrders(this.extend(request, params));
        }
        else if (type === 'spot') {
            response = await this.spotV1PrivateGetTradeHistoryOrders(this.extend(request, params));
            //
            //    {
            //        "code": 0,
            //        "msg": "",
            //        "data": {
            //            "orders": [
            //                {
            //                    "symbol": "XRP-USDT",
            //                    "orderId": 1514073325788200960,
            //                    "price": "0.5",
            //                    "origQty": "20",
            //                    "executedQty": "0",
            //                    "cummulativeQuoteQty": "0",
            //                    "status": "PENDING",
            //                    "type": "LIMIT",
            //                    "side": "BUY",
            //                    "time": 1649818185647,
            //                    "updateTime": 1649818185647,
            //                    "origQuoteOrderQty": "0"
            //                }
            //            ]
            //        }
            //    }
            //
        }
        else {
            if (subType === 'inverse') {
                response = await this.cswapV1PrivateGetTradeOrderHistory(this.extend(request, params));
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "data": {
                //             "orders": [
                //                 {
                //                     "symbol": "SOL-USD",
                //                     "orderId": "1816002957423951872",
                //                     "side": "BUY",
                //                     "positionSide": "LONG",
                //                     "type": "LIMIT",
                //                     "quantity": 1,
                //                     "origQty": "10.00000000",
                //                     "price": "150.000",
                //                     "executedQty": "0.00000000",
                //                     "avgPrice": "0.000",
                //                     "cumQuote": "",
                //                     "stopPrice": "0.000",
                //                     "profit": "0.0000",
                //                     "commission": "0.000000",
                //                     "status": "Filled",
                //                     "time": 1721803819000,
                //                     "updateTime": 1721803856000,
                //                     "clientOrderId": "",
                //                     "leverage": "",
                //                     "takeProfit": {
                //                         "type": "",
                //                         "quantity": 0,
                //                         "stopPrice": 0,
                //                         "price": 0,
                //                         "workingType": "",
                //                         "stopGuaranteed": ""
                //                     },
                //                     "stopLoss": {
                //                         "type": "",
                //                         "quantity": 0,
                //                         "stopPrice": 0,
                //                         "price": 0,
                //                         "workingType": "",
                //                         "stopGuaranteed": ""
                //                     },
                //                     "advanceAttr": 0,
                //                     "positionID": 0,
                //                     "takeProfitEntrustPrice": 0,
                //                     "stopLossEntrustPrice": 0,
                //                     "orderType": "",
                //                     "workingType": "MARK_PRICE"
                //                 },
                //             ]
                //         }
                //     }
                //
            }
            else {
                response = await this.swapV2PrivateGetTradeAllOrders(this.extend(request, params));
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "data": {
                //             "orders": [
                //                 {
                //                     "symbol": "LINK-USDT",
                //                     "orderId": 1585839271162413056,
                //                     "side": "BUY",
                //                     "positionSide": "LONG",
                //                     "type": "TRIGGER_MARKET",
                //                     "origQty": "5.0",
                //                     "price": "9",
                //                     "executedQty": "0.0",
                //                     "avgPrice": "0",
                //                     "cumQuote": "0",
                //                     "stopPrice": "5",
                //                     "profit": "0.0000",
                //                     "commission": "0.000000",
                //                     "status": "CANCELLED",
                //                     "time": 1667631605000,
                //                     "updateTime": 1667631605000
                //                 },
                //             ]
                //         }
                //     }
                //
            }
        }
        const data = this.safeDict(response, 'data', {});
        const orders = this.safeList(data, 'orders', []);
        return this.parseOrders(orders, market, since, limit);
    }
    async transfer(code, amount, fromAccount, toAccount, params = {}) {
        /**
         * @method
         * @name bingx#transfer
         * @description transfer currency internally between wallets on the same account
         * @see https://bingx-api.github.io/docs/#/spot/account-api.html#User%20Universal%20Transfer
         * @param {string} code unified currency code
         * @param {float} amount amount to transfer
         * @param {string} fromAccount account to transfer from
         * @param {string} toAccount account to transfer to
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [transfer structure]{@link https://docs.ccxt.com/#/?id=transfer-structure}
         */
        await this.loadMarkets();
        const currency = this.currency(code);
        const accountsByType = this.safeDict(this.options, 'accountsByType', {});
        const fromId = this.safeString(accountsByType, fromAccount, fromAccount);
        const toId = this.safeString(accountsByType, toAccount, toAccount);
        const request = {
            'asset': currency['id'],
            'amount': this.currencyToPrecision(code, amount),
            'type': fromId + '_' + toId,
        };
        const response = await this.spotV3PrivateGetGetAssetTransfer(this.extend(request, params));
        //
        //    {
        //        "tranId":13526853623
        //    }
        //
        return {
            'info': response,
            'id': this.safeString(response, 'tranId'),
            'timestamp': undefined,
            'datetime': undefined,
            'currency': code,
            'amount': amount,
            'fromAccount': fromAccount,
            'toAccount': toAccount,
            'status': undefined,
        };
    }
    async fetchTransfers(code = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchTransfers
         * @description fetch a history of internal transfers made on an account
         * @see https://bingx-api.github.io/docs/#/spot/account-api.html#Query%20User%20Universal%20Transfer%20History%20(USER_DATA)
         * @param {string} [code] unified currency code of the currency transferred
         * @param {int} [since] the earliest time in ms to fetch transfers for
         * @param {int} [limit] the maximum number of transfers structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [transfer structures]{@link https://docs.ccxt.com/#/?id=transfer-structure}
         */
        await this.loadMarkets();
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency(code);
        }
        const accountsByType = this.safeDict(this.options, 'accountsByType', {});
        const fromAccount = this.safeString(params, 'fromAccount');
        const toAccount = this.safeString(params, 'toAccount');
        const fromId = this.safeString(accountsByType, fromAccount, fromAccount);
        const toId = this.safeString(accountsByType, toAccount, toAccount);
        if (fromId === undefined || toId === undefined) {
            throw new errors.ExchangeError(this.id + ' fromAccount & toAccount parameter are required');
        }
        const request = {
            'type': fromId + '_' + toId,
        };
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['size'] = limit;
        }
        const response = await this.spotV3PrivateGetAssetTransfer(this.extend(request, params));
        //
        //     {
        //         "total": 3,
        //         "rows": [
        //             {
        //                 "asset":"USDT",
        //                 "amount":"-100.00000000000000000000",
        //                 "type":"FUND_SFUTURES",
        //                 "status":"CONFIRMED",
        //                 "tranId":1067594500957016069,
        //                 "timestamp":1658388859000
        //             },
        //         ]
        //     }
        //
        const rows = this.safeList(response, 'rows', []);
        return this.parseTransfers(rows, currency, since, limit);
    }
    parseTransfer(transfer, currency = undefined) {
        const tranId = this.safeString(transfer, 'tranId');
        const timestamp = this.safeInteger(transfer, 'timestamp');
        const currencyCode = this.safeCurrencyCode(undefined, currency);
        const status = this.safeString(transfer, 'status');
        const accountsById = this.safeDict(this.options, 'accountsById', {});
        const typeId = this.safeString(transfer, 'type');
        const typeIdSplit = typeId.split('_');
        const fromId = this.safeString(typeIdSplit, 0);
        const toId = this.safeString(typeId, 1);
        const fromAccount = this.safeString(accountsById, fromId, fromId);
        const toAccount = this.safeString(accountsById, toId, toId);
        return {
            'info': transfer,
            'id': tranId,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'currency': currencyCode,
            'amount': this.safeNumber(transfer, 'amount'),
            'fromAccount': fromAccount,
            'toAccount': toAccount,
            'status': status,
        };
    }
    async fetchDepositAddressesByNetwork(code, params = {}) {
        /**
         * @method
         * @name bingx#fetchDepositAddressesByNetwork
         * @description fetch the deposit addresses for a currency associated with this account
         * @see https://bingx-api.github.io/docs/#/en-us/common/wallet-api.html#Query%20Main%20Account%20Deposit%20Address
         * @param {string} code unified currency code
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary [address structures]{@link https://docs.ccxt.com/#/?id=address-structure}, indexed by the network
         */
        await this.loadMarkets();
        const currency = this.currency(code);
        const defaultRecvWindow = this.safeInteger(this.options, 'recvWindow');
        const recvWindow = this.safeInteger(this.parseParams, 'recvWindow', defaultRecvWindow);
        const request = {
            'coin': currency['id'],
            'offset': 0,
            'limit': 1000,
            'recvWindow': recvWindow,
        };
        const response = await this.walletsV1PrivateGetCapitalDepositAddress(this.extend(request, params));
        //
        //     {
        //         "code": "0",
        //         "timestamp": "1695200226859",
        //         "data": {
        //           "data": [
        //             {
        //               "coinId": "799",
        //               "coin": "USDT",
        //               "network": "BEP20",
        //               "address": "6a7eda2817462dabb6493277a2cfe0f5c3f2550b",
        //               "tag": ''
        //             }
        //           ],
        //           "total": "1"
        //         }
        //     }
        //
        const data = this.safeList(this.safeDict(response, 'data'), 'data');
        const parsed = this.parseDepositAddresses(data, [currency['code']], false);
        return this.indexBy(parsed, 'network');
    }
    async fetchDepositAddress(code, params = {}) {
        /**
         * @method
         * @name bingx#fetchDepositAddress
         * @description fetch the deposit address for a currency associated with this account
         * @see https://bingx-api.github.io/docs/#/en-us/common/wallet-api.html#Query%20Main%20Account%20Deposit%20Address
         * @param {string} code unified currency code
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.network] The chain of currency. This only apply for multi-chain currency, and there is no need for single chain currency
         * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
         */
        const network = this.safeString(params, 'network');
        params = this.omit(params, ['network']);
        const addressStructures = await this.fetchDepositAddressesByNetwork(code, params);
        if (network !== undefined) {
            return this.safeDict(addressStructures, network);
        }
        else {
            const options = this.safeDict(this.options, 'defaultNetworks');
            const defaultNetworkForCurrency = this.safeString(options, code);
            if (defaultNetworkForCurrency !== undefined) {
                return this.safeDict(addressStructures, defaultNetworkForCurrency);
            }
            else {
                const keys = Object.keys(addressStructures);
                const key = this.safeString(keys, 0);
                return this.safeDict(addressStructures, key);
            }
        }
    }
    parseDepositAddress(depositAddress, currency = undefined) {
        //
        //     {
        //         "coinId": "799",
        //         "coin": "USDT",
        //         "network": "BEP20",
        //         "address": "6a7eda2817462dabb6493277a2cfe0f5c3f2550b",
        //         "tag": ''
        //     }
        //
        const address = this.safeString(depositAddress, 'address');
        const tag = this.safeString(depositAddress, 'tag');
        const currencyId = this.safeString(depositAddress, 'coin');
        currency = this.safeCurrency(currencyId, currency);
        const code = currency['code'];
        const network = this.safeString(depositAddress, 'network');
        this.checkAddress(address);
        return {
            'currency': code,
            'address': address,
            'tag': tag,
            'network': network,
            'info': depositAddress,
        };
    }
    async fetchDeposits(code = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchDeposits
         * @description fetch all deposits made to an account
         * @see https://bingx-api.github.io/docs/#/spot/account-api.html#Deposit%20History(supporting%20network)
         * @param {string} [code] unified currency code
         * @param {int} [since] the earliest time in ms to fetch deposits for
         * @param {int} [limit] the maximum number of deposits structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
         */
        await this.loadMarkets();
        const request = {};
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency(code);
            request['coin'] = currency['id'];
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 1000
        }
        const response = await this.spotV3PrivateGetCapitalDepositHisrec(this.extend(request, params));
        //
        //    [
        //        {
        //            "amount":"0.00999800",
        //            "coin":"PAXG",
        //            "network":"ETH",
        //            "status":1,
        //            "address":"0x788cabe9236ce061e5a892e1a59395a81fc8d62c",
        //            "addressTag":"",
        //            "txId":"0xaad4654a3234aa6118af9b4b335f5ae81c360b2394721c019b5d1e75328b09f3",
        //            "insertTime":1599621997000,
        //            "transferType":0,
        //            "unlockConfirm":"12/12", // confirm times for unlocking
        //            "confirmTimes":"12/12"
        //        },
        //    ]
        //
        return this.parseTransactions(response, currency, since, limit);
    }
    async fetchWithdrawals(code = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchWithdrawals
         * @description fetch all withdrawals made from an account
         * @see https://bingx-api.github.io/docs/#/spot/account-api.html#Withdraw%20History%20(supporting%20network)
         * @param {string} [code] unified currency code
         * @param {int} [since] the earliest time in ms to fetch withdrawals for
         * @param {int} [limit] the maximum number of withdrawals structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
         */
        await this.loadMarkets();
        const request = {};
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency(code);
            request['coin'] = currency['id'];
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 1000
        }
        const response = await this.spotV3PrivateGetCapitalWithdrawHistory(this.extend(request, params));
        //
        //    [
        //        {
        //            "address": "0x94df8b352de7f46f64b01d3666bf6e936e44ce60",
        //            "amount": "8.91000000",
        //            "applyTime": "2019-10-12 11:12:02",
        //            "coin": "USDT",
        //            "id": "b6ae22b3aa844210a7041aee7589627c",
        //            "withdrawOrderId": "WITHDRAWtest123",
        //            "network": "ETH",
        //            "transferType": 0
        //            "status": 6,
        //            "transactionFee": "0.004",
        //            "confirmNo":3,
        //            "info": "The address is not valid. Please confirm with the recipient",
        //            "txId": "0xb5ef8c13b968a406cc62a93a8bd80f9e9a906ef1b3fcf20a2e48573c17659268"
        //        },
        //    ]
        //
        return this.parseTransactions(response, currency, since, limit);
    }
    parseTransaction(transaction, currency = undefined) {
        //
        // fetchDeposits
        //
        //    {
        //        "amount":"0.00999800",
        //        "coin":"PAXG",
        //        "network":"ETH",
        //        "status":1,
        //        "address":"0x788cabe9236ce061e5a892e1a59395a81fc8d62c",
        //        "addressTag":"",
        //        "txId":"0xaad4654a3234aa6118af9b4b335f5ae81c360b2394721c019b5d1e75328b09f3",
        //        "insertTime":1599621997000,
        //        "transferType":0,
        //        "unlockConfirm":"12/12", // confirm times for unlocking
        //        "confirmTimes":"12/12"
        //    }
        //
        // fetchWithdrawals
        //
        //    {
        //        "address": "0x94df8b352de7f46f64b01d3666bf6e936e44ce60",
        //        "amount": "8.91000000",
        //        "applyTime": "2019-10-12 11:12:02",
        //        "coin": "USDT",
        //        "id": "b6ae22b3aa844210a7041aee7589627c",
        //        "withdrawOrderId": "WITHDRAWtest123",
        //        "network": "ETH",
        //        "transferType": 0
        //        "status": 6,
        //        "transactionFee": "0.004",
        //        "confirmNo":3,
        //        "info": "The address is not valid. Please confirm with the recipient",
        //        "txId": "0xb5ef8c13b968a406cc62a93a8bd80f9e9a906ef1b3fcf20a2e48573c17659268"
        //    }
        //
        // withdraw
        //
        //     {
        //         "code":0,
        //         "timestamp":1705274263621,
        //         "data":{
        //             "id":"1264246141278773252"
        //         }
        //     }
        //
        // parse withdraw-type output first...
        //
        const data = this.safeValue(transaction, 'data');
        const dataId = (data === undefined) ? undefined : this.safeString(data, 'id');
        const id = this.safeString(transaction, 'id', dataId);
        const address = this.safeString(transaction, 'address');
        const tag = this.safeString(transaction, 'addressTag');
        let timestamp = this.safeInteger(transaction, 'insertTime');
        let datetime = this.iso8601(timestamp);
        if (timestamp === undefined) {
            datetime = this.safeString(transaction, 'applyTime');
            timestamp = this.parse8601(datetime);
        }
        const network = this.safeString(transaction, 'network');
        const currencyId = this.safeString(transaction, 'coin');
        let code = this.safeCurrencyCode(currencyId, currency);
        if ((code !== undefined) && (code !== network) && code.indexOf(network) >= 0) {
            if (network !== undefined) {
                code = code.replace(network, '');
            }
        }
        const rawType = this.safeString(transaction, 'transferType');
        const type = (rawType === '0') ? 'deposit' : 'withdrawal';
        return {
            'info': transaction,
            'id': id,
            'txid': this.safeString(transaction, 'txId'),
            'type': type,
            'currency': code,
            'network': this.networkIdToCode(network),
            'amount': this.safeNumber(transaction, 'amount'),
            'status': this.parseTransactionStatus(this.safeString(transaction, 'status')),
            'timestamp': timestamp,
            'datetime': datetime,
            'address': address,
            'addressFrom': undefined,
            'addressTo': address,
            'tag': tag,
            'tagFrom': tag,
            'tagTo': undefined,
            'updated': undefined,
            'comment': this.safeString(transaction, 'info'),
            'fee': {
                'currency': code,
                'cost': this.safeNumber(transaction, 'transactionFee'),
                'rate': undefined,
            },
            'internal': undefined,
        };
    }
    parseTransactionStatus(status) {
        const statuses = {
            '0': 'pending',
            '1': 'ok',
            '10': 'pending',
            '20': 'rejected',
            '30': 'ok',
            '40': 'rejected',
            '50': 'ok',
            '60': 'pending',
            '70': 'rejected',
            '2': 'pending',
            '3': 'rejected',
            '4': 'pending',
            '5': 'rejected',
            '6': 'ok',
        };
        return this.safeString(statuses, status, status);
    }
    async setMarginMode(marginMode, symbol = undefined, params = {}) {
        /**
         * @method
         * @name bingx#setMarginMode
         * @description set margin mode to 'cross' or 'isolated'
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Change%20Margin%20Type
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Set%20Margin%20Type
         * @param {string} marginMode 'cross' or 'isolated'
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} response from the exchange
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' setMarginMode() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        if (market['type'] !== 'swap') {
            throw new errors.BadSymbol(this.id + ' setMarginMode() supports swap contracts only');
        }
        marginMode = marginMode.toUpperCase();
        if (marginMode === 'CROSS') {
            marginMode = 'CROSSED';
        }
        if (marginMode !== 'ISOLATED' && marginMode !== 'CROSSED') {
            throw new errors.BadRequest(this.id + ' setMarginMode() marginMode argument should be isolated or cross');
        }
        const request = {
            'symbol': market['id'],
            'marginType': marginMode,
        };
        let subType = undefined;
        [subType, params] = this.handleSubTypeAndParams('setMarginMode', market, params);
        if (subType === 'inverse') {
            return await this.cswapV1PrivatePostTradeMarginType(this.extend(request, params));
        }
        else {
            return await this.swapV2PrivatePostTradeMarginType(this.extend(request, params));
        }
    }
    async addMargin(symbol, amount, params = {}) {
        const request = {
            'type': 1,
        };
        return await this.setMargin(symbol, amount, this.extend(request, params));
    }
    async reduceMargin(symbol, amount, params = {}) {
        const request = {
            'type': 2,
        };
        return await this.setMargin(symbol, amount, this.extend(request, params));
    }
    async setMargin(symbol, amount, params = {}) {
        /**
         * @method
         * @name bingx#setMargin
         * @description Either adds or reduces margin in an isolated position in order to set the margin to a specific value
         * @see https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Adjust%20isolated%20margin
         * @param {string} symbol unified market symbol of the market to set margin in
         * @param {float} amount the amount to set the margin to
         * @param {object} [params] parameters specific to the bingx api endpoint
         * @returns {object} A [margin structure]{@link https://docs.ccxt.com/#/?id=add-margin-structure}
         */
        const type = this.safeInteger(params, 'type'); // 1 increase margin 2 decrease margin
        if (type === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' setMargin() requires a type parameter either 1 (increase margin) or 2 (decrease margin)');
        }
        if (!this.inArray(type, [1, 2])) {
            throw new errors.ArgumentsRequired(this.id + ' setMargin() requires a type parameter either 1 (increase margin) or 2 (decrease margin)');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
            'amount': this.amountToPrecision(market['symbol'], amount),
            'type': type,
        };
        const response = await this.swapV2PrivatePostTradePositionMargin(this.extend(request, params));
        //
        //    {
        //        "code": 0,
        //        "msg": "",
        //        "amount": 1,
        //        "type": 1
        //    }
        //
        return this.parseMarginModification(response, market);
    }
    parseMarginModification(data, market = undefined) {
        //
        //    {
        //        "code": 0,
        //        "msg": "",
        //        "amount": 1,
        //        "type": 1
        //    }
        //
        const type = this.safeString(data, 'type');
        return {
            'info': data,
            'symbol': this.safeString(market, 'symbol'),
            'type': (type === '1') ? 'add' : 'reduce',
            'marginMode': 'isolated',
            'amount': this.safeNumber(data, 'amount'),
            'total': this.safeNumber(data, 'margin'),
            'code': this.safeString(market, 'settle'),
            'status': undefined,
            'timestamp': undefined,
            'datetime': undefined,
        };
    }
    async fetchLeverage(symbol, params = {}) {
        /**
         * @method
         * @name bingx#fetchLeverage
         * @description fetch the set leverage for a market
         * @see https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Query%20Leverage
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Query%20Leverage
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [leverage structure]{@link https://docs.ccxt.com/#/?id=leverage-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        let response = undefined;
        if (market['inverse']) {
            response = await this.cswapV1PrivateGetTradeLeverage(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "timestamp": 1720683803391,
            //         "data": {
            //             "symbol": "SOL-USD",
            //             "longLeverage": 5,
            //             "shortLeverage": 5,
            //             "maxLongLeverage": 50,
            //             "maxShortLeverage": 50,
            //             "availableLongVol": "4000000",
            //             "availableShortVol": "4000000"
            //         }
            //     }
            //
        }
        else {
            response = await this.swapV2PrivateGetTradeLeverage(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "data": {
            //             "longLeverage": 5,
            //             "shortLeverage": 5,
            //             "maxLongLeverage": 125,
            //             "maxShortLeverage": 125,
            //             "availableLongVol": "0.0000",
            //             "availableShortVol": "0.0000",
            //             "availableLongVal": "0.0",
            //             "availableShortVal": "0.0",
            //             "maxPositionLongVal": "0.0",
            //             "maxPositionShortVal": "0.0"
            //         }
            //     }
            //
        }
        const data = this.safeDict(response, 'data', {});
        return this.parseLeverage(data, market);
    }
    parseLeverage(leverage, market = undefined) {
        //
        // linear swap
        //
        //     {
        //         "longLeverage": 5,
        //         "shortLeverage": 5,
        //         "maxLongLeverage": 125,
        //         "maxShortLeverage": 125,
        //         "availableLongVol": "0.0000",
        //         "availableShortVol": "0.0000",
        //         "availableLongVal": "0.0",
        //         "availableShortVal": "0.0",
        //         "maxPositionLongVal": "0.0",
        //         "maxPositionShortVal": "0.0"
        //     }
        //
        // inverse swap
        //
        //     {
        //         "symbol": "SOL-USD",
        //         "longLeverage": 5,
        //         "shortLeverage": 5,
        //         "maxLongLeverage": 50,
        //         "maxShortLeverage": 50,
        //         "availableLongVol": "4000000",
        //         "availableShortVol": "4000000"
        //     }
        //
        const marketId = this.safeString(leverage, 'symbol');
        return {
            'info': leverage,
            'symbol': this.safeSymbol(marketId, market),
            'marginMode': undefined,
            'longLeverage': this.safeInteger(leverage, 'longLeverage'),
            'shortLeverage': this.safeInteger(leverage, 'shortLeverage'),
        };
    }
    async setLeverage(leverage, symbol = undefined, params = {}) {
        /**
         * @method
         * @name bingx#setLeverage
         * @description set the level of leverage for a market
         * @see https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Switch%20Leverage
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Modify%20Leverage
         * @param {float} leverage the rate of leverage
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.side] hedged: ['long' or 'short']. one way: ['both']
         * @returns {object} response from the exchange
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' setLeverage() requires a symbol argument');
        }
        const side = this.safeStringUpper(params, 'side');
        this.checkRequiredArgument('setLeverage', side, 'side', ['LONG', 'SHORT', 'BOTH']);
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
            'side': side,
            'leverage': leverage,
        };
        if (market['inverse']) {
            return await this.cswapV1PrivatePostTradeLeverage(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "timestamp": 1720725058059,
            //         "data": {
            //             "symbol": "SOL-USD",
            //             "longLeverage": 10,
            //             "shortLeverage": 5,
            //             "maxLongLeverage": 50,
            //             "maxShortLeverage": 50,
            //             "availableLongVol": "4000000",
            //             "availableShortVol": "4000000"
            //         }
            //     }
            //
        }
        else {
            return await this.swapV2PrivatePostTradeLeverage(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "data": {
            //             "leverage": 10,
            //             "symbol": "BTC-USDT",
            //             "availableLongVol": "0.0000",
            //             "availableShortVol": "0.0000",
            //             "availableLongVal": "0.0",
            //             "availableShortVal": "0.0",
            //             "maxPositionLongVal": "0.0",
            //             "maxPositionShortVal": "0.0"
            //         }
            //     }
            //
        }
    }
    async fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchMyTrades
         * @description fetch all trades made by the user
         * @see https://bingx-api.github.io/docs/#/en-us/spot/trade-api.html#Query%20transaction%20details
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Query%20historical%20transaction%20orders
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Query%20Order%20Trade%20Detail
         * @param {string} [symbol] unified market symbol
         * @param {int} [since] the earliest time in ms to fetch trades for
         * @param {int} [limit] the maximum number of trades structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] timestamp in ms for the ending date filter, default is undefined
         * @param {string} params.trandingUnit COIN (directly represent assets such as BTC and ETH) or CONT (represents the number of contract sheets)
         * @param {string} params.orderId the order id required for inverse swap
         * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchMyTrades() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {};
        let fills = undefined;
        let response = undefined;
        let subType = undefined;
        [subType, params] = this.handleSubTypeAndParams('fetchMyTrades', market, params);
        if (subType === 'inverse') {
            const orderId = this.safeString(params, 'orderId');
            if (orderId === undefined) {
                throw new errors.ArgumentsRequired(this.id + ' fetchMyTrades() requires an orderId argument for inverse swap trades');
            }
            response = await this.cswapV1PrivateGetTradeAllFillOrders(this.extend(request, params));
            fills = this.safeList(response, 'data', []);
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "timestamp": 1722147756019,
            //         "data": [
            //             {
            //                 "orderId": "1817441228670648320",
            //                 "symbol": "SOL-USD",
            //                 "type": "MARKET",
            //                 "side": "BUY",
            //                 "positionSide": "LONG",
            //                 "tradeId": "97244554",
            //                 "volume": "2",
            //                 "tradePrice": "182.652",
            //                 "amount": "20.00000000",
            //                 "realizedPnl": "0.00000000",
            //                 "commission": "-0.00005475",
            //                 "currency": "SOL",
            //                 "buyer": true,
            //                 "maker": false,
            //                 "tradeTime": 1722146730000
            //             }
            //         ]
            //     }
            //
        }
        else {
            request['symbol'] = market['id'];
            const now = this.milliseconds();
            if (since !== undefined) {
                const startTimeReq = market['spot'] ? 'startTime' : 'startTs';
                request[startTimeReq] = since;
            }
            else if (market['swap']) {
                request['startTs'] = now - 7776000000; // 90 days
            }
            const until = this.safeInteger(params, 'until');
            params = this.omit(params, 'until');
            if (until !== undefined) {
                const endTimeReq = market['spot'] ? 'endTime' : 'endTs';
                request[endTimeReq] = until;
            }
            else if (market['swap']) {
                request['endTs'] = now;
            }
            if (market['spot']) {
                response = await this.spotV1PrivateGetTradeMyTrades(this.extend(request, params));
                const data = this.safeDict(response, 'data', {});
                fills = this.safeList(data, 'fills', []);
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "debugMsg": "",
                //         "data": {
                //             "fills": [
                //                 {
                //                     "symbol": "LTC-USDT",
                //                     "id": 36237072,
                //                     "orderId": 1674069326895775744,
                //                     "price": "85.891",
                //                     "qty": "0.0582",
                //                     "quoteQty": "4.9988562000000005",
                //                     "commission": -0.00005820000000000001,
                //                     "commissionAsset": "LTC",
                //                     "time": 1687964205000,
                //                     "isBuyer": true,
                //                     "isMaker": false
                //                 }
                //             ]
                //         }
                //     }
                //
            }
            else {
                const tradingUnit = this.safeStringUpper(params, 'tradingUnit', 'CONT');
                params = this.omit(params, 'tradingUnit');
                request['tradingUnit'] = tradingUnit;
                response = await this.swapV2PrivateGetTradeAllFillOrders(this.extend(request, params));
                const data = this.safeDict(response, 'data', {});
                fills = this.safeList(data, 'fill_orders', []);
                //
                //    {
                //       "code": "0",
                //       "msg": '',
                //       "data": { fill_orders: [
                //          {
                //              "volume": "0.1",
                //              "price": "106.75",
                //              "amount": "10.6750",
                //              "commission": "-0.0053",
                //              "currency": "USDT",
                //              "orderId": "1676213270274379776",
                //              "liquidatedPrice": "0.00",
                //              "liquidatedMarginRatio": "0.00",
                //              "filledTime": "2023-07-04T20:56:01.000+0800"
                //          }
                //        ]
                //      }
                //    }
                //
            }
        }
        return this.parseTrades(fills, market, since, limit, params);
    }
    parseDepositWithdrawFee(fee, currency = undefined) {
        //
        //    {
        //        "coin": "BTC",
        //        "name": "BTC",
        //        "networkList": [
        //          {
        //            "name": "BTC",
        //            "network": "BTC",
        //            "isDefault": true,
        //            "minConfirm": "2",
        //            "withdrawEnable": true,
        //            "withdrawFee": "0.00035",
        //            "withdrawMax": "1.62842",
        //            "withdrawMin": "0.0005"
        //          },
        //          {
        //            "name": "BTC",
        //            "network": "BEP20",
        //            "isDefault": false,
        //            "minConfirm": "15",
        //            "withdrawEnable": true,
        //            "withdrawFee": "0.00001",
        //            "withdrawMax": "1.62734",
        //            "withdrawMin": "0.0001"
        //          }
        //        ]
        //    }
        //
        const networkList = this.safeList(fee, 'networkList', []);
        const networkListLength = networkList.length;
        const result = {
            'info': fee,
            'withdraw': {
                'fee': undefined,
                'percentage': undefined,
            },
            'deposit': {
                'fee': undefined,
                'percentage': undefined,
            },
            'networks': {},
        };
        if (networkListLength !== 0) {
            for (let i = 0; i < networkListLength; i++) {
                const network = networkList[i];
                const networkId = this.safeString(network, 'network');
                const isDefault = this.safeBool(network, 'isDefault');
                const currencyCode = this.safeString(currency, 'code');
                const networkCode = this.networkIdToCode(networkId, currencyCode);
                result['networks'][networkCode] = {
                    'deposit': { 'fee': undefined, 'percentage': undefined },
                    'withdraw': { 'fee': this.safeNumber(network, 'withdrawFee'), 'percentage': false },
                };
                if (isDefault) {
                    result['withdraw']['fee'] = this.safeNumber(network, 'withdrawFee');
                    result['withdraw']['percentage'] = false;
                }
            }
        }
        return result;
    }
    async fetchDepositWithdrawFees(codes = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchDepositWithdrawFees
         * @description fetch deposit and withdraw fees
         * @see https://bingx-api.github.io/docs/#/common/account-api.html#All%20Coins'%20Information
         * @param {string[]|undefined} codes list of unified currency codes
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a list of [fee structures]{@link https://docs.ccxt.com/#/?id=fee-structure}
         */
        await this.loadMarkets();
        const response = await this.walletsV1PrivateGetCapitalConfigGetall(params);
        const coins = this.safeList(response, 'data');
        return this.parseDepositWithdrawFees(coins, codes, 'coin');
    }
    async withdraw(code, amount, address, tag = undefined, params = {}) {
        /**
         * @method
         * @name bingx#withdraw
         * @description make a withdrawal
         * @see https://bingx-api.github.io/docs/#/common/account-api.html#Withdraw
         * @param {string} code unified currency code
         * @param {float} amount the amount to withdraw
         * @param {string} address the address to withdraw to
         * @param {string} [tag]
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.walletType] 1 fund account, 2 standard account, 3 perpetual account
         * @returns {object} a [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
         */
        await this.loadMarkets();
        const currency = this.currency(code);
        let walletType = this.safeInteger(params, 'walletType');
        if (walletType === undefined) {
            walletType = 1;
        }
        if (!this.inArray(walletType, [1, 2, 3])) {
            throw new errors.BadRequest(this.id + ' withdraw() requires either 1 fund account, 2 standard futures account, 3 perpetual account for walletType');
        }
        const request = {
            'coin': currency['id'],
            'address': address,
            'amount': this.numberToString(amount),
            'walletType': walletType,
        };
        const network = this.safeStringUpper(params, 'network');
        if (network !== undefined) {
            request['network'] = this.networkCodeToId(network);
        }
        params = this.omit(params, ['walletType', 'network']);
        const response = await this.walletsV1PrivatePostCapitalWithdrawApply(this.extend(request, params));
        const data = this.safeValue(response, 'data');
        //    {
        //        "code":0,
        //        "timestamp":1689258953651,
        //        "data":{
        //           "id":"1197073063359000577"
        //        }
        //    }
        return this.parseTransaction(data);
    }
    parseParams(params) {
        const sortedParams = this.keysort(params);
        const keys = Object.keys(sortedParams);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = sortedParams[key];
            if (Array.isArray(value)) {
                let arrStr = '[';
                for (let j = 0; j < value.length; j++) {
                    const arrayElement = value[j];
                    if (j > 0) {
                        arrStr += ',';
                    }
                    arrStr += arrayElement.toString();
                }
                arrStr += ']';
                sortedParams[key] = arrStr;
            }
        }
        return sortedParams;
    }
    async fetchMyLiquidations(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchMyLiquidations
         * @description retrieves the users liquidated positions
         * @see https://bingx-api.github.io/docs/#/swapV2/trade-api.html#User's%20Force%20Orders
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Query%20force%20orders
         * @param {string} [symbol] unified CCXT market symbol
         * @param {int} [since] the earliest time in ms to fetch liquidations for
         * @param {int} [limit] the maximum number of liquidation structures to retrieve
         * @param {object} [params] exchange specific parameters for the bingx api endpoint
         * @param {int} [params.until] timestamp in ms of the latest liquidation
         * @returns {object} an array of [liquidation structures]{@link https://docs.ccxt.com/#/?id=liquidation-structure}
         */
        await this.loadMarkets();
        let request = {
            'autoCloseType': 'LIQUIDATION',
        };
        [request, params] = this.handleUntilOption('endTime', request, params);
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        let subType = undefined;
        [subType, params] = this.handleSubTypeAndParams('fetchMyLiquidations', market, params);
        let response = undefined;
        let liquidations = undefined;
        if (subType === 'inverse') {
            response = await this.cswapV1PrivateGetTradeForceOrders(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "timestamp": 1721280071678,
            //         "data": [
            //             {
            //                 "orderId": "string",
            //                 "symbol": "string",
            //                 "type": "string",
            //                 "side": "string",
            //                 "positionSide": "string",
            //                 "price": "string",
            //                 "quantity": "float64",
            //                 "stopPrice": "string",
            //                 "workingType": "string",
            //                 "status": "string",
            //                 "time": "int64",
            //                 "avgPrice": "string",
            //                 "executedQty": "string",
            //                 "profit": "string",
            //                 "commission": "string",
            //                 "updateTime": "string"
            //             }
            //         ]
            //     }
            //
            liquidations = this.safeList(response, 'data', []);
        }
        else {
            response = await this.swapV2PrivateGetTradeForceOrders(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "data": {
            //             "orders": [
            //                 {
            //                     "time": "int64",
            //                     "symbol": "string",
            //                     "side": "string",
            //                     "type": "string",
            //                     "positionSide": "string",
            //                     "cumQuote": "string",
            //                     "status": "string",
            //                     "stopPrice": "string",
            //                     "price": "string",
            //                     "origQty": "string",
            //                     "avgPrice": "string",
            //                     "executedQty": "string",
            //                     "orderId": "int64",
            //                     "profit": "string",
            //                     "commission": "string",
            //                     "workingType": "string",
            //                     "updateTime": "int64"
            //                 },
            //             ]
            //         }
            //     }
            //
            const data = this.safeDict(response, 'data', {});
            liquidations = this.safeList(data, 'orders', []);
        }
        return this.parseLiquidations(liquidations, market, since, limit);
    }
    parseLiquidation(liquidation, market = undefined) {
        //
        //     {
        //         "time": "int64",
        //         "symbol": "string",
        //         "side": "string",
        //         "type": "string",
        //         "positionSide": "string",
        //         "cumQuote": "string",
        //         "status": "string",
        //         "stopPrice": "string",
        //         "price": "string",
        //         "origQty": "string",
        //         "avgPrice": "string",
        //         "executedQty": "string",
        //         "orderId": "int64",
        //         "profit": "string",
        //         "commission": "string",
        //         "workingType": "string",
        //         "updateTime": "int64"
        //     }
        //
        const marketId = this.safeString(liquidation, 'symbol');
        const timestamp = this.safeInteger(liquidation, 'time');
        const contractsString = this.safeString(liquidation, 'executedQty');
        const contractSizeString = this.safeString(market, 'contractSize');
        const priceString = this.safeString(liquidation, 'avgPrice');
        const baseValueString = Precise["default"].stringMul(contractsString, contractSizeString);
        const quoteValueString = Precise["default"].stringMul(baseValueString, priceString);
        return this.safeLiquidation({
            'info': liquidation,
            'symbol': this.safeSymbol(marketId, market),
            'contracts': this.parseNumber(contractsString),
            'contractSize': this.parseNumber(contractSizeString),
            'price': this.parseNumber(priceString),
            'baseValue': this.parseNumber(baseValueString),
            'quoteValue': this.parseNumber(quoteValueString),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
        });
    }
    async closePosition(symbol, side = undefined, params = {}) {
        /**
         * @method
         * @name bingx#closePosition
         * @description closes open positions for a market
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#One-Click%20Close%20All%20Positions
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Close%20all%20positions%20in%20bulk
         * @param {string} symbol Unified CCXT market symbol
         * @param {string} [side] not used by bingx
         * @param {object} [params] extra parameters specific to the bingx api endpoint
         * @param {string|undefined} [params.positionId] the id of the position you would like to close
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const positionId = this.safeString(params, 'positionId');
        const request = {};
        let response = undefined;
        if (positionId !== undefined) {
            response = await this.swapV1PrivatePostTradeClosePosition(this.extend(request, params));
            //
            //    {
            //        "code": 0,
            //        "msg": "",
            //        "timestamp": 1710992264190,
            //        "data": {
            //            "orderId": 1770656007907930112,
            //            "positionId": "1751667128353910784",
            //            "symbol": "LTC-USDT",
            //            "side": "Ask",
            //            "type": "MARKET",
            //            "positionSide": "Long",
            //            "origQty": "0.2"
            //        }
            //    }
            //
        }
        else {
            request['symbol'] = market['id'];
            if (market['inverse']) {
                response = await this.cswapV1PrivatePostTradeCloseAllPositions(this.extend(request, params));
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "timestamp": 1720771601428,
                //         "data": {
                //             "success": ["1811673520637231104"],
                //             "failed": null
                //         }
                //     }
                //
            }
            else {
                response = await this.swapV2PrivatePostTradeCloseAllPositions(this.extend(request, params));
                //
                //    {
                //        "code": 0,
                //        "msg": "",
                //        "data": {
                //            "success": [
                //                1727686766700486656,
                //            ],
                //            "failed": null
                //        }
                //    }
                //
            }
        }
        const data = this.safeDict(response, 'data');
        return this.parseOrder(data, market);
    }
    async closeAllPositions(params = {}) {
        /**
         * @method
         * @name bitget#closePositions
         * @description closes open positions for a market
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#One-Click%20Close%20All%20Positions
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Close%20all%20positions%20in%20bulk
         * @param {object} [params] extra parameters specific to the bingx api endpoint
         * @param {string} [params.recvWindow] request valid time window value
         * @returns {object[]} [a list of position structures]{@link https://docs.ccxt.com/#/?id=position-structure}
         */
        await this.loadMarkets();
        const defaultRecvWindow = this.safeInteger(this.options, 'recvWindow');
        const recvWindow = this.safeInteger(this.parseParams, 'recvWindow', defaultRecvWindow);
        let marketType = undefined;
        [marketType, params] = this.handleMarketTypeAndParams('closeAllPositions', undefined, params);
        let subType = undefined;
        [subType, params] = this.handleSubTypeAndParams('closeAllPositions', undefined, params);
        if (marketType === 'margin') {
            throw new errors.BadRequest(this.id + ' closePositions () cannot be used for ' + marketType + ' markets');
        }
        const request = {
            'recvWindow': recvWindow,
        };
        let response = undefined;
        if (subType === 'inverse') {
            response = await this.cswapV1PrivatePostTradeCloseAllPositions(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "timestamp": 1720771601428,
            //         "data": {
            //             "success": ["1811673520637231104"],
            //             "failed": null
            //         }
            //     }
            //
        }
        else {
            response = await this.swapV2PrivatePostTradeCloseAllPositions(this.extend(request, params));
            //
            //    {
            //        "code": 0,
            //        "msg": "",
            //        "data": {
            //            "success": [
            //                1727686766700486656,
            //                1727686767048613888
            //            ],
            //            "failed": null
            //        }
            //    }
            //
        }
        const data = this.safeDict(response, 'data', {});
        const success = this.safeList(data, 'success', []);
        const positions = [];
        for (let i = 0; i < success.length; i++) {
            const position = this.parsePosition({ 'positionId': success[i] });
            positions.push(position);
        }
        return positions;
    }
    async fetchPositionMode(symbol = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchPositionMode
         * @description fetchs the position mode, hedged or one way, hedged for binance is set identically for all linear markets or all inverse markets
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Get%20Position%20Mode
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an object detailing whether the market is in hedged or one-way mode
         */
        const response = await this.swapV1PrivateGetPositionSideDual(params);
        //
        //     {
        //         "code": "0",
        //         "msg": "",
        //         "timeStamp": "1709002057516",
        //         "data": {
        //             "dualSidePosition": "false"
        //         }
        //     }
        //
        const data = this.safeDict(response, 'data', {});
        const dualSidePosition = this.safeString(data, 'dualSidePosition');
        return {
            'info': response,
            'hedged': (dualSidePosition === 'true'),
        };
    }
    async setPositionMode(hedged, symbol = undefined, params = {}) {
        /**
         * @method
         * @name bingx#setPositionMode
         * @description set hedged to true or false for a market
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Set%20Position%20Mode
         * @param {bool} hedged set to true to use dualSidePosition
         * @param {string} symbol not used by bingx setPositionMode ()
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} response from the exchange
         */
        let dualSidePosition = undefined;
        if (hedged) {
            dualSidePosition = 'true';
        }
        else {
            dualSidePosition = 'false';
        }
        const request = {
            'dualSidePosition': dualSidePosition,
        };
        //
        //     {
        //         code: '0',
        //         msg: '',
        //         timeStamp: '1703327432734',
        //         data: { dualSidePosition: 'false' }
        //     }
        //
        return await this.swapV1PrivatePostPositionSideDual(this.extend(request, params));
    }
    async editOrder(id, symbol, type, side, amount = undefined, price = undefined, params = {}) {
        /**
         * @method
         * @name bingx#editOrder
         * @description cancels an order and places a new order
         * @see https://bingx-api.github.io/docs/#/en-us/spot/trade-api.html#Cancel%20order%20and%20place%20a%20new%20order  // spot
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Cancel%20an%20order%20and%20then%20Place%20a%20new%20order  // swap
         * @param {string} id order id
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much of the currency you want to trade in units of the base currency
         * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.stopPrice] Trigger price used for TAKE_STOP_LIMIT, TAKE_STOP_MARKET, TRIGGER_LIMIT, TRIGGER_MARKET order types.
         * @param {object} [params.takeProfit] *takeProfit object in params* containing the triggerPrice at which the attached take profit order will be triggered
         * @param {float} [params.takeProfit.triggerPrice] take profit trigger price
         * @param {object} [params.stopLoss] *stopLoss object in params* containing the triggerPrice at which the attached stop loss order will be triggered
         * @param {float} [params.stopLoss.triggerPrice] stop loss trigger price
         *
         * EXCHANGE SPECIFIC PARAMETERS
         * @param {string} [params.cancelClientOrderID] the user-defined id of the order to be canceled, 1-40 characters, different orders cannot use the same clientOrderID, only supports a query range of 2 hours
         * @param {string} [params.cancelRestrictions] cancel orders with specified status, NEW: New order, PENDING: Pending order, PARTIALLY_FILLED: Partially filled
         * @param {string} [params.cancelReplaceMode] STOP_ON_FAILURE - if the cancel order fails, it will not continue to place a new order, ALLOW_FAILURE - regardless of whether the cancel order succeeds or fails, it will continue to place a new order
         * @param {float} [params.quoteOrderQty] order amount
         * @param {string} [params.newClientOrderId] custom order id consisting of letters, numbers, and _, 1-40 characters, different orders cannot use the same newClientOrderId.
         * @param {string} [params.positionSide] *contract only* position direction, required for single position as BOTH, for both long and short positions only LONG or SHORT can be chosen, defaults to LONG if empty
         * @param {string} [params.reduceOnly] *contract only* true or false, default=false for single position mode. this parameter is not accepted for both long and short positions mode
         * @param {float} [params.priceRate] *contract only* for type TRAILING_STOP_Market or TRAILING_TP_SL, Max = 1
         * @param {string} [params.workingType] *contract only* StopPrice trigger price types, MARK_PRICE (default), CONTRACT_PRICE, or INDEX_PRICE
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = this.createOrderRequest(symbol, type, side, amount, price, params);
        request['cancelOrderId'] = id;
        request['cancelReplaceMode'] = 'STOP_ON_FAILURE';
        let response = undefined;
        if (market['swap']) {
            response = await this.swapV1PrivatePostTradeCancelReplace(this.extend(request, params));
            //
            //    {
            //        code: '0',
            //        msg: '',
            //        data: {
            //            cancelResult: 'true',
            //            cancelMsg: '',
            //            cancelResponse: {
            //                cancelClientOrderId: '',
            //                cancelOrderId: '1755336244265705472',
            //                symbol: 'SOL-USDT',
            //                orderId: '1755336244265705472',
            //                side: 'SELL',
            //                positionSide: 'SHORT',
            //                type: 'LIMIT',
            //                origQty: '1',
            //                price: '100.000',
            //                executedQty: '0',
            //                avgPrice: '0.000',
            //                cumQuote: '0',
            //                stopPrice: '',
            //                profit: '0.0000',
            //                commission: '0.000000',
            //                status: 'PENDING',
            //                time: '1707339747860',
            //                updateTime: '1707339747860',
            //                clientOrderId: '',
            //                leverage: '20X',
            //                workingType: 'MARK_PRICE',
            //                onlyOnePosition: false,
            //                reduceOnly: false
            //            },
            //            replaceResult: 'true',
            //            replaceMsg: '',
            //            newOrderResponse: {
            //                orderId: '1755338440612995072',
            //                symbol: 'SOL-USDT',
            //                positionSide: 'SHORT',
            //                side: 'SELL',
            //                type: 'LIMIT',
            //                price: '99',
            //                quantity: '2',
            //                stopPrice: '0',
            //                workingType: 'MARK_PRICE',
            //                clientOrderID: '',
            //                timeInForce: 'GTC',
            //                priceRate: '0',
            //                stopLoss: '',
            //                takeProfit: '',
            //                reduceOnly: false
            //            }
            //        }
            //    }
            //
        }
        else {
            response = await this.spotV1PrivatePostTradeOrderCancelReplace(this.extend(request, params));
            //
            //    {
            //        code: '0',
            //        msg: '',
            //        debugMsg: '',
            //        data: {
            //            cancelResult: { code: '0', msg: '', result: true },
            //            openResult: { code: '0', msg: '', result: true },
            //            orderOpenResponse: {
            //                symbol: 'SOL-USDT',
            //                orderId: '1755334007697866752',
            //                transactTime: '1707339214620',
            //                price: '99',
            //                stopPrice: '0',
            //                origQty: '0.2',
            //                executedQty: '0',
            //                cummulativeQuoteQty: '0',
            //                status: 'PENDING',
            //                type: 'LIMIT',
            //                side: 'SELL',
            //                clientOrderID: ''
            //            },
            //            orderCancelResponse: {
            //                symbol: 'SOL-USDT',
            //                orderId: '1755117055251480576',
            //                price: '100',
            //                stopPrice: '0',
            //                origQty: '0.2',
            //                executedQty: '0',
            //                cummulativeQuoteQty: '0',
            //                status: 'CANCELED',
            //                type: 'LIMIT',
            //                side: 'SELL'
            //            }
            //        }
            //    }
            //
        }
        const data = this.safeDict(response, 'data');
        return this.parseOrder(data, market);
    }
    async fetchMarginMode(symbol, params = {}) {
        /**
         * @method
         * @name bingx#fetchMarginMode
         * @description fetches the margin mode of the trading pair
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Query%20Margin%20Type
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Query%20Margin%20Type
         * @param {string} symbol unified symbol of the market to fetch the margin mode for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [margin mode structure]{@link https://docs.ccxt.com/#/?id=margin-mode-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        let subType = undefined;
        let response = undefined;
        [subType, params] = this.handleSubTypeAndParams('fetchMarginMode', market, params);
        if (subType === 'inverse') {
            response = await this.cswapV1PrivateGetTradeMarginType(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "timestamp": 1721966069132,
            //         "data": {
            //             "symbol": "SOL-USD",
            //             "marginType": "CROSSED"
            //         }
            //     }
            //
        }
        else {
            response = await this.swapV2PrivateGetTradeMarginType(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "data": {
            //             "marginType": "CROSSED"
            //         }
            //     }
            //
        }
        const data = this.safeDict(response, 'data', {});
        return this.parseMarginMode(data, market);
    }
    parseMarginMode(marginMode, market = undefined) {
        const marketId = this.safeString(marginMode, 'symbol');
        let marginType = this.safeStringLower(marginMode, 'marginType');
        marginType = (marginType === 'crossed') ? 'cross' : marginType;
        return {
            'info': marginMode,
            'symbol': this.safeSymbol(marketId, market, '-', 'swap'),
            'marginMode': marginType,
        };
    }
    async fetchTradingFee(symbol, params = {}) {
        /**
         * @method
         * @name bingx#fetchTradingFee
         * @description fetch the trading fees for a market
         * @see https://bingx-api.github.io/docs/#/en-us/spot/trade-api.html#Query%20Trading%20Commission%20Rate
         * @see https://bingx-api.github.io/docs/#/en-us/swapV2/account-api.html#Query%20Trading%20Commission%20Rate
         * @see https://bingx-api.github.io/docs/#/en-us/cswap/trade-api.html#Query%20Trade%20Commission%20Rate
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [fee structure]{@link https://docs.ccxt.com/#/?id=fee-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        let response = undefined;
        let commission = {};
        const data = this.safeDict(response, 'data', {});
        if (market['spot']) {
            response = await this.spotV1PrivateGetUserCommissionRate(this.extend(request, params));
            //
            //     {
            //         "code": 0,
            //         "msg": "",
            //         "debugMsg": "",
            //         "data": {
            //             "takerCommissionRate": 0.001,
            //             "makerCommissionRate": 0.001
            //         }
            //     }
            //
            commission = data;
        }
        else {
            if (market['inverse']) {
                response = await this.cswapV1PrivateGetUserCommissionRate(params);
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "timestamp": 1721365261438,
                //         "data": {
                //             "takerCommissionRate": "0.0005",
                //             "makerCommissionRate": "0.0002"
                //         }
                //     }
                //
                commission = data;
            }
            else {
                response = await this.swapV2PrivateGetUserCommissionRate(params);
                //
                //     {
                //         "code": 0,
                //         "msg": "",
                //         "data": {
                //             "commission": {
                //                 "takerCommissionRate": 0.0005,
                //                 "makerCommissionRate": 0.0002
                //             }
                //         }
                //     }
                //
                commission = this.safeDict(data, 'commission', {});
            }
        }
        return this.parseTradingFee(commission, market);
    }
    parseTradingFee(fee, market = undefined) {
        //
        //     {
        //         "takerCommissionRate": 0.001,
        //         "makerCommissionRate": 0.001
        //     }
        //
        const symbol = (market !== undefined) ? market['symbol'] : undefined;
        return {
            'info': fee,
            'symbol': symbol,
            'maker': this.safeNumber(fee, 'makerCommissionRate'),
            'taker': this.safeNumber(fee, 'takerCommissionRate'),
            'percentage': false,
            'tierBased': false,
        };
    }
    sign(path, section = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const type = section[0];
        const version = section[1];
        const access = section[2];
        const isSandbox = this.safeBool(this.options, 'sandboxMode', false);
        if (isSandbox && (type !== 'swap')) {
            throw new errors.NotSupported(this.id + ' does not have a testnet/sandbox URL for ' + type + ' endpoints');
        }
        let url = this.implodeHostname(this.urls['api'][type]);
        if (type === 'spot' && version === 'v3') {
            url += '/api';
        }
        else {
            url += '/' + type;
        }
        url += '/' + version + '/';
        path = this.implodeParams(path, params);
        url += path;
        params = this.omit(params, this.extractParams(path));
        params = this.keysort(params);
        if (access === 'public') {
            params['timestamp'] = this.nonce();
            if (Object.keys(params).length) {
                url += '?' + this.urlencode(params);
            }
        }
        else if (access === 'private') {
            this.checkRequiredCredentials();
            params['timestamp'] = this.nonce();
            const parsedParams = this.parseParams(params);
            let query = this.urlencode(parsedParams);
            const signature = this.hmac(this.encode(this.rawencode(parsedParams)), this.encode(this.secret), sha256.sha256);
            if (Object.keys(params).length) {
                query = '?' + query + '&';
            }
            else {
                query += '?';
            }
            query += 'signature=' + signature;
            headers = {
                'X-BX-APIKEY': this.apiKey,
                'X-SOURCE-KEY': this.safeString(this.options, 'broker', 'CCXT'),
            };
            url += query;
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
    nonce() {
        return this.milliseconds();
    }
    setSandboxMode(enable) {
        super.setSandboxMode(enable);
        this.options['sandboxMode'] = enable;
    }
    handleErrors(httpCode, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return undefined; // fallback to default error handler
        }
        //
        //    {
        //        "code": 80014,
        //        "msg": "Invalid parameters, err:Key: 'GetTickerRequest.Symbol' Error:Field validation for "Symbol" failed on the "len=0|endswith=-USDT" tag",
        //        "data": {
        //        }
        //    }
        //
        const code = this.safeString(response, 'code');
        const message = this.safeString(response, 'msg');
        if (code !== undefined && code !== '0') {
            const feedback = this.id + ' ' + body;
            this.throwExactlyMatchedException(this.exceptions['exact'], message, feedback);
            this.throwExactlyMatchedException(this.exceptions['exact'], code, feedback);
            this.throwBroadlyMatchedException(this.exceptions['broad'], message, feedback);
            throw new errors.ExchangeError(feedback); // unknown message
        }
        return undefined;
    }
}

module.exports = bingx;
