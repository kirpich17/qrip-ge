"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Download, FileText, AlertCircle, CheckCircle, Languages, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-toastify";
import Link from "next/link";
import IsAdminAuth from "@/lib/IsAdminAuth/page";
import axiosInstance from "@/services/axiosInstance";
import { useTranslation } from "@/hooks/useTranslate";

interface LanguageFile {
  language: string;
  filename: string;
  size: number;
  lastModified: string;
  exists: boolean;
}

interface UploadProgress {
  language: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

function TranslationManagementPage() {
  const { t, refreshTranslations, isUsingAPI, isLoading, error, debug } = useTranslation();
  const [languageFiles, setLanguageFiles] = useState<LanguageFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [previewData, setPreviewData] = useState<any>(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ka", name: "Georgian", flag: "🇬🇪" },
    { code: "ru", name: "Russian", flag: "🇷🇺" }
  ];

  // Get translations for the page
  const translations = t("languageManagement") || {
    title: "Language Management",
    description: "Upload and manage translation files for your application",
    backToDashboard: "Back to Admin Dashboard",
    tabs: {
      uploadFiles: "Upload Files",
      manageFiles: "Manage Files"
    },
    languages: {
      english: "English",
      georgian: "Georgian", 
      russian: "Russian"
    },
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

  useEffect(() => {
    fetchLanguageFiles();
  }, []);

  const fetchLanguageFiles = async () => {
    try {
      setIsUploading(true);
      const response = await axiosInstance.get("/api/admin/translation-files");
      setLanguageFiles(response.data);
    } catch (error) {
      console.error("Error fetching language files:", error);
      toast.error("Failed to fetch language files");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (language: string, file: File) => {
    if (!file) return;

    // Validate file
    if (!file.name.endsWith('.json')) {
      toast.error(translations.messages.invalidJsonFile);
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error(translations.messages.fileSizeError);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    try {
      setUploadProgress(prev => [...prev.filter(p => p.language !== language), {
        language,
        progress: 0,
        status: 'uploading'
      }]);

      const response = await axiosInstance.post("/api/admin/upload-translation", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          setUploadProgress(prev => prev.map(p => 
            p.language === language ? { ...p, progress } : p
          ));
        }
      });

      setUploadProgress(prev => prev.map(p => 
        p.language === language ? { ...p, status: 'success' } : p
      ));

      toast.success(translations.messages.uploadSuccess.replace('{language}', language));
      toast.info("Translations updated! Changes will appear immediately.");
      fetchLanguageFiles();
      
      // Refresh translations to show updated content immediately
      refreshTranslations();
      
      // Debug: Check if files were updated
      console.log('=== TRANSLATION UPLOAD DEBUG ===');
      console.log('Language:', language);
      console.log('Response:', response.data);
      console.log('Using Pure API approach - no page reload needed!');
      
      // Clear progress after 3 seconds
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => p.language !== language));
      }, 3000);

    } catch (error: any) {
      setUploadProgress(prev => prev.map(p => 
        p.language === language ? { ...p, status: 'error' } : p
      ));
      
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(translations.messages.uploadError.replace('{error}', errorMessage));
      
      // Clear error progress after 5 seconds
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => p.language !== language));
      }, 5000);
    }
  };

  const handleFileDownload = async (language: string) => {
    try {
      const response = await axiosInstance.get(`/api/admin/download-translation/${language}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${language}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(translations.messages.downloadSuccess.replace('{language}', language));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(translations.messages.downloadError.replace('{error}', errorMessage));
    }
  };

  const handlePreview = async (language: string) => {
    try {
      const response = await axiosInstance.get(`/api/admin/preview-translation/${language}`);
      setPreviewData(response.data);
      setSelectedLanguage(language);
    } catch (error) {
      console.error("Error fetching preview:", error);
      toast.error("Failed to load preview");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {translations.backToDashboard}
                </Button>
              </Link>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white rounded-xl"
              >
                <Languages className="h-5 w-5 text-[#243b31]" />
              </motion.div>
              <span className="text-2xl font-bold text-white">
                {translations.title}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {/* API Status Indicator */}
              <div className="flex items-center space-x-2 text-sm">
                {isLoading && (
                  <div className="flex items-center text-yellow-300">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Loading API...
                  </div>
                )}
                {!isUsingAPI && !isLoading && (
                  <div className="flex items-center text-blue-300">
                    <FileText className="h-3 w-3 mr-1" />
                    Using Static
                  </div>
                )}
                {error && (
                  <div className="flex items-center text-red-300">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    API Error
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  refreshTranslations();
                  toast.success("Translations refreshed successfully!");
                }}
                className="text-white hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Translations
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            {translations.title}
          </h1>
          <p className="text-gray-600">
            {translations.description}
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="data-[state=active]:bg-[#547455] data-[state=active]:text-white">
              {translations.tabs.uploadFiles}
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-[#547455] data-[state=active]:text-white">
              {translations.tabs.manageFiles}
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Translation Files</CardTitle>
                <CardDescription>
                  Upload JSON translation files for each language. Files will be validated and applied immediately.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Guidelines */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">{translations.upload.guidelines.title}</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>{translations.upload.guidelines.jsonFormat}</li>
                        <li>{translations.upload.guidelines.fileSize}</li>
                        <li>{translations.upload.guidelines.validJson}</li>
                        <li>{translations.upload.guidelines.replacement}</li>
                        <li>{translations.upload.guidelines.immediateEffect}</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Language Upload Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {languages.map((lang) => {
                    const progress = uploadProgress.find(p => p.language === lang.code);
                    return (
                      <Card key={lang.code} className="relative">
                        <CardHeader className="text-center">
                          <div className="text-4xl mb-2">{lang.flag}</div>
                          <CardTitle className="text-lg">{lang.name}</CardTitle>
                          <CardDescription>
                            {translations.upload.uploadDescription.replace('{language}', lang.name)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Upload Progress */}
                            {progress && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>{translations.upload.uploading}</span>
                                  <span>{translations.upload.progress.replace('{progress}', progress.progress.toString())}</span>
                                </div>
                                <Progress value={progress.progress} className="w-full" />
                                {progress.status === 'success' && (
                                  <div className="flex items-center text-green-600 text-sm">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    {translations.upload.success}
                                  </div>
                                )}
                                {progress.status === 'error' && (
                                  <div className="flex items-center text-red-600 text-sm">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {translations.upload.error}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* File Input */}
                            <div className="space-y-2">
                              <input
                                type="file"
                                accept=".json"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(lang.code, file);
                                  }
                                }}
                                className="hidden"
                                id={`upload-${lang.code}`}
                                disabled={progress?.status === 'uploading'}
                              />
                              <label
                                htmlFor={`upload-${lang.code}`}
                                className={`w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#547455] transition-colors ${
                                  progress?.status === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {progress?.status === 'uploading' ? translations.upload.uploading : translations.upload.selectFile}
                              </label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Translation Files</CardTitle>
                <CardDescription>
                  View, download, and manage existing translation files.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#547455] mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading files...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {languageFiles.map((file) => (
                      <Card key={file.language} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">
                              {languages.find(l => l.code === file.language)?.flag}
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {languages.find(l => l.code === file.language)?.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {file.exists ? (
                                  <>
                                    {translations.manage.fileUploaded} • {formatFileSize(file.size)} • {formatDate(file.lastModified)}
                                  </>
                                ) : (
                                  translations.manage.noFileUploaded
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {file.exists && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePreview(file.language)}
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  Preview
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleFileDownload(file.language)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  {translations.manage.download}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview Modal */}
            {previewData && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview: {languages.find(l => l.code === selectedLanguage)?.name}</CardTitle>
                  <CardDescription>
                    Preview of the translation file content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-auto">
                    <pre className="text-sm">
                      {JSON.stringify(previewData, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const page = () => {
  return (
    <IsAdminAuth>
      <TranslationManagementPage />
    </IsAdminAuth>
  );
};

export default page;
