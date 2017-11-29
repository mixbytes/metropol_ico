'use strict';

const _owners = [
    '',
    '',
    ''
];

const Token = artifacts.require("MetropolToken.sol");
const FundsRegistry = artifacts.require("FundsRegistry.sol");
const Crowdsale = artifacts.require("MetropolCrowdsale.sol");


module.exports = function(deployer, network) {
    let _token, _funds, _sale;

    deployer.then(function() {
        return Token.new(_owners);
    }).then(function(instance) {
        _token = instance;

        console.log('token ok: ' + _token.address);

        return FundsRegistry.new(_owners, 2, 0);
    }).then(function(instance) {
        _funds = instance;

        console.log('funds ok: ' + _funds.address);

        return Crowdsale.new(_token.address, _funds.address, _owners);
    }).then(function(instance) {
        console.log('sale ok: ' + instance.address);
    });
};
