'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Flame, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const forgeRecipes = [
  {
    id: 3,
    name: "Advanced Forge",
    requires: [0, 1],
    description: "Combine tokens #0 and #1 to forge token #3"
  },
  {
    id: 4,
    name: "Enhanced Forge",
    requires: [1, 2],
    description: "Combine tokens #1 and #2 to forge token #4"
  },
  {
    id: 5,
    name: "Master Forge",
    requires: [0, 2],
    description: "Combine tokens #0 and #2 to forge token #5"
  },
  {
    id: 6,
    name: "Ultimate Forge",
    requires: [0, 1, 2],
    description: "Combine tokens #0, #1, and #2 to forge token #6"
  }
];

export function ForgeGuide() {
  return (
    <div className="mb-8">
      <Card className="overflow-hidden bg-white/50 backdrop-blur-sm border-0 shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Forging Guide</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {forgeRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="p-4 bg-white/80 hover:bg-white/90 transition-colors duration-200">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Flame className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        {recipe.requires.map((tokenId, idx) => (
                          <div key={tokenId} className="flex items-center">
                            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                              Token #{tokenId}
                            </span>
                            {idx < recipe.requires.length - 1 && (
                              <ArrowRight className="h-4 w-4 mx-1 text-gray-400" />
                            )}
                          </div>
                        ))}
                        <ArrowRight className="h-4 w-4 mx-1 text-gray-400" />
                        <span className="inline-flex items-center justify-center rounded-full bg-primary px-3 py-1 text-sm font-medium text-white">
                          Token #{recipe.id}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{recipe.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}