
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALIBABA_CLOUD_API_KEY = Deno.env.get('ALIBABA_CLOUD_API_KEY')
const ALIBABA_CLOUD_API_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"

// 最大允许的输入长度，根据模型限制设置为30000（略小于实际限制30720以留出安全余量）
const MAX_MODEL_INPUT_LENGTH = 30000;

// 提取文档的摘要信息，增强差异检测能力的智能摘要
function extractDocumentSummary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // 更智能的文档摘要提取策略，确保捕捉关键内容
  // 开头占30%，结尾占20%，剩余的50%分布在文档中间，以5段为单位提取
  const headSize = Math.floor(maxLength * 0.3);
  const tailSize = Math.floor(maxLength * 0.2);
  const midTotalSize = maxLength - headSize - tailSize;
  
  // 从文档中间部分均匀提取5个片段
  const docMiddle = text.substring(headSize, text.length - tailSize);
  const middleSegmentLength = Math.floor(midTotalSize / 5);
  const middleSegments: string[] = [];
  
  // 计算中间部分的分段点
  for (let i = 0; i < 5; i++) {
    const segmentStart = Math.floor(docMiddle.length * i / 5);
    const segmentText = docMiddle.substring(segmentStart, segmentStart + middleSegmentLength);
    middleSegments.push(segmentText);
  }
  
  // 组合最终文档摘要
  const head = text.substring(0, headSize);
  const tail = text.substring(text.length - tailSize);
  
  return `${head}\n\n${middleSegments.join("\n\n[...文档间隔...]\n\n")}\n\n${tail}`;
}

// 优化后的比对提示词，重点关注数字、标识符和关键信息的差异
function getDetailedComparisonPrompt(docA: string, docB: string): string {
  return `作为一位专注于文档细节比对的AI专家，你需要对以下两份文档进行极其精确的比对分析，特别关注数字、批号、标识符等关键信息的差异。请用中文回答，并按以下结构输出：

## 1. 【关键差异摘要】
- 文档整体相似度评分(0-100%)
- 标注最重要的差异点（特别是批号、数字、日期、型号等关键标识符的差异）
- 这些差异可能带来的影响

## 2. 【关键标识符比对】
重点关注以下内容的差异：
- 批号/LOT号（如"2247222"vs"2337072"）
- 产品编码/型号
- 数量/规格
- 日期/时间
- 价格/金额
- 其他任何看似标识符或编码的内容

## 3. 【表格式精确对比】
创建一个三列表格，包含：
| 项目/位置 | 文档A内容 | 文档B内容 |
列出所有关键差异，特别是数字和编码类的差异。

## 4. 【文本内容比对】
- 检查产品名称、描述文本的细微差异
- 标注任何遗漏或添加的内容
- 检查标点符号和格式的差异（如果可能影响含义）

## 5. 【视觉元素差异】（如有）
- 注明条形码、二维码等可视化元素是否有差异
- 标注布局、排版的明显差别

请务必特别关注数字和编码类内容（如LOT号、产品编号等）的差异，即使只有一两个数字的变化也必须标出。这类微小差异往往是最关键的区别点。

文档A:
${docA}

文档B:
${docB}`;
}

// 智能比对函数：根据文档大小动态调整比对策略
async function compareDocuments(docA: string, docB: string): Promise<string> {
  console.log("开始智能文档细微差异比对");

  // 提示词估计长度和安全余量
  const estimatedPromptLength = 1500; // 基础提示词长度估计
  const maxDocLength = Math.floor((MAX_MODEL_INPUT_LENGTH - estimatedPromptLength) / 2);

  console.log(`估计提示词长度: ${estimatedPromptLength}, 每个文档最大允许长度: ${maxDocLength}`);
  console.log(`原始文档A长度: ${docA.length}, 原始文档B长度: ${docB.length}`);

  // 根据文档大小进行处理
  const processedDocA = extractDocumentSummary(docA, maxDocLength);
  const processedDocB = extractDocumentSummary(docB, maxDocLength);

  console.log(`处理后文档A长度: ${processedDocA.length}, 处理后文档B长度: ${processedDocB.length}`);

  // 构建完整提示词
  const fullPrompt = getDetailedComparisonPrompt(processedDocA, processedDocB);
  
  if (fullPrompt.length > MAX_MODEL_INPUT_LENGTH) {
    console.warn(`警告: 即使经过处理，提示词总长度${fullPrompt.length}仍超过模型限制${MAX_MODEL_INPUT_LENGTH}`);
    // 进一步缩减以确保不超过限制
    const excessLength = fullPrompt.length - MAX_MODEL_INPUT_LENGTH + 500; // 增加500字符安全余量
    const reductionPerDoc = Math.ceil(excessLength / 2);
    
    const furtherReducedDocA = extractDocumentSummary(processedDocA, processedDocA.length - reductionPerDoc);
    const furtherReducedDocB = extractDocumentSummary(processedDocB, processedDocB.length - reductionPerDoc);
    
    const finalPrompt = getDetailedComparisonPrompt(furtherReducedDocA, furtherReducedDocB);
    console.log(`紧急调整后的提示词长度: ${finalPrompt.length}`);
    
    return await callAiModel(finalPrompt);
  }
  
  return await callAiModel(fullPrompt);
}

// 调用AI模型API，增强了解析逻辑以适应多种返回格式
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
          temperature: 0.05,  // 降低温度以提高精确性
          top_p: 0.95,        // 提高top_p以增加准确性
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

    console.log("AI模型调用成功，已获取细微差异比对结果");
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
    console.log("接收到文档细微差异比对请求");
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
      console.error("文档细微差异比对处理错误:", error);
      
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
