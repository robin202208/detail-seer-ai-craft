
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface DocumentUploaderProps {
  onFileUpload: (files: File[]) => void;
}

const DocumentUploader = ({ onFileUpload }: DocumentUploaderProps) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onFileUpload(newFiles);
      
      toast({
        title: "文件已上传",
        description: `成功添加 ${newFiles.length} 个文件`,
      });
    }
  };

  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center bg-muted/30 transition-all",
        "hover:bg-muted/50 cursor-pointer hover:border-detailseer"
      )}
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
          选择多个文档上传 (.pdf, .txt, .doc, .docx)
        </p>
      </label>
    </div>
  );
};

export default DocumentUploader;
