"use client";

import React, { useState, useMemo } from "react";
import {
  getFocusCounties,
  getAllReports,
  getBetaPillars,
  getTrackedProjects,
  REPORTS_BULLETIN_DATA,
  searchBudgetQuestions,
} from "@/data/reports-bulletin";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";
import { ReportsHeroStatement } from "./reports-hero-statement";
import { NationalPictureSpread } from "./national-picture-spread";
import { CountyIntelligenceExplorer } from "./county-intelligence-explorer";
import { FollowTheMoneyPipeline } from "./follow-the-money-pipeline";
import { FeaturedInvestigationsSpread } from "./featured-investigations-spread";
import { CitizenIntelligenceHeroSearch } from "./citizen-intelligence-hero-search";
import { ReportLibraryArchive } from "./report-library-archive";

export function ReportsHubClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProgramme, setSelectedProgramme] = useState("All");
  const [selectedCounty, setSelectedCounty] = useState("All");

  const focusCounties = useMemo(() => getFocusCounties(), []);
  const allReports = useMemo(() => getAllReports(), []);
  const betaPillars = useMemo(() => getBetaPillars(), []);
  const trackedProjects = useMemo(() => getTrackedProjects(), []);
  const hubMeta = REPORTS_BULLETIN_DATA.hubMeta;

  const { matchingQuestions } = useMemo(() => {
    return searchBudgetQuestions(
      searchQuery,
      selectedCategory,
      selectedCounty,
      selectedProgramme,
    );
  }, [searchQuery, selectedCategory, selectedCounty, selectedProgramme]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <main className={cn(SECTION_SHELL_PADDING, SECTION_SHELL_INNER, "space-y-16 pt-24 md:pt-28")}>
        {/* HERO STATEMENT & NARRATIVE SPINE NAV */}
        <ReportsHeroStatement hubMeta={hubMeta} />

        {/* 01 & 02: NATIONAL PICTURE & WHAT CHANGED */}
        <NationalPictureSpread />

        {/* 03: COUNTY INTELLIGENCE EXPLORER */}
        <CountyIntelligenceExplorer focusCounties={focusCounties} />

        {/* 04: FOLLOW THE MONEY */}
        <FollowTheMoneyPipeline betaPillars={betaPillars} projects={trackedProjects} />

        {/* 05: FEATURED INVESTIGATIONS (ASYMMETRIC 1-LARGE + 2-SMALL) */}
        <FeaturedInvestigationsSpread reports={allReports} />

        {/* 06: CITIZEN INTELLIGENCE (HERO SEARCH & QUESTION RESOLUTION) */}
        <CitizenIntelligenceHeroSearch
          questions={matchingQuestions}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedProgramme={selectedProgramme}
          onProgrammeChange={setSelectedProgramme}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 07: REPORT LIBRARY ARCHIVE */}
        <ReportLibraryArchive reports={allReports} />
      </main>
    </div>
  );
}
