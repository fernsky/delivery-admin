"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Factory, X } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MediaItem {
  id: string;
  url: string | null;
  fileName: string;
  title: string | null;
  description: string | null;
  isPrimary: boolean | null;
  displayOrder: number | null;
}

interface ProcessingCenterMediaProps {
  media: MediaItem[];
}

export function ProcessingCenterMedia({ media }: ProcessingCenterMediaProps) {
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  // Find the primary image, or use the first one if none is marked as primary
  const primaryImage = media.find((item) => item.isPrimary) || media[0];

  // Sort media by isPrimary (true first), then by displayOrder
  const sortedMedia = [...media].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;

    const orderA = a.displayOrder || 0;
    const orderB = b.displayOrder || 0;
    return orderA - orderB;
  });

  if (media.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center p-12">
            <Factory className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">कुनै फोटो उपलब्ध छैन</h3>
            <p className="text-muted-foreground text-center max-w-md">
              यस कृषि प्रशोधन केन्द्रको लागि कुनै फोटो अपलोड गरिएको छैन। सम्पादन
              पृष्ठमा गएर फोटो अपलोड गर्नुहोस्।
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Image Display */}
      {primaryImage && (
        <Card
          className="overflow-hidden cursor-pointer"
          onClick={() => setSelectedImage(primaryImage)}
        >
          <CardContent className="p-0 relative">
            <div className="w-full h-80 relative">
              {primaryImage.url ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.title || primaryImage.fileName}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Factory className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            {primaryImage.isPrimary && (
              <Badge className="absolute top-2 left-2" variant="secondary">
                मुख्य फोटो
              </Badge>
            )}
            {primaryImage.title && (
              <div className="p-4">
                <h3 className="font-medium">{primaryImage.title}</h3>
                {primaryImage.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {primaryImage.description}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Image Gallery */}
      {media.length > 1 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              सबै फोटोहरू ({media.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedMedia.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square cursor-pointer rounded-md overflow-hidden border"
                  onClick={() => setSelectedImage(item)}
                >
                  {item.url ? (
                    <Image
                      src={item.url}
                      alt={item.title || item.fileName}
                      fill
                      sizes="(max-width: 768px) 200px, 300px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Factory className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {item.isPrimary && (
                    <Badge
                      className="absolute top-2 left-2"
                      variant="secondary"
                    >
                      मुख्य
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Viewer Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black/90 border-0">
          <Button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50 bg-black/50"
            size="icon"
            variant="ghost"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-5 w-5 text-white" />
            <span className="sr-only">Close</span>
          </Button>

          <Carousel className="w-full max-h-[80vh]">
            <CarouselContent>
              {sortedMedia.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="flex items-center justify-center p-6"
                >
                  <div className="relative w-full h-[65vh] flex items-center justify-center">
                    {item.url ? (
                      <Image
                        src={item.url}
                        alt={item.title || item.fileName}
                        fill
                        sizes="80vw"
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Factory className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-white">फोटो लोड गर्न सकिएन</p>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-white bg-black/50 hover:bg-black/70 border-0" />
            <CarouselNext className="text-white bg-black/50 hover:bg-black/70 border-0" />
          </Carousel>

          {selectedImage &&
            (selectedImage.title || selectedImage.description) && (
              <div className="p-4 text-white">
                {selectedImage.title && (
                  <h4 className="font-medium text-lg">{selectedImage.title}</h4>
                )}
                {selectedImage.description && (
                  <p className="text-sm opacity-80 mt-1">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
