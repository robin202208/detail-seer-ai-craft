
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileDiff, FileText, FileSearch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ComparisonResult {
  comparison: string;
}

const CompareDocuments = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{fileA?: File, fileB?: File}>({});
  const [fileContents, setFileContents] = useState<{[key: string]: string}>({});
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [comparisonView, setComparisonView] = useState<'formatted' | 'raw'>('formatted');

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
        title: "文件已上传",
        description: `成功添加 ${newFiles.length} 个文件`,
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
        title: "开始比对",
        description: "正在分析文档差异，这可能需要一点时间...",
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
        description: "文档差异分析已完成"
      });
    } catch (error) {
      console.error('Error comparing documents:', error);
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

  // Format comparison result for better readability
  const formatComparison = (text: string) => {
    if (!text) return [];
    
    // Convert the text into sections based on numbered points
    const sections = text.split(/^\d+\.\s/m).filter(Boolean);
    
    return sections.map((section, index) => {
      const title = section.split('\n')[0].trim();
      const content = section.split('\n').slice(1).join('\n').trim();
      
      return {
        title: title || `差异类别 ${index + 1}`,
        content
      };
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
            <h3 className="text-lg font-medium mb-2">上传文档进行比较</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              选择多个文档上传 (.pdf, .txt, .doc, .docx)
            </p>
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">已上传文档 ({uploadedFiles.length})</h3>
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
                      文档 A
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(selectedFiles.fileB === file && "bg-blue-100 border-blue-300")}
                      onClick={() => selectFileForComparison(file, 'B')}
                    >
                      文档 B
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFile(file)}
                    >
                      移除
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
              <CardTitle>已选择文档</CardTitle>
              <CardDescription>选择两个文档并点击比较，分析它们的差异</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 p-4 bg-muted/20 rounded-md">
                  <h4 className="text-sm font-medium mb-2">文档 A</h4>
                  {selectedFiles.fileA ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{selectedFiles.fileA.name}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">未选择文档</p>
                  )}
                </div>
                
                <div className="flex-1 p-4 bg-muted/20 rounded-md">
                  <h4 className="text-sm font-medium mb-2">文档 B</h4>
                  {selectedFiles.fileB ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{selectedFiles.fileB.name}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">未选择文档</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline" onClick={clearSelectedFiles}>清除选择</Button>
                <Button 
                  onClick={compareDocuments}
                  disabled={!selectedFiles.fileA || !selectedFiles.fileB || isComparing}
                  className="gap-2"
                >
                  {isComparing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      比对中...
                    </>
                  ) : (
                    <>
                      <FileDiff className="h-4 w-4" />
                      比较文档
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileDiff className="h-5 w-5" />
                    文档比对结果
                  </CardTitle>
                  <CardDescription>
                    AI分析的文档差异详情
                  </CardDescription>
                </div>
                <div>
                  <Tabs value={comparisonView} onValueChange={(v) => setComparisonView(v as 'formatted' | 'raw')} className="w-[200px]">
                    <TabsList>
                      <TabsTrigger value="formatted">结构化视图</TabsTrigger>
                      <TabsTrigger value="raw">原始文本</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-detailseer/10 text-detailseer-dark border-0">
                    文档 A: {selectedFiles.fileA?.name}
                  </Badge>
                  <Badge variant="outline" className="bg-detailseer/10 text-detailseer-dark border-0">
                    文档 B: {selectedFiles.fileB?.name}
                  </Badge>
                </div>
                
                <Separator className="my-4" />
                
                <div className="prose max-w-none">
                  {comparisonView === 'raw' ? (
                    <div className="whitespace-pre-wrap text-sm">
                      {comparisonResult.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formatComparison(comparisonResult).map((section, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-muted/5">
                          <h3 className="text-md font-semibold border-b pb-2 mb-3 flex items-center gap-2">
                            <FileSearch className="h-4 w-4" />
                            {section.title}
                          </h3>
                          <div className="whitespace-pre-wrap text-sm">
                            {section.content.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
