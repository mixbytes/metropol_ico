'use strict';

const expectThrow = require('./helpers/expectThrow');
const MetropolToken = artifacts.require('MetropolToken.sol');

contract('MetropolToken', function(accounts) {
    let token;

    const role = {
        owner3: accounts[0],
        owner1: accounts[1],
        owner2: accounts[2],
        investor1: accounts[2],
        investor2: accounts[3],
        investor3: accounts[4],
        nobody: accounts[5]
    };

    // converts amount of MTP into MTP-wei
    function MTP(amount) {
        return web3.toWei(amount, 'ether');
    }

    async function instantiate() {
        const token = await MetropolToken.new([role.owner1, role.owner2, role.owner3], {from: role.nobody});

        await token.setController(role.owner1, {from: role.owner1});
        await token.setController(role.owner1, {from: role.owner2});

        await token.mint(role.investor1, MTP(10), {from: role.owner1});
        await token.mint(role.investor2, MTP(12), {from: role.owner1});
        // await token.disableMinting({from: role.owner1});

        await token.startCirculation({from: role.owner1});

        return token;
    }


    it("test ERC20 is supported", async function() {
        const token = await instantiate();

        await token.name({from: role.nobody});
        await token.symbol({from: role.nobody});
        await token.decimals({from: role.nobody});

        assert((await token.totalSupply({from: role.nobody})).eq(MTP(22)));
        assert.equal(await token.balanceOf(role.investor1, {from: role.nobody}), MTP(10));

        await token.transfer(role.investor2, MTP(2), {from: role.investor1});
        assert.equal(await token.balanceOf(role.investor1, {from: role.nobody}), MTP(8));
        assert.equal(await token.balanceOf(role.investor2, {from: role.nobody}), MTP(14));

        await token.approve(role.investor2, MTP(3), {from: role.investor1});
        assert.equal(await token.allowance(role.investor1, role.investor2, {from: role.nobody}), MTP(3));
        await token.transferFrom(role.investor1, role.investor3, MTP(2), {from: role.investor2});
        assert.equal(await token.allowance(role.investor1, role.investor2, {from: role.nobody}), MTP(1));
        assert.equal(await token.balanceOf(role.investor1, {from: role.nobody}), MTP(6));
        assert.equal(await token.balanceOf(role.investor2, {from: role.nobody}), MTP(14));
        assert.equal(await token.balanceOf(role.investor3, {from: role.nobody}), MTP(2));
    });

});