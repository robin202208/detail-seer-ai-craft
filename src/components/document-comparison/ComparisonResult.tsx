
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FileDiff, FileSearch, ChevronDown, ChevronUp } from 'lucide-react';

interface ComparisonResultProps {
  comparisonResult: string | null;
  selectedFiles: {fileA?: File, fileB?: File};
}

interface FormattedSection {
  title: string;
  content: string;
}

const ComparisonResult = ({ comparisonResult, selectedFiles }: ComparisonResultProps) => {
  const [comparisonView, setComparisonView] = React.useState<'formatted' | 'raw'>('formatted');
  
  if (!comparisonResult) return null;

  // 增强格式化比较结果以更好地处理表格和结构化内容
  const formatComparison = (text: string): FormattedSection[] => {
    if (!text) return [];
    
    // 识别主要部分（基于数字和中文标题）
    const sections = text.split(/^\d+\.\s*【[^】]+】[：:]/m).filter(Boolean);
    
    if (sections.length <= 1) {
      // 如果无法拆分为预期的格式，尝试其他分割方法
      const altSections = text.split(/^\d+\.\s+/m).filter(Boolean);
      if (altSections.length > 1) {
        return altSections.map((section, index) => {
          const title = section.split('\n')[0].trim();
          const content = section.split('\n').slice(1).join('\n').trim();
          
          return {
            title: title || `差异类别 ${index + 1}`,
            content
          };
        });
      }
    }
    
    return sections.map((section, index) => {
      // 尝试提取标题（可能在第一行或开头部分）
      const titleMatch = section.match(/^([^：\n]+)[：:]/);
      let title = titleMatch ? titleMatch[1] : `差异类别 ${index + 1}`;
      title = title.replace(/^\s*【/, '').replace(/】\s*$/, '');
      
      // 提取内容（排除标题行）
      let content = titleMatch 
        ? section.substring(titleMatch[0].length).trim() 
        : section.trim();
      
      // 特殊处理表格内容，保持其格式
      content = content.replace(/\|-{2,}\|/g, '|---|'); // 格式化表格分隔行
      
      return {
        title: title || `差异类别 ${index + 1}`,
        content
      };
    });
  };

  // 提取并增强处理表格内容的函数
  const processTableContent = (content: string) => {
    if (content.includes('|')) {
      return (
        <div className="overflow-x-auto">
          <div className="whitespace-pre-wrap text-sm" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }
    
    return (
      <div className="whitespace-pre-wrap text-sm">
        {content.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <Card className="mt-6 animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileDiff className="h-5 w-5" />
              文档详细比对结果
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
              <div className="whitespace-pre-wrap text-sm overflow-x-auto">
                {comparisonResult.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {formatComparison(comparisonResult).map((section, index) => (
                  <Collapsible key={index} className="border rounded-lg overflow-hidden">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/10 hover:bg-muted/20 transition-colors">
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-left">
                        <FileSearch className="h-5 w-5" />
                        {section.title}
                      </h3>
                      <div className="flex items-center">
                        <ChevronDown className="h-5 w-5 collapsible-closed" />
                        <ChevronUp className="h-5 w-5 collapsible-open" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 border-t">
                      {processTableContent(section.content)}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonResult;
