import { QuestsProtectedGate } from "./quests-protected-gate";

export const metadata = {
  title: "Quests | Budget Ndio Story",
};

export default function QuestsLayout({ children }: { children: React.ReactNode }) {
  return <QuestsProtectedGate>{children}</QuestsProtectedGate>;
}
