
import { ContainerSpec, ContainerType, Product, LoadCalculation } from '../types';

export const CONTAINER_SPECS: Record<ContainerType, ContainerSpec> = {
  '20ft': {
    type: '20ft',
    name: '20ft Standard Container',
    maxVolumeCBM: 33.2,
    maxWeightKg: 25000, // Payload capacity approx
    innerLength: 589,
    innerWidth: 235,
    innerHeight: 239
  },
  '40ft': {
    type: '40ft',
    name: '40ft Standard Container',
    maxVolumeCBM: 67.7,
    maxWeightKg: 27600,
    innerLength: 1203,
    innerWidth: 235,
    innerHeight: 239
  },
  '40hc': {
    type: '40hc',
    name: '40ft High Cube Container',
    maxVolumeCBM: 76.3,
    maxWeightKg: 28600,
    innerLength: 1203,
    innerWidth: 235,
    innerHeight: 269
  }
};

export const calculateContainerLoad = (
  items: Product[],
  containerType: ContainerType
): LoadCalculation => {
  const spec = CONTAINER_SPECS[containerType];
  
  let totalVolumeCBM = 0;
  let totalWeightKg = 0;
  let totalCartons = 0;

  items.forEach(item => {
    const qty = item.quantity || 1;
    const lengthM = (item.length || 0) / 100;
    const widthM = (item.width || 0) / 100;
    const heightM = (item.height || 0) / 100;
    const weightKg = item.weight || 0;

    const itemVolume = lengthM * widthM * heightM;
    
    totalVolumeCBM += itemVolume * qty;
    totalWeightKg += weightKg * qty;
    totalCartons += qty;
  });

  // Calculate Utilization based on a SINGLE container capacity
  const volumeUtilization = (totalVolumeCBM / spec.maxVolumeCBM) * 100;
  const weightUtilization = (totalWeightKg / spec.maxWeightKg) * 100;

  // Containers Needed (Max of volume or weight requirement)
  const requiredByVol = Math.ceil(totalVolumeCBM / spec.maxVolumeCBM);
  const requiredByWt = Math.ceil(totalWeightKg / spec.maxWeightKg);
  const containersRequired = Math.max(requiredByVol, requiredByWt, 1);

  // Check if a single load is overweight for one container
  // (Only flag if we are trying to fit it all in one and it exceeds weight)
  const isOverweight = totalWeightKg > spec.maxWeightKg;

  return {
    totalVolumeCBM: parseFloat(totalVolumeCBM.toFixed(2)),
    totalWeightKg: parseFloat(totalWeightKg.toFixed(2)),
    containersRequired: totalVolumeCBM > 0 ? containersRequired : 0,
    volumeUtilization: parseFloat(volumeUtilization.toFixed(1)),
    weightUtilization: parseFloat(weightUtilization.toFixed(1)),
    isOverweight,
    totalCartons
  };
};
