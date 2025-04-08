"use client"

import type React from "react"

import { useState } from "react"
import * as XLSX from "xlsx"
import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileUp, Download, CheckCircle, AlertCircle } from "lucide-react"

type DataRow = (string | number | null)[]
type CleanedRow = Record<string, any>

export function ExcelPreprocessor() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processedData, setProcessedData] = useState<CleanedRow[] | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setProcessedData(null)
      setStatus("idle")
      setStatusMessage("")
    }
  }

  const cleanDate = (dateStr: string): string => {
    if (!dateStr) return "Not Provided"

    try {
      // Replace Chinese month names
      const chineseMonths: { [key: string]: string } = {
        一月: "January",
        二月: "February",
        三月: "March",
        四月: "April",
        五月: "May",
        六月: "June",
        七月: "July",
        八月: "August",
        九月: "September",
        十月: "October",
        十一月: "November",
        十二月: "December",
      }

      let processedDate = dateStr
      Object.entries(chineseMonths).forEach(([chinese, english]) => {
        processedDate = processedDate.replace(new RegExp(chinese, "g"), english)
      })

      // Parse and format the date
      const date = new Date(processedDate)
      if (isNaN(date.getTime())) {
        return "Invalid Date"
      }

      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    } catch {
      return "Invalid Date"
    }
  }

  const cleanData = (data: DataRow[]) => {
    try {
      // Step 1: Remove empty rows
      const filteredData = data.filter((row) => row.some((cell) => cell !== null && cell !== ""))

      if (filteredData.length === 0) {
        throw new Error("No valid data found in the file")
      }

      // Step 2: Standardize headers
      const headers = filteredData[0].map((header) => {
        if (typeof header === "string") {
          return header.trim().replace(/\s+/g, "_").toLowerCase()
        }
        return "unknown_column"
      })

      setHeaders(headers)

      // Step 3: Process rows with progress tracking
      const totalRows = filteredData.length - 1
      const cleanedRows: CleanedRow[] = []

      for (let i = 1; i < filteredData.length; i++) {
        const row = filteredData[i]
        const cleanedRow: CleanedRow = {}

        headers.forEach((header, index) => {
          let value = row[index]

          // Handle missing values
          if (value === null || value === "") {
            value = "Not Provided"
          }

          // Clean date fields
          if (header.includes("tarikh_lahir") || header.includes("tarikh_mati") || header.includes("date")) {
            value = cleanDate(value as string)
          }

          // Add to cleaned row
          cleanedRow[header] = value
        })

        cleanedRows.push(cleanedRow)

        // Update progress
        const currentProgress = Math.round((i / totalRows) * 100)
        setProgress(currentProgress)
      }

      return cleanedRows
    } catch (error) {
      console.error("Error cleaning data:", error)
      throw error
    }
  }

  const exportToCSV = (data: CleanedRow[], headers: string[]) => {
    const csv = Papa.unparse({
      fields: headers,
      data: data.map((row) => headers.map((header) => row[header])),
    })

    // Create a downloadable CSV file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `cleaned_${file?.name.replace(/\.[^/.]+$/, "")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const processFile = () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)
    setStatus("idle")
    setStatusMessage("")

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "binary" })

        // Assuming the first sheet contains the data
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Convert worksheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as DataRow[]

        // Clean the data
        const cleanedData = cleanData(jsonData)
        setProcessedData(cleanedData)
        setStatus("success")
        setStatusMessage(`Successfully processed ${cleanedData.length} rows of data.`)
      } catch (error) {
        console.error("Error processing file:", error)
        setStatus("error")
        setStatusMessage(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`)
      } finally {
        setIsProcessing(false)
      }
    }

    reader.onerror = () => {
      setStatus("error")
      setStatusMessage("Error reading the file.")
      setIsProcessing(false)
    }

    reader.readAsBinaryString(file)
  }

  const handleDownload = () => {
    if (processedData && headers.length > 0) {
      exportToCSV(processedData, headers)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Excel File Preprocessor</CardTitle>
        <CardDescription>Upload an Excel file (.xls or .xlsx) to clean and convert it to CSV format.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 border-gray-300 dark:border-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Excel files (.xls, .xlsx)</p>
                {file && (
                  <div className="mt-4 flex items-center">
                    <FileUp className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
            </label>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {status !== "idle" && (
            <div
              className={`p-4 rounded-md ${status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {status === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{statusMessage}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={processFile} disabled={!file || isProcessing} className="mr-2">
          {isProcessing ? "Processing..." : "Process File"}
        </Button>
        <Button onClick={handleDownload} disabled={!processedData || isProcessing} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Download CSV
        </Button>
      </CardFooter>
    </Card>
  )
}
