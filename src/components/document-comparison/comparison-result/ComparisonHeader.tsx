
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Maximize2, Minimize2 } from 'lucide-react';

interface ComparisonHeaderProps {
  fileAName: string;
  fileBName: string;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

const ComparisonHeader = ({ fileAName, fileBName, isExpanded, setIsExpanded }: ComparisonHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>细微差异比对结果：{fileAName} 与 {fileBName}</CardTitle>
          <CardDescription>详细的关键信息差异分析</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <Minimize2 className="h-4 w-4" />
              <span className="hidden sm:inline">收起详情</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" />
              <span className="hidden sm:inline">展开全部</span>
            </>
          )}
        </Button>
      </div>
    </CardHeader>
  );
};

export default ComparisonHeader;
