// Copyright 2018 Energy Web Foundation
// This file is part of the Origin Application brought to you by the Energy Web Foundation,
// a global non-profit organization focused on accelerating blockchain technology across the energy sector, 
// incorporated in Zug, Switzerland.
//
// The Origin Application is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY and without an implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details, at <http://www.gnu.org/licenses/>.
//
// @authors: slock.it GmbH, Martin Kuechler, martin.kuchler@slock.it

pragma solidity ^0.4.17;

import "./Owned.sol";
import "./Updatable.sol";

/// @title Contract for storing the current logic-contracts-addresses for the certificate of origin
contract CoO is Owned {

    Updatable public userRegistry;
    Updatable public assetRegistry;
    Updatable public certificateRegistry;
    Updatable public demandRegistry;

    /// @notice The constructor of the UserDB
    function CoO()
        Owned(msg.sender) 
        public
    {

    } 

    /// @notice function to initialize the contracts, setting the needed contract-addresses
    /// @param _userRegistry user-registry logic contract address
    /// @param _assetRegistry asset-registry logic contract address
    /// @param _certificateRegistry certificate-registry logic contract address
    function init(Updatable _userRegistry, Updatable _assetRegistry, Updatable _certificateRegistry, Updatable _demandRegistry) 
        onlyOwner
        external
    {
        require(    
            _userRegistry != address(0) && _assetRegistry != address(0) && _certificateRegistry != address(0) && _demandRegistry != address(0)
            && userRegistry == address(0) && assetRegistry == address(0) && certificateRegistry == address(0) && demandRegistry == address(0)
        );
        userRegistry = _userRegistry;
        assetRegistry = _assetRegistry;
        certificateRegistry = _certificateRegistry;
        demandRegistry = _demandRegistry;
        
    }

    /// @notice function to update one or more logic-contracts
    /// @param _userRegistry address of the new user-registry-logic-contract
    /// @param _assetRegistry address of the new asset-registry-logic-contract
    /// @param _certificateRegistry address of the new certificate-registry-logic-contract
    function update(Updatable _userRegistry, Updatable _assetRegistry, Updatable _certificateRegistry, Updatable _demandRegistry)
        onlyOwner 
        external
    {
        if (_userRegistry != address(0)) {
           userRegistry.update(_userRegistry);
            userRegistry = _userRegistry;
        }

        if (_assetRegistry != address(0)) {
            assetRegistry.update(_assetRegistry);
            assetRegistry = _assetRegistry;
        }

        if (_certificateRegistry != address(0)) {
            certificateRegistry.update(_certificateRegistry);
            certificateRegistry = _certificateRegistry;
        }

        if (_demandRegistry != address(0)) {
            demandRegistry.update(_demandRegistry);
            demandRegistry = _demandRegistry;
        }
        

    }

    /// @notice Fallback, will throw when ether is send to the contract
    function () external {
        revert();
    }

}