pragma solidity ^0.4.15;

import "../../token/MetropolMintableToken.sol";

contract MetropolMintableTokenHelper is MetropolMintableToken {

    function mint(address _to, uint256 _amount) public {
        super.mintInternal(_to, _amount);
    }

}
