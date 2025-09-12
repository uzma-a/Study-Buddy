// utils/pdfExport.js

import jsPDF from "jspdf";
import "jspdf-autotable";

export const saveAsPdf = (title, content) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margins = { top: 20, left: 15, right: 15, bottom: 20 };
    const maxWidth = pageWidth - margins.left - margins.right;
    
    let yPosition = margins.top;

    // Helper function to add a new page if needed
    const checkPageBreak = (requiredHeight = 10) => {
      if (yPosition + requiredHeight > pageHeight - margins.bottom) {
        pdf.addPage();
        yPosition = margins.top;
        return true;
      }
      return false;
    };

    // Helper function to wrap text
    const addWrappedText = (text, fontSize, fontStyle = 'normal', color = [0, 0, 0]) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      pdf.setTextColor(color[0], color[1], color[2]);
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      const lineHeight = fontSize * 0.4;
      
      lines.forEach(line => {
        checkPageBreak(lineHeight + 2);
        pdf.text(line, margins.left, yPosition);
        yPosition += lineHeight;
      });
      
      yPosition += 3; // Add some spacing after text block
    };

    // Add title
    pdf.setFillColor(59, 130, 246); // Blue background
    pdf.rect(0, 0, pageWidth, 35, 'F');
    
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text(title, margins.left, 25);
    
    yPosition = 45;

    // Add generation timestamp
    const timestamp = new Date().toLocaleString();
    addWrappedText(`Generated on: ${timestamp}`, 10, 'italic', [100, 100, 100]);
    yPosition += 5;

    // Process content - remove markdown and format properly
    let processedContent = content;
    
    // Remove markdown syntax and convert to plain text with proper formatting
    const lines = processedContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      if (!line) {
        yPosition += 3;
        continue;
      }
      
      // Handle headers
      if (line.startsWith('### ')) {
        yPosition += 5;
        addWrappedText(line.replace('### ', ''), 14, 'bold', [37, 99, 235]);
      } else if (line.startsWith('## ')) {
        yPosition += 8;
        addWrappedText(line.replace('## ', ''), 16, 'bold', [29, 78, 216]);
      } else if (line.startsWith('# ')) {
        yPosition += 10;
        addWrappedText(line.replace('# ', ''), 18, 'bold', [30, 64, 175]);
      }
      // Handle bold text
      else if (line.includes('**')) {
        // Simple bold handling - split by ** and alternate between normal and bold
        const parts = line.split('**');
        let processedLine = '';
        for (let j = 0; j < parts.length; j++) {
          if (j % 2 === 1) {
            // This would be bold text, but we'll just add it normally for simplicity
            processedLine += parts[j];
          } else {
            processedLine += parts[j];
          }
        }
        addWrappedText(processedLine, 11, 'normal', [51, 65, 85]);
      }
      // Handle bullet points
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const bulletText = line.substring(2);
        addWrappedText(`• ${bulletText}`, 11, 'normal', [51, 65, 85]);
      }
      // Handle numbered lists
      else if (/^\d+\.\s/.test(line)) {
        addWrappedText(line, 11, 'normal', [51, 65, 85]);
      }
      // Handle key-value pairs (like "Date:", "Event:", etc.)
      else if (line.includes(':') && line.length < 100) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        if (key && value) {
          // Add key in bold style
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(30, 64, 175);
          
          checkPageBreak(8);
          pdf.text(`${key.trim()}:`, margins.left, yPosition);
          
          // Add value in normal style
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(51, 65, 85);
          
          const keyWidth = pdf.getTextWidth(`${key.trim()}: `);
          const valueLines = pdf.splitTextToSize(value, maxWidth - keyWidth);
          
          if (valueLines.length === 1) {
            pdf.text(value, margins.left + keyWidth, yPosition);
            yPosition += 6;
          } else {
            yPosition += 6;
            valueLines.forEach(valueLine => {
              checkPageBreak(6);
              pdf.text(valueLine, margins.left + 10, yPosition);
              yPosition += 5;
            });
          }
          yPosition += 2;
        } else {
          addWrappedText(line, 11, 'normal', [51, 65, 85]);
        }
      }
      // Regular paragraph text
      else {
        addWrappedText(line, 11, 'normal', [51, 65, 85]);
      }
    }

    // Add footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margins.right - 20,
        pageHeight - 10
      );
      
      // Add a subtle line at the bottom
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margins.left, pageHeight - 15, pageWidth - margins.right, pageHeight - 15);
    }

    // Generate filename with timestamp
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
    
    console.log(`PDF saved successfully as: ${filename}`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Fallback: Create a simple PDF
    try {
      const fallbackPdf = new jsPDF();
      fallbackPdf.setFontSize(16);
      fallbackPdf.text(title, 20, 30);
      fallbackPdf.setFontSize(12);
      
      // Simple text wrapping for fallback
      const lines = fallbackPdf.splitTextToSize(content.replace(/[#*\-]/g, ''), 170);
      let y = 50;
      
      lines.forEach(line => {
        if (y > 280) {
          fallbackPdf.addPage();
          y = 30;
        }
        fallbackPdf.text(line, 20, y);
        y += 7;
      });
      
      fallbackPdf.save(`${title}_fallback.pdf`);
    } catch (fallbackError) {
      alert('Failed to generate PDF. Please try again.');
      console.error('Fallback PDF generation failed:', fallbackError);
    }
  }
};