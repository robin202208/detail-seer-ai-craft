
import React from 'react';
import { FileProcessingResult } from '@/lib/fileUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { File, FileText, Image, FileType, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface ResultDisplayProps {
  result: FileProcessingResult;
}

const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) {
    return <FileText className="h-6 w-6 text-orange-500" />;
  } else if (fileType.includes('image')) {
    return <Image className="h-6 w-6 text-blue-500" />;
  } else if (fileType.includes('text') || fileType.includes('plain')) {
    return <FileType className="h-6 w-6 text-green-500" />;
  } else if (fileType.includes('word') || fileType.includes('doc')) {
    return <File className="h-6 w-6 text-indigo-500" />;
  } else {
    return <File className="h-6 w-6 text-gray-500" />;
  }
};

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getFileIcon(result.fileType)}
            <div>
              <CardTitle className="text-lg">{result.fileName}</CardTitle>
              <CardDescription>{result.fileSize}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-detailseer/10 text-detailseer-dark border-0">
            {result.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {result.summary && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Summary</h4>
            <p className="text-sm text-muted-foreground">{result.summary}</p>
          </div>
        )}
        
        {result.summary && <Separator className="my-4" />}
        
        <h4 className="text-sm font-medium mb-3">Details Detected</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {result.details.map((detail, index) => (
            <div key={index} className="bg-muted/30 p-3 rounded-md">
              <h5 className="text-xs text-muted-foreground mb-1">{detail.category}</h5>
              <p className="text-sm">{detail.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
