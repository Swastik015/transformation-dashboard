import { projects } from '../data/projectData';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function askBot(query, activeScreen) {
  const apiKey = import.meta.env.VITE_GROK_API_KEY;

  if (!apiKey || apiKey === 'your_grok_api_key_here') {
    throw new Error("Missing API Key. Please add your Groq API key to the .env file as VITE_GROK_API_KEY.");
  }

  const contextData = JSON.stringify(projects, null, 2);

  const screenDescriptions = {
    'value-drivers': 'Value Drivers — showing portfolio value overview with project breakdown by value contribution.',
    'project-phase': 'Project Phase — displaying active portfolio summary by project phases (Ideate, Prepare, Deliver, Hypercare) with flow visualization.',
    'domain': 'Domain — showing circular domain visualization with project distribution across business domains.',
    'scoring-matrix': 'Scoring Matrix — displaying Impact vs Effort matrix with project ranking.',
    'pl-view': 'P&L View — showing financial deep-dive with cost breakdowns, LE vs Planned costs, and drift analysis.'
  };

  const currentScreen = screenDescriptions[activeScreen] || 'Dashboard Overview';

  const systemPrompt = `You are the "L'Oréal Transformation Portfolio Intelligence Assistant". You are embedded directly inside a transformation dashboard used by senior executives and the Transformation Office leadership at L'Oréal North America.

CONTEXT:
- The user is currently viewing: ${currentScreen}
- The portfolio contains ${projects.length} active transformation projects.
- Business rules: Cost risk = cost_drift_pct > 0.20 (20%), Timeline risk = timeline_drift_days > 30 days.

PORTFOLIO DATA (all ${projects.length} projects):
${contextData}

YOUR ROLE:
- Provide deep, analytical, executive-grade answers.
- Go beyond surface-level data dumps. Tell a STORY with the data.
- Highlight what matters: risks, opportunities, strategic implications.
- When relevant, relate your answer to the screen the user is viewing.

RESPONSE FORMAT — Return ONLY a valid JSON object:
{
  "text": "Your detailed executive answer. Use multiple paragraphs for complex answers. Include specific numbers, percentages, and project names. Structure the answer with clear sections if needed. Be thorough but concise.",
  "data": [],
  "chartType": "bar" | "donut" | "scatter" | "table" | null,
  "chartLabel": "Descriptive chart title",
  "insights": ["Insight 1 — specific and actionable", "Insight 2", "Insight 3"],
  "recommendation": "One clear, actionable recommendation for leadership."
}

RULES FOR "data" FIELD:
- For top-N or ranking questions: return the relevant project objects from the portfolio data (include all fields).
- For count/summary questions: return [{"label": "Category", "count": N}] or the relevant project objects.
- For impact vs effort questions: return project objects that have impact_score and effort_score.
- Always include enough fields for the visualization to work.

RULES FOR "chartType":
- "bar" — best for top N comparisons, rankings
- "table" — best for detailed project lists, multi-field comparisons
- "donut" — best for showing proportions (at risk vs on track)
- "scatter" — ONLY for impact vs effort analysis
- null — for simple text answers

CRITICAL: Return ONLY the raw JSON. No markdown, no \`\`\`json blocks, no extra text.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        temperature: 0.15,
        max_tokens: 2048,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error (${response.status}): ${errText}`);
    }

    const json = await response.json();
    let content = json.choices[0].message.content.trim();
    
    // Cleanup markdown formatting if present
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*\n?/, '').replace(/\n?\s*```$/, '');
    }
    if (content.startsWith('```')) {
      content = content.replace(/^```\s*\n?/, '').replace(/\n?\s*```$/, '');
    }

    const parsed = JSON.parse(content);
    
    // Normalize: the LLM might use "text" or "answer" — handle both
    if (!parsed.text && parsed.answer) {
      parsed.text = parsed.answer;
    }

    // Ensure detailData exists for table rendering
    if (!parsed.detailData && parsed.data) {
      parsed.detailData = parsed.data;
    }

    return parsed;

  } catch (error) {
    console.error("LLM Error:", error);
    throw error;
  }
}
