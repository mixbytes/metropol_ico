'use strict';

const expectThrow = require('../helpers/expectThrow');
const Controlled = artifacts.require('ControlledHelper.sol');

contract('Controlled', function(accounts) {
    let contract;

    beforeEach(async function() {
        contract = await Controlled.new();
    });

    it('default controller is empty', async function() {
        assert.equal(await contract.m_controller(), '0x0000000000000000000000000000000000000000');
    });

    it('set controller works', async function() {
        await contract.setController(accounts[3]);

        assert.equal(await contract.m_controller(), accounts[3]);
    });

    it('detach controller can be called only from controler', async function() {

        await expectThrow(contract.detachController());
    });

    it('detach controller works', async function() {
        await contract.setController(accounts[3], {from:accounts[0]});

        contract.detachController({from:accounts[3]});
        assert.equal(await contract.m_controller(), '0x0000000000000000000000000000000000000000');
    });

});