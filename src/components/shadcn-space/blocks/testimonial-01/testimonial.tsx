"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useInView } from "motion/react";
import { cn } from "@/utils";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";

function EngagementPhotoCard({
  image,
  imagePosition = "center",
  quote,
  name,
  role,
  className,
}: {
  image: string;
  imagePosition?: string;
  quote: string;
  name: string;
  role: string;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border border-border p-0 md:min-h-96",
        className,
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('${image}')`,
          backgroundPosition: imagePosition,
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-black/95 via-black/72 to-transparent" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] backdrop-blur-[2px] supports-[backdrop-filter]:backdrop-blur-md"
        style={{
          maskImage: "linear-gradient(to top, black 52%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 52%, transparent 100%)",
        }}
      />

      <CardContent className="relative z-10 flex h-full min-h-80 flex-col justify-between p-6 md:p-8 lg:p-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/75">
          Citizen engagements
        </p>

        <div className="space-y-5 pt-8">
          <p className="max-w-3xl text-lg font-medium leading-relaxed text-white md:text-xl lg:text-[1.65rem] lg:leading-snug">
            {quote}
          </p>
          <div className="space-y-1">
            <p className="text-base font-medium text-white">{name}</p>
            <p className="text-sm text-white/65">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef} className="py-10">
      <div className="max-w-7xl mx-auto px-4 xl:px-16">
        <div className="flex flex-col items-center self-stretch gap-12">
          <motion.div
            initial={{ opacity: 0, y: -32 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -32 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center gap-2 sm:gap-4"
          >
            <Badge
              variant={"outline"}
              className="py-1 px-3 text-sm font-normal h-7"
            >
              Testimonials
            </Badge>
            <h2 className="text-foreground text-3xl sm:text-5xl font-medium max-w-xs sm:max-w-2xl mx-auto text-center">
              What Kenyans are saying about transparent budgets
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
              className="col-span-1 lg:col-span-8"
            >
              <EngagementPhotoCard
                image={BNS_COMMUNITY_IMAGES.forumA}
                imagePosition="center top"
                quote="Budget Ndio Story made the national budget understandable for my community. Now we can actually track where our tax money is going."
                name="Grace Wanjiku"
                role="Community Organizer, Nakuru"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
              className="col-span-1 lg:col-span-4"
            >
              <Card className="relative h-full w-full overflow-hidden rounded-2xl border border-border p-8 md:min-h-96">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(15, 81, 50, 0.92) 0%, rgba(22, 94, 58, 0.88) 28%, rgba(122, 28, 42, 0.82) 58%, rgba(18, 18, 18, 0.94) 100%)",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_32%,rgba(255,255,255,0.06)_50%,transparent_68%)]" />
                <CardContent className="relative z-10 flex h-full flex-col items-start justify-between gap-24 p-0">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/75">
                    Facts & numbers
                  </p>
                  <div className="flex flex-col items-start gap-4">
                    <p className="text-4xl font-medium text-white lg:text-5xl">
                      78%
                    </p>
                    <p className="text-xl font-medium text-white/95 lg:text-2xl">
                      of Kenyans want easier budget access.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              className="col-span-1 lg:col-span-4"
            >
              <Card className="bg-gray-950 border border-border h-full w-full p-8 rounded-2xl">
                <CardContent className="flex flex-col items-start justify-between gap-6 p-0 h-full">
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-white/70 text-base font-normal">
                      Citizen engagements
                    </p>
                    <p className="text-white text-xl lg:text-2xl font-medium">
                      Their budget explainers helped our students understand
                      fiscal policy for the first time!
                    </p>
                  </div>
                  <img
                    src={BNS_COMMUNITY_IMAGES.cohortA}
                    alt="BNS cohort civic engagement session"
                    width={"100%"}
                    height={220}
                    className="rounded-xl object-cover"
                  />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              className="col-span-1 lg:col-span-8"
            >
              <EngagementPhotoCard
                image={BNS_COMMUNITY_IMAGES.stakeholdersC}
                imagePosition="center 20%"
                quote="Budget Ndio Story is bridging the gap between policy and people. Every Kenyan deserves to understand how public funds are spent."
                name="Nelly Maina"
                role="Lead Podcast Host, Budget Ndio Story"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
