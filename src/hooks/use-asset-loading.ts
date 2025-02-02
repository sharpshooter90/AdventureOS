import { useState, useEffect } from "react";
import { CacheService } from "@/services/cache-service";

export function useAssetLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAndLoadAssets() {
      // First check if assets are already cached
      const isCached = await CacheService.checkCachedAssets();

      if (isCached) {
        setIsLoading(false);
        return;
      }

      // If not cached, wait for assets to load
      await Promise.all([
        document.fonts.ready,
        new Promise((resolve) => {
          if (document.readyState === "complete") {
            resolve(true);
          } else {
            window.addEventListener("load", () => resolve(true), {
              once: true,
            });
          }
        }),
      ]);

      // Cache the assets for future use
      await CacheService.cacheAssets();

      // Add a minimum delay to prevent flash
      setTimeout(() => setIsLoading(false), 500);
    }

    checkAndLoadAssets();
  }, []);

  return isLoading;
}
