"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Settings, 
  Search,
  Filter,
  Trash2,
  Eye,
  Star,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { 
  getAdminTestimonials, 
  updateTestimonialStatus, 
  deleteTestimonial,
  getSiteSettings,
  updateSiteSettings,
  Testimonial,
  SiteSettings
} from "@/services/testimonialService";
import IsAdminAuth from "@/lib/IsAdminAuth/page";
import { useTranslation } from "@/hooks/useTranslate";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function TestimonialsAdmin() {
  const { t } = useTranslation();
  const router = useRouter();
  const adminTestimonialsTranslations = t("adminTestimonials");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await getAdminTestimonials(currentPage, 10, statusFilter === "all" ? undefined : statusFilter, searchTerm || undefined);
      if (response.status) {
        setTestimonials(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error: any) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await getSiteSettings();
      if (response.status) {
        setSettings(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings");
    }
  };

  useEffect(() => {
    fetchTestimonials();
    fetchSettings();
  }, [currentPage, statusFilter, searchTerm]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      setIsUpdating(true);
      const response = await updateTestimonialStatus(id, status);
      if (response.status) {
        toast.success(`Testimonial ${status} successfully`);
        fetchTestimonials();
      }
    } catch (error: any) {
      console.error("Error updating testimonial:", error);
      toast.error("Failed to update testimonial");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      setIsUpdating(true);
      const response = await deleteTestimonial(id);
      if (response.status) {
        toast.success("Testimonial deleted successfully");
        fetchTestimonials();
      }
    } catch (error: any) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSettingsUpdate = async (newSettings: Partial<SiteSettings>) => {
    if (!settings) return;

    try {
      setIsUpdating(true);
      const response = await updateSiteSettings({
        ...settings,
        ...newSettings
      });
      if (response.status) {
        toast.success("Settings updated successfully");
        setSettings(response.data);
      }
    } catch (error: any) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />{adminTestimonialsTranslations?.table?.status?.approved}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />{adminTestimonialsTranslations?.table?.status?.rejected}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />{adminTestimonialsTranslations?.table?.status?.pending}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{adminTestimonialsTranslations?.header?.back || "Back"}</span>
              </Button>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-8 w-8 text-[#547455]" />
                <h1 className="text-2xl font-bold text-gray-900">{adminTestimonialsTranslations?.header?.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="testimonials" className="space-y-6">
          <TabsList>
            <TabsTrigger value="testimonials">{adminTestimonialsTranslations?.table?.headers?.testimonial}</TabsTrigger>
            <TabsTrigger value="settings">{adminTestimonialsTranslations?.settings?.title}</TabsTrigger>
          </TabsList>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={adminTestimonialsTranslations?.search?.placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder={adminTestimonialsTranslations?.search?.filterByStatus} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{adminTestimonialsTranslations?.search?.allStatus}</SelectItem>
                      <SelectItem value="pending">{adminTestimonialsTranslations?.search?.pending}</SelectItem>
                      <SelectItem value="approved">{adminTestimonialsTranslations?.search?.approved}</SelectItem>
                      <SelectItem value="rejected">{adminTestimonialsTranslations?.search?.rejected}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials List */}
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : testimonials.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{adminTestimonialsTranslations?.empty?.title}</h3>
                    <p className="text-gray-600">{adminTestimonialsTranslations?.empty?.description}</p>
                  </CardContent>
                </Card>
              ) : (
                testimonials.map((testimonial) => (
                  <motion.div key={testimonial._id} variants={fadeInUp} initial="initial" animate="animate">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-[#547455] rounded-full flex items-center justify-center text-white font-bold">
                                {testimonial.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                                <p className="text-sm text-gray-600">{testimonial.location}</p>
                              </div>
                              {getStatusBadge(testimonial.status)}
                            </div>
                            
                            <p className="text-gray-700 italic mb-3">"{testimonial.text}"</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {renderStars(testimonial.rating)}
                              <span>{adminTestimonialsTranslations?.table?.headers?.submitted}: {new Date(testimonial.submittedAt).toLocaleDateString()}</span>
                              {testimonial.approvedAt && (
                                <span>{adminTestimonialsTranslations?.table?.status?.approved}: {new Date(testimonial.approvedAt).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {testimonial.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(testimonial._id, 'approved')}
                                  disabled={isUpdating}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  {adminTestimonialsTranslations?.table?.actions?.approve}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleStatusUpdate(testimonial._id, 'rejected')}
                                  disabled={isUpdating}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  {adminTestimonialsTranslations?.table?.actions?.reject}
                                </Button>
                              </>
                            )}
                            {testimonial.status === 'approved' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(testimonial._id, 'pending')}
                                disabled={isUpdating}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                {adminTestimonialsTranslations?.table?.actions?.markPending}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(testimonial._id)}
                              disabled={isUpdating}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              {adminTestimonialsTranslations?.table?.actions?.delete}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  {adminTestimonialsTranslations?.pagination?.previous}
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  {adminTestimonialsTranslations?.pagination?.pageInfo?.replace('{currentPage}', currentPage.toString()).replace('{totalPages}', totalPages.toString())}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  {adminTestimonialsTranslations?.pagination?.next}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {adminTestimonialsTranslations?.settings?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{adminTestimonialsTranslations?.settings?.enableSection}</h3>
                        <p className="text-sm text-gray-600">{adminTestimonialsTranslations?.settings?.enableSectionDescription}</p>
                      </div>
                      <Switch
                        checked={settings.testimonialsEnabled}
                        onCheckedChange={(checked) => handleSettingsUpdate({ testimonialsEnabled: checked })}
                        disabled={isUpdating}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{adminTestimonialsTranslations?.settings?.autoApprove}</h3>
                        <p className="text-sm text-gray-600">{adminTestimonialsTranslations?.settings?.autoApproveDescription}</p>
                      </div>
                      <Switch
                        checked={settings.testimonialsAutoApprove}
                        onCheckedChange={(checked) => handleSettingsUpdate({ testimonialsAutoApprove: checked })}
                        disabled={isUpdating}
                      />
                    </div>


                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {adminTestimonialsTranslations?.settings?.maxDisplay}
                      </label>
                      <Select
                        value={settings.testimonialsMaxDisplay?.toString() || "5"}
                        onValueChange={(value) => handleSettingsUpdate({ testimonialsMaxDisplay: parseInt(value) })}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select count" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const TestimonialsAdminPage = () => {
  return (
    <IsAdminAuth>
      <TestimonialsAdmin />
    </IsAdminAuth>
  );
};

export default TestimonialsAdminPage;
