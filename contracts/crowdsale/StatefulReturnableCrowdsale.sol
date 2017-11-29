// Copyright (C) 2017  MixBytes, LLC

// Licensed under the Apache License, Version 2.0 (the "License").
// You may not use this file except in compliance with the License.

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND (express or implied).

pragma solidity ^0.4.18;

import 'mixbytes-solidity/contracts/crowdsale/SimpleCrowdsaleBase.sol';
import '../lifecycle/SimpleStateful.sol';
import 'mixbytes-solidity/contracts/ownership/multiowned.sol';
import './MetropolFundsRegistryWalletConnector.sol';


/**
 * Crowdsale with state
 */
contract StatefulReturnableCrowdsale is
    SimpleCrowdsaleBase,
    SimpleStateful,
    multiowned,
    MetropolFundsRegistryWalletConnector
{

    /** Last recorded funds */
    uint256 public m_lastFundsAmount;

    event Withdraw(address payee, uint amount);

    /**
     * Automatic check for unaccounted withdrawals
     * @param _investor optional refund parameter
     * @param _payment optional refund parameter
     */
    modifier fundsChecker(address _investor, uint _payment) {
        uint atTheBeginning = getTotalInvestmentsStored();
        if (atTheBeginning < m_lastFundsAmount) {
            changeState(State.PAUSED);
            if (_payment > 0) {
                _investor.transfer(_payment);     // we cant throw (have to save state), so refunding this way
            }
            // note that execution of further (but not preceding!) modifiers and functions ends here
        } else {
            _;

            if (getTotalInvestmentsStored() < atTheBeginning) {
                changeState(State.PAUSED);
            } else {
                m_lastFundsAmount = getTotalInvestmentsStored();
            }
        }
    }

    /**
     * Triggers some state changes based on current time
     */
    modifier timedStateChange() {
        if (getCurrentState() == State.INIT && getCurrentTime() >= getStartTime()) {
            changeState(State.RUNNING);
        }

        _;
    }


    /**
     * Constructor
     */
    function StatefulReturnableCrowdsale(
            address _token,
            address _funds,
            address[] _owners,
            uint _signaturesRequired
        )
        public
        SimpleCrowdsaleBase(_token)
        multiowned(_owners, _signaturesRequired)
        MetropolFundsRegistryWalletConnector(_funds)
        validAddress(_token)
        validAddress(_funds)
    {
    }

    function pauseCrowdsale()
        public
        onlyowner
        requiresState(State.RUNNING)
    {
        changeState(State.PAUSED);
    }
    function continueCrowdsale()
        public
        onlymanyowners(sha3(msg.data))
        requiresState(State.PAUSED)
    {
        changeState(State.RUNNING);

        if (getCurrentTime() >= getEndTime()) {
            finish();
        }
    }
    function failCrowdsale()
        public
        onlymanyowners(sha3(msg.data))
        requiresState(State.PAUSED)
    {
        wcOnCrowdsaleFailure();
        m_finished = true;
    }

    function withdrawPayments()
        public
        nonReentrant
        requiresState(State.FAILED)
    {
        Withdraw(msg.sender, m_fundsAddress.m_weiBalances(msg.sender));
        m_fundsAddress.withdrawPayments(msg.sender);
    }


    /**
     * Additional check of contributing process since we have state
     */
    function buyInternal(address _investor, uint _payment, uint _extraBonuses)
        internal
        timedStateChange
        exceptState(State.PAUSED)
        fundsChecker(_investor, _payment)
    {
        if (!mustApplyTimeCheck(_investor, _payment)) {
            require(State.RUNNING == m_state || State.INIT == m_state);
        }
        else
        {
            require(State.RUNNING == m_state);
        }

        super.buyInternal(_investor, _payment, _extraBonuses);
    }


    /// @dev called in case crowdsale succeeded
    function wcOnCrowdsaleSuccess() internal {
        super.wcOnCrowdsaleSuccess();

        changeState(State.SUCCEEDED);
    }

    /// @dev called in case crowdsale failed
    function wcOnCrowdsaleFailure() internal {
        super.wcOnCrowdsaleFailure();

        changeState(State.FAILED);
    }

}
