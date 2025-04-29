
import React from 'react';

interface ComparisonTableProps {
  processTableContent: (content: string) => string;
  tableContent?: string;
}

const ComparisonTable = ({ processTableContent, tableContent }: ComparisonTableProps) => {
  if (!tableContent) return null;
  
  return (
    <div className="mb-6 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2">表格式精确对比</h3>
      <div 
        dangerouslySetInnerHTML={{ 
          __html: processTableContent(tableContent) 
        }}
      />
    </div>
  );
};

export default ComparisonTable;
