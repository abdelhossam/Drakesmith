# 🚀 Drakesmith - NFT Minting & Forging (on Polygon)

A fully decentralized ERC1155-based NFT system, built to demonstrate Solidity smart contract development with **minting, forging, operator-controlled execution,** and **cooldown mechanisms**. The system consists of two core contracts:

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
- 🔗 **Frontend:** [Mint & Forge NFTs](https://prismatic-salmiakki-286dd3.netlify.app/)
- 📜 **ERC1155 Contract:** [0xF0a0009b94e7E6071cC42b1eAA6F1B4424282b39](https://polygonscan.com/address/0xF0a0009b94e7E6071cC42b1eAA6F1B4424282b39) (Polygon Mainnet)
- 🔥 **Forging Logic Contract:** [0x77ca1Db200df9A8BAFC993b77E0feFBE7D495463](https://polygonscan.com/address/0x77ca1Db200df9A8BAFC993b77E0feFBE7D495463) (Polygon Mainnet)

---

## 🔒 **Security & Gas Optimizations**
- **Access Control**: Uses `onlyOperator` to restrict minting/burning to authorized accounts.
- **Cooldown Mechanism**: Prevents spam minting and enforces time-based restrictions.
- **Batch Minting & Burning**: Reduces gas costs by processing multiple tokens in a single transaction.
- **Efficient Storage Usage**: Uses mappings to track cooldowns, minimizing storage operations.
- **Safe External Calls**: Verifies contract addresses before interaction to avoid external call vulnerabilities.

---

## 📌 **Core Features**

### 🔹 **ERC1155 NFT Contract (Blacksmith_ERC1155)**
- Implements **ERC1155 standard** using OpenZeppelin.
- Defines **operator-based minting/burning** via `onlyOperator` modifier.
- Supports **URI metadata updates**.
- Implements `tokenURI` to return dynamic metadata.

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
- Implements **burn-and-mint forging mechanism**.
- Allows **minting free tokens** with cooldown enforcement.
- Supports **batch minting** and **burning-based minting**.
- Enforces **cooldowns** for minting to prevent spam transactions.
- Interfaces with the ERC1155 contract using `customIERC1155`.

#### **Key Solidity Code Snippets**

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
- Enforces cooldown before forging.
- Emits event logs for blockchain transparency.

---
  
### 🎯 **Project Highlights & Technical Strengths**
✔️ Demonstrates **ERC1155 implementation** with **minting & burning**.  
✔️ Implements **operator-based execution** for controlled NFT issuance.  
✔️ Uses **cooldowns & burn-to-forge logic** to ensure sustainable NFT generation.    
✔️ Fully **deployed on Polygon Mainnet** with an operational frontend.

---

## 📩 **Let's Connect**
📧 **Email**: [abdel.hossam.m@gmail.com](mailto:abdel.hossam.m@gmail.com)  
💼 **LinkedIn**: [abdelhossam](https://www.linkedin.com/in/abdelhossam/)

