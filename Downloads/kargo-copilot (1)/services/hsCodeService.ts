import { HSDatabaseEntry } from '../types';

// A small subset of the massive HS code database for demonstration
const HS_DATABASE: HSDatabaseEntry[] = [
  // Apparel
  { code: "6109.10", description: "T-shirts, singlets and other vests; knitted or crocheted, of cotton", chapter: "61", heading: "6109", section: "Section XI: Textiles" },
  { code: "6109.90", description: "T-shirts, singlets and other vests; knitted or crocheted, of other textile materials", chapter: "61", heading: "6109", section: "Section XI: Textiles" },
  { code: "6203.42", description: "Men's or boys' trousers, bib and brace overalls, breeches and shorts; of cotton", chapter: "62", heading: "6203", section: "Section XI: Textiles" },
  { code: "6403.91", description: "Footwear with outer soles of rubber, plastics, leather or composition leather and uppers of leather; covering the ankle", chapter: "64", heading: "6403", section: "Section XII: Footwear" },
  
  // Electronics
  { code: "8518.30", description: "Headphones and earphones, whether or not combined with a microphone, and sets consisting of a microphone and one or more loudspeakers", chapter: "85", heading: "8518", section: "Section XVI: Machinery & Mechanical Appliances" },
  { code: "8517.13", description: "Smartphones", chapter: "85", heading: "8517", section: "Section XVI: Machinery & Mechanical Appliances" },
  { code: "8471.30", description: "Portable automatic data processing machines, weighing not more than 10 kg, consisting of at least a central processing unit, a keyboard and a display (Laptops)", chapter: "84", heading: "8471", section: "Section XVI: Machinery & Mechanical Appliances" },
  
  // Home & Kitchen
  { code: "6911.10", description: "Tableware and kitchenware, of porcelain or china", chapter: "69", heading: "6911", section: "Section XIII: Stone, Plaster, Cement, Ceramics" },
  { code: "3924.10", description: "Tableware and kitchenware, of plastics", chapter: "39", heading: "3924", section: "Section VII: Plastics and Articles Thereof" },
  
  // Toys & Games
  { code: "9504.90", description: "Video game consoles and machines, table or parlour games", chapter: "95", heading: "9504", section: "Section XX: Miscellaneous Manufactured Articles" },
  { code: "9503.00", description: "Tricycles, scooters, pedal cars and similar wheeled toys; dolls' carriages; dolls; other toys; reduced-size ('scale') models", chapter: "95", heading: "9503", section: "Section XX: Miscellaneous Manufactured Articles" },

  // Coffee/Food
  { code: "0901.21", description: "Coffee, roasted: Not decaffeinated", chapter: "09", heading: "0901", section: "Section II: Vegetable Products" },
  { code: "1806.31", description: "Chocolate and other food preparations containing cocoa: Filled blocks, slabs or bars", chapter: "18", heading: "1806", section: "Section IV: Prepared Foodstuffs" }
];

export const searchHSDatabase = async (query: string): Promise<HSDatabaseEntry[]> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 400));

  if (!query) return [];

  const lowerQuery = query.toLowerCase();
  return HS_DATABASE.filter(entry => 
    entry.code.includes(lowerQuery) || 
    entry.description.toLowerCase().includes(lowerQuery) ||
    entry.heading.includes(lowerQuery)
  );
};
