"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, QrCode, Download, Copy, Share2, Eye, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function QRGeneratorPage() {
  const [selectedMemorial, setSelectedMemorial] = useState("1")
  const [qrSize, setQrSize] = useState("medium")
  const [qrStyle, setQrStyle] = useState("standard")

  const memorials = [
    {
      id: "1",
      name: "John Smith",
      dates: "1945 - 2023",
      qrCode: "QR001",
      url: "https://qrip.ge/memorial/john-smith-qr001",
      status: "active",
      plan: "premium",
    },
    {
      id: "2",
      name: "Mary Johnson",
      dates: "1952 - 2024",
      qrCode: "QR002",
      url: "https://qrip.ge/memorial/mary-johnson-qr002",
      status: "active",
      plan: "basic",
    },
  ]

  const selectedMemorialData = memorials.find((m) => m.id === selectedMemorial)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                QR Generator
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Generator</h1>
            <p className="text-gray-600">Generate and manage QR codes for your memorials</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Memorial</CardTitle>
                  <CardDescription>Choose which memorial to generate a QR code for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="memorial">Memorial</Label>
                    <Select value={selectedMemorial} onValueChange={setSelectedMemorial}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a memorial" />
                      </SelectTrigger>
                      <SelectContent>
                        {memorials.map((memorial) => (
                          <SelectItem key={memorial.id} value={memorial.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{memorial.name}</span>
                              <Badge variant={memorial.plan === "premium" ? "default" : "secondary"} className="ml-2">
                                {memorial.plan}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedMemorialData && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900">{selectedMemorialData.name}</h3>
                      <p className="text-gray-600">{selectedMemorialData.dates}</p>
                      <p className="text-sm text-gray-500 mt-2">QR Code: {selectedMemorialData.qrCode}</p>
                      <Badge
                        variant={selectedMemorialData.status === "active" ? "default" : "secondary"}
                        className="mt-2"
                      >
                        {selectedMemorialData.status}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customization</CardTitle>
                  <CardDescription>Customize your QR code appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Select value={qrSize} onValueChange={setQrSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (200x200px)</SelectItem>
                        <SelectItem value="medium">Medium (400x400px)</SelectItem>
                        <SelectItem value="large">Large (600x600px)</SelectItem>
                        <SelectItem value="xlarge">Extra Large (800x800px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style">Style</Label>
                    <Select value={qrStyle} onValueChange={setQrStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="rounded">Rounded Corners</SelectItem>
                        <SelectItem value="dots">Dots Style</SelectItem>
                        <SelectItem value="branded">Branded (with logo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Memorial URL</CardTitle>
                  <CardDescription>This is the URL that the QR code will link to</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedMemorialData && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Input value={selectedMemorialData.url} readOnly className="font-mono text-sm" />
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(selectedMemorialData.url)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/memorial/${selectedMemorialData.qrCode.toLowerCase()}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview Memorial
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Link
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* QR Code Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Preview</CardTitle>
                  <CardDescription>Preview and download your QR code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    {/* QR Code Placeholder */}
                    <div className="inline-block p-8 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                      <div
                        className={`bg-gray-900 ${
                          qrSize === "small"
                            ? "w-48 h-48"
                            : qrSize === "medium"
                              ? "w-64 h-64"
                              : qrSize === "large"
                                ? "w-80 h-80"
                                : "w-96 h-96"
                        } flex items-center justify-center text-white text-sm`}
                      >
                        QR Code
                        <br />
                        {selectedMemorialData?.qrCode}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex justify-center space-x-3">
                        <Button
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          onClick={() => {
                            console.log("Download PNG for:", selectedMemorialData?.qrCode)
                            // Handle PNG download logic
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PNG
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            console.log("Download SVG for:", selectedMemorialData?.qrCode)
                            // Handle SVG download logic
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download SVG
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => {
                          console.log("Print QR code for:", selectedMemorialData?.qrCode)
                          window.print()
                        }}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print QR Code
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        1
                      </div>
                      <p>Download and print the QR code on durable material</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        2
                      </div>
                      <p>Place it on the memorial site (gravestone, plaque, etc.)</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        3
                      </div>
                      <p>Visitors can scan with any smartphone camera to view the memorial</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        4
                      </div>
                      <p>No app download required - works with built-in camera apps</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>QR Code Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">127</p>
                      <p className="text-sm text-gray-600">Total Scans</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">23</p>
                      <p className="text-sm text-gray-600">This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
