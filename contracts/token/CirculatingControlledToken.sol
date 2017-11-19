pragma solidity ^0.4.15;

import 'mixbytes-solidity/contracts/token/CirculatingToken.sol';
import '../ownership/Controlled.sol';


/**
 * CirculatingControlledToken
 */
contract CirculatingControlledToken is CirculatingToken, Controlled {

    /**
     * Allows token transfers
     */
    function startCirculation() external onlyController {
        assert(enableCirculation());    // must be called once
    }
}
