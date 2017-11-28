pragma solidity ^0.4.18;

import './crowdsale/TokensBurnableReturnableCrowdsale.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './MetropolToken.sol';

/**
 * MetropolCrowdsale
 */
contract MetropolCrowdsale is TokensBurnableReturnableCrowdsale {

    uint256 internal m_startTimestamp;
    uint256 internal m_softCap;
    uint256 internal m_hardCap;
    uint256 internal m_exchangeRate;
    address internal m_foundersTokensStorage;

    function MetropolCrowdsale(
            address _token,
            address _funds,
            address[] _owners,
            address _foundersTokensStorage,
            uint256 _startTimestamp,
            uint256 _softCapInEther,
            uint256 _hardCapInEther,
            uint256 _tokensForOneEther
        )
        public
        TokensBurnableReturnableCrowdsale(_token, _funds, _owners, 2)
        validAddress(_token)
        validAddress(_funds)
        validAddress(_foundersTokensStorage)
    {
        require(3 == _owners.length);

        m_startTimestamp = _startTimestamp;
        m_softCap = _softCapInEther * 1 ether;
        m_hardCap = _hardCapInEther * 1 ether;
        m_exchangeRate = _tokensForOneEther;
        m_foundersTokensStorage = _foundersTokensStorage;
    }

    /**
     * Set exchange rate before start
     */
    function setExchangeRate(uint256 _tokensForOneEther) public requiresState(State.INIT) {
        m_exchangeRate = _tokensForOneEther;
    }


    // INTERNAL
    /**
     * All users except deployer must check time before contributing
     */
    function mustApplyTimeCheck(address investor, uint payment) constant internal returns (bool) {
        return !isOwner(investor);
    }

    /**
     * For min investment check
     */
    function getMinInvestment() public constant returns (uint) {
        return 1 wei;
    }

    /**
     * Get collected funds (internally from FundsRegistry)
     */
    function getWeiCollected() public constant returns (uint) {
        return getTotalInvestmentsStored();
    }

    /**
     * Minimum amount of funding to consider crowdsale as successful
     */
    function getMinimumFunds() internal constant returns (uint) {
        return m_softCap;
    }

    /**
     * Maximum investments to be accepted during crowdsale
     */
    function getMaximumFunds() internal constant returns (uint) {
        return m_hardCap;
    }

    /**
     * Start time of the crowdsale
     */
    function getStartTime() internal constant returns (uint) {
        return m_startTimestamp;
    }

    /**
     * End time of the crowdsale
     */
    function getEndTime() internal constant returns (uint) {
        return m_startTimestamp + 60 days;
    }

    /**
     * Formula for calculating tokens from contributed ether
     */
    function calculateTokens(address /*investor*/, uint payment, uint /*extraBonuses*/)
        internal
        constant
        returns (uint)
    {
        if (getCurrentTime() <= m_startTimestamp + 30 days) {
            return payment.mul(m_exchangeRate);
        } else if (getCurrentTime() <= m_startTimestamp + 37 days) {
            return payment.mul(m_exchangeRate).mul(100).div(105);
        } else if (getCurrentTime() <= m_startTimestamp + 44 days) {
            return payment.mul(m_exchangeRate).mul(100).div(110);
        } else if (getCurrentTime() <= m_startTimestamp + 51 days) {
            return payment.mul(m_exchangeRate).mul(100).div(115);
        } else if (getCurrentTime() <= m_startTimestamp + 58 days) {
            return payment.mul(m_exchangeRate).mul(100).div(120);
        } else {
            return payment.mul(m_exchangeRate).mul(100).div(125);
        }
    }

    /**
     * Additional on-success actions
     */
    function wcOnCrowdsaleSuccess() internal {

        //20% of total totalSupply to team
        m_token.mint(
            m_foundersTokensStorage,
            MetropolToken(m_token).totalSupply().mul(20).div(80)
        );

        //detaches controller, so all actions above
        super.wcOnCrowdsaleSuccess();
    }
}
