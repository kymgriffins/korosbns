/**
 * Live Townhall Q&A & WebSocket Simulation Engine.
 * Enables live citizen questions, voting, and interactive polls during county budget hearings.
 */

export type TownhallQuestion = {
  id: string;
  authorName: string;
  county: string;
  questionText: string;
  upvotes: number;
  timestamp: string;
  isAnswered: boolean;
  officialResponse?: string;
};

export type LiveTownhallSession = {
  id: string;
  title: string;
  county: string;
  hostName: string;
  activeViewers: number;
  status: "LIVE" | "UPCOMING" | "ENDED";
  questions: TownhallQuestion[];
};

const DEFAULT_TOWNHALL_SESSION: LiveTownhallSession = {
  id: "townhall-2026-08",
  title: "Kakamega County FY2026/27 Healthcare & Agriculture Budget Hearing",
  county: "Kakamega",
  hostName: "BNS Mashinani Team & County Fiscal Committee",
  activeViewers: 1420,
  status: "LIVE",
  questions: [
    {
      id: "q-101",
      authorName: "Amina Wanjiku",
      county: "Kakamega",
      questionText: "How much of the KES 19.4B total budget is allocated directly to Level 4 Hospital medicine supplies?",
      upvotes: 142,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      isAnswered: true,
      officialResponse: "KES 1.84 Billion (9.5% of total budget) is ring-fenced for KEMSA essential medical supplies.",
    },
    {
      id: "q-102",
      authorName: "Otieno Brian",
      county: "Kakamega",
      questionText: "What is the timeline for completing the Mumias West feeder road construction project?",
      upvotes: 98,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isAnswered: false,
    },
    {
      id: "q-103",
      authorName: "Faith Chebet",
      county: "Kakamega",
      questionText: "Can youth budget trackers inspect the project completion site before final procurement payout?",
      upvotes: 76,
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      isAnswered: true,
      officialResponse: "Yes, BNS Mashinani social audit teams hold official public participation site inspection clearance.",
    },
  ],
};

let _session: LiveTownhallSession = { ...DEFAULT_TOWNHALL_SESSION };

export const liveTownhallEngine = {
  getSession: (): LiveTownhallSession => ({ ..._session }),

  submitQuestion: (authorName: string, county: string, questionText: string): TownhallQuestion => {
    const q: TownhallQuestion = {
      id: `q-${Date.now()}`,
      authorName: authorName || "Engaged Citizen",
      county: county || "Kenya",
      questionText,
      upvotes: 1,
      timestamp: new Date().toISOString(),
      isAnswered: false,
    };
    _session.questions.unshift(q);
    return q;
  },

  upvoteQuestion: (questionId: string): boolean => {
    const idx = _session.questions.findIndex((q) => q.id === questionId);
    if (idx !== -1) {
      _session.questions[idx].upvotes += 1;
      return true;
    }
    return false;
  },
};
