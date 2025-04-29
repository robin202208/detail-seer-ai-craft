
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALIBABA_CLOUD_API_KEY = Deno.env.get('ALIBABA_CLOUD_API_KEY')
const ALIBABA_CLOUD_API_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("开始处理文档比对请求")
    const { documentA, documentB } = await req.json()

    if (!documentA || !documentB) {
      return new Response(
        JSON.stringify({ error: "比对需要两个文档，请确保都已提供" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log("文档A长度:", documentA.length, "文档B长度:", documentB.length)
    
    // 确保文档长度不超过模型限制
    const maxLength = 60000; // 设置合理的最大长度限制
    const trimmedDocA = documentA.length > maxLength ? documentA.substring(0, maxLength) + "..." : documentA;
    const trimmedDocB = documentB.length > maxLength ? documentB.substring(0, maxLength) + "..." : documentB;
    
    console.log("处理后文档A长度:", trimmedDocA.length, "处理后文档B长度:", trimmedDocB.length)
    
    // 使用更精细和专业的中文提示，要求AI进行全面而详尽的比对
    const response = await fetch(ALIBABA_CLOUD_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ALIBABA_CLOUD_API_KEY}`
      },
      body: JSON.stringify({
        model: "qwen-max", // 使用通义千问最强大的模型提高比对能力
        input: {
          prompt: `作为一位精通文档比对的专家，请对以下两份文档进行极其精确、系统和详尽的比对分析，不要遗漏任何细节。请用中文回答，并按以下结构输出：

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
${trimmedDocA}

文档B:
${trimmedDocB}`,
        },
        parameters: {
          temperature: 0.1, // 降低温度以获得更精确的结果
          top_p: 0.85,
          result_format: "message",
          max_tokens: 8000, // 增加最大tokens以容纳更详细的分析
        }
      })
    })

    const result = await response.json()
    console.log("已从AI API接收详细比对分析结果")

    if (!result.output?.text) {
      console.error("API响应错误:", JSON.stringify(result))
      return new Response(
        JSON.stringify({ 
          error: "获取比对结果失败", 
          details: result.message || "未从AI API接收到输出" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({
        comparison: result.output.text
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('文档比对错误:', error)
    return new Response(
      JSON.stringify({ error: '文档比对失败', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
