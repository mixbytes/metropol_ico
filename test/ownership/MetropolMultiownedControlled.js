'use strict';

const expectThrow = require('../helpers/expectThrow');

const MetropolMultiownedControlled = artifacts.require("MetropolMultiownedControlled.sol");

contract('MetropolMultiownedControlled', function(accounts) {

    const roles = {
        owner1: accounts[0],
        owner2: accounts[1],
        owner3: accounts[2],
        nobody1: accounts[3],
        nobody2: accounts[4],
        nobody3: accounts[5]
    };

    let contract;

    beforeEach(async function() {
        contract = await MetropolMultiownedControlled.new([roles.owner1, roles.owner2, roles.owner3], 2);
    });

    it("correct multiowned init", async function() {
        assert.equal(2, await contract.m_multiOwnedRequired());
        assert.equal(3, await contract.m_numOwners());

        assert.equal(true, await contract.isOwner(roles.owner1));
        assert.equal(true, await contract.isOwner(roles.owner2));
        assert.equal(true, await contract.isOwner(roles.owner3));
        assert.equal(false, await contract.isOwner(roles.nobody1));
        assert.equal(false, await contract.isOwner(roles.nobody2));

    });

    it("set controller fails on non owner", async function() {
        await expectThrow(contract.setController(roles.nobody1, {from: roles.nobody1}));
    });

    it("set controller multiowned", async function() {
        await contract.setController(roles.nobody2, {from: roles.owner1});
        assert.equal(await contract.m_controller(), '0x0000000000000000000000000000000000000000');

        await contract.setController(roles.nobody2, {from: roles.owner1});
        assert.equal(await contract.m_controller(), '0x0000000000000000000000000000000000000000');

        await contract.setController(roles.nobody2, {from: roles.owner3});
        assert.equal(await contract.m_controller(), roles.nobody2);
    });

});
