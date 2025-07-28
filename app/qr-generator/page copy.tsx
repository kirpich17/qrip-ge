"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  QrCode,
  Download,
  Copy,
  Share2,
  Eye,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";
import QRCode from "react-qr-code";

export default function QRGeneratorPage() {
  const { t } = useTranslation();
  const qrGeneratorTranslations = t("qrGenerator");
  const [selectedMemorial, setSelectedMemorial] = useState("1");
  const [qrSize, setQrSize] = useState("medium");
  const [qrStyle, setQrStyle] = useState("standard");

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
  ];

  const selectedMemorialData = memorials.find((m) => m.id === selectedMemorial);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Function to download QR as PNG
  const downloadQRAsPNG = () => {
    const svg = document.getElementById("qr-code") as SVGSVGElement;
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${selectedMemorialData?.qrCode || 'qr'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  // Function to download QR as SVG
  const downloadQRAsSVG = () => {
    const svg = document.getElementById("qr-code") as SVGSVGElement;
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {type: "image/svg+xml"});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    
    downloadLink.href = svgUrl;
    downloadLink.download = `${selectedMemorialData?.qrCode || 'qr'}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between  flex-wrap gap-3">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-white hover:underline gap-2 text-base"
              >
                <ArrowLeft className="h-5 w-5" />
                {qrGeneratorTranslations.header.back}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white rounded-xl"
              >
                <QrCode className="h-5 w-5 text-[#243b31]" />{" "}
              </motion.div>
              <span className="md:text-2xl text-base font-bold text-white ">
                {qrGeneratorTranslations.header.title}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="md:text-3xl text-2xl font-bold text-gray-900 mb-2">
              {qrGeneratorTranslations.title}
            </h1>
            <p className="text-gray-600 text-base">
              {qrGeneratorTranslations.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 md:gap-8 gap-5">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {qrGeneratorTranslations.selectMemorial.title}
                  </CardTitle>
                  <CardDescription>
                    {qrGeneratorTranslations.selectMemorial.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="memorial">
                      {qrGeneratorTranslations.selectMemorial.placeholder}
                    </Label>
                    <Select
                      value={selectedMemorial}
                      onValueChange={setSelectedMemorial}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            qrGeneratorTranslations.selectMemorial.placeholder
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {memorials.map((memorial) => (
                          <SelectItem key={memorial.id} value={memorial.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{memorial.name}</span>
                              <Badge
                                variant={
                                  memorial.plan === "premium"
                                    ? "default"
                                    : "secondary"
                                }
                                className="ml-2"
                              >
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
                      <h3 className="font-semibold text-gray-900">
                        {selectedMemorialData.name}
                      </h3>
                      <p className="text-gray-600">
                        {selectedMemorialData.dates}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        QR Code: {selectedMemorialData.qrCode}
                      </p>
                      <Badge
                        variant={
                          selectedMemorialData.status === "active"
                            ? "default"
                            : "secondary"
                        }
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
                  <CardTitle>
                    {qrGeneratorTranslations.customization.title}
                  </CardTitle>
                  <CardDescription>
                    {qrGeneratorTranslations.customization.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">
                      {qrGeneratorTranslations.customization.size}
                    </Label>
                    <Select value={qrSize} onValueChange={setQrSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">
                          {qrGeneratorTranslations.customization.sizes.small}
                        </SelectItem>
                        <SelectItem value="medium">
                          {qrGeneratorTranslations.customization.sizes.medium}
                        </SelectItem>
                        <SelectItem value="large">
                          {qrGeneratorTranslations.customization.sizes.large}
                        </SelectItem>
                        <SelectItem value="xlarge">
                          {qrGeneratorTranslations.customization.sizes.xlarge}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style">
                      {qrGeneratorTranslations.customization.style}
                    </Label>
                    <Select value={qrStyle} onValueChange={setQrStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">
                          {
                            qrGeneratorTranslations.customization.styles
                              .standard
                          }
                        </SelectItem>
                        <SelectItem value="rounded">
                          {qrGeneratorTranslations.customization.styles.rounded}
                        </SelectItem>
                        <SelectItem value="dots">
                          {qrGeneratorTranslations.customization.styles.dots}
                        </SelectItem>
                        <SelectItem value="branded">
                          {qrGeneratorTranslations.customization.styles.branded}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {qrGeneratorTranslations.memorialUrl.title}
                  </CardTitle>
                  <CardDescription>
                    {qrGeneratorTranslations.memorialUrl.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedMemorialData && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={selectedMemorialData.url}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(selectedMemorialData.url)
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                        <Link
                          href={`/memorial/${selectedMemorialData.qrCode.toLowerCase()}`}
                        >
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            {qrGeneratorTranslations.memorialUrl.preview}
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          {qrGeneratorTranslations.memorialUrl.share}
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
                  <CardTitle>{qrGeneratorTranslations.preview.title}</CardTitle>
                  <CardDescription>
                    {qrGeneratorTranslations.preview.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    {/* QR Code Display */}
                    <div className="inline-block p-8 bg-white border-2 border-gray-200 rounded-lg shadow-sm w-full">
                      <div className="flex items-center justify-center">
                        <QRCode
                          id="qr-code"
                          value={selectedMemorialData?.url || ""}
                          size={
                            qrSize === "small" 
                              ? 128 
                              : qrSize === "medium" 
                                ? 192 
                                : qrSize === "large" 
                                  ? 256 
                                  : 320
                          }
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="Q" // Error correction level
                          style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "100%",
                            borderRadius: 
                              qrStyle === "rounded" 
                                ? "8px" 
                                : qrStyle === "dots" 
                                  ? "50%" 
                                  : "0"
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex justify-center gap-4 flex-wrap">
                        <Button
                          className="bg-[#547455] hover:bg-white hover:text-[#547455] border border-[#547455] sm:w-auto w-full"
                          onClick={downloadQRAsPNG}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {qrGeneratorTranslations.preview.downloadPng}
                        </Button>
                        <Button
                          className="sm:w-auto w-full"
                          variant="outline"
                          onClick={downloadQRAsSVG}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {qrGeneratorTranslations.preview.downloadSvg}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => {
                          console.log(
                            "Print QR code for:",
                            selectedMemorialData?.qrCode
                          );
                          window.print();
                        }}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        {qrGeneratorTranslations.preview.print}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {qrGeneratorTranslations.instructions.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#547455]/10 text-[#547455] rounded-full flex items-center justify-center text-xs font-semibold">
                        1
                      </div>
                      <p>{qrGeneratorTranslations.instructions.steps[0]}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#547455]/10 text-[#547455] rounded-full flex items-center justify-center text-xs font-semibold">
                        2
                      </div>
                      <p>{qrGeneratorTranslations.instructions.steps[1]}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#547455]/10 text-[#547455] rounded-full flex items-center justify-center text-xs font-semibold">
                        3
                      </div>
                      <p>{qrGeneratorTranslations.instructions.steps[2]}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#547455]/10 text-[#547455] rounded-full flex items-center justify-center text-xs font-semibold">
                        4
                      </div>
                      <p>{qrGeneratorTranslations.instructions.steps[3]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{qrGeneratorTranslations.stats.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="md:text-2xl text-xl font-bold text-gray-900">
                        127
                      </p>
                      <p className="text-sm text-gray-600">
                        {qrGeneratorTranslations.stats.totalScans}
                      </p>
                    </div>
                    <div>
                      <p className="md:text-2xl text-xl font-bold text-gray-900">
                        23
                      </p>
                      <p className="text-sm text-gray-600">
                        {qrGeneratorTranslations.stats.thisMonth}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}