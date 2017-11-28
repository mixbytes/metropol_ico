// Copyright (C) 2017  MixBytes, LLC

// Licensed under the Apache License, Version 2.0 (the "License").
// You may not use this file except in compliance with the License.

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND (express or implied).

pragma solidity ^0.4.15;

import 'mixbytes-solidity/contracts/crowdsale/IInvestmentsWalletConnector.sol';
import 'mixbytes-solidity/contracts/crowdsale/FundsRegistry.sol';

/**
 * Stores investments in FundsRegistry.
 */
contract MetropolFundsRegistryWalletConnector is IInvestmentsWalletConnector {

    function MetropolFundsRegistryWalletConnector(address _fundsAddress)
        public
    {
        require(_fundsAddress!=address(0));
        m_fundsAddress = FundsRegistry(_fundsAddress);
    }

    /// @dev process and forward investment
    function storeInvestment(address investor, uint payment) internal
    {
        m_fundsAddress.invested.value(payment)(investor);
    }

    /// @dev total investments amount stored using storeInvestment()
    function getTotalInvestmentsStored() internal constant returns (uint)
    {
        return m_fundsAddress.totalInvested();
    }

    /// @dev called in case crowdsale succeeded
    function wcOnCrowdsaleSuccess() internal {
        m_fundsAddress.changeState(FundsRegistry.State.SUCCEEDED);
        m_fundsAddress.detachController();
    }

    /// @dev called in case crowdsale failed
    function wcOnCrowdsaleFailure() internal {
        m_fundsAddress.changeState(FundsRegistry.State.REFUNDING);
    }

    /// @notice address of wallet which stores funds
    FundsRegistry public m_fundsAddress;
}
