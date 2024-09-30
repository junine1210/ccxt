import Exchange from './abstract/digifinex.js';
import type { FundingRateHistory, Int, OHLCV, Order, OrderSide, OrderType, OrderRequest, Trade, Balances, Str, Transaction, Ticker, OrderBook, Tickers, Strings, Market, Currency, TransferEntry, Num, MarginModification, TradingFeeInterface, Currencies, CrossBorrowRate, CrossBorrowRates, Dict, LeverageTier, LeverageTiers, int, LedgerEntry, FundingRate } from './base/types.js';
/**
 * @class digifinex
 * @augments Exchange
 */
export default class digifinex extends Exchange {
    describe(): any;
    fetchCurrencies(params?: {}): Promise<Currencies>;
    fetchMarkets(params?: {}): Promise<Market[]>;
    fetchMarketsV2(params?: {}): Promise<any[]>;
    fetchMarketsV1(params?: {}): Promise<any[]>;
    parseBalance(response: any): Balances;
    fetchBalance(params?: {}): Promise<Balances>;
    fetchOrderBook(symbol: string, limit?: Int, params?: {}): Promise<OrderBook>;
    fetchTickers(symbols?: Strings, params?: {}): Promise<Tickers>;
    fetchTicker(symbol: string, params?: {}): Promise<Ticker>;
    parseTicker(ticker: Dict, market?: Market): Ticker;
    parseTrade(trade: Dict, market?: Market): Trade;
    fetchTime(params?: {}): Promise<number>;
    fetchStatus(params?: {}): Promise<{
        status: string;
        updated: any;
        eta: any;
        url: any;
        info: any;
    }>;
    fetchTrades(symbol: string, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    parseOHLCV(ohlcv: any, market?: Market): OHLCV;
    fetchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<OHLCV[]>;
    createOrder(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, params?: {}): Promise<Order>;
    createOrders(orders: OrderRequest[], params?: {}): Promise<Order[]>;
    createOrderRequest(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, params?: {}): any;
    createMarketBuyOrderWithCost(symbol: string, cost: number, params?: {}): Promise<Order>;
    cancelOrder(id: string, symbol?: Str, params?: {}): Promise<import("./base/types.js").Dictionary<any>>;
    parseCancelOrders(response: any): any[];
    cancelOrders(ids: any, symbol?: Str, params?: {}): Promise<any[]>;
    parseOrderStatus(status: Str): string;
    parseOrder(order: Dict, market?: Market): Order;
    fetchOpenOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    fetchMyTrades(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    parseLedgerEntryType(type: any): string;
    parseLedgerEntry(item: Dict, currency?: Currency): LedgerEntry;
    fetchLedger(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<LedgerEntry[]>;
    parseDepositAddress(depositAddress: any, currency?: Currency): {
        info: any;
        currency: string;
        address: string;
        tag: string;
        network: any;
    };
    fetchDepositAddress(code: string, params?: {}): Promise<any>;
    fetchTransactionsByType(type: any, code?: Str, since?: Int, limit?: Int, params?: {}): Promise<Transaction[]>;
    fetchDeposits(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<Transaction[]>;
    fetchWithdrawals(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<Transaction[]>;
    parseTransactionStatus(status: Str): string;
    parseTransaction(transaction: Dict, currency?: Currency): Transaction;
    parseTransferStatus(status: Str): Str;
    parseTransfer(transfer: Dict, currency?: Currency): TransferEntry;
    transfer(code: string, amount: number, fromAccount: string, toAccount: string, params?: {}): Promise<TransferEntry>;
    withdraw(code: string, amount: number, address: string, tag?: any, params?: {}): Promise<Transaction>;
    fetchBorrowInterest(code?: Str, symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<any>;
    parseBorrowInterest(info: Dict, market?: Market): {
        account: string;
        symbol: string;
        currency: string;
        interest: any;
        interestRate: number;
        amountBorrowed: number;
        timestamp: any;
        datetime: any;
        info: Dict;
    };
    fetchCrossBorrowRate(code: string, params?: {}): Promise<CrossBorrowRate>;
    fetchCrossBorrowRates(params?: {}): Promise<CrossBorrowRates>;
    parseBorrowRate(info: any, currency?: Currency): {
        currency: string;
        rate: number;
        period: number;
        timestamp: number;
        datetime: string;
        info: any;
    };
    parseBorrowRates(info: any, codeKey: any): any;
    fetchFundingRate(symbol: string, params?: {}): Promise<FundingRate>;
    parseFundingRate(contract: any, market?: Market): FundingRate;
    parseFundingInterval(interval: any): string;
    fetchFundingRateHistory(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<FundingRateHistory[]>;
    fetchTradingFee(symbol: string, params?: {}): Promise<TradingFeeInterface>;
    parseTradingFee(fee: Dict, market?: Market): TradingFeeInterface;
    fetchPositions(symbols?: Strings, params?: {}): Promise<import("./base/types.js").Position[]>;
    fetchPosition(symbol: string, params?: {}): Promise<import("./base/types.js").Position>;
    parsePosition(position: Dict, market?: Market): import("./base/types.js").Position;
    setLeverage(leverage: Int, symbol?: Str, params?: {}): Promise<any>;
    fetchTransfers(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<TransferEntry[]>;
    fetchLeverageTiers(symbols?: Strings, params?: {}): Promise<LeverageTiers>;
    fetchMarketLeverageTiers(symbol: string, params?: {}): Promise<LeverageTier[]>;
    parseMarketLeverageTiers(info: any, market?: Market): LeverageTier[];
    handleMarginModeAndParams(methodName: any, params?: {}, defaultValue?: any): any[];
    fetchDepositWithdrawFees(codes?: Strings, params?: {}): Promise<Dict>;
    parseDepositWithdrawFees(response: any, codes?: any, currencyIdKey?: any): Dict;
    addMargin(symbol: string, amount: number, params?: {}): Promise<MarginModification>;
    reduceMargin(symbol: string, amount: number, params?: {}): Promise<MarginModification>;
    modifyMarginHelper(symbol: string, amount: any, type: any, params?: {}): Promise<MarginModification>;
    parseMarginModification(data: Dict, market?: Market): MarginModification;
    fetchFundingHistory(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<import("./base/types.js").FundingHistory[]>;
    parseIncome(income: any, market?: Market): {
        info: any;
        symbol: string;
        code: string;
        timestamp: number;
        datetime: string;
        id: any;
        amount: number;
    };
    setMarginMode(marginMode: string, symbol?: Str, params?: {}): Promise<any>;
    sign(path: any, api?: any[], method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
    handleErrors(statusCode: int, statusText: string, url: string, method: string, responseHeaders: Dict, responseBody: any, response: any, requestHeaders: any, requestBody: any): any;
}
