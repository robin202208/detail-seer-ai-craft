
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ErrorDisplayProps {
  errorMessage: string;
  fileAName: string;
  fileBName: string;
}

const ErrorDisplay = ({ errorMessage, fileAName, fileBName }: ErrorDisplayProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>比对失败</CardTitle>
        <CardDescription>无法完成 {fileAName} 和 {fileBName} 的比对</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>建议解决方案：</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>尝试上传较小的文件（建议小于5MB）</li>
            <li>使用纯文本格式（.txt）可减少复杂格式问题</li>
            <li>确保文档内容是可读文本而非纯图像或加密内容</li>
            <li>稍后再试，AI服务可能暂时不可用</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
