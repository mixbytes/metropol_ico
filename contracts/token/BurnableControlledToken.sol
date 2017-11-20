pragma solidity ^0.4.15;

import './BurnableToken.sol';
import '../ownership/Controlled.sol';

/**
 * BurnableControlledToken
 */
contract BurnableControlledToken is BurnableToken, Controlled {

    /**
     * Function to burn tokens
     *
     * @param _from The address to burn tokens from.
     * @param _amount The amount of tokens to burn.
     *
     * @return A boolean that indicates if the operation was successful.
     */
    function burn(address _from, uint256 _amount) public onlyController returns (bool) {
        return super.burnInternal(_from, _amount);
    }

}
