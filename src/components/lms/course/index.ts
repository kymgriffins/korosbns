/**
 * @sdp-provenance
 * capability: CAP-course-detail
 * contracts: sic-cap-004@1.0.0
 */
export { CourseHero as JourneyHero } from "./course-hero";
export { JourneyMeta } from "./journey-meta";
export { JourneyBreadcrumb } from "./journey-breadcrumb";
export { LearningOutcomes } from "./learning-outcomes";
export { ModuleAccordion } from "./module-accordion";
export { CourseDetailSkeleton } from "./course-detail-skeleton";
export {
  formatJourneyTime,
  resolveLearningOutcomes,
  resolveDefaultOpenModule,
} from "./format-journey-time";
