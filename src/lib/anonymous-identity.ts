export const PATRIOTIC_WORDS = [
  "halisi", "daima", "mzalendo", "huruma", "amani", "umoja",
  "saba", "azimio", "uhuru", "harambee", "nyayo", "ishara",
  "mwangaza", "nuru", "fahari", "heshima", "taifa", "shujaa",
] as const;

export type AvatarGender = "female" | "male";

const ROTATION_STORAGE_KEY = "bns_identity_rotation_state";

type RotationState = {
  usedNames: string[];
  avatarOrder: AvatarGender[];
  refreshCount: number;
};

function loadRotationState(): RotationState {
  if (typeof window === "undefined") {
    return { usedNames: [], avatarOrder: ["female", "male"], refreshCount: 0 };
  }
  try {
    const raw = window.localStorage.getItem(ROTATION_STORAGE_KEY);
    if (!raw) return { usedNames: [], avatarOrder: ["female", "male"], refreshCount: 0 };
    const parsed = JSON.parse(raw) as RotationState;
    return {
      usedNames: Array.isArray(parsed.usedNames) ? parsed.usedNames : [],
      avatarOrder: parsed.avatarOrder?.length === 2 ? parsed.avatarOrder : ["female", "male"],
      refreshCount: typeof parsed.refreshCount === "number" ? parsed.refreshCount : 0,
    };
  } catch {
    return { usedNames: [], avatarOrder: ["female", "male"], refreshCount: 0 };
  }
}

function saveRotationState(state: RotationState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ROTATION_STORAGE_KEY, JSON.stringify(state));
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateName(word: string, attempt = 0): string {
  const suffix =
    attempt % 2 === 0
      ? String(Math.floor(Math.random() * 9000) + 1000)
      : Math.random().toString(36).slice(2, 6);
  return `mkenya${word}${suffix}`;
}

export function pickUniqueWords(
  words: readonly string[],
  count: number,
  exclude: string[] = [],
): string[] {
  const pool = words.filter((word) => !exclude.includes(word));
  const shuffled = shuffle(pool.length >= count ? pool : [...words]);
  const picked: string[] = [];
  for (const word of shuffled) {
    if (!picked.includes(word)) picked.push(word);
    if (picked.length === count) break;
  }
  return picked;
}

export function generateUniqueNamePair(
  words: readonly string[] = PATRIOTIC_WORDS,
  usedNames: string[] = [],
): [string, string] {
  let attempt = 0;
  while (attempt < 40) {
    const [wordA, wordB] = pickUniqueWords(words, 2);
    const nameA = generateName(wordA, attempt);
    const nameB = generateName(wordB, attempt + 1);
    if (
      nameA !== nameB &&
      !usedNames.includes(nameA) &&
      !usedNames.includes(nameB)
    ) {
      return [nameA, nameB];
    }
    attempt += 1;
  }
  const fallbackA = generateName("raia", attempt);
  const fallbackB = generateName("taifa", attempt + 1);
  return [fallbackA, fallbackB];
}

export function nextAvatarOrder(refreshCount: number): AvatarGender[] {
  return refreshCount % 2 === 0 ? ["female", "male"] : ["male", "female"];
}

export function createRotatedIdentitySuggestions(): {
  names: [string, string];
  avatarOrder: AvatarGender[];
  state: RotationState;
} {
  const state = loadRotationState();
  const names = generateUniqueNamePair(PATRIOTIC_WORDS, state.usedNames);
  const avatarOrder = nextAvatarOrder(state.refreshCount);
  return { names, avatarOrder, state };
}

export function recordRotatedIdentitySuggestions(
  state: RotationState,
  names: [string, string],
): RotationState {
  const nextState: RotationState = {
    usedNames: [...new Set([...state.usedNames, ...names])].slice(-50),
    avatarOrder: nextAvatarOrder(state.refreshCount + 1),
    refreshCount: state.refreshCount + 1,
  };
  saveRotationState(nextState);
  return nextState;
}

export function recordSelectedIdentity(name: string): void {
  const state = loadRotationState();
  saveRotationState({
    ...state,
    usedNames: [...new Set([...state.usedNames, name])].slice(-50),
  });
}
