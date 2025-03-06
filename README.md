# 🚀 Blacksmith ERC1155 - NFT Minting & Forging (on Polygon)

A fully decentralized ERC1155-based NFT system, built to demonstrate Solidity smart contract development with **minting, forging, operator-controlled execution, and cooldown mechanisms**. The system consists of two core contracts:

1. **Blacksmith_ERC1155.sol** – The ERC1155 token contract with minting and burning functionalities.
2. **Blacksmith.sol** – The logic contract handling **cooldowns, burning rules, and token forging**.

---

## 🏗 **Technologies Used**
| **Technology**   | **Purpose** |
|----------------|------------|
| **Solidity**  | Smart contract development |
| **OpenZeppelin** | Secure contract implementation |
| **Ethers.js**  | Blockchain interaction |
| **Wagmi**  | React hooks for Ethereum interactions |
| **RainbowKit**  | Wallet connection UI for dApps |
| **Next.js**  | Frontend framework |
| **Tailwind CSS**  | UI styling |

---

## 📸 **NFTs Preview**
<div align="center">
  <img src="https://ipfs.io/ipfs/bafybeia3tnamrwjjuyu3ih3llwneycpmjzyvlnkhvmozuz5h3g5335y5y4/4.png" width="30%" />
  <img src="https://ipfs.io/ipfs/bafybeia3tnamrwjjuyu3ih3llwneycpmjzyvlnkhvmozuz5h3g5335y5y4/5.png" width="30%" />
  <img src="https://ipfs.io/ipfs/bafybeia3tnamrwjjuyu3ih3llwneycpmjzyvlnkhvmozuz5h3g5335y5y4/6.png" width="30%" />
</div>

---

## 🌍 **Live Demo & Contract Addresses**
- 🔗 **Frontend:** [Mint & Forge Dragon NFTs](https://prismatic-salmiakki-286dd3.netlify.app/)

---

## 📌 **Core Features & Solidity Highlights**

### 🔹 **ERC1155 NFT Contract (Blacksmith_ERC1155)**
- Implements **ERC1155 standard** using OpenZeppelin.
- Defines **operator-based minting/burning** via `onlyOperator` modifier.
- Supports **URI metadata updates**.
- Implements `tokenURI` to return dynamic metadata.

#### **Key Solidity Code Snippets**

**Operator-Controlled Minting:**
```solidity
function mint(address to, uint256 id, uint256 amount, bytes memory data) external onlyOperator {
    _mint(to, id, amount, data);
}
```
- **Ensures only the authorized operator or owner can mint.**
- Uses `_mint` from OpenZeppelin’s ERC1155 implementation.

**Secure Operator Management:**
```solidity
modifier onlyOperator {
    require(operatorContract == msg.sender || owner() == msg.sender, "unauthorized");
    _;
}
```
- Restricts execution to the **owner or designated operator**.
- Prevents unauthorized access to minting and burning functions.

---

### 🔹 **Blacksmith Logic Contract (Forging & Cooldowns)**
**Minting Free Tokens (Single & Batch):**
```solidity
function _mintSingleFreeToken(uint256 tokenId, string memory data) private {
    require(getCooldownDuration() == 0, "Wait For the cooldown");
    IERC1155Token.mint(msg.sender, tokenId, 1, data);
    _cooldown[msg.sender] = block.timestamp + _interval;
    emit TokenMinted(data);
}

function _mintAllFreeTokens(uint256[] memory requiredIds, string memory data) private {
    require(getCooldownDuration() == 0, "Wait For the cooldown");
    uint256[] memory values = new uint256[](requiredIds.length);
    for (uint256 i = 0; i < requiredIds.length; i++) {
        values[i] = 1; 
    }
    IERC1155Token.mintBatch(msg.sender, requiredIds, values, data);
    _cooldown[msg.sender] = block.timestamp + _interval;
    emit TokenMinted(data);
}
```
- **Enforces cooldown before minting free NFTs.**
- **Batch minting** optimizes transactions and reduces gas costs.

**Burn and Forge Mechanism:**
```solidity
function _mintTokenWithBurn(uint256 tokenId, uint256[] memory requiredIds, string memory data) private {
    uint256[] memory values = new uint256[](requiredIds.length);
    for (uint256 i = 0; i < requiredIds.length; i++) {
        values[i] = 1;
    }
    IERC1155Token.burnBatch(msg.sender, requiredIds, values);
    IERC1155Token.mint(msg.sender, tokenId, 1, data);
    emit TokenMinted(data);
}
```
- **Requires burning specific token combinations** to mint new NFTs.
- Ensures **burned NFTs cannot be reused immediately**.

---

## 📩 **Let's Connect**
📧 **Email**: [abdel.hossam.m@gmail.com](mailto:abdel.hossam.m@gmail.com)  
💼 **LinkedIn**: [abdelhossam](https://www.linkedin.com/in/abdelhossam/)  

---

### 🎯 **Project Highlights**
✔️ Demonstrates **ERC1155 implementation** with **minting & burning**.  
✔️ Implements **operator-based execution** for controlled NFT issuance.  
✔️ Uses **cooldowns & burn-to-forge logic** to ensure sustainable NFT generation.   
✔️ Fully **deployed on Polygon** with an operational frontend.

