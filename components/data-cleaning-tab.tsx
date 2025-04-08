"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, FileUp, Download, Check, HelpCircle } from "lucide-react"
import * as XLSX from "xlsx"
import { cleanTextWithT5 } from "@/lib/huggingface-api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdBanner } from "@/components/ads/ad-banner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Add a state for processed data
export function DataCleaningTab() {
  const [inputText, setInputText] = useState("")
  const [cleanedText, setCleanedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [processingStatus, setProcessingStatus] = useState("")
  const [processedData, setProcessedData] = useState<any[] | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleCleanText = async () => {
    setIsProcessing(true)
    try {
      const result = await cleanTextWithT5(inputText)
      setCleanedText(result)
    } catch (error) {
      console.error("Error cleaning text:", error)
      setCleanedText("Error cleaning text. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Update the processExcelFile function to store the processed data
  const processExcelFile = async () => {
    if (!file) return

    setIsProcessing(true)
    setProcessingStatus("Reading file...")

    try {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: "binary" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)

          setProcessingStatus(`Processing ${jsonData.length} rows...`)

          // Clean the data
          const cleanedData = await cleanDataRows(jsonData)
          setProcessedData(cleanedData)

          // Process the first row as an example for display
          if (cleanedData.length > 0) {
            const firstRow = cleanedData[0]
            const firstKey = Object.keys(firstRow)[0]
            const sampleText = String(firstRow[firstKey])

            setInputText(JSON.stringify(firstRow, null, 2))
            setCleanedText(JSON.stringify(cleanedData[0], null, 2))
          }

          setProcessingStatus(`File processed successfully! ${cleanedData.length} rows cleaned.`)
        } catch (error) {
          console.error("Error processing Excel file:", error)
          setProcessingStatus("Error processing file. Please try again.")
        } finally {
          setIsProcessing(false)
        }
      }

      reader.readAsBinaryString(file)
    } catch (error) {
      console.error("Error reading file:", error)
      setProcessingStatus("Error reading file. Please try again.")
      setIsProcessing(false)
    }
  }

  // Add a function to clean data rows
  const cleanDataRows = async (rows: any[]): Promise<any[]> => {
    const cleanedRows = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const cleanedRow: Record<string, any> = {}

      // Update status for large datasets
      if (i % 10 === 0) {
        setProcessingStatus(`Cleaning row ${i + 1} of ${rows.length}...`)
      }

      // Clean each field in the row
      for (const [key, value] of Object.entries(row)) {
        // Skip null or undefined values
        if (value === null || value === undefined) {
          cleanedRow[key] = ""
          continue
        }

        const stringValue = String(value).trim()

        // Skip empty strings
        if (stringValue === "") {
          cleanedRow[key] = ""
          continue
        }

        // For text fields that might need cleaning, use the T5 model
        // Only clean text fields that are longer than 10 characters to avoid unnecessary API calls
        if (typeof value === "string" && stringValue.length > 10) {
          try {
            // We'll only clean a sample of rows to avoid excessive API calls
            if (i < 5) {
              const cleanedValue = await cleanTextWithT5(stringValue)
              cleanedRow[key] = cleanedValue
            } else {
              cleanedRow[key] = stringValue
            }
          } catch (error) {
            console.error(`Error cleaning field ${key}:`, error)
            cleanedRow[key] = stringValue
          }
        } else {
          // For numeric values or short strings, keep as is
          cleanedRow[key] = value
        }
      }

      cleanedRows.push(cleanedRow)
    }

    return cleanedRows
  }

  // Add functions to export data in different formats
  const exportToCSV = () => {
    if (!processedData || processedData.length === 0) return

    const csv = XLSX.utils.json_to_sheet(processedData)
    const csvOutput = XLSX.utils.sheet_to_csv(csv)

    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `cleaned_${file?.name.replace(/\.[^/.]+$/, "")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToJSON = () => {
    if (!processedData || processedData.length === 0) return

    const jsonString = JSON.stringify(processedData, null, 2)
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `cleaned_${file?.name.replace(/\.[^/.]+$/, "")}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Vertical ad on the side for larger screens */}
      <div className="hidden lg:block fixed right-4 top-1/4 z-10">
        <AdBanner slot="5678901234" format="vertical" responsive={false} />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Data Cleaning Guide</h3>
        <p className="text-green-700 mb-3">
          The T5-Base model helps clean and standardize your data. Here's how to use this feature effectively:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-green-700">
          <li>
            <strong>Text Cleaning:</strong> Paste text with errors, inconsistencies, or formatting issues in the input
            field.
          </li>
          <li>
            <strong>Excel Processing:</strong> Upload Excel files (.xls, .xlsx) to clean entire datasets at once.
          </li>
          <li>
            <strong>What Gets Cleaned:</strong> Spelling errors, inconsistent formatting, redundant information, and
            more.
          </li>
          <li>
            <strong>Export Options:</strong> Download as CSV for spreadsheet applications or JSON for web applications.
          </li>
        </ul>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Input Data
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Input help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Enter text with errors or inconsistencies that need cleaning.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>Enter text to clean or upload an Excel file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-text">Text to Clean</Label>
              <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mb-2">
                <strong>Example:</strong> "This textt has speling errors and Duplicated words words that need Cleaning."
              </div>
              <Textarea
                id="input-text"
                placeholder="Enter text to clean..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Or Upload Excel File</Label>
              <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mb-2">
                <strong>Supported formats:</strong> .xls, .xlsx files with headers in the first row
              </div>
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
              {processingStatus && <p className="text-sm text-muted-foreground">{processingStatus}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCleanText} disabled={!inputText.trim() || isProcessing} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Clean Text with T5"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Cleaned Output
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Output help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>The cleaned text will appear here after processing with the T5-Base model.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>Result after processing with T5-Base model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mb-2">
              <strong>Example output:</strong> "This text has spelling errors and duplicated words that need cleaning."
            </div>
            <Textarea
              placeholder="Cleaned text will appear here..."
              value={cleanedText}
              readOnly
              className="min-h-[200px]"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className="flex-1 mr-2"
              disabled={!cleanedText}
              onClick={() => {
                const blob = new Blob([cleanedText], { type: "text/plain" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "cleaned-text.txt"
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Text
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex-1" disabled={!processedData || processedData.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileUp className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToJSON}>
                  <Check className="mr-2 h-4 w-4" />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      </div>

      {/* In-content ad */}
      <AdBanner slot="6789012345" format="rectangle" className="mx-auto my-6" />
    </div>
  )
}
