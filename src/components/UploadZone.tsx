
import React, { useCallback } from 'react';
import { Upload, FileType, File as FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onFileSelected: (files: File[]) => void;
  isProcessing: boolean;
  acceptedFileTypes?: string;
}

const UploadZone = ({ onFileSelected, isProcessing, acceptedFileTypes = '.pdf,.png,.jpg,.jpeg,.txt,.doc,.docx' }: UploadZoneProps) => {
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isProcessing) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFileSelected(filesArray);
    }
  }, [onFileSelected, isProcessing]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && !isProcessing) {
      const filesArray = Array.from(e.target.files);
      onFileSelected(filesArray);
    }
  }, [onFileSelected, isProcessing]);

  return (
    <div 
      className={cn(
        "w-full border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center bg-muted/30 transition-all",
        "hover:bg-muted/50 cursor-pointer", 
        isProcessing ? "opacity-50 cursor-not-allowed" : "hover:border-detailseer"
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        id="file-upload" 
        className="hidden" 
        onChange={handleFileChange}
        multiple
        accept={acceptedFileTypes}
        disabled={isProcessing}
      />
      <label 
        htmlFor="file-upload" 
        className="w-full h-full flex flex-col items-center cursor-pointer"
      >
        <div className="h-16 w-16 rounded-full bg-detailseer/10 flex items-center justify-center mb-4">
          <Upload className="h-8 w-8 text-detailseer" />
        </div>
        <h3 className="text-lg font-medium mb-2">Upload your files</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
          Drag and drop your files here, or click to select files
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="flex items-center gap-1 text-xs bg-detailseer/10 text-detailseer-dark px-3 py-1 rounded-full">
            <FileIcon className="h-3 w-3" /> PDF
          </div>
          <div className="flex items-center gap-1 text-xs bg-detailseer/10 text-detailseer-dark px-3 py-1 rounded-full">
            <FileType className="h-3 w-3" /> Text
          </div>
          <div className="flex items-center gap-1 text-xs bg-detailseer/10 text-detailseer-dark px-3 py-1 rounded-full">
            <FileIcon className="h-3 w-3" /> Images
          </div>
        </div>
      </label>
    </div>
  );
};

export default UploadZone;
