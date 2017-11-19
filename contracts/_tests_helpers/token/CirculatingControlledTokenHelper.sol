pragma solidity ^0.4.15;

import "../../token/CirculatingControlledToken.sol";

contract CirculatingControlledTokenHelper is CirculatingControlledToken {

    function setController(address _controller) public {
        super.setControllerInternal(_controller);
    }
}
