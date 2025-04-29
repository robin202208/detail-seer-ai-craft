
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
    
    // 使用更详细的中文提示，要求AI进行全面而详尽的比对
    const response = await fetch(ALIBABA_CLOUD_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ALIBABA_CLOUD_API_KEY}`
      },
      body: JSON.stringify({
        model: "qwen-plus", // 使用通义千问增强版模型
        input: {
          prompt: `你是一个专业的文档比对分析专家，请对以下两份文档进行极其详尽的差异分析。
我需要你非常仔细地分析以下方面，并以结构化方式输出：

1. 【内容差异】：详尽列出所有内容差异点，包括：
   - 文档A独有内容（精确到句子级别）
   - 文档B独有内容（精确到句子级别）
   - 内容顺序调整
   - 重复或冗余内容

2. 【文字修改】：
   - 同一内容不同表述的精确对比
   - 词语替换、删除或添加（标出具体词语）
   - 标点符号变化
   - 拼写或错别字差异

3. 【格式结构】：
   - 段落划分差异
   - 标题与小标题差异
   - 缩进、间距、换行差异
   - 列表、表格或其他结构性元素差异

4. 【语言表达】：
   - 语气与语调差异
   - 正式性程度变化
   - 表达方式的差异（直接/间接、主动/被动等）
   - 专业术语使用差异

5. 【关键信息】：
   - 数字、日期、时间的差异
   - 人名、地名、机构名的差异
   - 重要引用或参考的差异
   - 其他关键事实性信息的差异

6. 【完整性分析】：
   - 哪个文档信息更完整
   - 哪个文档表达更清晰
   - 哪个文档结构更合理
   - 整体质量评估

请以表格或其他清晰的格式展示差异，并对每一类差异进行量化统计（如：发现了多少处内容差异、文字修改等）。对于重要差异，请使用引号标注原文。

文档A:
${documentA}

文档B:
${documentB}`,
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
