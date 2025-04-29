
import React, { useCallback, useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface DocumentUploaderProps {
  onFileUpload: (files: File[]) => void;
}

const DocumentUploader = ({ onFileUpload }: DocumentUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // 检查文件大小和类型
      const validFiles = validateFiles(newFiles);
      if (validFiles.length > 0) {
        onFileUpload(validFiles);
        
        toast({
          title: "文件已上传",
          description: `成功添加 ${validFiles.length} 个文件`,
        });
      }
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      
      // 检查文件大小和类型
      const validFiles = validateFiles(newFiles);
      if (validFiles.length > 0) {
        onFileUpload(validFiles);
        
        toast({
          title: "文件已上传",
          description: `成功添加 ${validFiles.length} 个文件`,
        });
      }
    }
  }, [onFileUpload]);

  // 验证文件
  const validateFiles = (files: File[]): File[] => {
    // 降低单个文件大小限制，避免超出模型处理能力
    const allowedTypes = ['.pdf', '.txt', '.doc', '.docx'];
    const maxSize = 5 * 1024 * 1024; // 5MB (降低限制)
    
    const validFiles = files.filter(file => {
      // 检查文件大小
      if (file.size > maxSize) {
        toast({
          title: "文件过大",
          description: `${file.name} 超出大小限制(5MB)，已跳过。较大的文件可能导致比对失败。`,
          variant: "destructive"
        });
        return false;
      }
      
      // 检查文件类型
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        toast({
          title: "不支持的文件类型",
          description: `${file.name} 格式不支持，请上传 PDF、TXT、DOC 或 DOCX 文件`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });
    
    return validFiles;
  };

  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center bg-muted/30 transition-all",
        "hover:bg-muted/50 cursor-pointer",
        isDragging ? "border-detailseer bg-detailseer/10" : "hover:border-detailseer"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
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
          <Upload className="h-6 w-6 text-detailseer" />
        </div>
        <h3 className="text-lg font-medium mb-2">上传文档进行比较</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          选择多个文档上传 (.pdf, .txt, .doc, .docx) 或拖放文件到此区域
        </p>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          文件大小限制: 5MB/文件（较大的文件可能导致比对失败）
        </div>
      </label>
    </div>
  );
};

export default DocumentUploader;
