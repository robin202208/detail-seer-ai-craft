
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import DocumentUploader from './document-comparison/DocumentUploader';
import DocumentList from './document-comparison/DocumentList';
import SelectedDocuments from './document-comparison/SelectedDocuments';
import ComparisonResult from './document-comparison/ComparisonResult';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

interface ComparisonResult {
  comparison: string;
}

const CompareDocuments = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{fileA?: File, fileB?: File}>({});
  const [fileContents, setFileContents] = useState<{[key: string]: string}>({});
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [comparisonError, setComparisonError] = useState<string | null>(null);

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
    
    // 清除之前的比对结果和错误
    setComparisonResult(null);
    setComparisonError(null);
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
    setComparisonError(null);

    try {
      const contentA = fileContents[selectedFiles.fileA.name];
      const contentB = fileContents[selectedFiles.fileB.name];

      toast({
        title: "开始细微差异比对",
        description: "正在深入分析文档细节，特别是数字、批号等关键差异...",
      });

      const { data, error } = await supabase.functions.invoke<ComparisonResult>('document-compare', {
        body: {
          documentA: contentA,
          documentB: contentB
        }
      });

      if (error) {
        throw new Error(error.message);
      }
      
      if (!data?.comparison) {
        throw new Error("无法获取比较结果");
      }
      
      setComparisonResult(data.comparison);
      
      toast({
        title: "比对完成",
        description: "文档细微差异分析已完成，重点标注了数字和标识符的差异"
      });
    } catch (error) {
      console.error('文档比对错误:', error);
      
      // 提供更友好的错误信息
      let errorMessage = "比对文档时出错";
      if (error instanceof Error) {
        errorMessage = error.message;
        // 检查特定的错误情况
        if (errorMessage.includes("2xx")) {
          errorMessage = "与AI服务连接失败。请尝试减少文档大小或稍后再试。";
        } else if (errorMessage.includes("格式")) {
          errorMessage = "处理文档时出错。请确保文档格式正确且内容可读。";
        }
      }
      
      setComparisonError(errorMessage);
      
      toast({
        title: "比对失败",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsComparing(false);
    }
  };

  const clearSelectedFiles = () => {
    setSelectedFiles({});
    setComparisonResult(null);
    setComparisonError(null);
  };

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(file => file !== fileToRemove));
    
    // Also remove from selected files if needed
    if (selectedFiles.fileA === fileToRemove || selectedFiles.fileB === fileToRemove) {
      setSelectedFiles(prev => ({
        fileA: prev.fileA === fileToRemove ? undefined : prev.fileA,
        fileB: prev.fileB === fileToRemove ? undefined : prev.fileB
      }));
      
      // 清除比对结果和错误
      setComparisonResult(null);
      setComparisonError(null);
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
        {!comparisonResult && !comparisonError && (
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              我们的文档比对引擎专门设计用于识别细微差异，如批号、代码、数值等关键信息的变化。
              上传两个文档后，系统将高亮显示这些关键差异。
            </AlertDescription>
          </Alert>
        )}
      
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
          errorMessage={comparisonError}
          selectedFiles={selectedFiles}
        />
      </div>
    </div>
  );
};

export default CompareDocuments;
