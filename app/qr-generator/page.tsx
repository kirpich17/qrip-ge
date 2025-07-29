"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  QrCode,
  Download,
  Copy,
  Share2,
  Eye,
  Printer,
  Loader2,
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
import { QRCodeSVG } from 'qrcode.react';
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";
import axios from "axios";

interface Memorial {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  deathDate: string;
  slug: string;
  plan: string;
  status: string;
}

export default function QRGeneratorPage() {
  const { t } = useTranslation();
  const qrGeneratorTranslations = t("qrGenerator");
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [selectedMemorialId, setSelectedMemorialId] = useState<string | undefined>(undefined);
  const [isLoadingMemorials, setIsLoadingMemorials] = useState(true);
  const [qrSize, setQrSize] = useState<"small" | "medium" | "large" | "xlarge">("medium");
  const [qrStyle, setQrStyle] = useState<"standard" | "rounded" | "dots" | "branded">("standard");
  const [isDownloading, setIsDownloading] = useState(false);

  // Size mapping for both preview and download
  const sizeMap = {
    small: { preview: 128, download: 400 },
    medium: { preview: 256, download: 800 },
    large: { preview: 384, download: 1200 },
    xlarge: { preview: 512, download: 1600 }
  };

  // Fetch memorials
  useEffect(() => {
    const fetchUserMemorials = async () => {
      setIsLoadingMemorials(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication token not found");
        setIsLoadingMemorials(false);
        return;
      }
      try {
        const response = await axios.get('https://qrip-ge-backend.vercel.app/api/memorials/my-memorials', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.status && response.data.data.length > 0) {
          setMemorials(response.data.data);
          setSelectedMemorialId(response.data.data[0]._id);
        } else {
          setMemorials([]);
          toast.info("No memorials found");
        }
      } catch (error) {
        console.error("Failed to fetch memorials", error);
        toast.error("Failed to load memorials");
      } finally {
        setIsLoadingMemorials(false);
      }
    };
    fetchUserMemorials();
  }, []);

  const selectedMemorialData = memorials.find((m) => m._id === selectedMemorialId);
  const publicMemorialUrl = selectedMemorialData ? `${window.location.origin}/memorial/${selectedMemorialData._id}?isScan=true` : "";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success("URL copied!"));
  };

  const handleDownload = async (format: 'png' | 'svg') => {
    if (!selectedMemorialData) return;
    setIsDownloading(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("You are not logged in");
      setIsDownloading(false);
      return;
    }
    try {
      const response = await axios.post(
        'https://qrip-ge-backend.vercel.app/api/qrcode/generate',
        {
          memorialId: selectedMemorialData._id,
          format,
          size: sizeMap[qrSize].download,
          style: qrStyle,
        },
        {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      saveAs(response.data, `qrip_${selectedMemorialData.slug}.${format}`);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setIsDownloading(false);
    }
  };

  // Apply different styles to QR code
  const getQrCodeProps = () => {
    const baseProps = {
      value: publicMemorialUrl,
      size: sizeMap[qrSize].preview,
      level: "H",
      includeMargin: true,
      bgColor: "#ffffff",
      fgColor: "#000000",
    };

    switch (qrStyle) {
      case "rounded":
        return {
          ...baseProps,
          imageSettings: {
            src: "/rounded-mask.png",
            excavate: true,
            height: 40,
            width: 40,
          }
        };
      case "branded":
        return {
          ...baseProps,
          imageSettings: {
            src: "/logo.png",
            excavate: true,
            height: 50,
            width: 50,
          }
        };
      default:
        return baseProps;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#243b31] py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-white hover:underline gap-2 text-base">
                <ArrowLeft className="h-5 w-5" />
                {qrGeneratorTranslations.header.back}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 bg-white rounded-xl">
                <QrCode className="h-5 w-5 text-[#243b31]" />
              </motion.div>
              <span className="md:text-2xl text-base font-bold text-white">
                {qrGeneratorTranslations.header.title}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <h1 className="md:text-3xl text-2xl font-bold text-gray-900 mb-2">
              {qrGeneratorTranslations.title}
            </h1>
            <p className="text-gray-600 text-base">
              {qrGeneratorTranslations.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 md:gap-8 gap-5">
            {/* Left Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{qrGeneratorTranslations.selectMemorial.title}</CardTitle>
                  <CardDescription>{qrGeneratorTranslations.selectMemorial.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="memorial">{qrGeneratorTranslations.selectMemorial.placeholder}</Label>
                    <Select
                      value={selectedMemorialId}
                      onValueChange={setSelectedMemorialId}
                      disabled={isLoadingMemorials || memorials.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingMemorials ? "Loading memorials..." : "Select a memorial"} />
                      </SelectTrigger>
                      <SelectContent>
                        {memorials.map((memorial) => (
                          <SelectItem key={memorial._id} value={memorial._id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{`${memorial.firstName} ${memorial.lastName}`}</span>
                              <Badge variant={memorial.plan === "Premium" ? "default" : "secondary"}>
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
                        {`${selectedMemorialData.firstName} ${selectedMemorialData.lastName}`}
                      </h3>
                      <p className="text-gray-600">
                        {`${new Date(selectedMemorialData.birthDate).getFullYear()} - ${new Date(selectedMemorialData.deathDate).getFullYear()}`}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        QR Code: {selectedMemorialData.slug}
                      </p>
                      <Badge variant={selectedMemorialData.status === "active" ? "default" : "secondary"} className="mt-2">
                        {selectedMemorialData.status}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{qrGeneratorTranslations.customization.title}</CardTitle>
                  <CardDescription>{qrGeneratorTranslations.customization.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">{qrGeneratorTranslations.customization.size}</Label>
                    <Select value={qrSize} onValueChange={(value) => setQrSize(value as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">{qrGeneratorTranslations.customization.sizes.small}</SelectItem>
                        <SelectItem value="medium">{qrGeneratorTranslations.customization.sizes.medium}</SelectItem>
                        <SelectItem value="large">{qrGeneratorTranslations.customization.sizes.large}</SelectItem>
                        <SelectItem value="xlarge">{qrGeneratorTranslations.customization.sizes.xlarge}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="style">{qrGeneratorTranslations.customization.style}</Label>
                    <Select value={qrStyle} onValueChange={(value) => setQrStyle(value as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">{qrGeneratorTranslations.customization.styles.standard}</SelectItem>
                        <SelectItem value="rounded">{qrGeneratorTranslations.customization.styles.rounded}</SelectItem>
                        <SelectItem value="dots">{qrGeneratorTranslations.customization.styles.dots}</SelectItem>
                        <SelectItem value="branded">{qrGeneratorTranslations.customization.styles.branded}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{qrGeneratorTranslations.memorialUrl.title}</CardTitle>
                  <CardDescription>{qrGeneratorTranslations.memorialUrl.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedMemorialData && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Input value={publicMemorialUrl} readOnly className="font-mono text-sm" />
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(publicMemorialUrl)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                        <Link href={publicMemorialUrl} target="_blank">
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

            {/* Right Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{qrGeneratorTranslations.preview.title}</CardTitle>
                  <CardDescription>{qrGeneratorTranslations.preview.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                      {selectedMemorialData ? (
                        <QRCodeSVG {...getQrCodeProps()} />
                      ) : (
                        <div className="w-64 h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                          {isLoadingMemorials ? <Loader2 className="animate-spin" /> : "Select a memorial to preview"}
                        </div>
                      )}
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="flex justify-center gap-4 flex-wrap">
                        <Button
                          className="bg-[#547455] hover:bg-white hover:text-[#547455] border border-[#547455] sm:w-auto w-full"
                          onClick={() => handleDownload('png')}
                          disabled={isDownloading || !selectedMemorialData}
                        >
                          {isDownloading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="mr-2 h-4 w-4" />
                          )}
                          {isDownloading ? 'Downloading...' : qrGeneratorTranslations.preview.downloadPng}
                        </Button>
                        <Button
                          className="sm:w-auto w-full"
                          variant="outline"
                          onClick={() => handleDownload('svg')}
                          disabled={isDownloading || !selectedMemorialData}
                        >
                          {isDownloading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="mr-2 h-4 w-4" />
                          )}
                          {isDownloading ? 'Downloading...' : qrGeneratorTranslations.preview.downloadSvg}
                        </Button>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent" onClick={() => window.print()}>
                        <Printer className="h-4 w-4 mr-2" />
                        {qrGeneratorTranslations.preview.print}
                      </Button>
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