'use strict';

const expectThrow = require('../helpers/expectThrow');
const CirculatingControlledToken = artifacts.require('CirculatingControlledTokenHelper.sol');

contract('CirculatingControlledToken', function(accounts) {
    let token;

    beforeEach(async function() {
        token = await CirculatingControlledToken.new();
    });

    it('fail on start circulating by non-controller', async function() {
        await expectThrow(token.startCirculation({from:accounts[3]}))
    });

    it('should start circulating called by controller (only once)', async function() {
        await token.setController(accounts[3]);

        assert.equal(false, await token.m_isCirculating());
        await token.startCirculation({from:accounts[3]}).valueOf();
        assert.equal(true, await token.m_isCirculating());

        await expectThrow(token.startCirculation({from:accounts[3]}).valueOf());
    });


});