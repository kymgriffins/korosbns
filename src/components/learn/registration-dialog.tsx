"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { citizenApi } from "@/lib/api-client";
import {
  Heart,
  BookOpen,
  Home,
  Sprout,
  Milestone,
  Cpu,
  Check,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const PRIORITIES = [
  { id: "Healthcare", label: "Healthcare", context: "Hospitals, NHIF access, medicines", icon: Heart },
  { id: "Education", label: "Education", context: "Schools, bursaries, CBC support", icon: BookOpen },
  { id: "Affordable Housing", label: "Affordable Housing", context: "Rent, urban planning, settlements", icon: Home },
  { id: "Agriculture & Food", label: "Agriculture & Food", context: "Fertilizer, farming, food prices", icon: Sprout },
  { id: "Infrastructure", label: "Infrastructure", context: "Roads, clean water, electricity", icon: Milestone },
  { id: "Jobs & Digital Economy", label: "Jobs & Digital Economy", context: "Youth employment, internet access", icon: Cpu },
];

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegistrationDialog({ open, onOpenChange }: RegistrationDialogProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const hasMinLength = password.length >= 10;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  const togglePriority = (id: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleNext = () => {
    setFormError("");
    if (step === 1) {
      if (selectedPriorities.length === 0) {
        setFormError("Please select at least 1 budget priority.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!firstName.trim() || !lastName.trim()) {
        setFormError("Please fill in both first and last names.");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setFormError("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!hasMinLength || !hasNumber || !hasUppercase) {
      setFormError("Password does not meet the secure criteria.");
      return;
    }

    setLoading(true);
    try {
      await citizenApi.register({
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });

      localStorage.setItem(
        "bns_onboarding_profile",
        JSON.stringify({
          priorities: selectedPriorities,
          onboardingCompleted: true,
        }),
      );

      setSent(true);
      toast.success("Registration complete! Check your email.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed.";
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setSent(false);
      setFormError("");
      setSelectedPriorities([]);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {sent
              ? "Verify your email"
              : step === 1
                ? "What matters most?"
                : step === 2
                  ? "Tell us about yourself"
                  : "Secure your account"}
          </DialogTitle>
          <DialogDescription>
            {sent
              ? `We sent a verification link to ${email}.`
              : step === 1
                ? "Which issues should public funds prioritize in your community?"
                : step === 2
                  ? "Used to represent your voice in citizen panels."
                  : "Complete registration and begin tracking your budget."}
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        {!sent && (
          <div className="mb-2 space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span>Citizen Onboarding</span>
              <span>Step {step} of 3</span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {formError && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
            <ShieldAlert className="size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {sent ? (
          <div className="text-center space-y-4 py-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
              <Sparkles className="size-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              Please click the link in your email to activate your account and access your personalized citizen dashboard.
            </p>
            <Button onClick={handleClose} className="w-full rounded-xl h-11 font-bold">
              Done
            </Button>
          </div>
        ) : (
          <>
            {/* Step 1: Priorities */}
            {step === 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {PRIORITIES.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedPriorities.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => togglePriority(option.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary shadow-xs"
                            : "border-border/60 hover:border-border hover:bg-muted/30"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-primary/15" : "bg-muted"} shrink-0`}>
                          <Icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold">{option.label}</p>
                          <p className="text-xs text-muted-foreground truncate">{option.context}</p>
                        </div>
                        {isSelected && <Check className="size-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <Button onClick={handleNext} className="w-full rounded-xl h-11 font-bold gap-2">
                  <span>Continue</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Identity */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="rd-firstName" className="text-sm font-bold flex items-center gap-1.5">
                      <User className="size-4 text-muted-foreground" />
                      First name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="rd-firstName"
                      required
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rd-lastName" className="text-sm font-bold">
                      Last name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="rd-lastName"
                      required
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="rounded-xl h-11"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleBack} variant="outline" className="flex-1 rounded-xl h-11 font-bold gap-1.5">
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                  <Button onClick={handleNext} className="flex-1 rounded-xl h-11 font-bold gap-1.5">
                    Continue
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Credentials */}
            {step === 3 && (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="rd-email" className="text-sm font-bold flex items-center gap-1.5">
                      <Mail className="size-4 text-muted-foreground" />
                      Email address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="rd-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rd-password" className="text-sm font-bold flex items-center gap-1.5">
                      <Lock className="size-4 text-muted-foreground" />
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="rd-password"
                      type="password"
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl h-11"
                    />
                    <div className="p-3 bg-muted/30 border border-border/60 rounded-xl space-y-1.5 text-xs">
                      <p className="font-semibold text-muted-foreground mb-1">Password requirements:</p>
                      <div className="flex items-center gap-2">
                        <div className={`size-4 rounded-full flex items-center justify-center text-[10px] ${hasMinLength ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                          <Check className="size-3" />
                        </div>
                        <span className={hasMinLength ? "text-emerald-500" : "text-muted-foreground"}>At least 10 characters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`size-4 rounded-full flex items-center justify-center text-[10px] ${hasNumber ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                          <Check className="size-3" />
                        </div>
                        <span className={hasNumber ? "text-emerald-500" : "text-muted-foreground"}>At least one number</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`size-4 rounded-full flex items-center justify-center text-[10px] ${hasUppercase ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                          <Check className="size-3" />
                        </div>
                        <span className={hasUppercase ? "text-emerald-500" : "text-muted-foreground"}>At least one uppercase letter</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="button" onClick={handleBack} variant="outline" className="flex-1 rounded-xl h-11 font-bold gap-1.5" disabled={loading}>
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 rounded-xl h-11 font-bold gap-1.5" disabled={loading}>
                    {loading ? "Creating Account…" : "Join Movement"}
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
