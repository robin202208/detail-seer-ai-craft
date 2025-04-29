
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ComparisonResultProps {
  comparisonResult: string | null;
  errorMessage?: string | null;
  selectedFiles: {fileA?: File, fileB?: File};
}

const ComparisonResult = ({ comparisonResult, errorMessage, selectedFiles }: ComparisonResultProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!comparisonResult && !errorMessage) return null;
  
  const fileAName = selectedFiles.fileA?.name || "文档A";
  const fileBName = selectedFiles.fileB?.name || "文档B";
  
  // 处理错误信息显示
  if (errorMessage) {
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
  }
  
  // 处理正常结果显示
  const displayResult = isExpanded ? comparisonResult : comparisonResult?.substring(0, 1000) + "...";
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>比对结果：{fileAName} 与 {fileBName}</CardTitle>
        <CardDescription>详细的文档差异分析</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-line">{displayResult}</div>
          
          {!isExpanded && comparisonResult && comparisonResult.length > 1000 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="mt-4 text-sm text-detailseer hover:underline"
            >
              显示完整比对结果
            </button>
          )}
          
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="mt-4 text-sm text-detailseer hover:underline"
            >
              显示简略内容
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonResult;
