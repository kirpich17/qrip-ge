"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import IsAdminAuth from "@/lib/IsAdminAuth/page";
import LanguageDropdown from "@/components/languageDropdown/page";
import axiosInstance from "@/services/axiosInstance";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";

interface LanguageFile {
  name: string;
  code: string;
  path: string;
  size?: number;
  lastModified?: string;
}

const LanguageUploadPage = () => {
  const { t, loading: translationsLoading } = useTranslation();
  const languageManagementTranslations = t("languageManagement") || {
    title: "Language Management",
    description: "Upload and manage translation files for your application",
    backToDashboard: "Back to Admin Dashboard",
    tabs: { uploadFiles: "Upload Files", manageFiles: "Manage Files" },
    languages: { english: "English", georgian: "Georgian", russian: "Russian" },
    upload: {
      selectFile: "Select File",
      uploading: "Uploading...",
      uploadDescription: "Upload {language} translation file",
      progress: "{progress}% uploaded",
      success: "File uploaded successfully!",
      error: "Upload failed",
      guidelines: {
        title: "Upload Guidelines",
        jsonFormat: "Files must be in JSON format (.json extension)",
        fileSize: "Maximum file size: 5MB",
        validJson: "JSON structure must be valid and properly formatted",
        replacement: "Uploading a new file will replace the existing one",
        immediateEffect: "Changes will be reflected immediately across the application"
      }
    },
    manage: {
      fileUploaded: "File uploaded",
      noFileUploaded: "No file uploaded",
      active: "Active",
      inactive: "Inactive",
      download: "Download",
      uploadFile: "Upload File",
      file: "File",
      size: "Size",
      updated: "Updated"
    },
    messages: {
      uploadSuccess: "{language} language file uploaded successfully!",
      downloadSuccess: "{language} file downloaded successfully!",
      uploadError: "Failed to upload file: {error}",
      downloadError: "Failed to download file: {error}",
      invalidJsonFile: "Please select a valid JSON file",
      fileSizeError: "File size must be less than 5MB"
    }
  };
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentFiles, setCurrentFiles] = useState<LanguageFile[]>([]);
  
  const fileInputRefs = {
    en: useRef<HTMLInputElement>(null),
    ka: useRef<HTMLInputElement>(null),
    ru: useRef<HTMLInputElement>(null)
  };

  const languages = [
    { code: "en", name: languageManagementTranslations.languages?.english || "English", flag: "🇺🇸" },
    { code: "ka", name: languageManagementTranslations.languages?.georgian || "Georgian", flag: "🇬🇪" },
    { code: "ru", name: languageManagementTranslations.languages?.russian || "Russian", flag: "🇷🇺" }
  ];

  // Load existing language files on component mount
  useEffect(() => {
    const loadLanguageFiles = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/languages');
        if (response.data.status && response.data.data) {
          const files = response.data.data.map((file: any) => ({
            name: file.fileName,
            code: file.language,
            path: `/uploads/languages/${file.fileName}`,
            size: file.fileSize,
            lastModified: file.lastModified
          }));
          setCurrentFiles(files);
        }
      } catch (error) {
        console.error('Error loading language files:', error);
      }
    };

    loadLanguageFiles();
  }, []);

  const handleFileSelect = (languageCode: string) => {
    const fileInput = fileInputRefs[languageCode as keyof typeof fileInputRefs];
    if (fileInput?.current) {
      fileInput.current.click();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, languageCode: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.json')) {
      toast.error(languageManagementTranslations.messages?.invalidJsonFile || "Please select a valid JSON file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(languageManagementTranslations.messages?.fileSizeError || "File size must be less than 5MB");
      return;
    }

    setSelectedLanguage(languageCode);
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus("idle");

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      // Read and validate JSON file
      const fileContent = await file.text();
      const jsonData = JSON.parse(fileContent);

      // Validate JSON structure (basic validation)
      if (typeof jsonData !== 'object' || jsonData === null) {
        throw new Error("Invalid JSON structure");
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to backend
      const response = await axiosInstance.post(`/api/admin/languages/${languageCode}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus("success");
      
      // Update current files list
      setCurrentFiles(prev => [
        ...prev.filter(f => f.code !== languageCode),
        {
          name: file.name,
          code: languageCode,
          path: `/locales/${languageCode}.json`,
          size: file.size,
          lastModified: new Date().toISOString()
        }
      ]);

      toast.success(languageManagementTranslations.messages?.uploadSuccess?.replace('{language}', languages.find(l => l.code === languageCode)?.name || '') || `${languages.find(l => l.code === languageCode)?.name} language file uploaded successfully!`);
      
      // Force refresh the page to load new translations
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      setUploadStatus("error");
      const errorMessage = error.response?.data?.message || error.message || "Upload failed";
      setErrorMessage(errorMessage);
      toast.error(languageManagementTranslations.messages?.uploadError?.replace('{error}', errorMessage) || `Failed to upload file: ${errorMessage}`);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownloadCurrent = async (languageCode: string) => {
    try {
      const response = await axiosInstance.get(`/api/admin/languages/${languageCode}/download`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${languageCode}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(languageManagementTranslations.messages?.downloadSuccess?.replace('{language}', languages.find(l => l.code === languageCode)?.name || '') || `${languages.find(l => l.code === languageCode)?.name} file downloaded successfully!`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Download failed";
      toast.error(languageManagementTranslations.messages?.downloadError?.replace('{error}', errorMessage) || `Failed to download file: ${errorMessage}`);
    }
  };

  // Delete functionality removed - files are replaced on upload instead

  // Show loading state while translations are being fetched
  if (translationsLoading) {
    return (
      <IsAdminAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#243b31] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading translations...</p>
          </div>
        </div>
      </IsAdminAuth>
    );
  }

  return (
    <IsAdminAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#243b31] py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <Link
                href="/admin/dashboard"
                className="flex items-center text-white hover:underline gap-2 text-base"
              >
                <ArrowLeft className="h-5 w-5" />
                {languageManagementTranslations.backToDashboard || "Back to Admin Dashboard"}
              </Link>
              <LanguageDropdown />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {languageManagementTranslations.title || "Language Management"}
                </h1>
                <p className="text-gray-600">
                  {languageManagementTranslations.description || "Upload and manage translation files for your application"}
                </p>
              </div>
            </div>
          </motion.div>

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">{languageManagementTranslations.tabs?.uploadFiles || "Upload Files"}</TabsTrigger>
              <TabsTrigger value="manage">{languageManagementTranslations.tabs?.manageFiles || "Manage Files"}</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {languages.map((language) => (
                  <motion.div
                    key={language.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: language.code === 'en' ? 0 : language.code === 'ka' ? 0.1 : 0.2 }}
                  >
                    <Card className="relative overflow-hidden">
                      <CardHeader className="text-center">
                        <div className="text-4xl mb-2">{language.flag}</div>
                        <CardTitle className="text-xl">{language.name}</CardTitle>
                        <CardDescription>
                          {languageManagementTranslations.upload?.uploadDescription?.replace('{language}', language.name) || `Upload ${language.name} translation file`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <input
                          ref={fileInputRefs[language.code as keyof typeof fileInputRefs]}
                          type="file"
                          accept=".json"
                          onChange={(e) => handleFileUpload(e, language.code)}
                          className="hidden"
                        />
                        
                        <Button
                          onClick={() => handleFileSelect(language.code)}
                          disabled={uploading && selectedLanguage === language.code}
                          className="w-full"
                          variant="outline"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading && selectedLanguage === language.code ? (languageManagementTranslations.upload?.uploading || "Uploading...") : (languageManagementTranslations.upload?.selectFile || "Select File")}
                        </Button>

                        {uploading && selectedLanguage === language.code && (
                          <div className="space-y-2">
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-sm text-center text-gray-600">
                              {languageManagementTranslations.upload?.progress?.replace('{progress}', uploadProgress.toString()) || `${uploadProgress}% uploaded`}
                            </p>
                          </div>
                        )}

                        {uploadStatus === "success" && selectedLanguage === language.code && (
                          <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                              {languageManagementTranslations.upload?.success || "File uploaded successfully!"}
                            </AlertDescription>
                          </Alert>
                        )}

                        {uploadStatus === "error" && selectedLanguage === language.code && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              {errorMessage}
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Upload Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    {languageManagementTranslations.upload?.guidelines?.title || "Upload Guidelines"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>• {languageManagementTranslations.upload?.guidelines?.jsonFormat || "Files must be in JSON format (.json extension)"}</p>
                    <p>• {languageManagementTranslations.upload?.guidelines?.fileSize || "Maximum file size: 5MB"}</p>
                    <p>• {languageManagementTranslations.upload?.guidelines?.validJson || "JSON structure must be valid and properly formatted"}</p>
                    <p>• {languageManagementTranslations.upload?.guidelines?.replacement || "Uploading a new file will replace the existing one"}</p>
                    <p>• {languageManagementTranslations.upload?.guidelines?.immediateEffect || "Changes will be reflected immediately across the application"}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {languages.map((language) => {
                  const currentFile = currentFiles.find(f => f.code === language.code);
                  return (
                    <Card key={language.code}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{language.flag}</span>
                            <div>
                              <CardTitle className="text-lg">{language.name}</CardTitle>
                              <CardDescription>
                                {currentFile ? (languageManagementTranslations.manage?.fileUploaded || "File uploaded") : (languageManagementTranslations.manage?.noFileUploaded || "No file uploaded")}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={currentFile ? "default" : "secondary"}>
                            {currentFile ? (languageManagementTranslations.manage?.active || "Active") : (languageManagementTranslations.manage?.inactive || "Inactive")}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {currentFile ? (
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">
                              <p><strong>{languageManagementTranslations.manage?.file || "File"}:</strong> {currentFile.name}</p>
                              <p><strong>{languageManagementTranslations.manage?.size || "Size"}:</strong> {(currentFile.size! / 1024).toFixed(1)} KB</p>
                              <p><strong>{languageManagementTranslations.manage?.updated || "Updated"}:</strong> {new Date(currentFile.lastModified!).toLocaleDateString()}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadCurrent(language.code)}
                                className="w-full"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                {languageManagementTranslations.manage?.download || "Download"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">{languageManagementTranslations.manage?.noFileUploaded || "No file uploaded"}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFileSelect(language.code)}
                              className="mt-2"
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              {languageManagementTranslations.manage?.uploadFile || "Upload File"}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </IsAdminAuth>
  );
};

export default LanguageUploadPage;