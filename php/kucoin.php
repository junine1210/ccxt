<?php

namespace ccxtpro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use \ccxtpro\ClientTrait; // websocket functionality
use Exception; // a common import
use \ccxt\ExchangeError;

class kucoin extends \ccxt\kucoin {

    use ClientTrait;

    public function describe () {
        return array_replace_recursive(parent::describe (), array(
            'has' => array(
                'watchOrderBook' => true,
            ),
            'options' => array(
                'watchOrderBookRate' => 100, // get updates every 100ms or 1000ms
            ),
        ));
    }

    public function watch_order_book ($symbol, $limit = null, $params = array ()) {
        $this->load_markets();
        $market = $this->market ($symbol);
        //
        // https://docs.kucoin.com/#level-2-$market-$data
        //
        // 1. After receiving the websocket Level 2 $data flow, cache the $data->
        // 2. Initiate a REST $request to get the snapshot $data of Level 2 order book.
        // 3. Playback the cached Level 2 $data flow.
        // 4. Apply the new Level 2 $data flow to the local snapshot to ensure that
        // the sequence of the new Level 2 update lines up with the sequence of
        // the previous Level 2 $data-> Discard all the message prior to that
        // sequence, and then playback the change to snapshot.
        // 5. Update the level2 full $data based on sequence according to the
        // size. If the price is 0, ignore the messages and update the sequence.
        // If the size=0, update the sequence and remove the price of which the
        // size is 0 out of level 2. For other cases, please update the price.
        //
        $tokenResponse = $this->safe_value($this->options, 'token');
        if ($tokenResponse === null) {
            $throwException = false;
            if ($this->check_required_credentials($throwException)) {
                $tokenResponse = $this->privatePostBulletPrivate ();
                //
                //     {
                //         code => "200000",
                //         $data => {
                //             $instanceServers => array(
                //                 {
                //                     pingInterval =>  50000,
                //                     $endpoint => "wss://push-private.kucoin.com/endpoint",
                //                     protocol => "websocket",
                //                     encrypt => true,
                //                     pingTimeout => 10000
                //                 }
                //             ),
                //             $token => "2neAiuYvAU61ZDXANAGAsiL4-iAExhsBXZxftpOeh_55i3Ysy2q2LEsEWU64mdzUOPusi34M_wGoSf7iNyEWJ1UQy47YbpY4zVdzilNP-Bj3iXzrjjGlWtiYB9J6i9GjsxUuhPw3BlrzazF6ghq4Lzf7scStOz3KkxjwpsOBCH4=.WNQmhZQeUKIkh97KYgU0Lg=="
                //         }
                //     }
                //
            } else {
                $tokenResponse = $this->publicPostBulletPublic ();
            }
        }
        $data = $this->safe_value($tokenResponse, 'data', array());
        $instanceServers = $this->safe_value($data, 'instanceServers', array());
        $firstServer = $this->safe_value($instanceServers, 0, array());
        $endpoint = $this->safe_string($firstServer, 'endpoint');
        $token = $this->safe_string($data, 'token');
        $nonce = $this->nonce ();
        $query = array(
            'token' => $token,
            'connectId' => $nonce,
            'acceptUserMessage' => 'true',
        );
        $url = $endpoint . '?' . $this->urlencode ($query);
        $topic = '/market/level2';
        $messageHash = $topic . ':' . $market['id'];
        $subscribe = array(
            'id' => $nonce,
            'type' => 'subscribe',
            'topic' => $messageHash,
            'response' => true,
        );
        $subscription = array(
            'id' => (string) $nonce,
            'symbol' => $symbol,
            'topic' => $topic,
            'messageHash' => $messageHash,
            'method' => array($this, 'handle_order_book_subscription'),
        );
        $request = array_merge($subscribe, $params);
        $future = $this->watch ($url, $messageHash, $request, $messageHash, $subscription);
        return $this->after ($future, array($this, 'limit_order_book'), $symbol, $limit, $params);
        // return $this->watch ($url, $messageHash, $request, $messageHash);
        // // $token = $this->publicPostBulletPublic ();
        // $name = 'book';
        // $request = array();
        // if ($limit !== null) {
        //     $request['subscription'] = array(
        //         'depth' => $limit, // default 10, valid options 10, 25, 100, 500, 1000
        //     );
        // }
        // return $this->watchPublic ($name, $symbol, array_merge($request, $params));
    }

    public function limit_order_book ($orderbook, $symbol, $limit = null, $params = array ()) {
        return $orderbook->limit ($limit);
    }

    public function fetch_order_book_snapshot ($client, $message, $subscription) {
        $symbol = $this->safe_string($subscription, 'symbol');
        $messageHash = $this->safe_string($subscription, 'messageHash');
        // 3. Get a depth $snapshot from https://www.binance.com/api/v1/depth?$symbol=BNBBTC&limit=1000 .
        // todo => this is a synch blocking call in ccxt.php - make it async
        $snapshot = $this->fetch_order_book($symbol);
        $orderbook = $this->orderbooks[$symbol];
        $orderbook->reset ($snapshot);
        // unroll the accumulated deltas
        $messages = $orderbook->cache;
        for ($i = 0; $i < count($messages); $i++) {
            $message = $messages[$i];
            $this->handle_order_book_message ($client, $message, $orderbook);
        }
        $this->orderbooks[$symbol] = $orderbook;
        $client->resolve ($orderbook, $messageHash);
    }

    public function handle_delta ($bookside, $delta) {
        $price = $this->safe_float($delta, 0);
        $amount = $this->safe_float($delta, 1);
        $bookside->store ($price, $amount);
    }

    public function handle_deltas ($bookside, $deltas) {
        for ($i = 0; $i < count($deltas); $i++) {
            $this->handle_delta ($bookside, $deltas[$i]);
        }
    }

    public function handle_order_book_message ($client, $message, $orderbook) {
        $u = $this->safe_integer_2($message, 'u', 'lastUpdateId');
        // merge accumulated deltas
        // 4. Drop any event where $u is <= lastUpdateId in the snapshot.
        if ($u > $orderbook['nonce']) {
            $U = $this->safe_integer($message, 'U');
            // 5. The first processed event should have $U <= lastUpdateId+1 AND $u >= lastUpdateId+1.
            if (($U !== null) && (($U - 1) > $orderbook['nonce'])) {
                throw new ExchangeError($this->id . ' handleOrderBook received an out-of-order nonce');
            }
            $this->handle_deltas ($orderbook['asks'], $this->safe_value($message, 'a', array()));
            $this->handle_deltas ($orderbook['bids'], $this->safe_value($message, 'b', array()));
            $orderbook['nonce'] = $u;
            $timestamp = $this->safe_integer($message, 'E');
            $orderbook['timestamp'] = $timestamp;
            $orderbook['datetime'] = $this->iso8601 ($timestamp);
        }
        return $orderbook;
    }

    public function handle_order_book ($client, $message) {
        //
        // initial snapshot is fetched with ccxt's fetchOrderBook
        // the feed does not include a snapshot, just the deltas
        //
        //     {
        //         "e" => "depthUpdate", // Event type
        //         "E" => 1577554482280, // Event time
        //         "s" => "BNBBTC", // Symbol
        //         "U" => 157, // First update ID in event
        //         "u" => 160, // Final update ID in event
        //         "b" => array( // bids
        //             array( "0.0024", "10" ), // price, size
        //         ),
        //         "a" => array( // asks
        //             array( "0.0026", "100" ), // price, size
        //         )
        //     }
        //
        $marketId = $this->safe_string($message, 's');
        $market = null;
        $symbol = null;
        if ($marketId !== null) {
            if (is_array($this->markets_by_id) && array_key_exists($marketId, $this->markets_by_id)) {
                $market = $this->markets_by_id[$marketId];
                $symbol = $market['symbol'];
            }
        }
        $name = 'depth';
        $messageHash = $market['lowercaseId'] . '@' . $name;
        $orderbook = $this->orderbooks[$symbol];
        if ($orderbook['nonce'] !== null) {
            // 5. The first processed event should have U <= lastUpdateId+1 AND u >= lastUpdateId+1.
            // 6. While listening to the stream, each new event's U should be equal to the previous event's u+1.
            $this->handle_order_book_message ($client, $message, $orderbook);
            $client->resolve ($orderbook, $messageHash);
        } else {
            // 2. Buffer the events you receive from the stream.
            $orderbook->cache[] = $message;
        }
    }

    public function sign_message ($client, $messageHash, $message, $params = array ()) {
        // todo => implement kucoin signMessage
        return $message;
    }

    public function handle_order_book_subscription ($client, $message, $subscription) {
        $symbol = $this->safe_string($subscription, 'symbol');
        if (is_array($this->orderbooks) && array_key_exists($symbol, $this->orderbooks)) {
            unset($this->orderbooks[$symbol]);
        }
        $this->orderbooks[$symbol] = $this->limited_order_book();
        // fetch the snapshot in a separate async call
        $this->spawn (array($this, 'fetch_order_book_snapshot'), $client, $message, $subscription);
    }

    public function handle_subscription_status ($client, $message) {
        //
        //     {
        //         id => '1578090438322',
        //         type => 'ack'
        //     }
        //
        $requestId = $this->safe_string($message, 'id');
        $subscriptionsByRequestId = $this->index_by($client->subscriptions, 'id');
        $subscription = $this->safe_value($subscriptionsByRequestId, $requestId, array());
        $method = $this->safe_value($subscription, 'method');
        if ($method !== null) {
            $this->call ($method, $client, $message, $subscription);
        }
        return $message;
    }

    public function handle_system_status ($client, $message) {
        //
        // todo => answer the question whether handleSystemStatus should be renamed
        // and unified as handleStatus for any usage pattern that
        // involves system status and maintenance updates
        //
        //     {
        //         id => '1578090234088', // connectId
        //         type => 'welcome',
        //     }
        //
        var_dump ($message);
        return $message;
    }

    public function handle_subject ($client, $message) {
        //
        //     {
        //         "type":"$message",
        //         "topic":"/market/level2:BTC-USDT",
        //         "$subject":"trade.l2update",
        //         "data":{
        //             "sequenceStart":1545896669105,
        //             "sequenceEnd":1545896669106,
        //             "symbol":"BTC-USDT",
        //             "changes" => {
        //                 "asks" => [["6","1","1545896669105"]], // price, size, sequence
        //                 "bids" => [["4","1","1545896669106"]]
        //             }
        //         }
        //     }
        //
        $subject = $this->safe_string($message, 'subject');
        $methods = array(
            'trade.l2update' => array($this, 'handle_order_book'),
        );
        $method = $this->safe_value($methods, $subject);
        if ($method === null) {
            return $message;
        } else {
            return $this->call ($method, $client, $message);
        }
    }

    public function handle_error_message ($client, $message) {
        return $message;
    }

    public function handle_message ($client, $message) {
        if ($this->handle_error_message ($client, $message)) {
            $type = $this->safe_string($message, 'type');
            $methods = array(
                // 'heartbeat' => $this->handleHeartbeat,
                'welcome' => array($this, 'handle_system_status'),
                'ack' => array($this, 'handle_subscription_status'),
                'message' => array($this, 'handle_subject'),
            );
            $method = $this->safe_value($methods, $type);
            if ($method === null) {
                return $message;
            } else {
                return $this->call ($method, $client, $message);
            }
        }
    }
}
