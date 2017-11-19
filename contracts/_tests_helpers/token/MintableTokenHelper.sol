pragma solidity ^0.4.15;

import "../../token/MintableToken.sol";

contract MintableTokenHelper is MintableToken {

    function mint(address _to, uint256 _amount) public returns (bool) {
        return super.mintInternal(_to, _amount);
    }

}
