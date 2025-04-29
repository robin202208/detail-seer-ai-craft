
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

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

    // Call Alibaba Cloud AI API for document comparison
    const response = await fetch(ALIBABA_CLOUD_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ALIBABA_CLOUD_API_KEY}`
      },
      body: JSON.stringify({
        model: "qwen-plus", // Using Qwen-Plus model for detailed text analysis
        input: {
          prompt: `Please compare the following two documents and identify the detailed differences between them. Analyze structure, key points, factual information, style, and language usage. Format the response as a structured comparison with categories of differences.
          
Document A:
${documentA}

Document B:
${documentB}`,
        },
        parameters: {
          temperature: 0.2,
          top_p: 0.8,
          result_format: "message",
        }
      })
    })

    const result = await response.json()

    return new Response(
      JSON.stringify({
        comparison: result.output?.text || "No comparison result available"
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
