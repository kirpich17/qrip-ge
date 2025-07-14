"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Calendar,
  MapPin,
  Users,
  Heart,
  Save,
  Eye,
  ImageIcon,
  Video,
  FileText,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function CreateMemorialPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    deathDate: "",
    biography: "",
    location: "",
    isPublic: true,
    profileImage: null,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-white hover:underline"
              >
                <ArrowLeft className="h-5 w-5 " />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  console.log("Preview memorial with current data:", formData);
                  // Handle preview logic - could open modal or navigate to preview
                  alert("Preview functionality - would show memorial preview");
                }}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                className="bg-[#547455] hover:bg-white hover:text-[#547455]"
                onClick={() => {
                  console.log("Save memorial:", formData);
                  // Handle save logic
                  alert("Memorial saved successfully!");
                }}
              >
                <Save className="h-4 w-4 " />
                Save Memorial
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Memorial
            </h1>
            <p className="text-gray-600">
              Honor your loved one with a beautiful digital memorial
            </p>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="family">Family Tree</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-[#547455]" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Enter the essential details about your loved one
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback className="text-2xl">
                        {formData.firstName[0]}
                        {formData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" className="mb-2 bg-transparent">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-sm text-gray-500">
                        Choose a beautiful photo to represent your loved one
                      </p>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Smith"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Date Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Birth Date
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                          handleInputChange("birthDate", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deathDate" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Date of Passing
                      </Label>
                      <Input
                        id="deathDate"
                        type="date"
                        value={formData.deathDate}
                        onChange={(e) =>
                          handleInputChange("deathDate", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Memorial Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="Tbilisi, Georgia"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="h-12"
                    />
                  </div>

                  {/* Biography */}
                  <div className="space-y-2">
                    <Label htmlFor="biography">Life Story</Label>
                    <Textarea
                      id="biography"
                      placeholder="Share the beautiful story of your loved one's life..."
                      value={formData.biography}
                      onChange={(e) =>
                        handleInputChange("biography", e.target.value)
                      }
                      className="min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Photos & Videos
                  </CardTitle>
                  <CardDescription>
                    Add meaningful photos and videos to celebrate their life
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Photo Upload */}
                    <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Add Photos
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Upload cherished memories
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            console.log("Upload photos");
                            // Handle photo upload
                            const input = document.createElement("input");
                            input.type = "file";
                            input.multiple = true;
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement)
                                .files;
                              console.log("Selected photos:", files);
                            };
                            input.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Photos
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Video Upload */}
                    <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <Video className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Add Videos
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Share video memories
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            console.log("Upload videos");
                            // Handle video upload
                            const input = document.createElement("input");
                            input.type = "file";
                            input.multiple = true;
                            input.accept = "video/*";
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement)
                                .files;
                              console.log("Selected videos:", files);
                            };
                            input.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Videos
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Documents
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Add important documents
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            console.log("Upload documents");
                            // Handle document upload
                            const input = document.createElement("input");
                            input.type = "file";
                            input.multiple = true;
                            input.accept = ".pdf,.doc,.docx,.txt";
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement)
                                .files;
                              console.log("Selected documents:", files);
                            };
                            input.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Files
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="family" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-500" />
                    Family Tree
                  </CardTitle>
                  <CardDescription>
                    Build a family tree to show relationships and connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Family Tree Builder
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Create connections between family members and show
                      relationships
                    </p>
                    <Button
                      className="bg-[#547455] hover:bg-[#243b31] text-white"
                      onClick={() => {
                        console.log("Start building family tree");
                        // Handle family tree builder
                        alert("Family Tree Builder - Coming Soon!");
                      }}
                    >
                      <Users className="h-4 w-4" />
                      Start Building Family Tree
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Settings</CardTitle>
                  <CardDescription>
                    Control who can view and interact with this memorial
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Public Memorial</Label>
                      <p className="text-sm text-gray-500">
                        Allow this memorial to appear in public directory
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPublic}
                      onCheckedChange={(checked) =>
                        handleInputChange("isPublic", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Allow Comments</Label>
                      <p className="text-sm text-gray-500">
                        Let visitors leave condolences and memories
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Get notified when someone visits or comments
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
