/**
 * Based on Zeppelin solidity code. Origin license:
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Smart Contract Solutions, Inc.
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

pragma solidity ^0.4.15;

import './MetropolMintableToken.sol';

/**
 * MintableToken with ability to disable  minting
 */
contract FinishableMintableToken is MetropolMintableToken {

    bool public m_mintingFinished = false;

    event MintFinished();


    modifier canMint() {
        require(!m_mintingFinished);
        _;
    }

    /**
     * Function to mint tokens
     *
     * @param _to The address that will receive the minted tokens.
     * @param _amount The amount of tokens to mint.
     *
     * @return A boolean that indicates if the operation was successful.
     */
    function mintInternal(address _to, uint256 _amount) internal canMint returns (bool) {
        return super.mintInternal(_to, _amount);
    }

    /**
     * Function to stop minting new tokens.
     *
     * @return True if the operation was successful.
     */
    function finishMintingInternal() internal canMint returns (bool) {
        m_mintingFinished = true;
        MintFinished();

        return true;
    }

}
