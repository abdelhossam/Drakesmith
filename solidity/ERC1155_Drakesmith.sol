// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Blacksmith_ERC1155 is ERC1155, Ownable {

    constructor() ERC1155("") Ownable(msg.sender) {
    }
    address public operatorContract;

    function setOperatorContract(address account) external onlyOwner{
        operatorContract = account;
    }
    modifier onlyOperator{
        require(operatorContract == msg.sender || owner() == msg.sender ,"unauthorized");
        _;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function tokenURI(uint256 tokenId) public view virtual returns (string memory) {
        string memory baseURI = uri(tokenId);
        return bytes(baseURI).length > 0 ? string.concat(baseURI, Strings.toString(tokenId)) : "";
    }
    // Mint    
    function mint(address to, uint256 id, uint256 value,string memory data) external onlyOperator{
        bytes memory myData = abi.encode(data);
        _mint(to, id, value, myData);
    }
    function mintBatch(address to, uint256[] memory ids, uint256[] memory values, string memory data) external onlyOperator{
        bytes memory myData = abi.encode(data);
        _mintBatch(to, ids, values, myData);
    }

    // Burn
    function burn(address to, uint256 id, uint256 value) external onlyOperator{
        _burn(to, id, value);
    }
    function burnBatch(address to, uint256[] memory ids, uint256[] memory values) external onlyOperator{
        _burnBatch(to, ids, values);
    }
}