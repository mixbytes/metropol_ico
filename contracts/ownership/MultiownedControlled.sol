pragma solidity ^0.4.15;

import './Controlled.sol';
import 'mixbytes-solidity/contracts/ownership/multiowned.sol';

/**
 * Contract which is owned by owners and operated by controller.
 *
 * Provides a way to set up an entity (typically other contract) entitled to control actions of this contract.
 * Controller is set up by owners or during construction.
 *
 */
contract MultiownedControlled is Controlled, multiowned {


    function MultiownedControlled(address[] _owners, uint256 _signaturesRequired)
        multiowned(_owners, _signaturesRequired)
    {
        // nothing here
    }

    /**
     * Sets the controller
     */
    function setController(address _controller) external onlymanyowners(sha3(msg.data)) {
        super.setControllerInternal(_controller);
    }

}