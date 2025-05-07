"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Building } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MediaFile {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  isPrimary?: boolean;
}

interface ReligiousPlaceMediaProps {
  religiousPlaceId: string;
  media: MediaFile[];
}

export function ReligiousPlaceMedia({
  religiousPlaceId,
  media,
}: ReligiousPlaceMediaProps) {
  const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null);

  if (!media || media.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
        <Building className="h-20 w-20 mx-auto opacity-10 mb-4" />
        <h3 className="text-lg font-semibold mb-2">कुनै फोटो उपलब्ध छैन</h3>
        <p>यस धार्मिक स्थलको कुनै फोटोहरू अपलोड गरिएको छैन।</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {media.map((item) => (
          <Card
            key={item.id}
            className={`relative cursor-pointer overflow-hidden shadow-md ${
              item.isPrimary ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedImage(item)}
          >
            <div className="relative h-64 w-full">
              <Image
                src={item.url}
                alt={item.title || "Religious place image"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              {item.isPrimary && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs">
                  मुख्य फोटो
                </div>
              )}
            </div>
            {(item.title || item.description) && (
              <div className="p-3 bg-white/80 absolute bottom-0 w-full">
                {item.title && <p className="font-medium">{item.title}</p>}
                {item.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            {selectedImage?.title && (
              <DialogTitle>{selectedImage.title}</DialogTitle>
            )}
            {selectedImage?.description && (
              <DialogDescription>{selectedImage.description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="relative h-[60vh] w-full">
            {selectedImage && (
              <Image
                src={selectedImage.url}
                alt={selectedImage.title || "Religious place image"}
                fill
                className="object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
