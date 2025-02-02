const CACHE_NAME = "app-assets-v1";

export class CacheService {
  static async cacheAssets() {
    const assetsToCache = [
      "/",
      "/index.html",
      // Add other important assets, images, fonts etc.
      // Example:
      // '/assets/fonts/inter.woff2',
      // '/assets/images/logo.png',
    ];

    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(assetsToCache);
      localStorage.setItem("app-assets-cached", "true");
      return true;
    } catch (error) {
      console.error("Failed to cache assets:", error);
      return false;
    }
  }

  static async checkCachedAssets() {
    try {
      const isCached = localStorage.getItem("app-assets-cached") === "true";
      if (!isCached) return false;

      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      return keys.length > 0;
    } catch (error) {
      console.error("Failed to check cached assets:", error);
      return false;
    }
  }

  static async clearCache() {
    try {
      await caches.delete(CACHE_NAME);
      localStorage.removeItem("app-assets-cached");
      return true;
    } catch (error) {
      console.error("Failed to clear cache:", error);
      return false;
    }
  }
}
