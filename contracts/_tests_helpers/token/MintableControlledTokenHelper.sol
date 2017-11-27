pragma solidity ^0.4.15;

import "../../token/MintableControlledToken.sol";

contract MintableControlledTokenHelper is MintableControlledToken {

    function setController(address _controller) external {
        super.setControllerInternal(_controller);
    }
}
