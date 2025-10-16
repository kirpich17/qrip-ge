"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslate';

// Individual Memorial Card Component
const MemorialCard = ({ memorial }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Link href={`/memorial/${memorial._id}`} key={memorial._id} target='_blank'>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2 flex flex-col h-full cursor-pointer">
        <div className="h-48 bg-gray-200 flex-shrink-0">
          {memorial.profileImage ? (
            <img 
              src={memorial.profileImage} 
              alt={`${memorial.firstName} ${memorial.lastName}`} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {memorial.firstName} {memorial.lastName}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDate(memorial.birthDate)} - {formatDate(memorial.deathDate)}
          </p>
          {memorial.location && (
            <p className="text-sm text-gray-600 mt-2">{memorial.location}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

// Main Public Memorials Component
export default function PublicMemorials() {
  const { t } = useTranslation();
  const publicMemorialsTranslations = t("publicMemorials");
  const publicMemorialsManage = publicMemorialsTranslations;

  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  
  // State for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    const fetchMemorials = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}api/admin/allmemorials?page=${currentPage}&limit=${limit}&search=${searchTerm}&isPagination=true&isPublic=true&sortBy=${sortBy}`;
        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.status) {
          let fetchedMemorials = response.data.memorials || [];

          if (sortBy === 'a-z') {
            fetchedMemorials.sort((a, b) => 
              `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
            );
          } else {
            fetchedMemorials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          }

          const filteredMemorials = fetchedMemorials.filter(
            (memorial: any) => memorial.firstName !== "Untitled"
          );

          setMemorials(filteredMemorials);
          setError(null); // Clear any previous errors

          if (response.data.pagination) {
            setTotalPages(response.data.pagination.totalPages);
            setCurrentPage(response.data.pagination.currentPage);
          }
        } else if (response.data && response.data.status === false && response.data.message === "No memorials found") {
          // API returned "No memorials found" - this is normal, not an error
          setMemorials([]);
          setError(null);
        } else {
          // If no data returned, show no memorials message instead of error
          setMemorials([]);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching memorials:", err);
        
        // Check if it's a 404 with "No memorials found" message (normal case)
        if (err.response?.status === 404 && err.response?.data?.message === "No memorials found") {
          setMemorials([]);
          setError(null);
        } else {
          // Real error (network, server error, etc.)
          setError(publicMemorialsManage.error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMemorials();
  }, [searchTerm, sortBy, currentPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };
  
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  // Format pagination text with current values
  const pageInfoText = publicMemorialsManage.pagination?.pageInfo
    ?.replace('{currentPage}', currentPage)
    ?.replace('{totalPages}', totalPages);

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          {publicMemorialsManage.title}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {publicMemorialsManage.description}
        </p>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <input
            type="search"
            placeholder={publicMemorialsManage.searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-gray-700">
              {publicMemorialsManage.sortByLabel}
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="recent">{publicMemorialsManage.sortOptions?.recent}</option>
              <option value="a-z">{publicMemorialsManage.sortOptions?.az}</option>
            </select>
          </div>
        </div>

        {/* Memorials Grid and Loading/Error States */}
        {loading ? (
          <p className="text-center py-10">{publicMemorialsManage.loading}</p>
        ) : error ? (
          <p className="text-center text-red-500 py-10">{error}</p>
        ) : memorials.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {memorials.map((memorial) => (
                <MemorialCard key={memorial._id} memorial={memorial} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  {publicMemorialsManage.pagination?.previous}
                </Button>
                <span className="text-sm text-gray-700">
                  {pageInfoText}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  {publicMemorialsManage.pagination?.next}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center py-10">{publicMemorialsManage.noMemorials}</p>
        )}
      </div>
    </div>
  );
}