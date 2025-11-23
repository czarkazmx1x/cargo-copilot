
import { ClassificationHistoryItem } from '../types';

// Mock Data
const MOCK_HISTORY: ClassificationHistoryItem[] = [
  {
    id: '1',
    productName: "Men's Cotton T-Shirt",
    description: "100% Cotton, round neck, short sleeve",
    hsCode: "6109.10",
    confidence: 98,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    method: 'AI_TEXT',
    status: 'active'
  },
  {
    id: '2',
    productName: "Leather Hiking Boots",
    description: "Waterproof leather upper, rubber sole",
    hsCode: "6403.91",
    confidence: 92,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    method: 'AI_VISION',
    status: 'active'
  },
  {
    id: '3',
    productName: "Ceramic Coffee Mug",
    description: "White ceramic mug, 12oz",
    hsCode: "6911.10",
    confidence: 88,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    method: 'AI_TEXT',
    status: 'active'
  },
  {
    id: '4',
    productName: "Bluetooth Wireless Headphones",
    description: "Over-ear noise cancelling headphones",
    hsCode: "8518.30",
    confidence: 95,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    method: 'HYBRID',
    status: 'active'
  },
  {
    id: '5',
    productName: "Wooden Chess Set",
    description: "Hand-carved wooden pieces and board",
    hsCode: "9504.90",
    confidence: 75, // Low confidence
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    method: 'AI_VISION',
    status: 'active'
  },
];

export const getHistory = async (
  searchTerm: string = '', 
  minConfidence: number = 0
): Promise<ClassificationHistoryItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  return MOCK_HISTORY.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.hsCode.includes(searchTerm);
    const matchesConfidence = item.confidence >= minConfidence;
    
    return matchesSearch && matchesConfidence;
  });
};

export const exportHistoryToCSV = (items: ClassificationHistoryItem[]) => {
  const headers = ['ID', 'Product Name', 'Description', 'HS Code', 'Confidence', 'Method', 'Timestamp'];
  const rows = items.map(item => [
    item.id,
    `"${item.productName.replace(/"/g, '""')}"`, // Escape quotes
    `"${item.description.replace(/"/g, '""')}"`,
    item.hsCode,
    item.confidence + '%',
    item.method,
    item.timestamp
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `classification_history_${new Date().toISOString().slice(0,10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};