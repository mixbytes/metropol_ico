/**
 * Based on Zeppelin solidity code. Origin license:
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Smart Contract Solutions, Inc.
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

const expectThrow = require('../helpers/expectThrow');
const MintableToken = artifacts.require('MintableTokenHelper.sol');

contract('MintableToken', function(accounts) {
    let token;

    beforeEach(async function() {
        token = await MintableToken.new();
    });

    it('should start with a totalSupply of 0', async function() {
        let totalSupply = await token.totalSupply();

        assert.equal(totalSupply, 0);
    });

    it('should mint a given amount of tokens to a given address', async function() {
        const result = await token.mint(accounts[0], 100);
        assert.equal(result.logs[0].event, 'Mint');
        assert.equal(result.logs[0].args.to.valueOf(), accounts[0]);
        assert.equal(result.logs[0].args.amount.valueOf(), 100);
        assert.equal(result.logs[1].event, 'Transfer');
        assert.equal(result.logs[1].args.from.valueOf(), 0x0);

        let balance0 = await token.balanceOf(accounts[0]);
        assert(balance0, 100);

        let totalSupply = await token.totalSupply();
        assert(totalSupply, 100);
    });

    it('mint only non-zero amount', async function() {
        await expectThrow(token.mint(accounts[0], 0))
    });

    it('mint only to non-zero address', async function() {
        await expectThrow(token.mint(0, 10))
    });
});