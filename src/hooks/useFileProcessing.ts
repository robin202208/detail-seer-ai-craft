
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
        title: "Processing started",
        description: `Analyzing ${files.length} file(s) with AI...`,
      });

      const filePromises = files.map(file => processFileWithAI(file));
      const processedResults = await Promise.all(filePromises);

      setResults(processedResults);
      
      toast({
        title: "Analysis complete",
        description: `Successfully analyzed ${files.length} file(s)`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Error processing files",
        description: "There was an error analyzing your files. Please try again.",
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
