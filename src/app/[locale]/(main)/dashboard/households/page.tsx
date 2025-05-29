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

// Mock data for households
const mockHouseholds = [
  {
    id: "1",
    family_head_name: "राम प्रसाद शर्मा",
    family_head_phone_no: "९८४५६७८९०१",
    ward_no: 5,
    total_members: 4,
    locality: "भुलभुले टोल",
  },
  {
    id: "2",
    family_head_name: "सीता कुमारी तामाङ",
    family_head_phone_no: "९८१२३४५६७८",
    ward_no: 3,
    total_members: 6,
    locality: "बसन्तपुर",
  },
  {
    id: "3",
    family_head_name: "हरि बहादुर गुरुङ",
    family_head_phone_no: "९८५६७८९०१२",
    ward_no: 7,
    total_members: 3,
    locality: "नयाँगाउँ",
  },
  {
    id: "4",
    family_head_name: "दिल माया राई",
    family_head_phone_no: "९८७१२३४५६७",
    ward_no: 2,
    total_members: 5,
    locality: "पुरानो बजार",
  },
];

export default function HouseholdsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHouseholds = mockHouseholds.filter(
    (household) =>
      household.family_head_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      household.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      household.family_head_phone_no.includes(searchQuery),
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">घरधुरी सूची</h1>
        <Button onClick={() => router.push("households/create")}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHouseholds.map((household) => (
          <Card
            key={household.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/households/${household.id}`)}
          >
            <CardHeader>
              <CardTitle>{household.family_head_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  वडा नं. {household.ward_no}, {household.locality}
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{household.family_head_phone_no}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>जम्मा सदस्य संख्या: {household.total_members}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/households/${household.id}/edit`);
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
    </div>
  );
}
