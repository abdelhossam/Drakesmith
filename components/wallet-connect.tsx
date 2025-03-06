'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/card';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import { Wallet } from 'lucide-react';

export function WalletConnect({ children }: { children: ReactNode }) {
  const { isConnected, isConnecting } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="p-8 max-w-md w-full">
          <Skeleton className="h-8 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-8" />
          <Skeleton className="h-10 w-40 mx-auto" />
        </Card>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[70vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-8 max-w-md w-full text-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Wallet className="h-12 w-12 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold">Connecting Wallet</h2>
            <p className="text-gray-600">
              Please confirm the connection in your wallet...
            </p>
            <PulseLoader color="hsl(221, 83%, 53%)" />
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!isConnected) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[70vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 max-w-md w-full text-center bg-white/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Wallet className="h-12 w-12 mx-auto mb-6 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-6">Connect Your Wallet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Connect your wallet using the Polygon network.
          </p>
          <motion.div 
            className="flex justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <ConnectButton />
          </motion.div>
        </Card>
      </motion.div>
    );
  }

  return <>{children}</>;
}