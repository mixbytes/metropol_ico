pragma solidity ^0.4.18;

import '../../lifecycle/SimpleStateful.sol';

/// @title Stateful mixin add state to contact and handlers for it
contract SimpleStatefulHelper is SimpleStateful {

    function changeStatePublic(State _newState) external {
        changeState(_newState);
    }

    function setState(State _newState) external {
        m_state = _newState;
    }

}