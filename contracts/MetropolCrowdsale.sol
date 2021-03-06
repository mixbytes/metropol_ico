pragma solidity ^0.4.18;

import './crowdsale/StatefulReturnableCrowdsale.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './MetropolToken.sol';

/**
 * MetropolCrowdsale
 */
contract MetropolCrowdsale is StatefulReturnableCrowdsale {

    uint256 public m_startTimestamp;
    uint256 public m_softCap;
    uint256 public m_hardCap;
    uint256 public m_exchangeRate;
    address public m_foundersTokensStorage;
    bool public m_initialSettingsSet = false;

    modifier requireSettingsSet() {
        require(m_initialSettingsSet);
        _;
    }

    function MetropolCrowdsale(address _token, address _funds, address[] _owners)
        public
        StatefulReturnableCrowdsale(_token, _funds, _owners, 2)
    {
        require(3 == _owners.length);

        //2030-01-01, not to start crowdsale
        m_startTimestamp = 1893456000;
    }

    /**
     * Set exchange rate before start
     */
    function setInitialSettings(
            address _foundersTokensStorage,
            uint256 _startTimestamp,
            uint256 _softCapInEther,
            uint256 _hardCapInEther,
            uint256 _tokensForOneEther
        )
        public
        timedStateChange
        requiresState(State.INIT)
        onlymanyowners(sha3(msg.data))
        validAddress(_foundersTokensStorage)
    {
        //no check for settings set
        //can be set multiple times before ICO

        require(_startTimestamp!=0);
        require(_softCapInEther!=0);
        require(_hardCapInEther!=0);
        require(_tokensForOneEther!=0);

        m_startTimestamp = _startTimestamp;
        m_softCap = _softCapInEther * 1 ether;
        m_hardCap = _hardCapInEther * 1 ether;
        m_exchangeRate = _tokensForOneEther;
        m_foundersTokensStorage = _foundersTokensStorage;

        m_initialSettingsSet = true;
    }

    /**
     * Set exchange rate before start
     */
    function setExchangeRate(uint256 _tokensForOneEther)
        public
        timedStateChange
        requiresState(State.INIT)
        onlymanyowners(sha3(msg.data))
    {
        m_exchangeRate = _tokensForOneEther;
    }

    /**
     * withdraw payments by investor on fail
     */
    function withdrawPayments() public requireSettingsSet {
        getToken().burn(
            msg.sender,
            getToken().balanceOf(msg.sender)
        );

        super.withdrawPayments();
    }


    // INTERNAL
    /**
     * Additional check of initial settings set
     */
    function buyInternal(address _investor, uint _payment, uint _extraBonuses)
        internal
        requireSettingsSet
    {
        super.buyInternal(_investor, _payment, _extraBonuses);
    }


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
        uint256 secondMonth = m_startTimestamp + 30 days;
        if (getCurrentTime() <= secondMonth) {
            return payment.mul(m_exchangeRate);
        } else if (getCurrentTime() <= secondMonth + 1 weeks) {
            return payment.mul(m_exchangeRate).mul(100).div(105);
        } else if (getCurrentTime() <= secondMonth + 2 weeks) {
            return payment.mul(m_exchangeRate).mul(100).div(110);
        } else if (getCurrentTime() <= secondMonth + 3 weeks) {
            return payment.mul(m_exchangeRate).mul(100).div(115);
        } else if (getCurrentTime() <= secondMonth + 4 weeks) {
            return payment.mul(m_exchangeRate).mul(100).div(120);
        } else {
            return payment.mul(m_exchangeRate).mul(100).div(125);
        }
    }

    /**
     * Additional on-success actions
     */
    function wcOnCrowdsaleSuccess() internal {
        super.wcOnCrowdsaleSuccess();

        //20% of total totalSupply to team
        m_token.mint(
            m_foundersTokensStorage,
            getToken().totalSupply().mul(20).div(80)
        );


        getToken().startCirculation();
        getToken().detachController();
    }

    /**
     * Returns attached token
     */
    function getToken() internal returns(MetropolToken) {
        return MetropolToken(m_token);
    }
}
