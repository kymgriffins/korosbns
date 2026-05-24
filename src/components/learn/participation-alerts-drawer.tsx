"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/ui/button";
import { toast } from "sonner";
import {
  Bell, FileText, Send, CheckCircle2, ChevronRight, X,
  Copy, MessageSquare, AlertTriangle, Sparkles, RefreshCw
} from "lucide-react";
import { cn } from "@/utils";


interface Alert {
  id: string;
  documentName: string;
  county: string;
  openDate: string;
  closeDate: string;
  portalLink: string;
  whatsappGroup: string;
}

interface ParticipationAlertsDrawerProps {
  profile: any;
  onClose: () => void;
  onUpdateProfile: (updatedProfile: any) => void;
}

export function ParticipationAlertsDrawer({ profile, onClose, onUpdateProfile }: ParticipationAlertsDrawerProps) {
  const [step, setStep] = useState<"review" | "draft" | "submit" | "completed">("review");
  const [aiFailed, setAiFailed] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [draftContent, setDraftContent] = useState("");
  const [participationLog, setParticipationLog] = useState<any[]>([]);

  // Sample alert targeted to the user's county
  const alert: Alert = {
    id: `alert_${profile.county.toLowerCase()}_cfsp`,
    documentName: "County Fiscal Strategy Paper (CFSP) 2026/27",
    county: profile.county,
    openDate: "2026-05-20",
    closeDate: "2026-06-03", // 10 days from now (current time is May 24, 2026)
    portalLink: `https://www.${profile.county.toLowerCase()}.go.ke/budget-comments`,
    whatsappGroup: "+254712345678" // County rep WhatsApp
  };

  // Observations, legal bases, and actions pool for the AI generator
  const aiObservations = [
    `We observe that the proposed allocation of KES 450 Million for "Governor's office renovations and furniture upgrades" in the ${profile.county} County budget is disproportionately high compared to the KES 45 Million allocated to medical supply procurements for sub-county dispensaries.`,
    `We note that the proposed agricultural extension service budget in ${profile.county} County has been slashed by 30%, which threatens food security in rural wards and contradicts county development priorities.`,
    `We notice that the ${profile.county} County development budget is set at only 22% of total expenditures, failing to meet the legal 30% minimum developmental expenditure threshold.`
  ];

  const aiLegalBases = [
    "This contradicts Section 107(2)(b) of the Public Finance Management (PFM) Act 2012, which mandates that over the medium term a minimum of thirty percent of the county government's budget shall be allocated to the development expenditure.",
    "This violates Article 201(d) of the Constitution of Kenya 2010, which mandates that public money shall be used in a prudent and responsible manner.",
    "This goes against Section 125 of the PFM Act 2012 which outlines the mandatory public participation guidelines in county planning and budget allocation."
  ];

  const aiActions = [
    "We request that the office renovation allocation be reduced by 60% and the KES 270 Million surplus be re-allocated to equipping rural health dispensaries in poor wards.",
    "We urge the County Assembly to reinstate the original agricultural support budget, funding it by cutting the governor's hospitality budget.",
    "We recommend restructuring the expenditures to raise the development budget allocation to at least 32%, ensuring compliance with public finance guidelines."
  ];

  // Static templates in case AI draft generator fails
  const staticTemplate = `PUBLIC PARTICIPATION MEMORANDUM ON THE BUDGET

County: ${profile.county}
Document: ${alert.documentName}

[Observation]: We request a clear review of public expenditure ceilings on administrative overheads. Development funds should prioritize primary services.
[Legal Basis]: Article 201 of the Kenyan Constitution requires public finance to promote an equitable society and prudent utilization of public funds.
[Action]: Reallocate recurrent administrative expenditure to county health and water infrastructure.`;

  // Simulate AI generation
  const handleGenerateAIDraft = () => {
    setAiLoading(true);
    setAiFailed(false);
    setTimeout(() => {
      // 20% chance of mock AI failure to demonstrate fallback
      if (Math.random() < 0.2) {
        setAiFailed(true);
        setDraftContent(staticTemplate);
        toast.error("AI Draft Generator failed to connect. Falling back to static template.");
      } else {
        const obs = aiObservations[Math.floor(Math.random() * aiObservations.length)];
        const leg = aiLegalBases[Math.floor(Math.random() * aiLegalBases.length)];
        const act = aiActions[Math.floor(Math.random() * aiActions.length)];
        
        const text = `PUBLIC PARTICIPATION BUDGET MEMORANDUM

County: ${profile.county}
Document: ${alert.documentName}
Submitted By: Anonymized Citizen (${profile.pseudoName})

[Observation]: ${obs}

[Legal Basis]: ${leg}

[Action]: ${act}`;

        setDraftContent(text);
        toast.success("AI Budget Draft generated successfully!");
      }
      setAiLoading(false);
      setStep("draft");
    }, 1200);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(draftContent);
    toast.success("Draft copied to clipboard!");
  };

  const handleSubmitPortal = () => {
    // Simulate portal submit
    toast.loading("Uploading memorandum to county portal...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Memorandum successfully submitted to the County Portal!");
      recordParticipation();
      setStep("completed");
    }, 1500);
  };

  const handleWhatsAppSubmit = () => {
    // Prefill whatsapp link
    const text = encodeURIComponent(draftContent);
    const url = `https://wa.me/254712345678?text=${text}`;
    window.open(url, "_blank");
    toast.success("Opened WhatsApp forward!");
    recordParticipation();
    setStep("completed");
  };

  const recordParticipation = () => {
    // Log in user profile tracked actions
    const logItem = {
      alertId: alert.id,
      documentName: alert.documentName,
      county: alert.county,
      dateSubmitted: new Date().toISOString(),
      method: step === "draft" ? "Portal" : "WhatsApp",
      draftText: draftContent
    };

    const currentLogs = profile.participationLogs || [];
    const updatedProfile = {
      ...profile,
      participationLogs: [...currentLogs, logItem]
    };
    onUpdateProfile(updatedProfile);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-background flex flex-col shadow-2xl md:max-w-xl md:mx-auto md:border-x border-border",
      "md:relative md:inset-auto md:z-auto md:border-0 md:shadow-none md:max-w-none md:h-full"
    )}>

      {/* Header */}
      <header className="sticky top-0 z-10 w-full h-14 border-b border-border bg-background flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Bell className="size-5 text-primary animate-bounce" />
          <div>
            <h2 className="text-sm font-bold tracking-tight uppercase leading-none">Participation Trigger</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">{profile.county} County Action</p>
          </div>
        </div>
        <Button size="icon-sm" variant="ghost" onClick={onClose} className="rounded-full">
          <X className="size-5" />
        </Button>
      </header>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20 text-xs font-bold">
        <span className={step === "review" ? "text-primary" : "text-muted-foreground"}>1. Review</span>
        <ChevronRight className="size-3.5 text-muted-foreground" />
        <span className={step === "draft" ? "text-primary" : "text-muted-foreground"}>2. Draft</span>
        <ChevronRight className="size-3.5 text-muted-foreground" />
        <span className={step === "submit" ? "text-primary" : "text-muted-foreground"}>3. Submit</span>
        <ChevronRight className="size-3.5 text-muted-foreground" />
        <span className={step === "completed" ? "text-primary" : "text-muted-foreground"}>4. Finish</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">

        {step === "review" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-300 text-xs flex gap-2">
              <AlertTriangle className="size-5 shrink-0" />
              <div>
                <span className="font-bold">Hyper-Local Trigger Match!</span>
                <p className="mt-1">
                  We matched your county (**{profile.county}**) and notification settings. A critical comment window is closing soon.
                </p>
              </div>
            </div>

            <div className="p-5 border border-border bg-card rounded-xl space-y-4 shadow-xs">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  Statutory Document
                </span>
                <h3 className="text-base font-black mt-3 leading-tight">{alert.documentName}</h3>
                <p className="text-xs text-muted-foreground mt-1">County: {alert.county} · Location Match</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-border">
                <div>
                  <span className="text-muted-foreground font-bold">Published:</span>
                  <p className="font-black text-foreground mt-1">{alert.openDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-bold">Comments Close:</span>
                  <p className="font-black text-destructive mt-1">{alert.closeDate} (7 days)</p>
                </div>
              </div>

              <div className="text-xs leading-relaxed text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/50">
                County assemblies table the CFSP to specify expenditure caps. Citizens have a legal window to critique allocations before appropriation.
              </div>
            </div>

            <Button
              onClick={handleGenerateAIDraft}
              disabled={aiLoading}
              className="w-full rounded-xl h-11 font-bold gap-2"
            >
              {aiLoading ? (
                <>Generating Draft...</>
              ) : (
                <>
                  <Sparkles className="size-4 fill-current" /> Generate AI Submission Draft
                </>
              )}
            </Button>
          </div>
        )}

        {step === "draft" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base">✏️ Customize Budget Comment</h3>
              <p className="text-xs text-muted-foreground">Verify and edit the AI-generated memorandum prior to submitting. Feel free to refine the content.</p>
            </div>

            {aiFailed && (
              <div className="p-3 border border-destructive/20 bg-destructive/5 rounded-xl text-xs text-destructive flex items-center gap-2">
                <AlertTriangle className="size-4" />
                <span>AI Server offline. Static template loaded below.</span>
              </div>
            )}

            <div className="space-y-2">
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                rows={12}
                className="w-full rounded-xl border border-border bg-card p-4 text-xs font-mono resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary leading-relaxed"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("review")}
                className="rounded-xl flex-1 h-11 font-bold"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep("submit")}
                className="rounded-xl flex-1 h-11 font-bold gap-1.5"
              >
                Next to Submit <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "submit" && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="font-bold text-base">📤 Send Your Memorandum</h3>
              <p className="text-xs text-muted-foreground">Choose your submission pathway. Submitting does not award Sovereigns, but records civic participation logs.</p>
            </div>

            <div className="grid gap-3">
              <div className="p-4 rounded-xl border border-border bg-card flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold">Pathway A: Official County Portal</h4>
                    <p className="text-xs text-muted-foreground">Upload directly onto the county public finance feedback system.</p>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full">Recommended</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button onClick={handleCopyToClipboard} variant="outline" size="sm" className="rounded-xl flex-1 gap-1">
                    <Copy className="size-3.5" /> Copy Draft
                  </Button>
                  <Button onClick={handleSubmitPortal} size="sm" className="rounded-xl flex-1 gap-1">
                    <Send className="size-3.5" /> Open Portal & Submit
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card flex flex-col gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold">Pathway B: WhatsApp Submission</h4>
                  <p className="text-xs text-muted-foreground">Forward your draft to the official county representation public engagement WhatsApp line.</p>
                </div>
                <Button onClick={handleWhatsAppSubmit} variant="outline" className="rounded-xl w-full gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50/50">
                  <MessageSquare className="size-4" /> Forward via WhatsApp
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => setStep("draft")}
              className="w-full text-muted-foreground"
            >
              Modify Draft
            </Button>
          </div>
        )}

        {step === "completed" && (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="size-16 mx-auto text-primary" />
            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase">Participation Logged!</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Thank you for acting on **{alert.documentName}**. We have recorded this submission in your local civic activity log. Keep tracking!
              </p>
            </div>

            <div className="pt-4 max-w-xs mx-auto">
              <Button onClick={onClose} className="w-full rounded-xl h-11 font-bold">
                Return to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
