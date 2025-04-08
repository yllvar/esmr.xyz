import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { model, inputs } = await request.json()

    if (!model || !inputs) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: "Hugging Face API error", details: errorData }, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in Hugging Face API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
