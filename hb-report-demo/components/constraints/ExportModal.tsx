"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  File 
} from "lucide-react"

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: (options: { format: "pdf" | "excel" | "csv"; fileName: string; filePath: string }) => void
  defaultFileName: string
}

export function ExportModal({
  open,
  onOpenChange,
  onExport,
  defaultFileName
}: ExportModalProps) {
  const [format, setFormat] = useState<"pdf" | "excel" | "csv">("pdf")
  const [fileName, setFileName] = useState(defaultFileName)
  const [filePath, setFilePath] = useState("")

  const handleExport = () => {
    onExport({
      format,
      fileName,
      filePath
    })
    onOpenChange(false)
  }

  const getFormatIcon = (formatType: string) => {
    switch (formatType) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />
      case "excel":
        return <FileSpreadsheet className="h-4 w-4 text-green-600" />
      case "csv":
        return <File className="h-4 w-4 text-blue-600" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const getFormatDescription = (formatType: string) => {
    switch (formatType) {
      case "pdf":
        return "Portable Document Format - Great for reports and printing"
      case "excel":
        return "Excel format (CSV) - Perfect for data analysis"
      case "csv":
        return "Comma Separated Values - Universal data format"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-[#FF6B35]" />
            Export Constraints
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Export Format */}
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select value={format} onValueChange={(value: any) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    {getFormatIcon("pdf")}
                    <div>
                      <div className="font-medium">PDF Report</div>
                      <div className="text-xs text-muted-foreground">Formatted report with charts</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    {getFormatIcon("excel")}
                    <div>
                      <div className="font-medium">Excel (CSV)</div>
                      <div className="text-xs text-muted-foreground">Spreadsheet format</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    {getFormatIcon("csv")}
                    <div>
                      <div className="font-medium">CSV File</div>
                      <div className="text-xs text-muted-foreground">Raw data format</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {getFormatDescription(format)}
            </p>
          </div>

          {/* File Name */}
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
            />
            <p className="text-xs text-muted-foreground">
              File extension will be added automatically
            </p>
          </div>

          {/* File Path (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="filePath">Save Location (Optional)</Label>
            <Input
              id="filePath"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="Default download folder"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use default download location
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={!fileName.trim()}
            className="bg-[#FF6B35] hover:bg-[#E55A2B]"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 