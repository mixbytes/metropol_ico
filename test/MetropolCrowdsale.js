'use strict';

const expectThrow = require('./helpers/expectThrow');
const MetropolToken = artifacts.require('MetropolToken.sol');
const MetropolCrowdsale = artifacts.require('MetropolCrowdsale.sol');

contract('MetropolCrowdsale', function(accounts) {

    const role = {
        owner3: accounts[0],
        owner1: accounts[1],
        owner2: accounts[2],
        controller: accounts[3],
        investor1: accounts[4],
        investor2: accounts[5],
        investor3: accounts[6],
        nobody: accounts[7]
    };

    // converts amount of MTP into MTP-wei
    function MTP(amount) {
        return web3.toWei(amount, 'ether');
    }

    async function instantiate() {
        const token     = await MetropolToken.new([role.owner1, role.owner2, role.owner3], {from: role.nobody});


       // const crowdsale = await

         try { await   MetropolCrowdsale.new(
            token.address,
            [role.owner1, role.owner2, role.owner3],
            1,
            100,
            200,
            10,
            0x2,

            {from: role.nobody}
        ); } catch(error) {
             console.log(error);
         }

        // await token.setController(role.owner1, {from: role.owner1});
        // await token.setController(role.owner1, {from: role.owner2});
        //
        // await token.mint(role.investor1, MTP(10), {from: role.owner1});
        // await token.mint(role.investor2, MTP(12), {from: role.owner1});
        // // await token.disableMinting({from: role.owner1});
        //
        // await token.startCirculation({from: role.owner1});
        //

        return token;
    }


    it("Complex ownership test", async function() {
        const c = await instantiate();

    });

});