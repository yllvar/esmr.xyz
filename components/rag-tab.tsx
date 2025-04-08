"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Search, HelpCircle, FileUp } from "lucide-react"
import { generateWithPegasus } from "@/lib/huggingface-api"
import { AdBanner } from "@/components/ads/ad-banner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import * as XLSX from "xlsx"

export function RagTab() {
  const [context, setContext] = useState("")
  const [query, setQuery] = useState("")
  const [result, setResult] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileProcessingStatus, setFileProcessingStatus] = useState("")

  const handleGenerate = async () => {
    if (!context.trim() || !query.trim()) return

    setIsProcessing(true)
    try {
      const generatedText = await generateWithPegasus(context, query)
      setResult(generatedText)
    } catch (error) {
      console.error("Error generating text:", error)
      setResult("Error generating response. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setFileProcessingStatus("")
    }
  }

  const processExcelFile = async () => {
    if (!file) return

    setFileProcessingStatus("Reading file...")
    setIsProcessing(true)

    try {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: "binary" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)

          // Convert the JSON data to a readable string format
          const contextText = jsonData
            .map((row, index) => {
              const rowNumber = index + 1
              const entries = Object.entries(row)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")
              return `Row ${rowNumber}: ${entries}`
            })
            .join("\n\n")

          setContext(contextText)
          setFileProcessingStatus(`File processed successfully! ${jsonData.length} rows extracted.`)
        } catch (error) {
          console.error("Error processing Excel file:", error)
          setFileProcessingStatus("Error processing file. Please try again.")
        } finally {
          setIsProcessing(false)
        }
      }

      reader.readAsBinaryString(file)
    } catch (error) {
      console.error("Error reading file:", error)
      setFileProcessingStatus("Error reading file. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Vertical ad on the side for larger screens */}
      <div className="hidden lg:block fixed right-4 top-1/4 z-10">
        <AdBanner slot="7890123456" format="vertical" responsive={false} />
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">RAG (Retrieval-Augmented Generation) Guide</h3>
        <p className="text-purple-700 mb-3">
          RAG combines information retrieval with text generation to create more accurate, contextual responses:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-purple-700">
          <li>
            <strong>Knowledge Base:</strong> Paste your reference text, documentation, or data in the context field, or
            upload an Excel file.
          </li>
          <li>
            <strong>Query:</strong> Ask specific questions about the information in your knowledge base.
          </li>
          <li>
            <strong>Results:</strong> The Pegasus model will generate answers based on the provided context.
          </li>
          <li>
            <strong>Best For:</strong> Summarization, question answering, and extracting insights from large text
            documents.
          </li>
        </ul>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Knowledge Base
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">Knowledge base help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Enter reference information that the AI will use to answer your questions. You can paste text
                    directly or upload an Excel file.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Enter the context information for the RAG system or upload an Excel file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mb-2">
            <strong>Example context:</strong> "Excel Smart Model Refinery (ESMR) is an AI-powered tool that cleans and
            processes Excel data. It uses the T5-Base model for data cleaning and the Pegasus model for
            retrieval-augmented generation. Users can upload Excel files or input text directly, then export the cleaned
            data as CSV or JSON."
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Excel File for Context (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              <Button onClick={processExcelFile} disabled={!file || isProcessing} size="sm">
                <FileUp className="mr-2 h-4 w-4" />
                Process
              </Button>
            </div>
            {fileProcessingStatus && <p className="text-sm text-muted-foreground">{fileProcessingStatus}</p>}
          </div>

          <div className="flex items-center justify-center my-2">
            <div className="bg-gray-200 h-px flex-grow"></div>
            <span className="px-2 text-gray-500 text-sm">OR PASTE TEXT DIRECTLY</span>
            <div className="bg-gray-200 h-px flex-grow"></div>
          </div>

          <Textarea
            placeholder="Enter context information..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      {/* In-content ad */}
      <AdBanner slot="8901234567" format="rectangle" className="mx-auto" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Query
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">Query help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Ask a specific question about the information in your knowledge base. Be clear and direct for best
                    results.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Enter your question or prompt</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mb-2">
            <strong>Example query:</strong> "What models does ESMR use and what are their purposes?"
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="query" className="sr-only">
                Query
              </Label>
              <Input
                id="query"
                placeholder="Enter your question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleGenerate} disabled={!context.trim() || !query.trim() || isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Generated Response
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">Response help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    The AI-generated response based on your context and query. For best results, provide detailed
                    context and clear questions.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Result from Pegasus model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mb-2">
            <strong>Example response:</strong> "ESMR uses two main models: T5-Base for data cleaning tasks, which helps
            correct errors and standardize formats in Excel data, and Pegasus for retrieval-augmented generation, which
            allows users to ask questions about their data and receive AI-generated insights."
          </div>
          <Textarea
            placeholder="Generated response will appear here..."
            value={result}
            readOnly
            className="min-h-[150px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}
