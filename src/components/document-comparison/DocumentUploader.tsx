
import React, { useCallback } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface DocumentUploaderProps {
  onFileUpload: (files: File[]) => void;
}

const DocumentUploader = ({ onFileUpload }: DocumentUploaderProps) => {
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onFileUpload(newFiles);
      
      toast({
        title: "文件已上传",
        description: `成功添加 ${newFiles.length} 个文件`,
      });
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      onFileUpload(newFiles);
      
      toast({
        title: "文件已上传",
        description: `成功添加 ${newFiles.length} 个文件`,
      });
    }
  }, [onFileUpload]);

  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center bg-muted/30 transition-all",
        "hover:bg-muted/50 cursor-pointer hover:border-detailseer"
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        id="doc-upload" 
        className="hidden" 
        onChange={handleFileUpload}
        multiple
        accept=".pdf,.txt,.doc,.docx"
      />
      <label htmlFor="doc-upload" className="w-full h-full flex flex-col items-center cursor-pointer">
        <div className="h-12 w-12 rounded-full bg-detailseer/10 flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-detailseer" />
        </div>
        <h3 className="text-lg font-medium mb-2">上传文档进行比较</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          选择多个文档上传 (.pdf, .txt, .doc, .docx) 或拖放文件到此区域
        </p>
      </label>
    </div>
  );
};

export default DocumentUploader;
