
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  
  // 处理结果显示 - 使用手风琴组件来分段显示结果
  // 尝试根据标题分割内容
  const sections = parseComparisonSections(comparisonResult || "");
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>细微差异比对结果：{fileAName} 与 {fileBName}</CardTitle>
        <CardDescription>详细的文档细微差异分析</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {/* 使用手风琴模式显示各个部分 */}
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(sections).map(([title, content], index) => (
              <AccordionItem key={index} value={`section-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="whitespace-pre-line overflow-auto">
                    {/* 使用简单的表格样式处理，特别是表格式差异对比部分 */}
                    {title.includes("表格式") ? (
                      <div className="overflow-x-auto">
                        <div dangerouslySetInnerHTML={{ __html: formatComparisonTable(content) }} />
                      </div>
                    ) : (
                      <div>{content}</div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* 展示完整内容的选项 */}
          {!isExpanded && comparisonResult && comparisonResult.length > 1000 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="mt-4 text-sm text-primary hover:underline"
            >
              显示原始完整比对结果
            </button>
          )}
          
          {isExpanded && (
            <>
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-lg font-medium mb-2">完整原始比对结果</h3>
                <div className="whitespace-pre-line bg-muted/50 p-4 rounded-md text-sm">
                  {comparisonResult}
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="mt-4 text-sm text-primary hover:underline"
              >
                隐藏原始完整内容
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// 将比对结果解析为各个章节
function parseComparisonSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // 正则匹配##开头的标题
  const titlePattern = /##\s+\d+\.\s+【(.*?)】/g;
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

// 格式化比对表格
function formatComparisonTable(content: string): string {
  // 尝试将markdown表格转换为HTML表格
  let formattedContent = content;
  
  // 查找可能的表格部分
  const tablePattern = /\|\s*位置\s*\|\s*文档A内容\s*\|\s*文档B内容\s*\|[\s\S]*?(?=##|\n\n|$)/g;
  formattedContent = formattedContent.replace(tablePattern, (table) => {
    // 分割表格行
    const rows = table.split('\n').filter(row => row.trim().startsWith('|'));
    
    // 创建HTML表格
    let htmlTable = '<table class="min-w-full border-collapse border border-border mt-2 mb-4">\n<thead>\n<tr>\n';
    
    // 处理表头
    if (rows.length > 0) {
      const headers = rows[0].split('|').filter(cell => cell.trim());
      headers.forEach(header => {
        htmlTable += `<th class="border border-border bg-muted px-4 py-2 text-left text-sm font-medium">${header.trim()}</th>\n`;
      });
      htmlTable += '</tr>\n</thead>\n<tbody>\n';
      
      // 处理数据行，跳过表头和分隔行
      for (let i = 2; i < rows.length; i++) {
        const cells = rows[i].split('|').filter(cell => cell.trim());
        if (cells.length > 0) {
          htmlTable += '<tr>\n';
          cells.forEach((cell, index) => {
            // 为不同列应用不同的样式
            let cellClass = "border border-border px-4 py-2 text-sm";
            if (index === 0) {
              cellClass += " font-medium bg-muted/30"; // 位置列样式
            } else if (index === 2) {
              cellClass += " bg-blue-50"; // 文档B内容列轻微背景色区分
            }
            htmlTable += `<td class="${cellClass}">${cell.trim()}</td>\n`;
          });
          htmlTable += '</tr>\n';
        }
      }
    }
    
    htmlTable += '</tbody>\n</table>';
    return htmlTable;
  });
  
  return formattedContent;
}

export default ComparisonResult;
