pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/StandardToken.sol';
import './ownership/Controlled.sol';
import './ownership/MultiownedControlled.sol';
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
    MultiownedControlled
{
    string public constant name = 'Metropol Token';
    string public constant symbol = 'MTP';
    uint8 public constant decimals = 18;

    /**
     * MetropolToken constructor
     */
    function MetropolToken(address[] _owners)
        MultiownedControlled(_owners, 2)
        public
    {
        require(3 == _owners.length);
    }

}
