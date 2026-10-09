
const API_KEY = import.meta.env.VITE_AI_API_KEY;

// Use a model currently available to your Google AI Studio API key.
const MODEL = "gemini-3.5-flash-lite";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateRoadmap(userInput = {}) {
  const role = userInput.role?.trim() || "Software Engineer";
  const company = userInput.company?.trim() || "Tech Startup";
  const knownSkills = userInput.knownSkills?.trim() || "None specified";
  const education = userInput.education?.trim() || "Not specified";
  const currentYear = userInput.currentYear?.trim() || "Not specified";
  const hoursPerWeek = userInput.hoursPerWeek || "Not specified";
  const targetTimeline = userInput.targetTimeline || "Flexible";

  if (!API_KEY || API_KEY === "your-api-key-here") {
    throw new Error("Gemini API key is missing. Check your .env.local file.");
  }

  const prompt = `
You are PathForge AI, a realistic career strategist and technical mentor.

Create a personalized, dependency-aware career roadmap.

USER PROFILE
- Target role: ${role}
- Target company/type: ${company}
- Education: ${education}
- Current year/semester: ${currentYear}
- Existing skills: ${knownSkills}
- Available study time: ${hoursPerWeek} hours per week
- Target timeline: ${targetTimeline}

RULES
1. Generate exactly 6 ordered learning milestones.
2. Start at the user's actual level. Do not assume a college student is a beginner
   or that a school student already knows advanced programming.
3. Use the stated education and skills to choose an appropriate starting point.
4. Avoid repeating skills the user already knows unless a short assessment is useful.
5. Make every milestone specific to the target role and company type.
6. Progress from prerequisites to advanced skills, practical experience and job readiness.
7. Make durations realistic given the hours available per week.
8. Every milestone must include:
   - A precise, meaningful title.
   - Why it matters for this career goal.
   - A concrete action plan.
   - A project or other proof of work.
   - An interview checkpoint or measurable success criterion.
   - Required prerequisite milestone titles, if any.
9. Recommend real technologies and relevant, verifiable certifications only when useful.
   Never invent certifications, URLs, job openings or employer requirements.
10. Make projects demonstrate the actual skills required for the target role.
11. The sixth milestone must be a substantial portfolio project or job-readiness milestone.
12. Do not guarantee employment or invent a precise hiring timeline.
13. Use clear language suitable for a student. Avoid vague advice such as
    "learn coding", "build projects", or "improve skills".
14. Return valid JSON only, matching the requested schema.
15. Choose technologies and projects based on the actual target role.
    Do not confuse ML Engineering with quantitative trading, frontend
    development, data analytics, or other adjacent careers.

16. For ML Engineer roles, prioritize relevant foundations, mathematics
    and statistics, data preparation, machine learning algorithms,
    model evaluation, deployment, and monitoring. Adapt this sequence
    to the user's existing skills and target industry.

17. Make every project directly demonstrate a required competency.
    For fintech ML, consider realistic problems such as fraud detection,
    credit-risk prediction, or transaction anomaly detection.

18. Never suggest extreme or arbitrary performance targets, such as
    processing millions of trades per second, unless the target role
    explicitly requires that capability.

19. Treat listed skills as self-reported familiarity, not proof of mastery.
    Avoid beginner repetition, but use practical assessments where useful.

20. Ensure total milestone durations are consistent with the user's
    available weekly hours and target timeline. If the timeline is
    unrealistic, explain the constraint in an appropriate milestone.

21. Make every action plan concrete. Specify what to study, what to
    implement, and what measurable result demonstrates completion.
    Avoid generic advice and unrelated technologies.

22. Every prerequisite must refer to an earlier milestone or a clearly
    stated existing competency.
    23. For ML engineering, include probability, statistics, and relevant
    linear algebra when the user's current level requires them.
24. For fintech ML projects, address class imbalance, data leakage,
    model calibration, precision-recall trade-offs, and explainability
    where relevant.
25. Every project must define measurable evaluation criteria and explain
    how results will be validated on unseen data.

Make the roadmap meaningfully different for different target roles.
`;

  const responseSchema = {
    type: "OBJECT",
    properties: {
      steps: {
        type: "ARRAY",
        minItems: 6,
        maxItems: 6,
        items: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            duration: { type: "STRING" },
            whyItMatters: { type: "STRING" },
            actionPlan: { type: "STRING" },
            proofOfWork: { type: "STRING" },
            interviewCheckpoint: { type: "STRING" },
            prerequisites: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          },
          required: [
            "title",
            "duration",
            "whyItMatters",
            "actionPlan",
            "proofOfWork",
            "interviewCheckpoint",
            "prerequisites"
          ],
          propertyOrdering: [
            "title",
            "duration",
            "whyItMatters",
            "actionPlan",
            "proofOfWork",
            "interviewCheckpoint",
            "prerequisites"
          ]
        }
      }
    },
    required: ["steps"]
  };

  let result;

  // Retry temporary rate-limit and server errors, not invalid requests.
  for (let attempt = 0; attempt < 3; attempt++) {
    let response;

    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema,
              temperature: 0.4
            }
          })
        }
      );
    } catch {
      if (attempt === 2) {
        throw new Error("Network error. Check your connection and try again.");
      }
      await sleep(1000 * (attempt + 1));
      continue;
    }

    if (response.ok) {
      result = await response.json();
      break;
    }

    const errorBody = await response.json().catch(() => ({}));
    const status = response.status;

    if (status === 429 || status >= 500) {
      if (attempt < 2) {
        const retryDelay = Math.min(1500 * (2 ** attempt), 5000);
        await sleep(retryDelay);
        continue;
      }
    }

    if (status === 429) {
      throw new Error(
        "Gemini is rate-limited. Please wait a little and try again."
      );
    }

    if (status === 401 || status === 403) {
      throw new Error(
        "Gemini rejected the API key. Check the key and API permissions."
      );
    }

    throw new Error(
      errorBody?.error?.message || `Gemini request failed (${status}).`
    );
  }

  const text = result?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned no roadmap. Please try again.");
  }

  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned an invalid roadmap. Please try again.");
  }

  if (!Array.isArray(parsed.steps) || parsed.steps.length !== 6) {
    throw new Error("The generated roadmap was incomplete. Please try again.");
  }

  const known = knownSkills
    .toLowerCase()
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

    
  const nodes = parsed.steps.map((step, index) => {
    const titleLower = step.title.toLowerCase();

    const isKnown = known.some(
      (skill) =>
        titleLower.includes(skill) ||
        (skill.length > 2 && skill.includes(titleLower))
    );

    return {
      id: String(index + 1),
      position: { x: 250, y: index * 160 },
      data: {
        title: step.title,
        duration: isKnown ? "Already Known" : step.duration,
        originalDuration: step.duration,
        status: isKnown ? "completed" : "pending",
        whyItMatters: step.whyItMatters,
        actionPlan: step.actionPlan,
        proofOfWork: step.proofOfWork,
        interviewCheckpoint: step.interviewCheckpoint,
        prerequisites: step.prerequisites || []
      },
      type: "custom"
    };
  });

  const targetId = String(nodes.length + 1);

  nodes.push({
    id: targetId,
    position: { x: 250, y: nodes.length * 160 },
    data: {
      title: `${role} (${company})`,
      duration: "Target Goal",
      status: "target"
    },
    type: "custom"
  });

  const edges = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `e${nodes[i].id}-${nodes[i + 1].id}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      animated: true
    });
  }

  return { nodes, edges };
}
