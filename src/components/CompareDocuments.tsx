
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileDiff, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface ComparisonResult {
  comparison: string;
}

const CompareDocuments = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{fileA?: File, fileB?: File}>({});
  const [fileContents, setFileContents] = useState<{[key: string]: string}>({});
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Read file contents
      newFiles.forEach(file => {
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

      toast({
        title: "Files uploaded",
        description: `Successfully added ${newFiles.length} file(s)`,
      });
    }
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
        title: "Selection needed",
        description: "Please select two documents to compare",
        variant: "destructive"
      });
      return;
    }

    setIsComparing(true);
    setComparisonResult(null);

    try {
      const contentA = fileContents[selectedFiles.fileA.name];
      const contentB = fileContents[selectedFiles.fileB.name];

      const { data, error } = await supabase.functions.invoke<ComparisonResult>('document-compare', {
        body: {
          documentA: contentA,
          documentB: contentB
        }
      });

      if (error) throw new Error(error.message);
      
      setComparisonResult(data?.comparison || 'No comparison result available');
      
      toast({
        title: "Comparison complete",
        description: "Documents have been compared successfully"
      });
    } catch (error) {
      console.error('Error comparing documents:', error);
      toast({
        title: "Comparison failed",
        description: error instanceof Error ? error.message : "An error occurred while comparing documents",
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
            <h3 className="text-lg font-medium mb-2">Upload documents for comparison</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Select multiple documents to upload (.pdf, .txt, .doc, .docx)
            </p>
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Uploaded Documents ({uploadedFiles.length})</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
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
                      onClick={() => selectFileForComparison(file, 'A')}
                    >
                      Document A
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(selectedFiles.fileB === file && "bg-blue-100 border-blue-300")}
                      onClick={() => selectFileForComparison(file, 'B')}
                    >
                      Document B
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFile(file)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(selectedFiles.fileA || selectedFiles.fileB) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Selected Documents for Comparison</CardTitle>
              <CardDescription>Select two documents and click compare to analyze their differences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 p-4 bg-muted/20 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Document A</h4>
                  {selectedFiles.fileA ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{selectedFiles.fileA.name}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No document selected</p>
                  )}
                </div>
                
                <div className="flex-1 p-4 bg-muted/20 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Document B</h4>
                  {selectedFiles.fileB ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{selectedFiles.fileB.name}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No document selected</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline" onClick={clearSelectedFiles}>Clear Selection</Button>
                <Button 
                  onClick={compareDocuments}
                  disabled={!selectedFiles.fileA || !selectedFiles.fileB || isComparing}
                  className="gap-2"
                >
                  {isComparing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Comparing...
                    </>
                  ) : (
                    <>
                      <FileDiff className="h-4 w-4" />
                      Compare Documents
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {comparisonResult && (
          <Card className="mt-6 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileDiff className="h-5 w-5" />
                Document Comparison Results
              </CardTitle>
              <CardDescription>
                AI-powered analysis of differences between selected documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-detailseer/10 text-detailseer-dark border-0">
                    Document A: {selectedFiles.fileA?.name}
                  </Badge>
                  <Badge variant="outline" className="bg-detailseer/10 text-detailseer-dark border-0">
                    Document B: {selectedFiles.fileB?.name}
                  </Badge>
                </div>
                
                <Separator className="my-4" />
                
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm">
                    {comparisonResult.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompareDocuments;
