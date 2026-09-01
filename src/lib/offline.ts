import { supabase } from './supabase';

export const OfflineSync = {
  QUEUE_KEY: 'inflow_offline_queue',

  // Add transaction to local queue if offline
  async queueTransaction(transaction: any) {
    const queue = JSON.parse(localStorage.getItem(this.QUEUE_KEY) || '[]');
    const txWithId = { ...transaction, offline_sync_id: crypto.randomUUID() };
    queue.push(txWithId);
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    console.log('Transaction queued offline:', txWithId.offline_sync_id);
    return txWithId;
  },

  // Sync queue with Supabase
  async syncQueue() {
    if (!navigator.onLine) return;

    const queue = JSON.parse(localStorage.getItem(this.QUEUE_KEY) || '[]');
    if (queue.length === 0) return;

    console.log(`Syncing ${queue.length} offline transactions...`);

    const results = await Promise.allSettled(
      queue.map(async (tx: any) => {
        const { error } = await supabase.from('transactions').insert(tx);
        if (error) throw error;
        return tx.offline_sync_id;
      })
    );

    const successfulIds = results
      .filter(r => r.status === 'fulfilled')
      .map((r: any) => r.value);

    const remainingQueue = queue.filter(
      (tx: any) => !successfulIds.includes(tx.offline_sync_id)
    );

    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(remainingQueue));
    console.log(`Sync complete. ${successfulIds.length} uploaded, ${remainingQueue.length} failed.`);
  }
};
