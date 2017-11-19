pragma solidity ^0.4.15;

import './MintableToken.sol';
import '../ownership/Controlled.sol';

/**
 * MintableControlledToken
 */
contract MintableControlledToken is MintableToken, Controlled {

    /**
     * Function to mint tokens
     *
     * @param _to The address that will receive the minted tokens.
     * @param _amount The amount of tokens to mint.
     *
     * @return A boolean that indicates if the operation was successful.
     */
    function mint(address _to, uint256 _amount) public onlyController returns (bool) {
        return super.mintInternal(_to, _amount);
    }

}
