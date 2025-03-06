'use client';

import { useAccount } from 'wagmi';
import axios from 'axios';
import useSWR from 'swr';

export interface NFTAttribute {
  value: string;
  trait_type: string;
}

export interface NFT {
  id: string;
  name: string;
  description?: string;
  image: string;
  collection: string;
  contractAddress: string;
  tokenId: string;
  quantity: number;
  attributes?: NFTAttribute[];
  owned: boolean;
}

const CONTRACT_ADDRESS = '0xF0a0009b94e7E6071cC42b1eAA6F1B4424282b39';

// Predefined NFTs collection
const PREDEFINED_NFTS: Omit<NFT, 'owned'>[] = [
  {
    id: 'predefined-0',
    name: 'NFT #0',
    description: 'A beautiful #0',
    image: 'https://ipfs.io/ipfs/bafybeia3tnamrwjjuyu3ih3llwneycpmjzyvlnkhvmozuz5h3g5335y5y4/0.png',
    collection: 'NFT Collection',
    contractAddress: CONTRACT_ADDRESS,
    tokenId: '0',
    quantity: 1,
    attributes: []
  },
  {
    id: 'predefined-1',
    name: 'NFT #1',
    description: 'A beautiful #1',
    image: 'https://ipfs.io/ipfs/bafybeia3tnamrwjjuyu3ih3llwneycpmjzyvlnkhvmozuz5h3g5335y5y4/1.png',
    collection: 'NFT Collection',
    contractAddress: CONTRACT_ADDRESS,
    tokenId: '1',
    quantity: 1,
    attributes: []
  },
  {
    id: 'predefined-2',
    name: 'NFT #2',
    description: 'A beautiful #2',
    image: 'https://ipfs.io/ipfs/bafybeia3tnamrwjjuyu3ih3llwneycpmjzyvlnkhvmozuz5h3g5335y5y4/2.png',
    collection: 'NFT Collection',
    contractAddress: CONTRACT_ADDRESS,
    tokenId: '2',
    quantity: 1,
    attributes: []
  },
  {
    id: 'predefined-3',
    name: 'NFT #3',
    description: 'A beautiful #3',
    image: 'https://ipfs.io/ipfs/bafybeia3tnamrwjjuyu3ih3llwneycpmjzyvlnkhvmozuz5h3g5335y5y4/3.png',
    collection: 'NFT Collection',
    contractAddress: CONTRACT_ADDRESS,
    tokenId: '3',
    quantity: 1,
    attributes: []
  },
  {
    id: 'predefined-4',
    name: 'NFT #4',
    description: 'A beautiful #4',
    image: 'https://ipfs.io/ipfs/bafybeia3tnamrwjjuyu3ih3llwneycpmjzyvlnkhvmozuz5h3g5335y5y4/4.png',
    collection: 'NFT Collection',
    contractAddress: CONTRACT_ADDRESS,
    tokenId: '4',
    quantity: 1,
    attributes: []
  },
  {
    id: 'predefined-5',
    name: 'NFT #5',
    description: 'A beautiful #5',
    image: 'https://ipfs.io/ipfs/bafybeia3tnamrwjjuyu3ih3llwneycpmjzyvlnkhvmozuz5h3g5335y5y4/5.png',
    collection: 'NFT Collection',
    contractAddress: CONTRACT_ADDRESS,
    tokenId: '5',
    quantity: 1,
    attributes: []
  },
  {
    id: 'predefined-6',
    name: 'NFT #6',
    description: 'A beautiful #6',
    image: 'https://ipfs.io/ipfs/bafybeia3tnamrwjjuyu3ih3llwneycpmjzyvlnkhvmozuz5h3g5335y5y4/6.png',
    collection: 'NFT Collection',
    contractAddress: CONTRACT_ADDRESS,
    tokenId: '6',
    quantity: 1,
    attributes: []
  }
];

const ALCHEMY_API_URL = 'https://polygon-mainnet.g.alchemy.com/nft/v3/ED3A57EuqQxuQLQhxy1CsVIxFBc-PIT0/getNFTsForOwner';

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export function useNFTs() {
  const { address } = useAccount();
  
  const { data, error, isLoading, mutate } = useSWR(
    address ? `${ALCHEMY_API_URL}?owner=${address}&contractAddresses[]=${CONTRACT_ADDRESS}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  const processNFTs = (data: any): NFT[] => {
    // Create a map of owned NFTs by tokenId
    const ownedNFTsMap = new Map<string, number>();
    let ownedNFTsCount = 0;
    
    if (data && data.ownedNfts) {
      data.ownedNfts
        .filter((nft: any) => nft.contract.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase())
        .forEach((nft: any) => {
          const quantity = parseInt(nft.balance) || 1;
          ownedNFTsMap.set(nft.tokenId, quantity);
          ownedNFTsCount += quantity;
        });
    }
    
    // Return the predefined NFTs with ownership status
    return PREDEFINED_NFTS.map(nft => ({
      ...nft,
      owned: ownedNFTsMap.has(nft.tokenId),
      quantity: ownedNFTsMap.get(nft.tokenId) || nft.quantity
    }));
  };

  // Calculate the actual count of NFTs from the Alchemy API
  const calculateTotalCount = (data: any): number => {
    if (!data || !data.ownedNfts) return 0;
    
    return data.ownedNfts
      .filter((nft: any) => nft.contract.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase())
      .reduce((total: number, nft: any) => {
        return total + (parseInt(nft.balance) || 1);
      }, 0);
  };

  return {
    nfts: processNFTs(data),
    totalCount: calculateTotalCount(data),
    isLoading,
    error,
    mutate, // Expose the mutate function to allow manual revalidation
  };
}