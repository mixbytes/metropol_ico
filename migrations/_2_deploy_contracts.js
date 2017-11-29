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

        return FundsRegistry.new(_owners, 2, 0);
    }).then(function(instance) {
        _funds = instance;

        return Crowdsale(_token.address, _funds.address, _owners);
    });
};
