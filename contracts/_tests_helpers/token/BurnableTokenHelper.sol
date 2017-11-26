pragma solidity ^0.4.15;

import "../../token/BurnableToken.sol";

contract BurnableTokenHelper is BurnableToken {

    function BurnableTokenHelper() public {
        totalSupply = 1000;
        balances[msg.sender] = 1000;
    }

    function burn(address _from, uint256 _amount) public returns (bool) {
        return super.burnInternal(_from, _amount);
    }

}
