// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface customIERC1155 {
    function burn(address to, uint256 id, uint256 value) external;
    function burnBatch(address to, uint256[] memory ids, uint256[] memory values) external;
    function mint(address to, uint256 id, uint256 value, string memory data) external;
    function mintBatch(address to, uint256[] memory ids, uint256[] memory values, string memory data) external;
    function balanceOfBatch(address[] memory accounts, uint256[] memory ids) external;
}

contract Blacksmith is Ownable {
    event ContractsInitialized(address indexed IERC1155Token);
    event TokenMinted(string tokenId);
    event TokensBurned(uint256 tokenId,uint256 value);


    uint256 private _interval = 60 seconds;
    mapping (address => uint256) private _cooldown;

    customIERC1155 public IERC1155Token;
    
    constructor() Ownable(msg.sender) {}

    function contractInitialize(address IERC1155TokenAddress) external onlyOwner {
        require(IERC1155TokenAddress.code.length > 0, "Not a contract address");
        IERC1155Token = customIERC1155(IERC1155TokenAddress);
        emit ContractsInitialized(IERC1155TokenAddress);
    }

    function _mintSingleFreeToken(uint256 tokenId, string memory data) private  {
        require(getCooldownDuration() == 0, "Wait For the cooldown");
        IERC1155Token.mint(msg.sender, tokenId, 1, data);
        _cooldown[msg.sender] = block.timestamp + _interval;
        emit TokenMinted(data);
    }

    function _mintAllFreeTokens(uint256[] memory requiredIds,string memory data) private {
        require(getCooldownDuration() == 0, "Wait For the cooldown");
        uint256[] memory values = new uint256[](requiredIds.length);
        for (uint256 i = 0; i < requiredIds.length; i++) {
            values[i] = 1; // Set all burn amounts to 1
        }
        IERC1155Token.mintBatch(msg.sender, requiredIds, values, data);
        _cooldown[msg.sender] = block.timestamp + _interval;
        emit TokenMinted(data);
    } 

    function _mintTokenWithBurn(uint256 tokenId, uint256[] memory requiredIds,string memory data) private {
        uint256[] memory values = new uint256[](requiredIds.length);
        for (uint256 i = 0; i < requiredIds.length; i++) {
            values[i] = 1; // Set all burn amounts to 1
        }
        IERC1155Token.burnBatch(msg.sender, requiredIds, values);
        IERC1155Token.mint(msg.sender, tokenId, 1, data);
        emit TokenMinted(data);
    }

    function mintAllFreeToken() public { _mintAllFreeTokens(_getIds(0, 1, 2), "Tokens 0,1,2"); }
    function mintToken0() public { _mintSingleFreeToken(0, "Token 0"); }
    function mintToken1() public { _mintSingleFreeToken(1, "Token 1"); }
    function mintToken2() public { _mintSingleFreeToken(2, "Token 2"); }
    function mintToken3() public { _mintTokenWithBurn(3, _getIds(0, 1), "Token 3"); }
    function mintToken4() public { _mintTokenWithBurn(4, _getIds(1, 2), "Token 4"); }
    function mintToken5() public { _mintTokenWithBurn(5, _getIds(0, 2), "Token 5"); }
    function mintToken6() public { _mintTokenWithBurn(6, _getIds(0, 1, 2), "Token 6"); }


    function burnWithoutForge(uint256 tokenId, uint256 value) public { 
        IERC1155Token.burn(msg.sender,tokenId, value); 
        emit TokensBurned(tokenId,value);
    }
    function _getIds(uint256 id1, uint256 id2) private pure returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](2);
        ids[0] = id1;
        ids[1] = id2;
        return ids;
    }

    function _getIds(uint256 id1, uint256 id2, uint256 id3) private pure returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](3);
        ids[0] = id1;
        ids[1] = id2;
        ids[2] = id3;
        return ids;
    }

    function getCooldownDuration() public view returns (uint256) {
        return block.timestamp >= _cooldown[msg.sender] ? 0 : _cooldown[msg.sender] - block.timestamp;
    }
}