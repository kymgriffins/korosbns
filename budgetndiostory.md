# Budget Ndio Story (BNS) Civic Platform

## Overview
Budget Ndio Story (BNS) is a civic technology initiative and platform designed to empower citizens by making public finance, government budgets, and civic processes accessible, understandable, and engaging. The platform bridges the gap between complex public budget data and citizen awareness through interactive digital content, educational stories, and community feedback mechanisms. 

BNS sources its data directly from official, verified public records (such as national open data portals, ministry of finance publications, and treasury reports) to ensure reliability and trust.

## Core Mission & Objectives
The platform operates on the belief that transparent, understandable budgets lead to stronger citizen engagement and better governance. BNS accomplishes this through:
* **Democratizing Budget Data**: Translating dense budget sheets and policies into structured, readable articles and visual timelines.
* **Interactive Civic Education**: Engaging citizens through gamified learning (Trivia) and step-by-step narratives (Stories).
* **Two-Way Communication**: Gathering public feedback via user-friendly surveys and displaying aggregate results to foster community awareness.
* **Community Connection**: Managing civic events and keeping citizens informed through automated, tailored email updates.
* **Inclusivity & Accessibility**: Ensuring the platform is accessible to all citizens regardless of language, device capability, or network bandwidth.

---

## Core Platform Features

### 1. Interactive Civic Learning & Stories
* **Narrative Stories (Learn Hub)**: Step-by-step interactive educational journeys where users can explore public finance topics. Custom navigation logic manages pacing and transitions between units.
* **Knowledge Unit Collections**: Organized resources, definitions, and tutorials detailing public budget terms, local governance structures, and citizen rights.
* **Articles & Deep Dives**: A dynamic article archive containing policy analyses, news updates, and research findings, easily searchable and mapped for quick loading.

### 2. Public Engagement & Feedback
* **Civic Surveys**: Tools to gather community sentiment on budget priorities and civic events. 
  * Allows submissions from both anonymous visitors and authenticated members.
  * Computes and displays aggregate response data directly in the browser, encouraging open and transparent civic discourse.
* **Educational Trivia**: Gamified quizzes testing citizens' knowledge of budget allocations and public governance.
  * Instant scoring and submission verification.
  * Answer-tracking that displays selected versus correct choices upon completion.
  * Community leaderboards displaying top scores to promote engagement.

### 3. Event Management & Community Outreach
* **Public Event Directory**: Real-time listing of community dialogues, town halls, and learning unit events.
* **Media & Photo Galleries**: Dynamic links to post-event media galleries (e.g., cloud storage folders) integrated directly into event detail pages, allowing citizens who missed an event to review what occurred.
* **Event Lifecycle Notifications**: Cron-triggered notification systems dispatching reminders before events start and follow-ups after they end.

### 4. Public Newsletters & Campaigns
* **Subscription Management**: Secure sign-up and unsubscribe capabilities, ensuring citizens control their communications.
* **Campaign Builder**: Staff-composed outreach emails that can be drafted, previewed, scheduled, and dispatched to lists.
* **Welcome Automations**: Immediate email confirmations triggered upon subscription or resubscription.

### 5. Secure Onboarding & Profile Portals
* **Citizen Accounts**: Secure registration, token-based verification, and JWT session handling for secure login/logout.
* **Personalized Dashboard**: A profile management portal where citizens can bookmark resources, view their trivia scores, and set notification preferences.

### 6. Staff Operations & Administration
* **Role-Based Access Control (RBAC)**: Fine-grained permissions securing administration pages and ensuring only authorized staff can modify content or publish trivia/surveys.
* **Response Moderation**: Internal management grids to inspect survey responses and trivia statistics without needing database access.
* **Audit Trails & Platform Governance**: Robust backend audit logs recording organizational modifications, cron-locking to ensure scheduler stability, and API rate-limiting to protect resources.

### 7. Open Data API & Research Access
* **Read-Only Civic API**: Exposes anonymized, aggregated survey statistics and budget summaries. This allows journalists, civic researchers, and non-governmental organizations to query public datasets for advocacy and report generation.

---

## Technical Design & How We Do It
BNS utilizes a decoupled, modern web architecture designed for performance, modularity, and future adaptability:

### Decoupled Frontend-Backend Split
* **Backend API (Django)**: Serves as the single source of truth for business logic. It handles the relational database, processes API queries, executes background cron jobs, and manages mail/notification dispatch queues.
* **Citizen Client (Next.js)**: A responsive client application communicating asynchronously with the Django API. It features optimized asset loading, error recovery boundaries, and strict client-side state isolation.

### Framework-Agnostic Core Logic
To ensure longevity and allow the UI framework to change in the future, the citizen client decouples its core features:
* **Pure TypeScript Core**: The network adapters, authentication workflows, mapper functions, and validation checks are written in pure TypeScript. They contain no dependencies on React or Next.js.
* **Adapter / UI Layers**: Light React components and hooks connect this pure TypeScript core to the Next.js router, pages, and browser storage APIs.

### Data Privacy & Security Compliance
* **Encryption Standards**: All data is encrypted in transit using HTTPS (TLS 1.3) and at rest (database-level encryption).
* **Compliance Alignment**: Complies with the Kenya Data Protection Act 2019 and global GDPR frameworks. We follow data minimization guidelines, only collecting basic credential details (emails/usernames), hashing passwords via Argon2/BCrypt, and strictly partitioning citizen identities from anonymous survey responses.

### Accessibility & Inclusion Standards
* **A11y Compliance**: Designed to align with WCAG 2.1 AA standards, supporting screen readers, semantic HTML, and high-contrast color choices.
* **Localization Ready**: The architecture is translation-friendly, pre-configured to easily support Swahili, English, and other regional languages.
* **Low-Bandwidth Optimization**: Features minimal initial bundle sizes, image compression pipelines, and aggressive static asset caching to ensure fast loading on 3G networks and mobile devices.

### Infrastructure & Deployment Readiness
* **Containerized Deployment**: Ready for hosting in managed cloud environments (e.g., AWS, GCP, or Dokku/Docker-based setups).
* **Automated CI/CD Pipelines**: Integrates with continuous integration systems to automatically run TypeScript checks, Vitest core tests, Pytest backend tests, and build production artifacts before each release.

### Measuring Impact (KPIs)
* **Budget Literacy Growth**: Analytics comparing pre- and post-trivia assessment scores to track knowledge retention.
* **Civic Engagement Rates**: Monitored through survey completion percentages and event check-in/attendance metrics.
* **Communication Performance**: Tracking active newsletter subscriber growth, email open rates, and bounce metrics.
