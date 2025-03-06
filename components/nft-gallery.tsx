'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  AlertCircle,
  ImageIcon,
  Lock,
  Hammer,
  Flame,
  Sparkles,
  Info,
  RefreshCw,
  ExternalLink,
  Eye,
  Loader2,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNFTs } from '@/lib/utils/nft';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useContract } from '@/lib/utils/contract';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAccount, useBalance } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';

const TOKEN_REQUIREMENTS = {
  '3': { requires: [0, 1], description: 'Requires tokens #0 and #1' },
  '4': { requires: [1, 2], description: 'Requires tokens #1 and #2' },
  '5': { requires: [0, 2], description: 'Requires tokens #0 and #2' },
  '6': { requires: [0, 1, 2], description: 'Requires tokens #0, #1, and #2' },
};

export function NFTGallery() {
  const [mounted, setMounted] = useState(false);
  const [forgingTokens, setForgingTokens] = useState<Record<string, boolean>>({});
  const [burnAmount, setBurnAmount] = useState<number>(1);
  const [selectedNFTForBurn, setSelectedNFTForBurn] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBasicSetForging, setIsBasicSetForging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { nfts, isLoading, error, totalCount, mutate } = useNFTs();
  const { toast } = useToast();
  const { mintToken, mintAllFreeTokens, burnToken, isProcessing } = useContract();
  const { address } = useAccount();
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address,
    chainId: 137,
    watch: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredNFTs = mounted && nfts ? nfts : [];

  const isAnyOperationInProgress = () => {
    return isProcessing || Object.values(forgingTokens).some(value => value) || isBasicSetForging;
  };

  const refreshData = async () => {
    try {
      await Promise.all([mutate(), refetchBalance()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([mutate(), refetchBalance()]);
    setIsRefreshing(false);
  };

  const handleForge = async (nft: any) => {
    const tokenId = parseInt(nft.tokenId);
    try {
      setForgingTokens(prev => ({...prev, [nft.id]: true}));
      await mintToken(tokenId, refreshData);
    } catch (error) {
      console.error("Error forging token:", error);
    } finally {
      setForgingTokens(prev => ({...prev, [nft.id]: false}));
    }
  };

  const handleForgeAll = async () => {
    try {
      setIsBasicSetForging(true);
      await mintAllFreeTokens(refreshData);
    } catch (error) {
      console.error("Error forging basic set:", error);
    } finally {
      setIsBasicSetForging(false);
    }
  };

  const handleBurn = async (nft: any, amount: number) => {
    try {
      const tokenId = parseInt(nft.tokenId);
      await burnToken(tokenId, amount, refreshData);
      setDialogOpen(false);
      setSelectedNFTForBurn(null);
      setBurnAmount(1);
    } catch (error) {
      console.error("Error burning token:", error);
    }
  };

  const handleBurnClick = (nft: any) => {
    setSelectedNFTForBurn(nft);
    setBurnAmount(1);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedNFTForBurn(null);
    setBurnAmount(1);
  };

  const handleImageClick = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  const hasRequiredTokens = (tokenId: string) => {
    const requirements = TOKEN_REQUIREMENTS[tokenId as keyof typeof TOKEN_REQUIREMENTS];
    if (!requirements) return true;
    
    return requirements.requires.every(requiredTokenId => {
      const requiredToken = filteredNFTs.find(nft => parseInt(nft.tokenId) === requiredTokenId);
      return requiredToken && requiredToken.owned;
    });
  };

  if (!mounted) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <Skeleton className="h-10 w-80" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            How NFT Forging Works
          </h2>
          <Button variant="ghost" size="icon">
            {isDescriptionOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <AnimatePresence>
          {isDescriptionOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4 text-gray-600">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Getting Started</h3>
                  <p>Start by forging the basic set (NFTs #0, #1, and #2) using the "Forge Basic Set" button. These are your foundation NFTs and don't require any prerequisites.</p>
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-2">
                    <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Important: Cooldown Period</p>
                      <p className="text-sm text-blue-600 mt-1">
                        There is a 1-minute cooldown period when forging basic NFTs individually. To save time, use the "Forge Basic Set" button to get all three basic NFTs (#0, #1, #2) in a single transaction without any cooldown!
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Advanced Forging</h3>
                  <p>Once you have the basic NFTs, you can forge advanced NFTs (#3 through #6) by combining specific basic NFTs:</p>
                  <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                    <li>NFT #3: Requires NFTs #0 and #1</li>
                    <li>NFT #4: Requires NFTs #1 and #2</li>
                    <li>NFT #5: Requires NFTs #0 and #2</li>
                    <li>NFT #6: Requires NFTs #0, #1, and #2</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Burning NFTs</h3>
                  <p>You can burn owned NFTs if you want to remove them from your collection.</p>
                  <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-700 font-medium">Warning: Permanent Action</p>
                      <p className="text-sm text-red-600 mt-1">
                        Burning NFTs is irreversible.However, You can forge them again.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <Tabs defaultValue="collection" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList className="h-10">
            <TabsTrigger value="collection" className="px-4">
              Collection <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">{totalCount || filteredNFTs.length}</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing || isAnyOperationInProgress()}
              className={isRefreshing ? 'animate-spin' : ''}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleForgeAll}
                    disabled={isAnyOperationInProgress()}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span className="mr-2">
                      {isBasicSetForging ? 'Forging Basic Set' : 'Forge Basic Set'}
                    </span>
                    {isBasicSetForging && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Forge tokens #0, #1, and #2 in a single transaction</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <TabsContent value="collection" className="mt-0">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load NFTs. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredNFTs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredNFTs.map((nft) => {
                const tokenId = nft.tokenId;
                const requirements = TOKEN_REQUIREMENTS[tokenId as keyof typeof TOKEN_REQUIREMENTS];
                const canForge = hasRequiredTokens(tokenId);
                const isOperationInProgress = isAnyOperationInProgress();
                const isBasicNFT = ['0', '1', '2'].includes(tokenId);
                
                return (
                  <Card key={nft.id} className="overflow-hidden nft-card">
                    <div className="aspect-square relative group cursor-pointer" onClick={() => handleImageClick(nft.image)}>
                      {nft.image ? (
                        <>
                          <img 
                            src={nft.image} 
                            alt={nft.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                            <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      {nft.quantity > 1 && (
                        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                          x{nft.quantity}
                        </div>
                      )}
                      {!nft.owned && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Badge variant="outline" className="bg-black bg-opacity-70 text-white border-none px-3 py-1 flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            <span>Not Owned</span>
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{nft.name}</h3>
                        {requirements && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-help">
                                  <Info className="h-4 w-4 text-blue-500" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="p-2 max-w-xs">
                                <p>{requirements.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      
                      {requirements && (
                        <div className="mt-2 mb-2">
                          <div className="text-xs text-gray-500 mb-1">Required NFTs To Forge:</div>
                          <div className="flex flex-wrap gap-1">
                            {requirements.requires.map(reqToken => {
                              const hasToken = filteredNFTs.find(n => 
                                parseInt(n.tokenId) === reqToken && n.owned
                              );
                              return (
                                <Badge 
                                  key={reqToken} 
                                  variant={hasToken ? "default" : "outline"}
                                  className={hasToken ? "bg-green-600" : "text-red-500 border-red-500"}
                                >
                                  #{reqToken}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {isBasicNFT && !nft.owned && (
                        <div className="mt-2 mb-2">
                          <div className="text-xs text-gray-500 mb-1">Required NFTs To Forge:</div>
                          <div className="text-xs text-gray-500">-</div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className={`flex-1 ${
                            isOperationInProgress 
                              ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                              : !canForge && requirements 
                                ? 'bg-gray-400 hover:bg-gray-500' 
                                : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                          onClick={() => handleForge(nft)}
                          disabled={isOperationInProgress || (requirements && !canForge)}
                          title={
                            isOperationInProgress 
                              ? "Operation in progress" 
                              : requirements && !canForge 
                                ? "Missing required tokens" 
                                : ""
                          }
                        >
                          <Hammer className="h-4 w-4 mr-2" />
                          <span className="mr-2">
                            {forgingTokens[nft.id] ? 'Forging' : 'Forge'}
                          </span>
                          {forgingTokens[nft.id] && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                        </Button>
                        
                        {nft.owned && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className={`flex-1 ${
                              isOperationInProgress 
                                ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                                : 'bg-red-600 hover:bg-red-700'
                            }`}
                            onClick={() => handleBurnClick(nft)}
                            disabled={isOperationInProgress}
                          >
                            <Flame className="h-4 w-4 mr-2" />
                            <span className="mr-2">Burn</span>
                            {isProcessing && selectedNFTForBurn?.id === nft.id && (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No items to display</h3>
              <p className="text-gray-500 text-center max-w-md">
                You don't have any NFTs in your wallet yet.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          {selectedNFTForBurn && (
            <>
              <DialogHeader>
                <DialogTitle>Burn NFT #{selectedNFTForBurn.tokenId}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">
                      This action is irreversible. The NFT will be permanently removed from your collection.
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    How many tokens would you like to burn? (Max: {selectedNFTForBurn.quantity})
                  </p>
                  <Input
                    type="number"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(Math.min(Math.max(1, parseInt(e.target.value) || 1), selectedNFTForBurn.quantity))}
                    min={1}
                    max={selectedNFTForBurn.quantity}
                    disabled={isAnyOperationInProgress()}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDialogClose}
                    disabled={isAnyOperationInProgress()}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    className={`${
                      isAnyOperationInProgress() 
                        ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    onClick={() => handleBurn(selectedNFTForBurn, burnAmount)}
                    disabled={isAnyOperationInProgress()}
                  >
                    <span className="mr-2">
                      {isProcessing ? 'Burning' : 'Confirm Burn'}
                    </span>
                    {isProcessing && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}