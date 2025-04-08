"use server"

import { cleanTextWithT5 } from "./huggingface-api"

/**
 * Cleans and validates data before JSON conversion
 */
export async function cleanDataForJSON(data: any[]): Promise<any[]> {
  const cleanedData = []

  for (const item of data) {
    const cleanedItem: Record<string, any> = {}

    for (const [key, value] of Object.entries(item)) {
      // Handle null or undefined values
      if (value === null || value === undefined) {
        cleanedItem[key] = null
        continue
      }

      // Convert to string for processing
      const strValue = String(value).trim()

      // Handle empty strings
      if (strValue === "") {
        cleanedItem[key] = null
        continue
      }

      // Handle different data types
      if (typeof value === "number") {
        // Ensure valid numbers
        cleanedItem[key] = isNaN(value) ? null : value
      } else if (typeof value === "boolean") {
        cleanedItem[key] = value
      } else if (typeof value === "string") {
        // Clean text with T5 model if it's a longer string
        if (strValue.length > 20) {
          try {
            const cleanedText = await cleanTextWithT5(strValue)
            cleanedItem[key] = cleanedText
          } catch (error) {
            console.error(`Error cleaning text: ${error}`)
            cleanedItem[key] = strValue
          }
        } else {
          cleanedItem[key] = strValue
        }
      } else if (value instanceof Date) {
        // Format dates consistently
        cleanedItem[key] = value.toISOString()
      } else if (Array.isArray(value)) {
        // Recursively clean arrays
        cleanedItem[key] = await Promise.all(
          value.map(async (item) => {
            if (typeof item === "object" && item !== null) {
              return await cleanDataForJSON([item]).then((result) => result[0])
            }
            return item
          }),
        )
      } else if (typeof value === "object") {
        // Recursively clean nested objects
        cleanedItem[key] = await cleanDataForJSON([value]).then((result) => result[0])
      } else {
        // Default case
        cleanedItem[key] = value
      }
    }

    cleanedData.push(cleanedItem)
  }

  return cleanedData
}

/**
 * Validates JSON structure to ensure it's error-free
 * Changed to async function to comply with server actions requirements
 */
export async function validateJSON(data: any[]): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = []

  try {
    // Test serialization/deserialization
    const serialized = JSON.stringify(data)
    JSON.parse(serialized)

    // Check for circular references
    const seen = new WeakSet()
    const detectCircular = (obj: any): boolean => {
      if (typeof obj !== "object" || obj === null) return false

      if (seen.has(obj)) return true
      seen.add(obj)

      if (Array.isArray(obj)) {
        return obj.some((item) => detectCircular(item))
      }

      return Object.values(obj).some((value) => detectCircular(value))
    }

    if (detectCircular(data)) {
      errors.push("Circular reference detected in data structure")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  } catch (error) {
    errors.push(`JSON validation error: ${error instanceof Error ? error.message : String(error)}`)
    return {
      valid: false,
      errors,
    }
  }
}
