"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen, 
  Calendar, 
  Image as ImageIcon, 
  ChevronRight,
  Loader2,
  Wand2,
  Save,
  ArrowLeft,
  X,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/utils";

interface TriviaFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const CATEGORIES = [
  { value: "history", label: "History", icon: "📜" },
  { value: "budget", label: "Budget Data", icon: "📊" },
  { value: "people", label: "Cabinet Secretaries", icon: "👥" },
  { value: "general", label: "General Trivia", icon: "🌐" },
];

export function TriviaForm({ initialData, isEditing }: TriviaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    question: initialData?.question || "",
    answer: initialData?.answer || "",
    category: initialData?.category || "general",
    year: initialData?.year || new Date().getFullYear(),
    context: initialData?.context || "",
    image_url: initialData?.image_url || "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const url = isEditing 
        ? `/api/admin/models/trivia/${initialData.id}`
        : `/api/admin/models/trivia`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save trivia");

      toast.success(isEditing ? "Trivia updated" : "Trivia created");
      router.push("/admin/dashboard"); // Or back to library
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Smart Automation: Category Suggestion
  const suggestCategory = async () => {
    if (!formData.question) return;
    setAiLoading("category");
    
    // Simulate AI delay
    await new Promise(r => setTimeout(r, 800));
    
    const text = formData.question.toLowerCase();
    let suggested = "general";
    
    if (text.includes("budget") || text.includes("kes") || text.includes("billion") || text.includes("spending")) {
      suggested = "budget";
    } else if (text.includes("history") || text.includes("19") || text.includes("independence") || text.includes("ago")) {
      suggested = "history";
    } else if (text.includes("secretary") || text.includes("minister") || text.includes("who was") || text.includes("cabinet")) {
      suggested = "people";
    }
    
    handleChange("category", suggested);
    setAiLoading(null);
    toast.info(`Suggested category: ${suggested}`, {
      icon: <Sparkles className="size-4 text-indigo-500" />
    });
  };

  // Smart Automation: Year Detection
  const detectYear = () => {
    const yearMatch = formData.question.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      handleChange("year", parseInt(yearMatch[0]));
      toast.info(`Detected year: ${yearMatch[0]}`);
    }
  };

  // Smart Automation: Context Generation (Mock)
  const generateContext = async () => {
    if (!formData.answer) return;
    setAiLoading("context");
    await new Promise(r => setTimeout(r, 1200));
    
    const mockContext = `Interesting fact: ${formData.answer} played a key role in Kenya's policy development during this period. This decision influenced fiscal outcomes for several years following its implementation.`;
    handleChange("context", mockContext);
    setAiLoading(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            {isEditing ? "Edit Trivia" : "Build Your Trivia"}
          </h2>
          <p className="text-muted-foreground">
            Create engaging questions — we'll help with the heavy lifting.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
            {isEditing ? "Save Changes" : "Publish Trivia"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Section 1: The Question */}
          <FormSection title="The Question" icon={<HelpCircle className="size-5 text-indigo-500" />}>
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="e.g., Who directed the 1994 film 'Pulp Fiction'?"
                  value={formData.question}
                  onChange={(e) => handleChange("question", e.target.value)}
                  onBlur={() => {
                    suggestCategory();
                    detectYear();
                  }}
                  className="text-xl font-medium min-h-[120px] bg-transparent border-none focus-visible:ring-0 px-0 resize-none placeholder:text-muted-foreground/40 border-b border-muted transition-all focus:border-indigo-500 rounded-none"
                />
                <div className="absolute right-0 bottom-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    onClick={suggestCategory}
                    disabled={aiLoading === "category"}
                  >
                    {aiLoading === "category" ? <Loader2 className="size-3 animate-spin mr-2" /> : <Wand2 className="size-3 mr-2" />}
                    Magic Suggest
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60">Try:</span>
                {["Historical events", "Budget data", "Cabinet ministers"].map((tip) => (
                  <button 
                    key={tip}
                    onClick={() => handleChange("question", `Tell me about ${tip.toLowerCase()} in...`)}
                    className="text-xs bg-muted/50 hover:bg-muted px-2 py-1 rounded-full transition-colors"
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
          </FormSection>

          {/* Section 2: The Answer */}
          <FormSection title="The Answer" icon={<CheckCircle2 className="size-5 text-emerald-500" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 group">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-indigo-600 transition-colors">Primary Answer</Label>
                <Input 
                  placeholder="e.g., Quentin Tarantino"
                  value={formData.answer}
                  onChange={(e) => handleChange("answer", e.target.value)}
                  onBlur={generateContext}
                  className="bg-transparent border-none border-b border-muted focus-visible:ring-0 px-0 rounded-none transition-all focus:border-indigo-500 h-10"
                />
              </div>
              <div className="space-y-2 opacity-60">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Alternative spellings</Label>
                <Input 
                  placeholder="Optional"
                  className="bg-transparent border-none border-b border-muted focus-visible:ring-0 px-0 rounded-none h-10 cursor-not-allowed"
                  disabled
                />
                <p className="text-[10px] text-muted-foreground">Users get credit for any of these.</p>
              </div>
            </div>
          </FormSection>

          {/* Section 3: Metadata */}
          <FormSection title="Context & Classification" icon={<BookOpen className="size-5 text-amber-500" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(v) => handleChange("category", v)}
                >
                  <SelectTrigger className="bg-transparent border-none border-b border-muted focus:ring-0 px-0 rounded-none transition-all focus:border-indigo-500 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="mr-2">{cat.icon}</span> {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Year</Label>
                <Input 
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleChange("year", parseInt(e.target.value))}
                  className="bg-transparent border-none border-b border-muted focus-visible:ring-0 px-0 rounded-none transition-all focus:border-indigo-500 h-10"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Context / Fun Fact</Label>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 text-[10px] text-indigo-600"
                    onClick={generateContext}
                    disabled={aiLoading === "context"}
                  >
                    {aiLoading === "context" ? <Loader2 className="size-3 animate-spin mr-1" /> : <Sparkles className="size-3 mr-1" />}
                    Generate Fact
                  </Button>
                </div>
                <Textarea 
                  placeholder="Additional info to show after the user answers..."
                  value={formData.context}
                  onChange={(e) => handleChange("context", e.target.value)}
                  className="bg-transparent border-none border-b border-muted focus-visible:ring-0 px-0 rounded-none transition-all focus:border-indigo-500 min-h-[80px] resize-none"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Image URL</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input 
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image_url}
                      onChange={(e) => handleChange("image_url", e.target.value)}
                      className="bg-transparent border-none border-b border-muted focus-visible:ring-0 px-0 rounded-none transition-all focus:border-indigo-500 h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <div className="sticky top-24">
            <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4 ml-4">Live Preview</h3>
            <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-slate-900 text-white min-h-[400px] flex flex-col">
              <div className="h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="absolute inset-0 size-full object-cover mix-blend-overlay opacity-60" />
                )}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-white/20 backdrop-blur-md border-none text-white capitalize">
                    {CATEGORIES.find(c => c.value === formData.category)?.icon} {formData.category}
                  </Badge>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-2xl font-bold leading-tight">
                    {formData.question || "Your question will appear here..."}
                  </p>
                  <div className="h-px w-12 bg-white/20" />
                  <p className="text-indigo-300 text-sm font-medium">
                    {formData.year ? `Context: Kenya ${formData.year}` : "Kenya General"}
                  </p>
                </div>
                
                <div className="mt-8 space-y-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-white/40 italic">
                    Tap to reveal answer...
                  </div>
                  <AnimatePresence>
                    {formData.answer && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold"
                      >
                        {formData.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Card>
            <p className="text-center text-[10px] text-muted-foreground mt-4">
              This is how your trivia will look to users in the Learn Hub.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 pt-12 border-t border-muted/30">
        <Button variant="outline" size="lg" className="rounded-xl px-8" onClick={() => router.back()}>
          Back
        </Button>
        <Button 
          size="lg" 
          className="rounded-xl px-8 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
          {isEditing ? "Save Changes" : "Publish Trivia"}
        </Button>
        <Button variant="ghost" size="lg" className="rounded-xl text-muted-foreground ml-auto">
          Add Another
        </Button>
      </div>
    </div>
  );
}

function FormSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      <h3 className="text-lg font-semibold mb-8 flex items-center gap-3">
        <span className="p-2 rounded-xl bg-muted/50 group-hover:bg-white transition-colors shadow-inner">
          {icon}
        </span>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}
