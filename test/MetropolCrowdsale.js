'use strict';

import {crowdsaleUTest} from './utest/Crowdsale';
//import {crowdsaleUTest} from './node_modules/mixbytes-solidity/test/utest/Crowdsale.js';

const expectThrow = require('./helpers/expectThrow');
const MetropolToken = artifacts.require('MetropolToken.sol');
const FundsRegistry = artifacts.require('FundsRegistry.sol');
const MetropolCrowdsale = artifacts.require('MetropolCrowdsaleHelper.sol');


contract('CommonCrowdsleTests', function(accounts) {
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







//
// contract('MetropolCrowdsale', function(accounts) {
//
//     const role = {
//         owner3: accounts[0],
//         owner1: accounts[1],
//         owner2: accounts[2],
//         controller: accounts[3],
//         investor1: accounts[4],
//         investor2: accounts[5],
//         investor3: accounts[6],
//         nobody: accounts[7]
//     };
//
//     // converts amount of MTP into MTP-wei
//     function MTP(amount) {
//         return web3.toWei(amount, 'ether');
//     }
//
//     async function instantiate() {
//         const token = await MetropolToken.new([role.owner1, role.owner2, role.owner3],       {from: role.nobody});
//         const funds = await FundsRegistry.new([role.owner1, role.owner2, role.owner3], 2, 0, {from: role.nobody});
//
//         const crowdsale =  await MetropolCrowdsale.new(
//             token.address,
//             funds.address,
//             [role.owner1, role.owner2, role.owner3],
//             1,
//             100,
//             200,
//             10,
//             0x2,
//
//             {from: role.nobody}
//         );
//
//         await token.setController(role.owner1, {from: role.owner1});
//         await token.setController(role.owner1, {from: role.owner2});
//         //
//         // await token.mint(role.investor1, MTP(10), {from: role.owner1});
//         // await token.mint(role.investor2, MTP(12), {from: role.owner1});
//         // // await token.disableMinting({from: role.owner1});
//         //
//         // await token.startCirculation({from: role.owner1});
//         //
//
//         return token;
//     }
//
//
//     it("Complex ownership test", async function() {
//         const c = await instantiate();
//
//     });
//
// });