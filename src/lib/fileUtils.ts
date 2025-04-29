
export interface FileProcessingResult {
  fileName: string;
  fileType: string;
  fileSize: string;
  contentType?: string;
  details: {
    category: string;
    content: string;
  }[];
  summary?: string;
  content?: string; // Added for document comparison
}

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileTypeIcon = (fileType: string): string => {
  // This function would return an appropriate icon based on file type
  // In a real implementation, this might return different icon components
  const type = fileType.toLowerCase();
  
  if (type.includes('pdf')) return 'pdf';
  if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(type)) return 'image';
  if (type.includes('text') || type === 'txt') return 'text';
  if (type.includes('word') || type === 'doc' || type === 'docx') return 'document';
  
  return 'file';
};

// Function to extract text content from a file
export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file content'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

// Mock function to simulate AI processing of files
// In a real implementation, this would connect to an AI service
export const processFileWithAI = async (file: File): Promise<FileProcessingResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const fileType = file.type || `file/${getFileExtension(file.name)}`;
  let content = '';
  
  try {
    // Try to extract text content
    content = await extractTextFromFile(file);
  } catch (error) {
    console.error('Error extracting text:', error);
    content = 'Content extraction not available for this file type';
  }
  
  // Mock results based on file type
  let details = [];
  let summary = '';
  
  if (fileType.includes('pdf') || fileType.includes('document')) {
    details = [
      { category: 'Document Type', content: 'Business Report' },
      { category: 'Date', content: 'April 25, 2025' },
      { category: 'Author', content: 'Zhang Wei' },
      { category: 'Key Topics', content: 'Financial Analysis, Market Trends, Quarterly Results' },
      { category: 'Tables Detected', content: '3 tables with financial data' },
      { category: 'Charts Detected', content: '2 bar charts, 1 line graph showing growth trends' },
    ];
    summary = 'This document appears to be a quarterly business report with financial data, market analysis, and performance metrics. It contains detailed tables and visualizations of key business indicators.';
  } else if (fileType.includes('image')) {
    details = [
      { category: 'Image Type', content: 'Photograph' },
      { category: 'Resolution', content: '1920x1080 pixels' },
      { category: 'Color Profile', content: 'RGB' },
      { category: 'Objects Detected', content: 'Office Building, People (4), Trees (2), Vehicles (3)' },
      { category: 'Text Detected', content: 'Company logo, "Innovation Center" signage' },
      { category: 'Scene Classification', content: 'Corporate Exterior' },
    ];
    summary = 'This image shows the exterior of a corporate building with the company logo and "Innovation Center" signage. Several people and vehicles are visible in the foreground.';
  } else {
    details = [
      { category: 'Content Type', content: 'Text Document' },
      { category: 'Language', content: 'Simplified Chinese (主要) with some English terms' },
      { category: 'Character Count', content: `~${content.length} characters` },
      { category: 'Sections Detected', content: 'Header, Main Content, Footer' },
      { category: 'Key Entities', content: 'Names, Dates, Organization References' },
    ];
    summary = 'This appears to be a text document written primarily in Simplified Chinese with some English technical terms. It contains structured sections with various entities like names, dates, and organizational references.';
  }
  
  return {
    fileName: file.name,
    fileType,
    fileSize: formatFileSize(file.size),
    contentType: fileType,
    details,
    summary,
    content: content.substring(0, 5000) // Limit content length for large files
  };
};
