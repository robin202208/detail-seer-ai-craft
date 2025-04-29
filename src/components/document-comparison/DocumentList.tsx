
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DocumentListProps {
  files: File[];
  selectedFiles: {fileA?: File, fileB?: File};
  onSelectFile: (file: File, slot: 'A' | 'B') => void;
  onRemoveFile: (file: File) => void;
}

const DocumentList = ({ files, selectedFiles, onSelectFile, onRemoveFile }: DocumentListProps) => {
  if (files.length === 0) return null;
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">已上传文档 ({files.length})</h3>
      <div className="space-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-detailseer" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className={cn(selectedFiles.fileA === file && "bg-blue-100 border-blue-300")}
                onClick={() => onSelectFile(file, 'A')}
              >
                文档 A
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(selectedFiles.fileB === file && "bg-blue-100 border-blue-300")}
                onClick={() => onSelectFile(file, 'B')}
              >
                文档 B
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onRemoveFile(file)}
              >
                移除
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
