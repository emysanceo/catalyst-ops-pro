// Offline support utilities using IndexedDB
const DB_NAME = 'catalyst-ops-db';
const DB_VERSION = 1;
const STORES = {
  pendingSales: 'pending-sales',
  cachedProducts: 'cached-products',
};

export interface PendingSale {
  id: string;
  items: any[];
  total: number;
  discount: number;
  tax: number;
  payment_method: string;
  cashier_id: string;
  timestamp: number;
}

// Open IndexedDB connection
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.pendingSales)) {
        db.createObjectStore(STORES.pendingSales, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.cachedProducts)) {
        db.createObjectStore(STORES.cachedProducts, { keyPath: 'id' });
      }
    };
  });
}

// Save a pending sale to IndexedDB
export async function savePendingSale(sale: PendingSale): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction([STORES.pendingSales], 'readwrite');
  const store = transaction.objectStore(STORES.pendingSales);

  return new Promise((resolve, reject) => {
    const request = store.add(sale);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Get all pending sales
export async function getPendingSales(): Promise<PendingSale[]> {
  const db = await openDB();
  const transaction = db.transaction([STORES.pendingSales], 'readonly');
  const store = transaction.objectStore(STORES.pendingSales);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Delete a pending sale
export async function deletePendingSale(id: string): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction([STORES.pendingSales], 'readwrite');
  const store = transaction.objectStore(STORES.pendingSales);

  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Cache products for offline access
export async function cacheProducts(products: any[]): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction([STORES.cachedProducts], 'readwrite');
  const store = transaction.objectStore(STORES.cachedProducts);

  // Clear existing cache
  await new Promise<void>((resolve, reject) => {
    const clearRequest = store.clear();
    clearRequest.onsuccess = () => resolve();
    clearRequest.onerror = () => reject(clearRequest.error);
  });

  // Add new products
  return new Promise((resolve, reject) => {
    let completed = 0;
    products.forEach(product => {
      const request = store.add(product);
      request.onsuccess = () => {
        completed++;
        if (completed === products.length) resolve();
      };
      request.onerror = () => reject(request.error);
    });
  });
}

// Get cached products
export async function getCachedProducts(): Promise<any[]> {
  const db = await openDB();
  const transaction = db.transaction([STORES.cachedProducts], 'readonly');
  const store = transaction.objectStore(STORES.cachedProducts);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Check if online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Register online/offline event listeners
export function registerConnectivityListeners(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}
