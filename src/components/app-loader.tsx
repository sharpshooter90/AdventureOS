import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CacheService } from "@/services/cache-service";

export function AppLoader() {
  const [progress, setProgress] = useState(0);
  const [isCached, setIsCached] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    async function checkCache() {
      const cached = await CacheService.checkCachedAssets();
      setIsCached(cached);
    }
    checkCache();

    let progressInterval: NodeJS.Timeout;

    // Function to handle progress increment
    const incrementProgress = () => {
      setProgress((prev) => {
        // If assets are cached, progress faster
        const increment = isCached ? 2 : 1;
        const newProgress = Math.min(prev + increment, 100);

        // If we've reached 100%, clear the interval
        if (newProgress === 100) {
          clearInterval(progressInterval);
          // Wait a moment at 100% before setting complete
          setTimeout(() => {
            setIsComplete(true);
          }, 800); // Wait at 100% for 800ms before starting exit animation
        }

        return newProgress;
      });
    };

    // Start progress animation
    progressInterval = setInterval(incrementProgress, isCached ? 20 : 30);

    return () => {
      clearInterval(progressInterval);
    };
  }, [isCached]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: "easeInOut",
            },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background font-mono"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.p
              className="text-8xl font-thin tabular-nums tracking-tight text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {progress}%
            </motion.p>
            <motion.div
              className="h-[1px] w-48 overflow-hidden bg-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              />
            </motion.div>
            <motion.p
              className="text-sm font-light tracking-widest uppercase text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {progress === 100
                ? "Ready to launch..."
                : isCached
                ? "Loading from cache..."
                : "Caching assets..."}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
