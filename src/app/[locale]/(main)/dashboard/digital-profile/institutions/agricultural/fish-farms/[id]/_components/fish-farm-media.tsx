"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Fish } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FishFarmMediaProps {
  fishFarmId: string;
  media: Array<{
    id: string;
    url: string | null;
    title: string | null;
    description: string | null;
    isPrimary?: boolean | null;
  }>;
}

export function FishFarmMedia({ fishFarmId, media }: FishFarmMediaProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const sortedMedia = [...media].sort((a, b) => {
    // Primary media first
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return 0;
  });

  const handleSelect = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5 text-muted-foreground" />
          माछा फार्म फोटोहरू
        </CardTitle>
      </CardHeader>
      <CardContent>
        {media.length > 0 ? (
          <div className="space-y-4">
            <Carousel
              className="w-full"
              setApi={setApi}
              onSelect={(api) => setCurrent(api.selectedScrollSnap())}
            >
              <CarouselContent>
                {sortedMedia.map((item) => (
                  <CarouselItem key={item.id}>
                    <div className="rounded-xl overflow-hidden border">
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={item.url || ""}
                          alt={item.title || "Fish farm photo"}
                          fill
                          priority
                          className="object-cover"
                        />
                      </AspectRatio>
                    </div>
                    {(item.title || item.description) && (
                      <div className="mt-2 p-2">
                        {item.title && (
                          <p className="font-medium">{item.title}</p>
                        )}
                        {item.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                        {item.isPrimary && (
                          <Badge variant="outline" className="mt-1">
                            मुख्य फोटो
                          </Badge>
                        )}
                      </div>
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center gap-2 mt-3">
                <CarouselPrevious variant="outline" />
                <div className="text-muted-foreground text-sm">
                  {current + 1} / {media.length}
                </div>
                <CarouselNext variant="outline" />
              </div>
            </Carousel>

            {/* Thumbnails */}
            <div className="flex flex-wrap gap-2">
              {sortedMedia.map((item, index) => (
                <div
                  key={`thumb-${item.id}`}
                  className={cn(
                    "w-16 h-16 rounded-md overflow-hidden border cursor-pointer",
                    current === index
                      ? "border-primary border-2"
                      : "border-border",
                  )}
                  onClick={() => handleSelect(index)}
                >
                  <Image
                    src={item.url || ""}
                    alt={item.title || "Thumbnail"}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Fish className="h-12 w-12 mb-2 opacity-20" />
            <p>कुनै फोटो उपलब्ध छैन</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
