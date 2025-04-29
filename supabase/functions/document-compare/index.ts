
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
    const { documentA, documentB } = await req.json()

    if (!documentA || !documentB) {
      return new Response(
        JSON.stringify({ error: "Both documents are required for comparison" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log("Starting detailed document comparison with Alibaba Cloud AI")
    
    // Call Alibaba Cloud AI API for document comparison with improved prompt
    const response = await fetch(ALIBABA_CLOUD_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ALIBABA_CLOUD_API_KEY}`
      },
      body: JSON.stringify({
        model: "qwen-plus", // Using Qwen-Plus model for detailed text analysis
        input: {
          prompt: `请详细分析以下两个文档之间的所有差异，包括：
1. 内容差异：哪些内容在A文档中有而B文档中没有，反之亦然
2. 文本修改：哪些内容被修改了，具体修改了什么
3. 格式和结构差异：段落、章节、标题的组织方式有何不同
4. 语言表达差异：用词、语气、语调的变化
5. 关键信息差异：关键数据、日期、名称、引用等的差异
6. 整体内容对比：两份文档的主要差异点总结

将分析结果按上述类别分段呈现，使用表格或清晰的格式标记差异。
          
文档A:
${documentA}

文档B:
${documentB}`,
        },
        parameters: {
          temperature: 0.1,
          top_p: 0.85,
          result_format: "message",
        }
      })
    })

    const result = await response.json()
    console.log("Received detailed comparison analysis from AI API")

    if (!result.output?.text) {
      console.error("API response error:", JSON.stringify(result))
      return new Response(
        JSON.stringify({ 
          error: "Failed to get comparison result", 
          details: result.message || "No output received from AI API" 
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
    console.error('Error comparing documents:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to compare documents', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
