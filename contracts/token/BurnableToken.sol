pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/token/StandardToken.sol';

/**
 * BurnableToken
 */
contract BurnableToken is StandardToken {

    event Burn(address indexed from, uint256 amount);

    /**
     * Function to burn tokens
     * Internal for not forgetting to add access modifier
     *
     * @param _from The address to burn tokens from.
     * @param _amount The amount of tokens to burn.
     *
     * @return A boolean that indicates if the operation was successful.
     */
    function burnInternal(address _from, uint256 _amount) internal returns (bool) {
        require(_amount>0);


        totalSupply = totalSupply.sub(_amount);
        balances[_from] = balances[_from].sub(_amount);
        Burn(_from, _amount);
        Transfer(_from, address(0), _amount);

        return true;
    }

}
