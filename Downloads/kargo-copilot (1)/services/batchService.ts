
import { BatchJob, BatchItemResult, Order, ProductData } from '../types';
import { classifyProductWithGemini } from './geminiService';

// Simulating a backend store
let batchJobs: BatchJob[] = [];
const listeners: ((jobs: BatchJob[]) => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(l => l([...batchJobs]));
};

export const subscribeToBatches = (callback: (jobs: BatchJob[]) => void) => {
  listeners.push(callback);
  callback([...batchJobs]);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
};

export const createBatchJob = (orders: Order[]): string => {
  const id = Math.random().toString(36).substr(2, 9);
  
  const newJob: BatchJob = {
    id,
    name: `Batch #${Math.floor(Math.random() * 1000)}`,
    total: orders.length,
    processed: 0,
    failed: 0,
    status: 'queued',
    createdAt: new Date().toISOString(),
    results: []
  };

  batchJobs = [newJob, ...batchJobs];
  notifyListeners();

  // Simulate backend processing trigger
  processBatch(id, orders);
  
  return id;
};

const processBatch = async (jobId: string, orders: Order[]) => {
  // Artificial delay to simulate queue pickup
  await new Promise(resolve => setTimeout(resolve, 500));

  const updateJob = (updates: Partial<BatchJob>) => {
    batchJobs = batchJobs.map(job => job.id === jobId ? { ...job, ...updates } : job);
    notifyListeners();
  };

  updateJob({ status: 'processing' });

  // Process items with REAL Gemini API
  for (const order of orders) {
    let orderStatus: 'success' | 'failed' = 'success';
    let message = 'HS Codes generated successfully';
    let codesGenerated = 0;

    try {
      // If order has no items, skip
      if (!order.items || order.items.length === 0) {
        orderStatus = 'success';
        message = 'No items to classify in order';
      } else {
        // Process each item in the order
        for (const item of order.items) {
          // Skip if already classified to save API costs
          if (item.hsCode || item.status === 'classified') {
            continue;
          }

          const productData: ProductData = {
            title: item.title,
            description: item.description,
            // Map other fields if available in Product type
          };

          // Call Gemini API
          // Note: Sequential processing to respect rate limits
          const result = await classifyProductWithGemini(productData);
          
          if (result && result.hs_code) {
             codesGenerated++;
             // Update the mock item (in memory only for now)
             item.hsCode = result.hs_code;
             item.status = 'classified';
          }
          
          // Small delay to avoid rate limits (gemini-2.5-flash has decent limits but good practice)
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (codesGenerated > 0) {
          message = `Classified ${codesGenerated} item(s) with Gemini AI`;
        } else {
          message = 'Items already classified or skipped';
        }
      }
      
    } catch (error) {
      console.error(`Failed to classify order ${order.orderNumber}:`, error);
      orderStatus = 'failed';
      message = 'AI Service Error: ' + (error instanceof Error ? error.message : 'Unknown error');
    }

    const result: BatchItemResult = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: orderStatus,
      message: message,
      hsCodesGenerated: codesGenerated
    };

    // 3. Update State
    const currentJob = batchJobs.find(j => j.id === jobId);
    if (!currentJob) break;

    const newProcessed = currentJob.processed + 1;
    const newFailed = orderStatus === 'failed' ? currentJob.failed + 1 : currentJob.failed;
    const newResults = [...currentJob.results, result];

    updateJob({
      processed: newProcessed,
      failed: newFailed,
      results: newResults
    });
  }

  updateJob({ 
    status: 'completed', 
    completedAt: new Date().toISOString() 
  });
};

export const getBatchJobs = () => [...batchJobs];
