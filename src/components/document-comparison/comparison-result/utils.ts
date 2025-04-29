
// Helper utilities for the comparison result component

// 将比对结果解析为各个章节
export function parseComparisonSections(text: string): Record<string, string> {
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

// 高亮显示关键差异，特别是数字和批号的不同
export function highlightDifferences(text: string): string {
  // 高亮数字差异，尤其是批号/LOT号等关键信息
  return text.replace(/(\d+)/g, '<span class="font-bold text-rose-600">$1</span>');
}

// 增强版表格格式化，更好地突出差异
export function enhancedFormatComparisonTable(content: string): string {
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
