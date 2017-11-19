pragma solidity ^0.4.15;

import "../../ownership/Controlled.sol";

contract ControlledHelper is Controlled {

    function setController(address _controller) public {
        super.setControllerInternal(_controller);
    }
}
