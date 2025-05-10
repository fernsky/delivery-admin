"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OlRoadMap from "./ol-road-map";
import { ImageGallery } from "./image-gallery";

interface ClientRoadDetailDisplayProps {
  road: any;
  roadTypeNepali: string;
  roadConditionNepali: string;
  drainageSystemNepali: string;
}

export function ClientRoadDetailDisplay({
  road,
  roadTypeNepali,
  roadConditionNepali,
  drainageSystemNepali,
}: ClientRoadDetailDisplayProps) {
  const [activeTab, setActiveTab] = useState<string>("map");

  const hasImages = road.media && road.media.length > 0;

  return (
    <div>
      <Tabs
        defaultValue="map"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">नक्शा</TabsTrigger>
          <TabsTrigger value="images" disabled={!hasImages}>
            तस्वीरहरू {hasImages && `(${road.media.length})`}
          </TabsTrigger>
        </TabsList>

        {/* Map Tab */}
        <TabsContent value="map" id="location-and-map">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>सडक नक्शा</CardTitle>
              <CardDescription>सडकको स्थान र मार्ग</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[500px] p-0 overflow-hidden rounded-b-lg">
              <OlRoadMap road={road} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab - Enhanced Gallery */}
        <TabsContent value="images" id="images">
          {hasImages ? (
            <ImageGallery images={road.media} alt={road.name} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>तस्वीरहरू उपलब्ध छैनन्</CardTitle>
                <CardDescription>
                  यस सडकको कुनै तस्वीर हालसम्म अपलोड गरिएको छैन
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
