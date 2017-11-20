'use strict';

const expectThrow = require('../helpers/expectThrow');
const BurnableControlledToken = artifacts.require('BurnableControlledTokenHelper.sol');

contract('BurnableControlledToken', function(accounts) {
    let token;

    beforeEach(async function() {
        token = await BurnableControlledToken.new();
    });

    it('fail on burn by non-controller', async function() {
        await expectThrow(token.burn(accounts[0], 100, {from:accounts[3]}))
    });

    it('fail on burn by non-controller with set controller', async function() {
        token.setController(accounts[3]);
        await expectThrow(token.burn(accounts[0], 100, {from:accounts[2]}))
    });

    it('burn by controller', async function() {
        token.setController(accounts[3]);

        assert.equal(1000, await token.balanceOf(accounts[0]));

        const result = await token.burn(accounts[0], 99, {from:accounts[3]});

        assert.equal(901, await token.balanceOf(accounts[0]));
        assert(901, await token.totalSupply());
    });


});