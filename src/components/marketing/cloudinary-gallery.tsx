"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";

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

      <div className="no-scrollbar -mx-6 flex max-w-full flex-nowrap gap-6 overflow-x-auto py-8 md:-mx-16 md:gap-10 md:px-0">
        {images.map((image, i) => (
          <GalleryItem key={i} image={image} index={i} />
        ))}
      </div>
    </SectionShell>
  );
};

const GalleryItem = ({ image, index }: { image: CloudinaryImage; index: number }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? -5 : 5, index % 2 === 0 ? 5 : -5]
  );

  return (
    <motion.div
      ref={ref}
      style={{ scale, rotate }}
      className="relative aspect-[4/5] w-[300px] flex-shrink-0 overflow-hidden rounded-3xl shadow-2xl md:w-[450px]"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-700 hover:scale-110"
        sizes="(max-width: 768px) 300px, 450px"
      />
      <div className="absolute inset-0 flex items-end bg-linear-to-t from-background/80 to-transparent p-6 opacity-0 transition-opacity duration-500 hover:opacity-100">
        <p className="text-sm uppercase tracking-widest text-foreground">{image.alt}</p>
      </div>
    </motion.div>
  );
};

export default CloudinaryGallery;
