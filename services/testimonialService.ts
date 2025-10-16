import axiosInstance from './axiosInstance';

export interface Testimonial {
  _id: string;
  name: string;
  email: string;
  location: string;
  text: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  avatar?: string;
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: {
    _id: string;
    firstname: string;
    lastname: string;
  };
}

export interface TestimonialSubmission {
  name: string;
  email: string;
  location: string;
  text: string;
  rating?: number;
}

export interface SiteSettings {
  _id: string;
  testimonialsEnabled: boolean;
  testimonialsMaxDisplay: number;
  testimonialsAutoApprove: boolean;
  lastUpdated: string;
  updatedBy: string;
}

export interface TestimonialResponse {
  status: boolean;
  message: string;
  data: Testimonial[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/**
 * Submit a new testimonial
 */
export const submitTestimonial = async (testimonialData: TestimonialSubmission) => {
  try {
    const response = await axiosInstance.post('/api/testimonials/submit', testimonialData);
    return response.data;
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    throw error;
  }
};

/**
 * Get public testimonials for display
 */
export const getPublicTestimonials = async (limit: number = 3) => {
  try {
    const response = await axiosInstance.get('/api/testimonials/public', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching public testimonials:', error);
    throw error;
  }
};

/**
 * Get all testimonials for admin (with pagination)
 */
export const getAdminTestimonials = async (page: number = 1, limit: number = 10, status?: string, search?: string) => {
  try {
    const response = await axiosInstance.get('/api/testimonials/admin', {
      params: { page, limit, status, search }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin testimonials:', error);
    throw error;
  }
};

/**
 * Update testimonial status
 */
export const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
  try {
    const response = await axiosInstance.put(`/api/testimonials/admin/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating testimonial status:', error);
    throw error;
  }
};

/**
 * Delete testimonial
 */
export const deleteTestimonial = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/api/testimonials/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

/**
 * Get public site settings (for frontend display)
 */
export const getPublicSiteSettings = async (): Promise<{ status: boolean; data: { testimonialsEnabled: boolean; testimonialsMaxDisplay: number } }> => {
  try {
    const response = await axiosInstance.get('/api/testimonials/public/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching public site settings:', error);
    throw error;
  }
};

/**
 * Get site settings (admin only)
 */
export const getSiteSettings = async (): Promise<{ status: boolean; data: SiteSettings }> => {
  try {
    const response = await axiosInstance.get('/api/testimonials/admin/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    throw error;
  }
};

/**
 * Update site settings
 */
export const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
  try {
    const response = await axiosInstance.put('/api/testimonials/admin/settings', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }
};
