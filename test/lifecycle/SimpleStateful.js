'use strict';

const expectThrow = require('../helpers/expectThrow');

const SimpleStateful = artifacts.require("./test_helpers/SimpleStatefulHelper.sol");

contract('SimpleStateful', function(accounts) {

    const roles = {
        cash: accounts[0],
        owner3: accounts[0],
        owner1: accounts[1],
        owner2: accounts[2],
        controller1: accounts[2],
        controller2: accounts[3],
        controller3: accounts[4],
        investor1: accounts[2],
        investor2: accounts[4],
        investor3: accounts[5],
        nobody: accounts[9]
    };

    let contract;

    beforeEach(async function() {
        contract = await SimpleStateful.new({from: roles.owner1});
    });

//    0 - INIT
//    1 - RUNNING
//    2 - PAUSED
//    3 - FAILED
//    4 - SUCCEEDED

    it("Initial state at start is INIT", async function() {
        assert.equal(await contract.m_state(), '0');
    });

    describe('Change state INIT', function() {
        it("If change State INIT to INIT throw function changeState, contract raise error", async function() {
            await expectThrow(contract.changeStatePublic(0));
        });

        it("If change State INIT to RUNNING throw function changeState, state changed to RUNNING", async function() {
            await contract.changeStatePublic(1);
            assert.equal(await contract.m_state(), 1);
        });

        it("If change State INIT to PAUSED throw function changeState, contract raise error", async function() {
            await expectThrow(contract.changeStatePublic(2));
        });

        it("If change State INIT to FAILED throw function changeState, contract raise error", async function() {
            await expectThrow(contract.changeStatePublic(3));
        });

        it("If change State INIT to SUCCEEDED throw function changeState, contract raise error", async function() {
            await expectThrow(contract.changeStatePublic(4));
        });
    });

    describe('Change state RUNNING', function() {
        it("If change State RUNNING to INIT throw function changeState, contract raise error", async function() {
            await contract.setState(1);
            await expectThrow(contract.changeStatePublic(0));
        });

        it("If change State RUNNING to RUNNING throw function changeState, contract raise error", async function() {
            await contract.setState(1);
            await expectThrow(contract.changeStatePublic(1));
        });

        it("If change State RUNNING to PAUSED throw function changeState, state changed to PAUSED", async function() {
            await contract.setState(1);
            await contract.changeStatePublic(2);
            assert.equal(await contract.m_state(), 2);
        });

        it("If change State RUNNING to FAILED throw function changeState, state changed to FAILED", async function() {
            await contract.setState(1);
            await contract.changeStatePublic(3);
            assert.equal(await contract.m_state(), 3);
        });

        it("If change State RUNNING to SUCCEEDED throw function changeState, state changed to SUCCEEDED", async function() {
            await contract.setState(1);
            await contract.changeStatePublic(4);
            assert.equal(await contract.m_state(), 4);
        });
    });

    describe('Change state PAUSED', function() {
        it("If change State PAUSED to INIT throw function changeState, contract raise error", async function() {
            await contract.setState(2);
            await expectThrow(contract.changeStatePublic(0));
        });

        it("If change State PAUSED to RUNNING throw function changeState, contract raise error", async function() {
            await contract.setState(2);
            await contract.changeStatePublic(1);
            assert.equal(await contract.m_state(), 1);
        });

        it("If change State PAUSED to PAUSED throw function changeState, contract raise error", async function() {
            await contract.setState(2);
            await expectThrow(contract.changeStatePublic(2));
        });

        it("If change State PAUSED to FAILED throw function changeState, state changed to FAILED", async function() {
            await contract.setState(2);
            await contract.changeStatePublic(3);
            assert.equal(await contract.m_state(), 3);
        });

        it("If change State PAUSED to SUCCEEDED throw function changeState, contract raise error", async function() {
            await contract.setState(2);
            await expectThrow(contract.changeStatePublic(4));
        });
    });

    describe('Change state FAILED', function() {
        it("If change State FAILED to INIT throw function changeState, contract raise error", async function() {
            await contract.setState(3);
            await expectThrow(contract.changeStatePublic(0));
        });

        it("If change State FAILED to RUNNING throw function changeState, contract raise error", async function() {
            await contract.setState(3);
            await expectThrow(contract.changeStatePublic(1));
        });

        it("If change State FAILED to PAUSED throw function changeState, contract raise error", async function() {
            await contract.setState(3);
            await expectThrow(contract.changeStatePublic(2));
        });

        it("If change State FAILED to FAILED throw function changeState, contract raise error", async function() {
            await contract.setState(3);
            await expectThrow(contract.changeStatePublic(3));
        });

        it("If change State FAILED to SUCCEEDED throw function changeState, contract raise error", async function() {
            await contract.setState(3);
            await expectThrow(contract.changeStatePublic(4));
        });
    });

    describe('Change state SUCCEEDED', function() {
        it("If change State SUCCEEDED to INIT throw function changeState, contract raise error", async function() {
            await contract.setState(4);
            await expectThrow(contract.changeStatePublic(0));
        });

        it("If change State SUCCEEDED to RUNNING throw function changeState, contract raise error", async function() {
            await contract.setState(4);
            await expectThrow(contract.changeStatePublic(1));
        });

        it("If change State SUCCEEDED to PAUSED throw function changeState, contract raise error", async function() {
            await contract.setState(4);
            await expectThrow(contract.changeStatePublic(2));
        });

        it("If change State SUCCEEDED to FAILED throw function changeState, contract raise error", async function() {
            await contract.setState(4);
            await expectThrow(contract.changeStatePublic(3));
        });

        it("If change State SUCCEEDED to SUCCEEDED throw function changeState, contract raise error", async function() {
            await contract.setState(4);
            await expectThrow(contract.changeStatePublic(4));
        });
    });

});