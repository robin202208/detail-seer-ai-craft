
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import DocumentUploader from './document-comparison/DocumentUploader';
import DocumentList from './document-comparison/DocumentList';
import SelectedDocuments from './document-comparison/SelectedDocuments';
import ComparisonResult from './document-comparison/ComparisonResult';

interface ComparisonResult {
  comparison: string;
}

const CompareDocuments = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{fileA?: File, fileB?: File}>({});
  const [fileContents, setFileContents] = useState<{[key: string]: string}>({});
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Read file contents
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileContents(prev => ({
            ...prev,
            [file.name]: event.target?.result as string
          }));
        }
      };
      reader.readAsText(file);
    });
  };

  const selectFileForComparison = (file: File, slot: 'A' | 'B') => {
    setSelectedFiles(prev => ({
      ...prev,
      [`file${slot}`]: file
    }));
  };

  const compareDocuments = async () => {
    if (!selectedFiles.fileA || !selectedFiles.fileB) {
      toast({
        title: "需要选择文件",
        description: "请选择两个文档进行比较",
        variant: "destructive"
      });
      return;
    }

    setIsComparing(true);
    setComparisonResult(null);

    try {
      const contentA = fileContents[selectedFiles.fileA.name];
      const contentB = fileContents[selectedFiles.fileB.name];

      toast({
        title: "开始详细比对",
        description: "正在深入分析文档差异，这可能需要一些时间...",
      });

      const { data, error } = await supabase.functions.invoke<ComparisonResult>('document-compare', {
        body: {
          documentA: contentA,
          documentB: contentB
        }
      });

      if (error) throw new Error(error.message);
      
      setComparisonResult(data?.comparison || '未能获取比较结果');
      
      toast({
        title: "比对完成",
        description: "文档差异详细分析已完成"
      });
    } catch (error) {
      console.error('文档比对错误:', error);
      toast({
        title: "比对失败",
        description: error instanceof Error ? error.message : "比较文档时出错",
        variant: "destructive"
      });
    } finally {
      setIsComparing(false);
    }
  };

  const clearSelectedFiles = () => {
    setSelectedFiles({});
  };

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(file => file !== fileToRemove));
    
    // Also remove from selected files if needed
    if (selectedFiles.fileA === fileToRemove || selectedFiles.fileB === fileToRemove) {
      setSelectedFiles(prev => ({
        fileA: prev.fileA === fileToRemove ? undefined : prev.fileA,
        fileB: prev.fileB === fileToRemove ? undefined : prev.fileB
      }));
    }
    
    // Remove file contents
    setFileContents(prev => {
      const newContents = {...prev};
      delete newContents[fileToRemove.name];
      return newContents;
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4">
        <DocumentUploader onFileUpload={handleFileUpload} />
        
        <DocumentList 
          files={uploadedFiles}
          selectedFiles={selectedFiles}
          onSelectFile={selectFileForComparison}
          onRemoveFile={removeFile}
        />
        
        <SelectedDocuments 
          selectedFiles={selectedFiles}
          onClearSelection={clearSelectedFiles}
          onCompare={compareDocuments}
          isComparing={isComparing}
        />
        
        <ComparisonResult 
          comparisonResult={comparisonResult}
          selectedFiles={selectedFiles}
        />
      </div>
    </div>
  );
};

export default CompareDocuments;
