"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Home, Phone, Users } from "lucide-react";
import { api } from "@/trpc/react";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function HouseholdsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [wardFilter, setWardFilter] = useState<number | undefined>(undefined);
  const pageSize = 9; // Items per page

  // Fetch households data with pagination
  const { data, isLoading, error } = api.households.getHouseholds.useQuery({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    sortBy: "family_head_name",
    sortOrder: "asc",
    filters: {
      wardNo: wardFilter,
    },
  });

  // Filter households based on search query
  const filteredHouseholds =
    data?.households?.filter(
      (household) =>
        (household.family_head_name as string) ||
        " ".toLowerCase().includes(searchQuery.toLowerCase()) ||
        (household.locality as string)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (household.family_head_phone_no as string).includes(searchQuery),
    ) || [];

  const totalPages = data?.meta ? Math.ceil(data.meta.total / pageSize) : 0;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">घरधुरी सूची</h1>
        <Button onClick={() => router.push("/dashboard/households/create")}>
          <Plus className="mr-2 h-4 w-4" />
          नयाँ घरधुरी थप्नुहोस्
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="परिवार मूलीको नाम, फोन नम्बर, वा स्थान द्वारा खोज्नुहोस्"
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-500">
            डाटा प्राप्त गर्न त्रुटि भयो
          </h2>
          <p className="mt-2">कृपया पछि फेरि प्रयास गर्नुहोस्</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHouseholds.map((household) => (
              <Card
                key={household.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  router.push(`/dashboard/households/${household.id}`)
                }
              >
                <CardHeader>
                  <CardTitle>{household.family_head_name as string}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      वडा नं. {household.ward_no as string},{" "}
                      {household.locality as string}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{household.family_head_phone_no as string}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      जम्मा सदस्य संख्या: {household.total_members as string}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/households/edit/${household.id}`);
                    }}
                  >
                    विवरण सम्पादन
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredHouseholds.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-muted-foreground">
                कुनै घरधुरी फेला परेन
              </h2>
              <p className="mt-2">
                खोज मापदण्ड परिवर्तन गर्नुहोस् वा नयाँ घरधुरी थप्नुहोस्
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
