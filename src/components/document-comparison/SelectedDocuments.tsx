
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, FileDiff, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface SelectedDocumentsProps {
  selectedFiles: {fileA?: File, fileB?: File};
  onClearSelection: () => void;
  onCompare: () => void;
  isComparing: boolean;
}

const SelectedDocuments = ({ 
  selectedFiles, 
  onClearSelection, 
  onCompare, 
  isComparing 
}: SelectedDocumentsProps) => {
  if (!selectedFiles.fileA && !selectedFiles.fileB) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>已选择文档</CardTitle>
        <CardDescription>选择两个文档并点击比较，详细分析它们的差异</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 p-4 bg-muted/20 rounded-md">
            <h4 className="text-sm font-medium mb-2">文档 A</h4>
            {selectedFiles.fileA ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{selectedFiles.fileA.name}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">未选择文档</p>
            )}
          </div>
          
          <div className="flex-1 p-4 bg-muted/20 rounded-md">
            <h4 className="text-sm font-medium mb-2">文档 B</h4>
            {selectedFiles.fileB ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{selectedFiles.fileB.name}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">未选择文档</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={onClearSelection}>清除选择</Button>
          <Button 
            onClick={onCompare}
            disabled={!selectedFiles.fileA || !selectedFiles.fileB || isComparing}
            className="gap-2"
          >
            {isComparing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                详细比对中...
              </>
            ) : (
              <>
                <FileDiff className="h-4 w-4" />
                详细比对文档
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedDocuments;
