import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataCleaningTab } from "@/components/data-cleaning-tab"
import { RagTab } from "@/components/rag-tab"
import { AdBanner } from "@/components/ads/ad-banner"
import { InfoIcon as InfoCircle } from "lucide-react"

export default function Home() {
  return (
    <>
      <main className="container mx-auto py-10 px-4 md:px-6">
        {/* Top banner ad */}
        <AdBanner slot="1234567890" format="horizontal" className="mb-8" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Excel Smart Model Refinery (ESMR)</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform your Excel data with AI-powered cleaning and analysis. ESMR uses advanced language models to
            refine, structure, and extract insights from your spreadsheet data.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold flex items-center text-blue-800 mb-2">
            <InfoCircle className="h-5 w-5 mr-2" />
            Getting Started with ESMR
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-blue-700">
            <li>
              <strong>Data Cleaning Tab:</strong> Clean and structure your Excel data using the T5-Base model. Upload
              Excel files or paste text directly.
            </li>
            <li>
              <strong>RAG Tab:</strong> Use Retrieval-Augmented Generation to ask questions about your data and get
              AI-generated insights.
            </li>
            <li>
              <strong>Export Options:</strong> Download your cleaned data in CSV or JSON format for further analysis or
              integration.
            </li>
          </ol>
        </div>

        <Tabs defaultValue="data-cleaning" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="data-cleaning">Data Cleaning (T5-Base)</TabsTrigger>
            <TabsTrigger value="rag">RAG (Pegasus)</TabsTrigger>
          </TabsList>

          <TabsContent value="data-cleaning">
            <DataCleaningTab />

            {/* Middle ad between tabs */}
            <div className="my-8">
              <AdBanner slot="2345678901" format="rectangle" className="mx-auto" />
            </div>
          </TabsContent>

          <TabsContent value="rag">
            <RagTab />

            {/* Middle ad between tabs */}
            <div className="my-8">
              <AdBanner slot="3456789012" format="rectangle" className="mx-auto" />
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom banner ad */}
        <AdBanner slot="4567890123" format="horizontal" className="mt-8" />
      </main>
    </>
  )
}
