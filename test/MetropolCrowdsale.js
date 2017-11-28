'use strict';

import {crowdsaleUTest} from './utest/Crowdsale';
//import {crowdsaleUTest} from './node_modules/mixbytes-solidity/test/utest/Crowdsale.js';

const expectThrow = require('./helpers/expectThrow');
const MetropolToken = artifacts.require('MetropolToken.sol');
const FundsRegistry = artifacts.require('FundsRegistry.sol');
const MetropolCrowdsale = artifacts.require('MetropolCrowdsaleHelper.sol');

async function instantiate(role) {
    const token = await MetropolToken.new([role.owner1, role.owner2, role.owner3],       {from: role.nobody});
    const funds = await FundsRegistry.new([role.owner1, role.owner2, role.owner3], 2, 0, {from: role.nobody});

    const crowdsale =  await MetropolCrowdsale.new(
        token.address,
        funds.address,
        [role.owner1, role.owner2, role.owner3],
        role.nobody,
        (new Date('Mon, 1 Jan 2018 0:00:00 GMT')).getTime() / 1000,
        web3.toWei(100, 'finney'),
        web3.toWei(400, 'finney'),
        1,

        {from: role.nobody}
    );

    await token.setController(crowdsale.address, {from: role.owner1});
    await token.setController(crowdsale.address, {from: role.owner2});

    await funds.setController(crowdsale.address, {from: role.owner1});
    await funds.setController(crowdsale.address, {from: role.owner2});


    return [crowdsale, token, funds];
}


contract('CommonCrowdsleTests', function(accounts) {

    for (const [name, fn] of crowdsaleUTest(accounts, instantiate, {
        usingFund: true,
        extraPaymentFunction: 'buy',
        rate: 1,
        softCap: web3.toWei(100, 'finney'),
        hardCap: web3.toWei(400, 'finney'),
        startTime: (new Date('Mon, 1 Jan 2018 0:00:00 GMT')).getTime() / 1000,
        endTime: 60*24*3600 + (new Date('Mon, 1 Jan 2018 0:00:00 GMT')).getTime() / 1000,
        maxTimeBonus: 0,
        firstPostICOTxFinishesSale: true,
        postICOTxThrows: true,
        hasAnalytics: false,
        analyticsPaymentBonus: 0,
        // No circulation
        tokenTransfersDuringSale: false,
        foundersTokensBonus: (x) => x.mul(20).div(80)

    })) {
         it(name, fn);
    }

});


contract('MetropolCrowdsale', function(accounts) {

    const role = {
        owner3: accounts[0],
        owner1: accounts[1],
        owner2: accounts[2],
        investor1: accounts[4],
        investor2: accounts[5],
        investor3: accounts[6],
        nobody: accounts[7]
    };

    // converts amount of MTP into MTP-wei
    function MTP(amount) {
        return web3.toWei(amount, 'ether');
    }

    it("Token price test", async function() {
        const [sale, token, funds] = await instantiate(role);

        const testCalues = [
            {date: '2018-01-01 0:00:01 GMT', wei: 1000000, tokens: 1000000},
            {date: '2018-01-30 0:00:01 GMT', wei: 1000000, tokens: 1000000},
            {date: '2018-01-31 0:00:01 GMT', wei: 1000000, tokens: Math.floor(1000000/1.05)},
            {date: '2018-02-07 0:00:01 GMT', wei: 1000000, tokens: Math.floor(1000000/1.1)},
            {date: '2018-02-14 0:00:01 GMT', wei: 1000000, tokens: Math.floor(1000000/1.15)},
            {date: '2018-02-21 0:00:01 GMT', wei: 1000000, tokens: Math.floor(1000000/1.2)},
            {date: '2018-02-28 0:00:01 GMT', wei: 1000000, tokens: Math.floor(1000000/1.25)},
        ];

        let prevBalance = 0;
        for (let values of testCalues) {
            await sale.setTime((new Date(values.date)).getTime() / 1000);
            assert.equal(prevBalance, await token.balanceOf(role.investor1));
            await sale.sendTransaction({from: role.investor1, value: values.wei});
            assert.equal(prevBalance+values.tokens, await token.balanceOf(role.investor1));
            prevBalance += values.tokens
        }
    });

    it("Set rate available only before start", async function() {
        const [sale, token, funds] = await instantiate(role);

        //check set rate before time
        await sale.setTime((new Date('2017-12-28 0:00:01 GMT')).getTime() / 1000);
        await sale.setExchangeRate(10, {from: role.owner1});
        assert.equal(1, (await sale.m_exchangeRate()).valueOf());
        await sale.setExchangeRate(10, {from: role.owner2});
        assert.equal(10, (await sale.m_exchangeRate()).valueOf());

        //check set rate after time
        await sale.setTime((new Date('2018-01-02 0:00:01 GMT')).getTime() / 1000);
        await expectThrow(sale.setExchangeRate(11, {from: role.owner1}));
        await expectThrow(sale.setExchangeRate(11, {from: role.owner2}));

    });

    it("Check founders tokens", async function() {
        const [sale, token, funds] = await instantiate(role);

        await sale.setTime((new Date('2018-01-02 0:00:01 GMT')).getTime() / 1000);
        await sale.sendTransaction({from: role.investor1, value: web3.toWei(100, 'finney')});

        await sale.setTime((new Date('2018-03-02 0:00:01 GMT')).getTime() / 1000);
        await sale.sendTransaction({from: role.investor1, value: web3.toWei(100, 'finney')}); //unsuccessful, finishes ico

        assert.equal(web3.toWei(25, 'finney'), (await token.balanceOf(role.nobody)).valueOf());
        assert.equal(web3.toWei(125, 'finney'), (await token.totalSupply()).valueOf());
    });

});