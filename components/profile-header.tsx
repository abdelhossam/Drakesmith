'use client';

import { useAccount, useBalance } from 'wagmi';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Copy, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useNFTs } from '@/lib/utils/nft';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ProfileHeader() {
  const { address } = useAccount();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
    chainId: 137, // Polygon
    watch: true, // Enable automatic updates
  });
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const { nfts, totalCount, isLoading: isNFTsLoading } = useNFTs();

  useEffect(() => {
    setMounted(true);
  }, []);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openOpensea = () => {
    if (address) {
      window.open(`https://opensea.io/${address}`, '_blank');
    }
  };

  if (!mounted) {
    return (
      <div className="mb-8">
        <Card className="relative px-6 pb-6 pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mb-6">
            <div className="flex-1 mt-4 md:mt-0">
              <Skeleton className="h-4 w-48 mt-2" />
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Skeleton className="h-9 w-40" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-500">MATIC Balance</h3>
              <Skeleton className="h-8 w-24 mt-1" />
            </Card>
            <Card className="p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-500">NFTs Owned</h3>
              <Skeleton className="h-8 w-24 mt-1" />
            </Card>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Card className="relative px-6 pb-6 pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mb-6">
          <div className="flex-1 mt-4 md:mt-0">
            <div className="flex items-center mt-2 text-gray-600">
              <span>{address ? truncateAddress(address) : 'No address'}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-1 h-6 w-6"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 mt-8 md:mt-8">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={openOpensea}
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on OpenSea</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-500">MATIC Balance</h3>
            {isBalanceLoading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <p className="text-2xl font-bold">
                {balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0'} MATIC
              </p>
            )}
          </Card>
          
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-500">NFTs Owned</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                      <Info className="h-4 w-4 text-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of NFTs owned from this collection only</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {isNFTsLoading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <p className="text-2xl font-bold">{totalCount}</p>
            )}
          </Card>
        </div>
      </Card>
    </div>
  );
}