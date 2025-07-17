"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Heart,
  MapPin,
  Calendar,
  Eye,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Header from "@/components/header/page";
import { useTranslation } from "@/hooks/useTranslate";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const { t } = useTranslation();
  const directoryTranslations = t("directory");
  const memorials = [
    {
      id: "qr001",
      name: "John Smith",
      dates: "1945 - 2023",
      image: "/placeholder.svg?height=100&width=100",
      location: "Tbilisi, Georgia",
      views: 245,
      description:
        "Beloved father, grandfather, and community leader who dedicated his life to education.",
      tags: ["Teacher", "Community Leader"],
    },
    {
      id: "qr002",
      name: "Mary Johnson",
      dates: "1952 - 2024",
      image: "/placeholder.svg?height=100&width=100",
      location: "Batumi, Georgia",
      views: 189,
      description:
        "Loving mother and talented artist who brought beauty to the world through her paintings.",
      tags: ["Artist", "Mother"],
    },
    {
      id: "qr003",
      name: "Robert Wilson",
      dates: "1938 - 2023",
      image: "/placeholder.svg?height=100&width=100",
      location: "Kutaisi, Georgia",
      views: 156,
      description:
        "War veteran and devoted husband who served his country with honor and dignity.",
      tags: ["Veteran", "Husband"],
    },
    {
      id: "qr004",
      name: "Anna Georgadze",
      dates: "1960 - 2024",
      image: "/placeholder.svg?height=100&width=100",
      location: "Tbilisi, Georgia",
      views: 203,
      description:
        "Renowned doctor who saved countless lives and mentored young medical professionals.",
      tags: ["Doctor", "Mentor"],
    },
    {
      id: "qr005",
      name: "David Kvirikashvili",
      dates: "1955 - 2023",
      image: "/placeholder.svg?height=100&width=100",
      location: "Rustavi, Georgia",
      views: 134,
      description:
        "Passionate musician and composer who enriched Georgian cultural heritage.",
      tags: ["Musician", "Composer"],
    },
    {
      id: "qr006",
      name: "Elena Chavchavadze",
      dates: "1948 - 2024",
      image: "/placeholder.svg?height=100&width=100",
      location: "Gori, Georgia",
      views: 178,
      description:
        "Dedicated teacher and children's book author who inspired generations of young minds.",
      tags: ["Teacher", "Author"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {directoryTranslations.header.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {directoryTranslations.header.description}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder={directoryTranslations.search.placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <div className="flex gap-3">
                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {
                          directoryTranslations.search.locationFilter.options
                            .all
                        }
                      </SelectItem>
                      <SelectItem value="tbilisi">
                        {
                          directoryTranslations.search.locationFilter.options
                            .tbilisi
                        }
                      </SelectItem>
                      <SelectItem value="batumi">
                        {
                          directoryTranslations.search.locationFilter.options
                            .batumi
                        }
                      </SelectItem>
                      <SelectItem value="kutaisi">
                        {
                          directoryTranslations.search.locationFilter.options
                            .kutaisi
                        }
                      </SelectItem>
                      <SelectItem value="rustavi">
                        {
                          directoryTranslations.search.locationFilter.options
                            .rustavi
                        }
                      </SelectItem>
                      <SelectItem value="gori">
                        {
                          directoryTranslations.search.locationFilter.options
                            .gori
                        }
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {directoryTranslations.search.yearFilter.options.all}
                      </SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            {directoryTranslations.results.count.replace(
              "{count}",
              memorials.length
            )}
          </p>
        </motion.div>

        {/* Memorial Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {memorials.map((memorial) => (
            <motion.div key={memorial.id} variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="h-16 w-16 ring-2 ring-gray-100">
                      <AvatarImage src={memorial.image || "/placeholder.svg"} />
                      <AvatarFallback>
                        {memorial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {memorial.name}
                      </h3>
                      <p className="text-gray-600 flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {memorial.dates}
                      </p>
                      <p className="text-gray-500 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {memorial.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {memorial.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {memorial.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      {memorial.views}{" "}
                      {directoryTranslations.memorialCard.views}
                    </div>
                    <Link href={`/memorial/${memorial.id}`}>
                      <Button size="sm" className="">
                        <Heart className="h-4 w-4 mr-1" />
                        {directoryTranslations.memorialCard.visitButton}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg">
            {directoryTranslations.loadMore}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// "directory": {
//     "header": {
//       "title":
//       "description":
//     },
//     "search": {
//       "placeholder":
//       "locationFilter": {
//         "label":
//         "options": {
//           "all":
//           "tbilisi":
//           "batumi":
//           "kutaisi":
//           "rustavi":
//           "gori":
//         }
//       },
//       "yearFilter": {
//         "label":
//         "options": {
//           "all":
//           "2024":
//           "2023":
//           "2022":
//         }
//       }
//     },
//     "results": {
//       "count":
//     },
//     "memorialCard": {
//       "visitButton":
//       "views":
//     },
//     "loadMore":
//   }
