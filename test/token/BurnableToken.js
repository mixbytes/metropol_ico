'use strict';

const expectThrow = require('../helpers/expectThrow');
const BurnableToken = artifacts.require('BurnableTokenHelper.sol');

contract('BurnableToken', function(accounts) {
    let token;

    beforeEach(async function() {
        token = await BurnableToken.new();
    });

    it('simple burning', async function() {

        assert.equal(1000, await token.balanceOf(accounts[0]));

        const result = await token.burn(accounts[0], 99);
        assert.equal(result.logs[0].event, 'Burn');
        assert.equal(result.logs[0].args.from.valueOf(), accounts[0]);
        assert.equal(result.logs[0].args.amount.valueOf(), 99);
        assert.equal(result.logs[1].event, 'Transfer');
        assert.equal(result.logs[1].args.to.valueOf(), 0x0);

        assert.equal(901, await token.balanceOf(accounts[0]));

        assert(901, await token.totalSupply());
    });


    it('must not burn more than exist', async function() {
        assert.equal(1000, await token.balanceOf(accounts[0]));
        await expectThrow(token.burn(accounts[0], 1001))
    });

    it('burn only non-zero amount', async function() {
        assert.equal(1000, await token.balanceOf(accounts[0]));
        await expectThrow(token.burn(accounts[0], 0))
    });
});