pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/StandardToken.sol';
import './ownership/Controlled.sol';
import './ownership/MetropolMultiownedControlled.sol';
import './token/MintableControlledToken.sol';
import './token/BurnableControlledToken.sol';
import './token/CirculatingControlledToken.sol';


/**
 * MetropolToken
 */
contract MetropolToken is
    StandardToken,
    Controlled,
    MintableControlledToken,
    BurnableControlledToken,
    CirculatingControlledToken,
    MetropolMultiownedControlled
{
    string internal m_name = '';
    string internal m_symbol = '';
    uint8 public constant decimals = 18;

    /**
     * MetropolToken constructor
     */
    function MetropolToken(address[] _owners)
        MetropolMultiownedControlled(_owners, 2)
        public
    {
        require(3 == _owners.length);
    }

    function name() public constant returns (string) {
        return m_name;
    }
    function symbol() public constant returns (string) {
        return m_symbol;
    }

    function setNameSymbol(string _name, string _symbol) external onlymanyowners(sha3(msg.data)) {
        require(bytes(m_name).length==0);
        require(bytes(_name).length!=0 && bytes(_symbol).length!=0);

        m_name = _name;
        m_symbol = _symbol;
    }

}
