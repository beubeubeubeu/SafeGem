// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

interface IUserCollectionFactory {
    /**
     * @dev Emitted when a new UserCollection is created
     * @param _userAddress Address of the user who created the collection
     * @param _newCollectionAddress Address of the newly created collection contract
     * @param _collectionName Name of the new collection
     * @param _timestamp Timestamp when the collection was created
     */
    event UserCollectionCreated(
        address indexed _userAddress,
        address indexed _newCollectionAddress,
        string _collectionName,
        uint256 _timestamp
    );

    /**
     * @dev Creates a new clone of the UserCollection contract.
     * @param _collectionName Name for the new collection
     */
    function createNFTCollection(string memory _collectionName) external;
}
