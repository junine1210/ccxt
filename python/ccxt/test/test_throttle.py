import os
import sys

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(root)

# ----------------------------------------------------------------------------

import asyncio  # noqa: E402
import time  # noqa: E402
from ccxt.async_support.base.throttler import Throttler as Throttle  # noqa: E402
# from ccxt.async_support.base.throttle import throttle as Throttle


delta = 50

test_cases = [
    {
        'capacity': 0,
        'refillRate': 1 / 50,
        'cost': 1,
        'runs': 100,
    },
    {
        'capacity': 20,
        'refillRate': 1 / 50,
        'cost': 1,
        'runs': 100,
    },
    {
        'capacity': 40,
        'refillRate': 1 / 50,
        'cost': 1,
        'runs': 100,
    },
    {
        'capacity': 0,
        'refillRate': 1 / 20,
        'cost': 1,
        'runs': 100,
    },
    {
        'capacity': 100,
        'refillRate': 1 / 20,
        'cost': 5,
        'runs': 50,
    },
    {
        'capacity': 0,
        'refillRate': 1 / 40,
        'cost': 2,
        'runs': 50,
    },
    {
        'capacity': 1,
        'refillRate': 1 / 100,
        'cost': 1,
        'runs': 10,
    },
    {
        'capacity': 5,
        'refillRate': 1 / 100,
        'cost': 1,
        'runs': 10,
    },
    {
        'capacity': 0,
        'refillRate': 1 / 500,
        'cost': 1,
        'runs': 10,
    },
]

# add any more tests you want above


for i, case in enumerate(test_cases, 1):
    case['number'] = i
    # while the tokenBucket has capacity the throttler should return instantly
    # so the first capacity / cost runs are deducted
    instantly_complete = case['capacity'] / case['cost']
    # after that each run will take cost and the total time will be runs * cost / refillRate
    remaining = case['runs'] - instantly_complete
    case['expected'] = remaining * case['cost'] / case['refillRate']


async def schedule(case):
    # 😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏
    thot = Throttle({
        'capacity': case['capacity'],
        'refillRate': case['refillRate'],
    })
    start = time.perf_counter_ns()
    for i in range(case['runs']):
        await thot(case['cost'])
    end = time.perf_counter_ns()
    elapsed_ms = (end - start) / 1000000
    result = abs(case['expected'] - elapsed_ms) < delta
    print(f'case {case["number"]} {"succeeded" if result else "failed"} in {elapsed_ms}ms expected {case["expected"]}ms')
    assert result


async def main():
    await asyncio.wait([schedule(case) for case in test_cases], return_when=asyncio.ALL_COMPLETED)


asyncio.run(main())

# output

'''
case 8 succeeded in 501.224333ms expected 500.0ms
case 7 succeeded in 900.647542ms expected 900.0ms
case 4 succeeded in 2000.706958ms expected 2000.0ms
case 5 succeeded in 3001.669125ms expected 3000.0ms
case 3 succeeded in 3001.736666ms expected 3000.0ms
case 6 succeeded in 4001.392584ms expected 4000.0ms
case 2 succeeded in 4001.503833ms expected 4000.0ms
case 9 succeeded in 5001.487ms expected 5000.0ms
case 1 succeeded in 5001.635042ms expected 5000.0ms
'''
