
import { useState } from 'react';
import { processFileWithAI, FileProcessingResult } from '@/lib/fileUtils';
import { toast } from '@/components/ui/use-toast';

export const useFileProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<FileProcessingResult[]>([]);

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setResults([]);

    try {
      toast({
        title: "开始处理",
        description: `正在使用AI分析 ${files.length} 个文件...`,
      });

      const filePromises = files.map(file => processFileWithAI(file));
      const processedResults = await Promise.all(filePromises);

      setResults(processedResults);
      
      toast({
        title: "分析完成",
        description: `成功分析了 ${files.length} 个文件`,
        variant: "default",
      });
    } catch (error) {
      console.error('处理文件出错:', error);
      toast({
        title: "处理文件出错",
        description: "分析文件时发生错误，请重试。",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    results,
    processFiles,
    clearResults: () => setResults([])
  };
};
