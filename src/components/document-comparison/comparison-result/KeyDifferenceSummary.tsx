
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface KeyDifferenceSummaryProps {
  highlightDifferences: (text: string) => string;
  keySummary?: string;
  keyIdentifiers?: string;
}

const KeyDifferenceSummary = ({ highlightDifferences, keySummary, keyIdentifiers }: KeyDifferenceSummaryProps) => {
  return (
    <>
      {/* 特别突出显示关键差异摘要 */}
      {keySummary && (
        <div className="mb-6 bg-muted/30 p-4 rounded-md border border-muted">
          <h3 className="text-lg font-semibold mb-2">关键差异摘要</h3>
          <div 
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{ 
              __html: highlightDifferences(keySummary) 
            }}
          />
        </div>
      )}
      
      {/* 关键标识符比对部分，特别突出显示 */}
      {keyIdentifiers && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Search className="h-4 w-4 mr-2" />
            关键标识符比对
            <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
              最重要
            </Badge>
          </h3>
          <div 
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{ 
              __html: highlightDifferences(keyIdentifiers) 
            }}
          />
        </div>
      )}
    </>
  );
};

export default KeyDifferenceSummary;
