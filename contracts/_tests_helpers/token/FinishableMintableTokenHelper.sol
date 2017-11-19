pragma solidity ^0.4.15;

import "../../token/FinishableMintableToken.sol";

contract FinishableMintableTokenHelper is FinishableMintableToken {

    function mint(address _to, uint256 _amount) public returns (bool) {
        return super.mintInternal(_to, _amount);
    }

    function finishMinting() public returns (bool) {
        return super.finishMintingInternal();
    }

}
