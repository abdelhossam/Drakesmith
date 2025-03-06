'use client';

import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// Human readable ABI for the contract functions we need
const humanReadableAbi = [
  "function mintAllFreeToken()",
  "function mintToken0()",
  "function mintToken1()",
  "function mintToken2()",
  "function mintToken3()",
  "function mintToken4()",
  "function mintToken5()",
  "function mintToken6()",
  "function burnWithoutForge(uint256 tokenId, uint256 value)",
  "event TokenMinted(string data)",
  "event TokenBurned(uint256 tokenId, uint256 amount)"
];

// Contract address - replace with your actual contract address
const CONTRACT_ADDRESS = '0x77ca1Db200df9A8BAFC993b77E0feFBE7D495463';
const TRANSACTION_TIMEOUT = 20000; // 20 seconds in milliseconds

// Function to parse blockchain errors into human-readable messages
const parseErrorMessage = (error: any): string => {
  // Check if it's a user rejection
  if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
    return 'Transaction was rejected.';
  }

  // Check for common error messages in the error object
  const errorMessage = error.message || '';
  
  // Check specifically for cooldown error
  if (errorMessage.toLowerCase().includes('wait for the cooldown')) {
    return 'Please wait for the cooldown period to end before forging again.';
  }
  
  // Gas related errors
  if (errorMessage.includes('insufficient funds') || errorMessage.includes('not enough funds')) {
    return 'Insufficient funds to complete this transaction. Please check your MATIC balance.';
  }
  
  // Contract execution errors
  if (errorMessage.includes('execution reverted')) {
    if (errorMessage.toLowerCase().includes('wait for the cooldown')) {
      return 'Please wait for the cooldown period to end before forging again.';
    }
    return 'Transaction failed. You may not meet the requirements for this action.';
  }
  
  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('connection')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  // Gas price errors
  if (errorMessage.includes('gas price')) {
    return 'Gas price too low. Please increase gas price or try again later.';
  }
  
  // Nonce errors
  if (errorMessage.includes('nonce')) {
    return 'Transaction nonce error. Please refresh the page and try again.';
  }
  
  // Timeout errors
  if (errorMessage.includes('timeout')) {
    return 'Transaction timed out. The network may be congested, please try again.';
  }
  
  // If we can't identify a specific error, return a generic message
  return 'Transaction failed. Please try again.';
};

interface ContractEvent {
  event: string;
  args?: {
    data?: string;
    tokenId?: string;
    amount?: string;
  };
}

export function useContract() {
  const { address, connector } = useAccount();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const waitForTransaction = async (tx: ethers.ContractTransaction) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Transaction timeout')), TRANSACTION_TIMEOUT);
    });

    try {
      const receipt = await Promise.race([
        tx.wait(),
        timeoutPromise
      ]);
      return receipt;
    } catch (error: any) {
      if (error.message === 'Transaction timeout') {
        throw new Error('Transaction timed out after 20 seconds. Please check your transaction status in your wallet.');
      }
      throw error;
    }
  };

  const handleTransaction = async (
    action: () => Promise<ethers.ContractTransaction>,
    actionName: string,
    refreshData: () => void
  ) => {
    if (!address || !connector) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      const tx = await action();

      toast({
        title: 'Transaction Submitted',
        description: `${actionName} in progress. Please wait for confirmation...`,
      });

      const receipt = await waitForTransaction(tx);
      
      toast({
        title: 'Success',
        description: `${actionName} completed successfully`,
      });

      refreshData();
      return receipt;
    } catch (error: any) {
      // Don't show error toast for user rejections
      if (error.code !== 4001 && error.code !== 'ACTION_REJECTED') {
        const humanReadableError = parseErrorMessage(error);
        toast({
          title: 'Error',
          description: humanReadableError,
          variant: 'destructive',
        });
      }
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const mintToken = async (tokenId: number, refreshData: () => void) => {
    const provider = await connector?.getProvider();
    if (!provider) return;

    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, humanReadableAbi, signer);

    let mintFunction;
    switch (tokenId) {
      case 0: mintFunction = () => contract.mintToken0(); break;
      case 1: mintFunction = () => contract.mintToken1(); break;
      case 2: mintFunction = () => contract.mintToken2(); break;
      case 3: mintFunction = () => contract.mintToken3(); break;
      case 4: mintFunction = () => contract.mintToken4(); break;
      case 5: mintFunction = () => contract.mintToken5(); break;
      case 6: mintFunction = () => contract.mintToken6(); break;
      default: throw new Error(`No minting function available for token ${tokenId}`);
    }

    return handleTransaction(
      mintFunction,
      `Forging token #${tokenId}`,
      refreshData
    );
  };

  const burnToken = async (tokenId: number, amount: number, refreshData: () => void) => {
    const provider = await connector?.getProvider();
    if (!provider) return;

    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, humanReadableAbi, signer);

    return handleTransaction(
      () => contract.burnWithoutForge(tokenId, amount),
      `Burning ${amount} of token #${tokenId}`,
      refreshData
    );
  };

  const mintAllFreeTokens = async (refreshData: () => void) => {
    const provider = await connector?.getProvider();
    if (!provider) return;

    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, humanReadableAbi, signer);

    return handleTransaction(
      () => contract.mintAllFreeToken(),
      'Forging basic set (tokens #0, #1, #2)',
      refreshData
    );
  };

  return {
    mintToken,
    mintAllFreeTokens,
    burnToken,
    isProcessing
  };
}