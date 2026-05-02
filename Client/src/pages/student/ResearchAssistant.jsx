import { useState } from "react";
import {
  Sparkles,
  Lightbulb,
  TrendingUp,
  BookOpen,
  Brain,
  Loader,
  Target,
  ArrowRight,
  Search,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const SYSTEM_PROMPTS = {
  ideas: `You are a research advisor for university students. Given interests/skills, generate exactly 5 project ideas.
You MUST respond with ONLY a raw JSON array. No explanation, no markdown, no code blocks, no backticks.
The response must start with [ and end with ].
Each object must have exactly these keys:
- "title": short project name
- "description": 2-sentence description
- "technologies": array of 4-6 technology strings
- "complexity": one of "Low", "Medium", "Medium-High", or "High"
- "impact": 1-2 sentence impact statement
- "timeline": estimated timeline like "3-4 months"
- "difficulty": short difficulty note`,

  trends: `You are a research trend analyst. Given a topic, identify 5 current research trends.
You MUST respond with ONLY a raw JSON array. No explanation, no markdown, no code blocks, no backticks.
The response must start with [ and end with ].
Each object must have exactly these keys:
- "name": trend name
- "description": 2-sentence description
- "growthRate": like "up 220%"
- "publicationCount": like "12,400+"
- "keyResearchers": array of 2-3 researcher name strings
- "topConferences": array of 2 conference name strings
- "futureOutlook": 1-sentence future outlook`,

  literature: `You are a literature review assistant. Given a topic, suggest 4 relevant academic papers.
You MUST respond with ONLY a raw JSON array. No explanation, no markdown, no code blocks, no backticks.
The response must start with [ and end with ].
Each object must have exactly these keys:
- "title": paper title
- "authors": array of 2-3 author strings like "Smith J."
- "year": number like 2023
- "journal": journal or conference name
- "abstract": 2-sentence abstract
- "citations": number
- "doi": a realistic DOI string like "10.1000/xyz123"
- "keywords": array of 3-4 keyword strings
- "methodology": one of "Survey", "Experimental", "Theoretical", "Case Study"`,

  suggestions: `You are an AI research suggestion engine for CS students. Given interests, suggest 4 unique project ideas.
You MUST respond with ONLY a raw JSON array. No explanation, no markdown, no code blocks, no backticks.
The response must start with [ and end with ].
Each object must have exactly these keys:
- "title": project title
- "description": 2-sentence description
- "keywords": array of 3-4 keyword strings
- "novelty": what makes it unique (1 sentence)
- "requiredSkills": array of 3-4 skill strings
- "potentialOutcome": expected output or result (1 sentence)
- "researchGap": what problem it addresses (1 sentence)`,
};

async function callGemini(systemPrompt, userMessage) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const models = ["gemini-2.0-flash", "gemini-flash-latest"];

  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userMessage }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2048,
              responseMimeType: "application/json",
            },
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!raw) throw new Error("Empty response from model.");
      return parseJSON(raw);
    } catch (e) {
      lastError = e;
    }
  }

  throw new Error(lastError?.message || "All models failed. Please try again.");
}

function parseJSON(raw) {
  let text = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (_) {}

  const arrMatch = text.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try {
      return JSON.parse(arrMatch[0]);
    } catch (_) {}
    const fixed = arrMatch[0].replace(/,\s*([}\]])/g, "$1");
    try {
      return JSON.parse(fixed);
    } catch (_) {}
  }

  throw new Error("Could not parse AI response. Please try again.");
}

function Badge({ children, variant = "green" }) {
  const styles = {
    green: "bg-[rgba(0,229,96,0.12)] text-[#00e560]",
    blue: "bg-[rgba(0,150,255,0.12)] text-[#4db8ff]",
    amber: "bg-[rgba(255,180,0,0.12)] text-[#ffb800]",
  };
  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-wrap items-start gap-1">
      <span className="text-[11px] font-semibold text-[#00e560] shrink-0">
        {label}:
      </span>
      <span className="text-[11px] text-[#7ab898] leading-relaxed">
        {value}
      </span>
    </div>
  );
}

function IdeasPanel({ results, selectedIdea, setSelectedIdea }) {
  return (
    <div className="space-y-3 mt-6">
      <h3 className="text-sm font-semibold text-[#c8f5e0] flex items-center gap-2">
        <Target className="w-4 h-4 text-[#00e560]" />
        Generated Project Ideas ({results.length})
      </h3>
      {results.map((idea, index) => (
        <div
          key={index}
          className="bg-[#0c1210] border border-[rgba(0,229,96,0.15)] rounded-xl p-4 hover:border-[rgba(0,229,96,0.3)] cursor-pointer transition-all"
          onClick={() => setSelectedIdea(selectedIdea === index ? null : index)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge>#{index + 1}</Badge>
                <h4 className="font-semibold text-[#c8f5e0] text-sm">
                  {idea.title}
                </h4>
                {idea.complexity && (
                  <Badge variant="amber">{idea.complexity}</Badge>
                )}
              </div>
              <p className="text-xs text-[#7ab898] leading-relaxed">
                {idea.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {idea.technologies?.map((t, i) => (
                  <Badge key={i} variant="blue">
                    {t}
                  </Badge>
                ))}
              </div>
              {selectedIdea === index && (
                <div className="pt-3 border-t border-[rgba(0,229,96,0.1)] space-y-2">
                  <InfoRow label="Impact" value={idea.impact} />
                  <InfoRow label="Timeline" value={idea.timeline} />
                  <InfoRow label="Difficulty" value={idea.difficulty} />
                </div>
              )}
            </div>
            <ArrowRight
              className={`w-4 h-4 text-[#5a8a72] shrink-0 mt-0.5 transition-transform duration-200 ${selectedIdea === index ? "rotate-90" : ""}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TrendsPanel({ results, topic }) {
  return (
    <div className="space-y-3 mt-6">
      <h3 className="text-sm font-semibold text-[#c8f5e0] flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[#00e560]" />
        Research Trends for &ldquo;{topic}&rdquo;
      </h3>
      {results.map((trend, index) => (
        <div
          key={index}
          className="bg-[#0c1210] border border-[rgba(0,229,96,0.15)] rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00e560] mt-1.5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-[#c8f5e0]">
                  {trend.name}
                </p>
                {trend.growthRate && <Badge>{trend.growthRate}</Badge>}
                {trend.publicationCount && (
                  <span className="text-[10px] text-[#5a8a72]">
                    {trend.publicationCount} publications
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7ab898] leading-relaxed">
                {trend.description}
              </p>
              <InfoRow label="Outlook" value={trend.futureOutlook} />
              {trend.keyResearchers?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[11px] font-semibold text-[#00e560] shrink-0">
                    Key Researchers:
                  </span>
                  {trend.keyResearchers.map((r, i) => (
                    <Badge key={i} variant="blue">
                      {r}
                    </Badge>
                  ))}
                </div>
              )}
              {trend.topConferences?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[11px] font-semibold text-[#00e560] shrink-0">
                    Top Venues:
                  </span>
                  {trend.topConferences.map((c, i) => (
                    <Badge key={i} variant="amber">
                      {c}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LiteraturePanel({ results }) {
  return (
    <div className="space-y-3 mt-6">
      <h3 className="text-sm font-semibold text-[#c8f5e0] flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[#00e560]" />
        Related Papers &amp; Articles ({results.length})
      </h3>
      {results.map((paper, index) => (
        <div
          key={index}
          className="bg-[#0c1210] border border-[rgba(0,229,96,0.15)] rounded-xl p-4 space-y-2"
        >
          <h4 className="font-semibold text-[#c8f5e0] text-sm leading-snug">
            {paper.title}
          </h4>
          <p className="text-[11px] text-[#5a8a72]">
            {paper.authors?.join(", ")} &bull; {paper.year} &bull;{" "}
            {paper.journal}
          </p>
          <p className="text-xs text-[#7ab898] leading-relaxed">
            {paper.abstract}
          </p>
          {paper.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {paper.keywords.map((k, i) => (
                <Badge key={i} variant="blue">
                  {k}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[rgba(0,229,96,0.08)]">
            {paper.methodology && (
              <Badge variant="amber">{paper.methodology}</Badge>
            )}
            {paper.citations != null && (
              <span className="text-[10px] text-[#5a8a72]">
                {paper.citations} citations
              </span>
            )}
            {paper.doi && (
              <span className="text-[10px] text-[#5a8a72]">
                DOI: {paper.doi}
              </span>
            )}
            <a
              href={paper.doi ? `https://doi.org/${paper.doi}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-[10px] text-[#00e560] hover:text-[#00bb4d] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View Paper
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function SuggestionsPanel({ results }) {
  return (
    <div className="space-y-3 mt-6">
      <h3 className="text-sm font-semibold text-[#c8f5e0] flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#00e560]" />
        AI Research Suggestions ({results.length})
      </h3>
      {results.map((s, index) => (
        <div
          key={index}
          className="bg-[#0c1210] border border-[rgba(0,229,96,0.15)] rounded-xl p-4 hover:border-[rgba(0,229,96,0.3)] transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[rgba(0,229,96,0.12)] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <ChevronRight className="w-4 h-4 text-[#00e560]" />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-[#c8f5e0] text-sm">
                {s.title}
              </h4>
              <p className="text-xs text-[#7ab898] leading-relaxed">
                {s.description}
              </p>
              <InfoRow label="Novelty" value={s.novelty} />
              <InfoRow label="Research Gap" value={s.researchGap} />
              <InfoRow label="Outcome" value={s.potentialOutcome} />
              {s.requiredSkills?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[11px] font-semibold text-[#00e560] shrink-0">
                    Skills:
                  </span>
                  {s.requiredSkills.map((sk, i) => (
                    <Badge key={i} variant="amber">
                      {sk}
                    </Badge>
                  ))}
                </div>
              )}
              {s.keywords?.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {s.keywords.map((kw, i) => (
                    <Badge key={i} variant="blue">
                      {kw}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResearchAssistant() {
  const [activeTab, setActiveTab] = useState("ideas");
  const [interests, setInterests] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [error, setError] = useState(null);
  const [lastCall, setLastCall] = useState(null);

  const reset = (tab) => {
    setActiveTab(tab);
    setResults(null);
    setSelectedIdea(null);
    setError(null);
  };

  const run = async (type, input) => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setLastCall({ type, input });
    try {
      const data = await callGemini(SYSTEM_PROMPTS[type], input);
      if (!Array.isArray(data) || data.length === 0)
        throw new Error("Received empty results. Please try again.");
      setResults(data);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const retry = () => lastCall && run(lastCall.type, lastCall.input);

  const usesInterests = activeTab === "ideas" || activeTab === "suggestions";
  const inputValue = usesInterests ? interests : topic;
  const setInput = usesInterests ? setInterests : setTopic;

  const meta = {
    ideas: {
      label: "Your Interests & Skills",
      hint: "Enter your interests, skills, or domains separated by commas",
      placeholder: "e.g., Machine Learning, Healthcare, Web Development, IoT",
      btn: "Generate Ideas",
      Icon: Lightbulb,
    },
    trends: {
      label: "Research Topic",
      hint: "Enter a topic to analyze current research trends",
      placeholder: "e.g., Artificial Intelligence in Education",
      btn: "Analyze Trends",
      Icon: TrendingUp,
    },
    literature: {
      label: "Research Topic",
      hint: "Get relevant papers and articles for your literature review",
      placeholder: "e.g., Blockchain for Supply Chain Management",
      btn: "Search Papers",
      Icon: Search,
    },
    suggestions: {
      label: "Your Interests",
      hint: "Get AI-powered research suggestions based on your interests",
      placeholder: "e.g., AI, Sustainability, Mobile Apps",
      btn: "Get Suggestions",
      Icon: Brain,
    },
  }[activeTab];

  const tabs = [
    { id: "ideas", label: "Project Ideas", icon: Lightbulb },
    { id: "trends", label: "Research Trends", icon: TrendingUp },
    { id: "literature", label: "Literature Review", icon: BookOpen },
    { id: "suggestions", label: "AI Suggestions", icon: Brain },
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        {/* Header */}
        <div className="card-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[rgba(0,229,96,0.12)] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#00e560]" />
            </div>
            <div>
              <h1 className="card-title">Research Assistant</h1>
              <p className="card-subtitle">
                AI-powered research guidance for your project
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-[#0c1210] rounded-xl p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => reset(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[rgba(0,229,96,0.12)] text-[#00e560]"
                  : "text-[#5a8a72] hover:text-[#c8f5e0]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div>
          <label className="label">{meta.label}</label>
          <p className="text-xs text-[#5a8a72] mb-3">{meta.hint}</p>
          <div className="flex gap-3">
            <input
              type="text"
              className="input flex-1"
              placeholder={meta.placeholder}
              value={inputValue}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run(activeTab, inputValue)}
              disabled={loading}
            />
            <button
              onClick={() => run(activeTab, inputValue)}
              disabled={loading || !inputValue.trim()}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <meta.Icon className="w-4 h-4" />
              )}
              {meta.btn}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="w-8 h-8 text-[#00e560] animate-spin mx-auto mb-3" />
              <p className="text-sm text-[#5a8a72]">
                Asking AI, please wait&hellip;
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-4 bg-[rgba(255,80,80,0.08)] border border-[rgba(255,80,80,0.2)] rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="flex-1 text-sm text-red-400">{error}</p>
            <button
              onClick={retry}
              className="flex items-center gap-1 text-xs text-[#00e560] hover:text-[#00bb4d] shrink-0 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && results && activeTab === "ideas" && (
          <IdeasPanel
            results={results}
            selectedIdea={selectedIdea}
            setSelectedIdea={setSelectedIdea}
          />
        )}
        {!loading && results && activeTab === "trends" && (
          <TrendsPanel results={results} topic={topic} />
        )}
        {!loading && results && activeTab === "literature" && (
          <LiteraturePanel results={results} />
        )}
        {!loading && results && activeTab === "suggestions" && (
          <SuggestionsPanel results={results} />
        )}
      </div>
    </div>
  );
}
