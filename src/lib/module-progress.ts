export interface ModuleProgress {
  currentStep: number;
  stepsCompleted: Record<number, boolean>;
  masteryAwarded: boolean;
  articleRead: boolean;
  quizAttempts: number;
  quizCooldown: string | null;
  triviaRewards: string[];
  videosWatched: Record<number, boolean>;
  chaptersRead: Record<number, boolean>;
}

const defaultProgress = (): ModuleProgress => ({
  currentStep: 0,
  stepsCompleted: {},
  masteryAwarded: false,
  articleRead: false,
  quizAttempts: 0,
  quizCooldown: null,
  triviaRewards: [],
  videosWatched: {},
  chaptersRead: {},
});

function blobKey(slug: string): string {
  return `bns_module_${slug}_progress`;
}

function migrateLegacy(slug: string, order: number, progress: ModuleProgress): ModuleProgress {
  if (typeof localStorage === "undefined" || typeof localStorage.getItem !== "function") {
    return progress;
  }
  const migrated = { ...progress };
  let dirty = false;

  const currentStep = localStorage.getItem(`stage_${order}_current_step`);
  if (currentStep !== null) {
    migrated.currentStep = parseInt(currentStep, 10) || 0;
    localStorage.removeItem(`stage_${order}_current_step`);
    dirty = true;
  }

  const masteryKey = `stage_${order}_mastery_awarded`;
  if (localStorage.getItem(masteryKey) === "true") {
    migrated.masteryAwarded = true;
    localStorage.removeItem(masteryKey);
    dirty = true;
  }

  const articleKey = `stage_${order}_article`;
  if (localStorage.getItem(articleKey) === "true") {
    migrated.articleRead = true;
    localStorage.removeItem(articleKey);
    dirty = true;
  }

  const quizAttempts = localStorage.getItem(`stage_${order}_quiz_attempts`);
  if (quizAttempts !== null) {
    migrated.quizAttempts = parseInt(quizAttempts, 10) || 0;
    localStorage.removeItem(`stage_${order}_quiz_attempts`);
    dirty = true;
  }

  const quizCooldown = localStorage.getItem(`stage_${order}_quiz_cooldown`);
  if (quizCooldown !== null) {
    migrated.quizCooldown = quizCooldown;
    localStorage.removeItem(`stage_${order}_quiz_cooldown`);
    dirty = true;
  }

  for (let j = 0; j < 10; j++) {
    const triviaPassed = localStorage.getItem(`stage_${order}_step_${j}_trivia_passed`);
    if (triviaPassed === "true") {
      migrated.stepsCompleted[j] = true;
      localStorage.removeItem(`stage_${order}_step_${j}_trivia_passed`);
      dirty = true;
    }

    const rewardKey = `stage_${order}_step_${j}_trivia_${j}_reward`;
    if (localStorage.getItem(rewardKey) === "true") {
      if (!migrated.triviaRewards.includes(`${j}_${j}`)) {
        migrated.triviaRewards.push(`${j}_${j}`);
      }
      localStorage.removeItem(rewardKey);
      dirty = true;
    }

    const videoKey = `stage_${order}_video_${j}`;
    if (localStorage.getItem(videoKey) === "true") {
      migrated.videosWatched[j] = true;
      localStorage.removeItem(videoKey);
      dirty = true;
    }

    const chapterKey = `stage_${order}_chapter_${j}`;
    if (localStorage.getItem(chapterKey) === "true") {
      migrated.chaptersRead[j] = true;
      localStorage.removeItem(chapterKey);
      dirty = true;
    }
  }

  if (dirty) {
    writeProgress(slug, migrated);
  }
  return migrated;
}

export function readProgress(slug: string, order: number): ModuleProgress {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(blobKey(slug));
  } catch { /* noop */ }

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<ModuleProgress>;
      const progress = { ...defaultProgress(), ...parsed };
      return migrateLegacy(slug, order, progress);
    } catch {
      localStorage.removeItem(blobKey(slug));
    }
  }

  const fresh = defaultProgress();
  return migrateLegacy(slug, order, fresh);
}

export function writeProgress(slug: string, progress: ModuleProgress): void {
  try {
    localStorage.setItem(blobKey(slug), JSON.stringify(progress));
  } catch { /* noop */ }
}

export function clearAllModuleProgress(stages: { slug: string; order: number }[]): void {
  const legacyCleanupPatterns: string[] = [];
  for (const s of stages) {
    localStorage.removeItem(blobKey(s.slug));
    legacyCleanupPatterns.push(
      `stage_${s.order}_current_step`,
      `stage_${s.order}_mastery_awarded`,
      `stage_${s.order}_article`,
      `stage_${s.order}_quiz_attempts`,
      `stage_${s.order}_quiz_cooldown`,
    );
    for (let j = 0; j < 10; j++) {
      legacyCleanupPatterns.push(
        `stage_${s.order}_video_${j}`,
        `stage_${s.order}_chapter_${j}`,
        `stage_${s.order}_step_${j}_trivia_passed`,
        `stage_${s.order}_step_${j}_trivia_${j}_reward`,
      );
    }
  }
  for (const key of legacyCleanupPatterns) {
    localStorage.removeItem(key);
  }
}
