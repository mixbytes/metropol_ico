pragma solidity ^0.4.15;

import "../../token/BurnableControlledToken.sol";

contract BurnableControlledTokenHelper is BurnableControlledToken {

    function BurnableControlledTokenHelper() {
        totalSupply = 1000;
        balances[msg.sender] = 1000;
    }

    function setController(address _controller) public {
        super.setControllerInternal(_controller);
    }
}
