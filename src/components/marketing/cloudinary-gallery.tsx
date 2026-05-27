"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import { Marquee } from "@/ui/marquee";

interface CloudinaryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const CloudinaryGallery = () => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/images/cohort");
        const data = await res.json();
        if (data.images) {
          setImages(data.images);
        }
      } catch (error) {
        console.error("Failed to fetch cohort images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <SectionShell className="border-b border-border/40 bg-background">
        <div className="flex h-96 items-center justify-center">Loading Gallery...</div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      className="overflow-x-hidden border-b border-border/40 bg-background"
      innerClassName="mb-0"
    >
      <SectionHeader
        eyebrow="Visual Impact"
        title={
          <>
            Documenting the{" "}
            <span className="font-heading italic text-primary">Movement</span> in the field.
          </>
        }
      />

      <div className="py-4">
        <Marquee pauseOnHover className="py-4 [--duration:40s] [--gap:1.5rem]">
          {images.map((image, i) => (
            <GalleryItem key={i} image={image} index={i} />
          ))}
        </Marquee>
      </div>
    </SectionShell>
  );
};

const GalleryItem = ({ image, index }: { image: CloudinaryImage; index: number }) => {
  return (
    <div
      className="relative aspect-[4/5] w-[260px] flex-shrink-0 overflow-hidden rounded-3xl border border-border bg-card shadow-lg md:w-[350px] transition-transform duration-500 hover:scale-[1.02]"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-700 hover:scale-105"
        sizes="(max-width: 768px) 260px, 350px"
      />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/35 to-transparent p-6 opacity-0 transition-opacity duration-300 hover:opacity-100">
        <p className="text-sm font-semibold uppercase tracking-widest text-white">{image.alt}</p>
      </div>
    </div>
  );
};

export default CloudinaryGallery;
