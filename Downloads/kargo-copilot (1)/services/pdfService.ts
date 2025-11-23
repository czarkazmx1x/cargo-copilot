
import { Order, DocumentType, DocumentTemplate } from '../types';
import { getSettings } from './settingsService';

// Access global jsPDF from CDN
declare const jspdf: any;

export const generateDocument = async (
  type: DocumentType, 
  order: Order,
  template?: DocumentTemplate
): Promise<Blob> => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const settings = await getSettings();

  // Default template values if none provided
  const primaryColor = template?.primaryColor || '#202223';
  const layout = template?.layout || 'classic';
  const showFooter = !!template?.footerText;

  // Helper: Hex to RGB for jsPDF
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const color = hexToRgb(primaryColor);

  // --- RENDER LOGO ---
  let headerOffset = 20;
  if (template?.logo) {
    try {
      // Add logo at top left
      // Maintain aspect ratio logic would go here, simplifying to fixed width
      doc.addImage(template.logo, 'JPEG', 14, 10, 40, 20);
      headerOffset = 40; // Push header text down
    } catch (e) {
      console.warn("Could not render logo", e);
    }
  }

  // --- HEADER ---
  const addHeader = (title: string) => {
    if (layout === 'modern') {
      // Modern: Colored bar at top or colored title
      doc.setFillColor(color.r, color.g, color.b);
      doc.rect(0, 0, 210, 5, 'F'); // Top colored strip
      
      doc.setFontSize(24);
      doc.setTextColor(color.r, color.g, color.b);
      doc.text(title, 14, headerOffset + 10);
    } else {
      // Classic: Black text
      doc.setFontSize(22);
      doc.setTextColor(32, 34, 35);
      doc.text(title, 14, headerOffset + 10);
    }
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, headerOffset + 10);
    
    if (template?.id) {
       doc.setFontSize(8);
       doc.text(`Ref: ${template.name}`, 150, headerOffset + 16);
    }
  };

  // --- ORDER INFO & ADDRESSES ---
  const addOrderInfo = (startY: number) => {
    const sellerY = startY;
    
    // Seller Info
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("EXPORTER (SELLER):", 14, sellerY);
    
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(settings.companyName || "My Store Inc.", 14, sellerY + 6);
    
    if (template?.showCompanyAddress !== false) {
       const addrLines = doc.splitTextToSize(settings.address || "123 Commerce St", 80);
       doc.text(addrLines, 14, sellerY + 12);
    }
    
    if (template?.showTaxId !== false && settings.taxId) {
       doc.text(`Tax ID: ${settings.taxId}`, 14, sellerY + 24);
    }

    // Buyer Info
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("CONSIGNEE (BUYER):", 110, sellerY);
    
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(order.customer, 110, sellerY + 6);
    doc.text(`Order #: ${order.orderNumber}`, 110, sellerY + 12);
    doc.text(order.countryCode, 110, sellerY + 18);

    return sellerY + 40;
  };

  // --- DOCUMENT SPECIFIC CONTENT ---

  if (type === 'COMMERCIAL_INVOICE') {
    addHeader('COMMERCIAL INVOICE');
    const tableStartY = addOrderInfo(headerOffset + 25);

    // Table Header
    let yPos = tableStartY;
    
    // Styled Table Header
    doc.setFillColor(layout === 'minimal' ? 240 : color.r, layout === 'minimal' ? 240 : color.g, layout === 'minimal' ? 240 : color.b);
    if (layout !== 'minimal') doc.setFillColor(color.r, color.g, color.b);
    
    doc.rect(14, yPos, 181, 8, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(layout === 'minimal' ? 0 : 255);
    doc.font = 'helvetica';
    doc.fontType = 'bold';
    doc.text("DESCRIPTION", 16, yPos + 5);
    doc.text("HS CODE", 90, yPos + 5);
    doc.text("ORIGIN", 120, yPos + 5);
    doc.text("QTY", 145, yPos + 5);
    doc.text("VALUE", 165, yPos + 5);
    
    // Mock Items (since Order mock might be empty)
    const items = order.items.length > 0 ? order.items : [
      { title: "Leather Hiking Boots", hsCode: "6403.91.00", originCountry: settings.defaultOriginCountry, price: order.total, quantity: 1 }
    ];

    yPos += 14;
    doc.setTextColor(0);
    doc.fontType = 'normal';
    
    items.forEach((item: any) => {
      doc.text(item.title.substring(0, 40), 16, yPos);
      doc.text(item.hsCode || "MISSING", 90, yPos);
      doc.text(item.originCountry || "US", 120, yPos);
      doc.text("1", 145, yPos);
      doc.text(`$${item.price.toFixed(2)}`, 165, yPos);
      yPos += 8;
    });
    
    // Totals
    doc.line(14, yPos + 2, 195, yPos + 2);
    doc.setFontSize(10);
    doc.fontType = 'bold';
    doc.text(`Total (${settings.defaultCurrency}):`, 135, yPos + 10);
    doc.text(`$${order.total.toFixed(2)}`, 165, yPos + 10);

    // Declaration
    const declY = yPos + 30;
    doc.setFontSize(8);
    doc.fontType = 'normal';
    doc.text("I declare that the information contained in this invoice is true and correct.", 14, declY);
    doc.line(14, declY + 15, 80, declY + 15);
    doc.text("Authorized Signature", 14, declY + 20);

  } else if (type === 'PACKING_LIST') {
    addHeader('PACKING LIST');
    const nextY = addOrderInfo(headerOffset + 25);
    
    doc.autoTable({
      startY: nextY + 5,
      headStyles: { fillColor: [color.r, color.g, color.b] },
      head: [['Item', 'SKU', 'HS Code', 'Net Wt (kg)', 'Gross Wt (kg)']],
      body: [
        ['Leather Boots', 'BT-001', '6403.91', '1.2', '1.5'],
        ['Cotton Socks', 'SK-022', '6115.95', '0.1', '0.15'],
      ],
    });

  } else if (type === 'CERTIFICATE_OF_ORIGIN') {
    addHeader('CERTIFICATE OF ORIGIN');
    const nextY = addOrderInfo(headerOffset + 25);

    doc.setFontSize(11);
    doc.text("The undersigned hereby declares that the following goods", 14, nextY + 10);
    doc.text(`originated in ${settings.defaultOriginCountry === 'US' ? 'the United States of America' : settings.defaultOriginCountry}.`, 14, nextY + 16);
    
    doc.autoTable({
      startY: nextY + 25,
      headStyles: { fillColor: [color.r, color.g, color.b] },
      head: [['Product Description', 'HS Tariff Classification', 'Origin Criterion']],
      body: [
         ['Leather Hiking Boots', '6403.91.00', 'Criterion A'],
      ]
    });
    
    doc.rect(14, 220, 180, 40);
    doc.text("Authorized Signature:", 20, 235);
    doc.text("Date:", 120, 235);
  }

  // Footer
  if (template?.footerText) {
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(template.footerText, 105, pageHeight - 10, { align: 'center' });
  }

  return doc.output('blob');
};
