
import React from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FullResultViewProps {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  comparisonResult: string;
}

const FullResultView = ({ isExpanded, setIsExpanded, comparisonResult }: FullResultViewProps) => {
  if (isExpanded) {
    return (
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-lg font-medium mb-2">完整原始比对结果</h3>
        <div className="whitespace-pre-line bg-muted/50 p-4 rounded-md text-sm">
          {comparisonResult}
        </div>
      </div>
    );
  }
  
  if (comparisonResult && comparisonResult.length > 1000) {
    return (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button
            variant="link"
            className="mt-4 text-sm p-0 h-auto"
          >
            显示原始完整比对结果
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-lg font-medium mb-2">完整原始比对结果</h3>
            <div className="whitespace-pre-line bg-muted/50 p-4 rounded-md text-sm">
              {comparisonResult}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
  
  return null;
};

export default FullResultView;
