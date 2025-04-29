
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Maximize2, Minimize2, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ComparisonResultProps {
  comparisonResult: string | null;
  errorMessage?: string | null;
  selectedFiles: {fileA?: File, fileB?: File};
}

const ComparisonResult = ({ comparisonResult, errorMessage, selectedFiles }: ComparisonResultProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
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
  
  // 解析比对结果的各个章节
  const sections = parseComparisonSections(comparisonResult || "");
  
  // 高亮显示关键差异，特别是数字和批号的不同
  const highlightDifferences = (text: string) => {
    // 高亮数字差异，尤其是批号/LOT号等关键信息
    return text.replace(/(\d+)/g, '<span class="font-bold text-rose-600">$1</span>');
  };
  
  // 查找表格内容并转换为实际表格
  const processTableContent = (content: string) => {
    // 识别并处理表格内容
    if (content.includes('|')) {
      return enhancedFormatComparisonTable(content);
    }
    return content;
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>细微差异比对结果：{fileAName} 与 {fileBName}</CardTitle>
            <CardDescription>详细的关键信息差异分析</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                <Minimize2 className="h-4 w-4" />
                <span className="hidden sm:inline">收起详情</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4" />
                <span className="hidden sm:inline">展开全部</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {/* 特别突出显示关键差异摘要 */}
          {sections['关键差异摘要'] && (
            <div className="mb-6 bg-muted/30 p-4 rounded-md border border-muted">
              <h3 className="text-lg font-semibold mb-2">关键差异摘要</h3>
              <div 
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{ 
                  __html: highlightDifferences(sections['关键差异摘要']) 
                }}
              />
            </div>
          )}
          
          {/* 关键标识符比对部分，特别突出显示 */}
          {sections['关键标识符比对'] && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Search className="h-4 w-4 mr-2" />
                关键标识符比对
                <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                  最重要
                </Badge>
              </h3>
              <div 
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{ 
                  __html: highlightDifferences(sections['关键标识符比对']) 
                }}
              />
            </div>
          )}
          
          {/* 使用表格组件显示表格式对比结果 */}
          {sections['表格式精确对比'] && (
            <div className="mb-6 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-2">表格式精确对比</h3>
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: processTableContent(sections['表格式精确对比']) 
                }}
              />
            </div>
          )}
          
          {/* 使用手风琴模式折叠显示其他各个部分 */}
          <Accordion 
            type="single" 
            collapsible 
            className="w-full"
            value={activeSection}
            onValueChange={setActiveSection}
          >
            {Object.entries(sections).map(([title, content], index) => {
              // 已经单独显示的部分不再在手风琴中显示
              if (
                title === '关键差异摘要' || 
                title === '关键标识符比对' || 
                title === '表格式精确对比'
              ) {
                return null;
              }
              
              return (
                <AccordionItem key={index} value={`section-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="whitespace-pre-line overflow-auto">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: highlightDifferences(content) 
                        }}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* 展示完整内容的选项 */}
          {!isExpanded && comparisonResult && comparisonResult.length > 1000 && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button
                  variant="link"
                  className="mt-4 text-sm p-0 h-auto"
                >
                  显示原始完整比对结果
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-lg font-medium mb-2">完整原始比对结果</h3>
                  <div className="whitespace-pre-line bg-muted/50 p-4 rounded-md text-sm">
                    {comparisonResult}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-lg font-medium mb-2">完整原始比对结果</h3>
              <div className="whitespace-pre-line bg-muted/50 p-4 rounded-md text-sm">
                {comparisonResult}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// 将比对结果解析为各个章节
function parseComparisonSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // 匹配各种可能的标题格式
  // 既匹配 ## 1. 【细微差异摘要】 格式，也匹配 ## 关键差异摘要 格式
  const titlePattern = /##\s+(?:\d+\.\s+)?【?(.*?)】?/g;
  let match;
  let lastIndex = 0;
  let lastTitle = "";
  
  // 找出所有标题及其内容
  while ((match = titlePattern.exec(text)) !== null) {
    if (lastTitle) {
      // 保存上一个章节的内容
      const content = text.substring(lastIndex, match.index).trim();
      sections[lastTitle] = content;
    }
    
    lastTitle = match[1];
    lastIndex = match.index;
  }
  
  // 保存最后一个章节
  if (lastTitle) {
    sections[lastTitle] = text.substring(lastIndex).trim();
  } else {
    // 如果没有找到任何标题，直接显示全部
    sections["比对结果"] = text;
  }
  
  return sections;
}

// 增强版表格格式化，更好地突出差异
function enhancedFormatComparisonTable(content: string): string {
  // 查找可能的表格部分
  const tableLines = content.split('\n').filter(line => line.trim().startsWith('|'));
  
  if (tableLines.length < 2) {
    return content; // 不是有效的表格
  }
  
  // 创建HTML表格
  let htmlTable = '<table class="min-w-full border-collapse border border-border mt-2 mb-4">\n<thead>\n<tr>\n';
  
  // 处理表头
  const headers = tableLines[0].split('|').filter(cell => cell.trim());
  headers.forEach(header => {
    htmlTable += `<th class="border border-border bg-muted px-4 py-2 text-left text-sm font-medium">${header.trim()}</th>\n`;
  });
  htmlTable += '</tr>\n</thead>\n<tbody>\n';
  
  // 跳过表头和分隔行（如果有），处理数据行
  const startRow = tableLines[1].includes('---') ? 2 : 1;
  
  for (let i = startRow; i < tableLines.length; i++) {
    const cells = tableLines[i].split('|').filter(cell => cell.trim());
    if (cells.length > 0) {
      htmlTable += '<tr>\n';
      cells.forEach((cell, index) => {
        // 为不同列应用不同的样式
        let cellClass = "border border-border px-4 py-2 text-sm";
        let cellContent = cell.trim();
        
        if (index === 0) {
          // 位置/项目列样式
          cellClass += " font-medium bg-muted/30"; 
        } else {
          // 检测文档A和文档B的内容是否有差异
          // 如果是数字内容，添加特殊高亮
          if (/\d+/.test(cellContent) && index > 0) {
            cellContent = cellContent.replace(/(\d+)/g, '<span class="font-bold text-rose-600">$1</span>');
            
            // 给有数字差异的单元格添加背景色
            if (index === 2) { // 文档B内容列
              cellClass += " bg-rose-50 border-rose-200";
            } else if (index === 1) { // 文档A内容列 
              cellClass += " bg-amber-50 border-amber-200";
            }
          }
        }
        
        htmlTable += `<td class="${cellClass}">${cellContent}</td>\n`;
      });
      htmlTable += '</tr>\n';
    }
  }
  
  htmlTable += '</tbody>\n</table>';
  
  // 替换原始表格文本为HTML表格
  return content.replace(tableLines.join('\n'), htmlTable);
}

export default ComparisonResult;
