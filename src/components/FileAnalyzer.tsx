
import React from 'react';
import UploadZone from './UploadZone';
import ResultDisplay from './ResultDisplay';
import { useFileProcessing } from '@/hooks/useFileProcessing';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

const FileAnalyzer = () => {
  const { isProcessing, results, processFiles, clearResults } = useFileProcessing();
  
  const handleNewUpload = () => {
    clearResults();
  };
  
  return (
    <div className="w-full">
      {results.length === 0 ? (
        <UploadZone 
          onFileSelected={processFiles} 
          isProcessing={isProcessing} 
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <Button 
              variant="outline" 
              onClick={handleNewUpload}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Analyze New Files
            </Button>
          </div>
          
          {isProcessing && (
            <div className="p-8 flex flex-col items-center justify-center animate-pulse">
              <Loader2 className="h-8 w-8 text-detailseer animate-spin mb-4" />
              <p className="text-center text-muted-foreground">Processing your files with AI...</p>
            </div>
          )}
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <ResultDisplay key={index} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileAnalyzer;
