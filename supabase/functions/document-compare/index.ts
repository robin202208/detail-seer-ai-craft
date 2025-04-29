
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALIBABA_CLOUD_API_KEY = Deno.env.get('ALIBABA_CLOUD_API_KEY')
const ALIBABA_CLOUD_API_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"

// 最大允许的输入长度，根据模型限制设置为30000（略小于实际限制30720以留出安全余量）
const MAX_MODEL_INPUT_LENGTH = 30000;

// 提取文档的摘要信息
function extractDocumentSummary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // 提取文档的开头、中间和结尾部分
  const headSize = Math.floor(maxLength * 0.4);  // 40%用于开头
  const tailSize = Math.floor(maxLength * 0.3);  // 30%用于结尾
  const midSize = maxLength - headSize - tailSize; // 剩余30%用于中间部分
  
  const head = text.substring(0, headSize);
  const middle = text.substring(Math.floor(text.length/2) - midSize/2, Math.floor(text.length/2) + midSize/2);
  const tail = text.substring(text.length - tailSize);
  
  return `${head}\n\n[...文档中间部分已省略...]\n\n${middle}\n\n[...文档中间部分已省略...]\n\n${tail}`;
}

// 智能比对函数：根据文档大小动态调整比对策略
async function compareDocuments(docA: string, docB: string): Promise<string> {
  console.log("开始智能文档比对");

  // 计算提示词和两个文档的综合长度
  const promptTemplate = `作为一位精通文档比对的专家，请对以下两份文档进行极其精确、系统和详尽的比对分析，不要遗漏任何细节。请用中文回答，并按以下结构输出：

## 1. 【总体对比摘要】
- 相似度评分(0-100%)
- 文档A与B的主要区别概述
- 整体变化趋势和关键差异点

## 2. 【内容差异】
### 2.1 文档A独有内容
- 详细列出所有文档A独有的章节、段落、句子
- 每处独有内容标明在原文中的位置和重要性

### 2.2 文档B独有内容
- 详细列出所有文档B独有的章节、段落、句子
- 每处独有内容标明在原文中的位置和重要性

### 2.3 共有内容的差异
- 相同段落中的文字修改（词语替换、增减、调整）
- 句式结构变化
- 表达方式变化

## 3. 【格式与结构差异】
- 段落划分差异
- 标题与小标题差异
- 缩进、换行、空格差异
- 列表、表格结构差异

## 4. 【语言表达差异】
- 措辞与用语差别
- 语气与语调变化
- 专业术语使用差异
- 表达清晰度与准确性差异

## 5. 【关键信息差异】
- 数字与日期变化
- 人名、地名、机构名变化
- 联系方式、网址等信息变化
- 其他重要实体信息变化

## 6. 【文档质量对比】
- 哪份文档格式更规范
- 哪份文档内容更完整
- 哪份文档表达更专业/清晰

## 7. 【详细对比表】
请提供一个详细的对比表，列出所有重要差异点，包括在文档中的位置、原文内容和修改内容。

请务必做到全面细致，不遗漏任何可能的差异，即使是细微的标点符号或格式变化。对于每一类差异，请提供具体示例并引用原文。

文档A:
`;

  const estimatedPromptLength = promptTemplate.length + 300; // 300留给额外参数和格式
  const maxDocLength = Math.floor((MAX_MODEL_INPUT_LENGTH - estimatedPromptLength) / 2);

  console.log(`估计提示词长度: ${estimatedPromptLength}, 每个文档最大允许长度: ${maxDocLength}`);
  console.log(`原始文档A长度: ${docA.length}, 原始文档B长度: ${docB.length}`);

  // 根据文档大小进行处理
  const processedDocA = extractDocumentSummary(docA, maxDocLength);
  const processedDocB = extractDocumentSummary(docB, maxDocLength);

  console.log(`处理后文档A长度: ${processedDocA.length}, 处理后文档B长度: ${processedDocB.length}`);

  // 构建完整提示词
  const fullPrompt = `${promptTemplate}${processedDocA}\n\n文档B:\n${processedDocB}`;
  
  if (fullPrompt.length > MAX_MODEL_INPUT_LENGTH) {
    console.warn(`警告: 即使经过处理，提示词总长度${fullPrompt.length}仍超过模型限制${MAX_MODEL_INPUT_LENGTH}`);
    // 进一步缩减以确保不超过限制
    const excessLength = fullPrompt.length - MAX_MODEL_INPUT_LENGTH + 500; // 增加500字符安全余量
    const reductionPerDoc = Math.ceil(excessLength / 2);
    
    const furtherReducedDocA = extractDocumentSummary(processedDocA, processedDocA.length - reductionPerDoc);
    const furtherReducedDocB = extractDocumentSummary(processedDocB, processedDocB.length - reductionPerDoc);
    
    const finalPrompt = `${promptTemplate}${furtherReducedDocA}\n\n文档B:\n${furtherReducedDocB}`;
    console.log(`紧急调整后的提示词长度: ${finalPrompt.length}`);
    
    return await callAiModel(finalPrompt);
  }
  
  return await callAiModel(fullPrompt);
}

// 调用AI模型API
async function callAiModel(prompt: string): Promise<string> {
  try {
    console.log(`正在调用AI模型, 提示词长度: ${prompt.length}`);
    
    const response = await fetch(ALIBABA_CLOUD_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ALIBABA_CLOUD_API_KEY}`
      },
      body: JSON.stringify({
        model: "qwen-max",
        input: {
          prompt: prompt
        },
        parameters: {
          temperature: 0.1,
          top_p: 0.85,
          result_format: "message",
          max_tokens: 8000,
        }
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error("API响应错误状态码:", response.status);
      throw new Error(`API调用失败: ${result.message || result.error || "未知错误"}`);
    }

    console.log("API原始响应:", JSON.stringify(result).substring(0, 500) + "...");

    // 增强版结果解析，适应多种可能的返回格式
    let outputText = "";
    
    // 尝试从不同可能的路径获取输出文本
    if (result.output?.text) {
      outputText = result.output.text;
    } else if (result.output?.choices && result.output.choices.length > 0) {
      if (result.output.choices[0].message?.content) {
        outputText = result.output.choices[0].message.content;
      } else if (result.output.choices[0].text) {
        outputText = result.output.choices[0].text;
      }
    } else if (result.choices && result.choices.length > 0) {
      if (result.choices[0].message?.content) {
        outputText = result.choices[0].message.content;
      } else if (result.choices[0].text) {
        outputText = result.choices[0].text;
      }
    }
    
    if (!outputText) {
      console.error("无法从API响应中提取文本:", JSON.stringify(result).substring(0, 500) + "...");
      throw new Error("无法从API响应中提取比对结果，请检查API响应格式");
    }

    console.log("AI模型调用成功，已获取比对结果");
    return outputText;
  } catch (error) {
    console.error("AI模型调用出错:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("接收到文档比对请求");
    const { documentA, documentB } = await req.json()

    if (!documentA || !documentB) {
      console.error("缺少必要文档");
      return new Response(
        JSON.stringify({ error: "比对需要两个文档，请确保都已提供" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // 记录原始文档大小
    console.log(`原始文档A大小: ${documentA.length} 字符, 文档B大小: ${documentB.length} 字符`);
    
    try {
      const comparisonResult = await compareDocuments(documentA, documentB);
      
      return new Response(
        JSON.stringify({ comparison: comparisonResult }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } catch (error) {
      console.error("文档比对处理错误:", error);
      
      // 返回更具可读性的错误信息
      const errorMessage = error instanceof Error ? error.message : "处理文档时出现技术问题";
      const userFriendlyError = "文档比对失败。" + 
        (errorMessage.includes("API") ? "AI服务暂时不可用，请稍后再试。" : "请尝试上传较小的文档或不同格式的文件。");
      
      return new Response(
        JSON.stringify({ 
          error: userFriendlyError, 
          details: errorMessage
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
  } catch (error) {
    console.error('请求处理错误:', error);
    return new Response(
      JSON.stringify({ error: '处理请求失败', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
