
import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { BatchJob, NavItem } from '../types';
import { subscribeToBatches } from '../services/batchService';
import { CheckCircle2, XCircle, Loader2, FileText, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Batch: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<BatchJob[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToBatches((updatedJobs) => {
      setJobs(updatedJobs);
    });
    return () => unsubscribe();
  }, []);

  const activeJobs = jobs.filter(j => j.status === 'processing' || j.status === 'queued');
  const pastJobs = jobs.filter(j => j.status === 'completed' || j.status === 'failed');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-shopify-text">Batch Processing</h2>
          <p className="text-shopify-subdued mt-1">Monitor bulk HS code classification jobs.</p>
        </div>
        <Button onClick={() => navigate('/orders')}>Create New Batch</Button>
      </div>

      {/* Active Jobs Section */}
      {activeJobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-shopify-text">In Progress</h3>
          {activeJobs.map((job) => (
            <Card key={job.id} className="border-l-4 border-l-shopify-primary animate-pulse-soft">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-shopify-text text-lg">{job.name}</h4>
                    <p className="text-sm text-shopify-subdued flex items-center gap-2 mt-1">
                      <Loader2 size={14} className="animate-spin" />
                      Processing {job.processed} of {job.total} orders
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Running
                    </span>
                  </div>
                </div>
                
                <ProgressBar 
                  progress={(job.processed / job.total) * 100} 
                  size="md" 
                  label="Overall Progress" 
                />

                <div className="bg-slate-50 rounded-md p-3 text-xs font-mono h-32 overflow-y-auto custom-scrollbar border border-shopify-border">
                   {job.results.slice().reverse().map((res, idx) => (
                     <div key={idx} className="flex items-center gap-2 mb-1.5 last:mb-0">
                       {res.status === 'success' ? (
                         <CheckCircle2 size={12} className="text-green-600" />
                       ) : (
                         <XCircle size={12} className="text-red-600" />
                       )}
                       <span className="text-shopify-text font-semibold">{res.orderNumber}:</span>
                       <span className="text-shopify-subdued">{res.message}</span>
                     </div>
                   ))}
                   {job.results.length === 0 && (
                     <span className="text-gray-400 italic">Initializing worker queue...</span>
                   )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* History Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-shopify-text">History</h3>
        {pastJobs.length === 0 ? (
           <Card className="py-12 flex flex-col items-center text-center">
             <div className="bg-gray-100 p-4 rounded-full mb-3">
               <Clock size={24} className="text-gray-400" />
             </div>
             <p className="text-shopify-text font-medium">No batch jobs found</p>
             <p className="text-shopify-subdued text-sm max-w-xs mt-1">Select multiple orders from the Orders page to start a batch.</p>
             <div className="mt-4">
                <Button onClick={() => navigate('/orders')}>Go to Orders</Button>
             </div>
           </Card>
        ) : (
          <Card className="p-0 overflow-hidden">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-shopify-border">
                  <tr>
                    <th className="px-6 py-3 font-medium text-shopify-subdued">Batch Name</th>
                    <th className="px-6 py-3 font-medium text-shopify-subdued">Date</th>
                    <th className="px-6 py-3 font-medium text-shopify-subdued">Status</th>
                    <th className="px-6 py-3 font-medium text-shopify-subdued">Success Rate</th>
                    <th className="px-6 py-3 font-medium text-shopify-subdued text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-shopify-border">
                  {pastJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-shopify-text">{job.name}</td>
                      <td className="px-6 py-4 text-shopify-subdued">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                           job.failed === 0 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                         }`}>
                           {job.failed === 0 ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                           {job.status === 'completed' ? 'Completed' : 'Failed'}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-shopify-text">
                        {job.total > 0 ? Math.round(((job.total - job.failed) / job.total) * 100) : 0}%
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-shopify-primary hover:underline inline-flex items-center gap-1 text-xs font-semibold">
                          <FileText size={14} /> View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </Card>
        )}
      </div>
    </div>
  );
};
