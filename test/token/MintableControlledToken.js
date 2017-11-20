'use strict';

const expectThrow = require('../helpers/expectThrow');
const MintableControlledToken = artifacts.require('MintableControlledTokenHelper.sol');

contract('MintableControlledToken', function(accounts) {
    let token;

    beforeEach(async function() {
        token = await MintableControlledToken.new();
    });

    it('fail on mint by non-controller', async function() {
        await expectThrow(token.mint(accounts[0], 100, {from:accounts[3]}))
    });

    it('fail on mint by non-controller with set controller', async function() {
        token.setController(accounts[3]);
        await expectThrow(token.mint(accounts[0], 100, {from:accounts[2]}))
    });

    it('should mint a given amount of tokens to a given address (by controller)', async function() {
        token.setController(accounts[3]);

        const result = await token.mint(accounts[0], 100, {from:accounts[3]});

        assert.equal(100, await token.balanceOf(accounts[0]));
        assert.equal(100, await token.totalSupply());
    });


});