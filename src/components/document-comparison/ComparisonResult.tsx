
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { enhancedFormatComparisonTable, highlightDifferences, parseComparisonSections } from './comparison-result/utils';
import ErrorDisplay from './comparison-result/ErrorDisplay';
import KeyDifferenceSummary from './comparison-result/KeyDifferenceSummary';
import ComparisonTable from './comparison-result/ComparisonTable';
import DetailedSections from './comparison-result/DetailedSections';
import FullResultView from './comparison-result/FullResultView';
import ComparisonHeader from './comparison-result/ComparisonHeader';

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
    return <ErrorDisplay 
      errorMessage={errorMessage} 
      fileAName={fileAName} 
      fileBName={fileBName} 
    />;
  }
  
  // 解析比对结果的各个章节
  const sections = parseComparisonSections(comparisonResult || "");
  
  // 表格内容处理函数
  const processTableContent = (content: string) => {
    // 识别并处理表格内容
    if (content.includes('|')) {
      return enhancedFormatComparisonTable(content);
    }
    return content;
  };
  
  // 定义哪些部分需要特殊处理而不在手风琴中显示
  const excludedSections = ['关键差异摘要', '关键标识符比对', '表格式精确对比'];
  
  return (
    <Card className="mt-6">
      <ComparisonHeader 
        fileAName={fileAName}
        fileBName={fileBName}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <KeyDifferenceSummary 
            highlightDifferences={highlightDifferences}
            keySummary={sections['关键差异摘要']}
            keyIdentifiers={sections['关键标识符比对']}
          />
          
          <ComparisonTable 
            processTableContent={processTableContent}
            tableContent={sections['表格式精确对比']}
          />
          
          <DetailedSections 
            sections={sections}
            highlightDifferences={highlightDifferences}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            excludedSections={excludedSections}
          />

          <FullResultView 
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            comparisonResult={comparisonResult || ""}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonResult;
