"use server"

/**
 * Clean text using the T5-Base model from Hugging Face
 */
export async function cleanTextWithT5(text: string): Promise<string> {
  try {
    // Prepare the prompt for text cleaning
    // We can use different prefixes based on the cleaning task
    const cleaningPrompt = `clean: ${text}`

    const response = await fetch("https://api-inference.huggingface.co/models/google-t5/t5-base", {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: cleaningPrompt }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Hugging Face API error:", errorData)
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()

    // The API returns an array of generated texts
    if (Array.isArray(result) && result.length > 0) {
      return result[0].generated_text || "No result generated"
    }

    // Handle different response formats
    if (result.generated_text) {
      return result.generated_text
    }

    return JSON.stringify(result)
  } catch (error) {
    console.error("Error in cleanTextWithT5:", error)
    throw error
  }
}

/**
 * Generate text using the Pegasus model for RAG
 */
export async function generateWithPegasus(context: string, query: string): Promise<string> {
  try {
    // Combine context and query for RAG
    const prompt = `Context: ${context}\n\nQuestion: ${query}\n\nAnswer:`

    const response = await fetch("https://api-inference.huggingface.co/models/google/pegasus-large", {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Hugging Face API error:", errorData)
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()

    // The API returns an array of generated texts
    if (Array.isArray(result) && result.length > 0) {
      return result[0].generated_text || "No result generated"
    }

    // Handle different response formats
    if (result.generated_text) {
      return result.generated_text
    }

    return JSON.stringify(result)
  } catch (error) {
    console.error("Error in generateWithPegasus:", error)
    throw error
  }
}

// Add a new function to clean data for JSON export
import { validateJSON } from "./data-cleaner"

/**
 * Prepare data for JSON export by cleaning and validating
 */
export async function prepareDataForJSON(data: any[]): Promise<any[]> {
  try {
    // First pass: Basic cleaning and type conversion
    const cleanedData = data.map((item) => {
      const cleanedItem: Record<string, any> = {}

      for (const [key, value] of Object.entries(item)) {
        // Handle null or undefined
        if (value === null || value === undefined) {
          cleanedItem[key] = null
          continue
        }

        // Handle different data types
        if (typeof value === "number") {
          cleanedItem[key] = isNaN(value) ? null : value
        } else if (typeof value === "string") {
          // Clean strings: trim, normalize whitespace
          cleanedItem[key] = value.trim().replace(/\s+/g, " ")
        } else if (value instanceof Date) {
          cleanedItem[key] = value.toISOString()
        } else {
          cleanedItem[key] = value
        }
      }

      return cleanedItem
    })

    // Validate the cleaned data - now with await since validateJSON is async
    const validation = await validateJSON(cleanedData)
    if (!validation.valid) {
      console.error("JSON validation errors:", validation.errors)
      throw new Error(`Invalid JSON structure: ${validation.errors.join(", ")}`)
    }

    return cleanedData
  } catch (error) {
    console.error("Error preparing data for JSON:", error)
    throw error
  }
}
