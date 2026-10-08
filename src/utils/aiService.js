const API_KEY = import.meta.env.VITE_AI_API_KEY;

export async function generateRoadmap(userInput) {
  const role = userInput.role || "Software Engineer";
  const company = userInput.company || "Tech Startup";
  const knownSkills = userInput.knownSkills || "None provided";

  if (!API_KEY || API_KEY === "your-api-key-here") {
    throw new Error("Gemini API key is missing.");
  }

  const prompt = `
You are PathForge AI, an expert career roadmap planner.

Create a realistic career roadmap for:

Target Role: ${role}
Target Company Type: ${company}
Current Skills: ${knownSkills}

Create exactly 6 milestones.

Requirements:
- Start from the user's current level.
- Avoid repeating skills the user already knows.
- Order milestones by dependency.
- Make the roadmap practical and industry-oriented.
- The final milestone must be a realistic portfolio/project milestone.
- Give each milestone a realistic duration.
- Give a concrete proof-of-work task.
- Give one realistic interview checkpoint.
- Make recommendations relevant to the target company type.

Return ONLY valid JSON in this format:

{
  "steps": [
    {
      "title": "string",
      "duration": "string",
      "proofOfWork": "string",
      "interviewCheckpoint": "string"
    }
  ]
}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              steps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string"
                    },
                    duration: {
                      type: "string"
                    },
                    proofOfWork: {
                      type: "string"
                    },
                    interviewCheckpoint: {
                      type: "string"
                    }
                  },
                  required: [
                    "title",
                    "duration",
                    "proofOfWork",
                    "interviewCheckpoint"
                  ]
                }
              }
            },
            required: ["steps"]
          }
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${errorText}`);
  }

  const result = await response.json();

  const text =
    result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  const parsed = JSON.parse(text);

  const known = knownSkills
    .toLowerCase()
    .split(",")
    .map(skill => skill.trim())
    .filter(Boolean);

  const steps = parsed.steps || [];

  const nodes = steps.map((step, index) => {
    const titleLower = step.title.toLowerCase();

    const isKnown = known.some(
      skill =>
        skill &&
        (
          titleLower.includes(skill) ||
          skill.includes(titleLower)
        )
    );

    return {
      id: String(index + 1),

      position: {
        x: 250,
        y: index * 140
      },

      data: {
        title: step.title,
        
        duration: isKnown ? "Already Known" : step.duration,
originalDuration: step.duration,
        status: isKnown ? "completed" : "pending",
        proofOfWork: step.proofOfWork,
        interviewCheckpoint: step.interviewCheckpoint
      },

      type: "custom"
    };
  });

  // Final target node
  nodes.push({
    id: String(nodes.length + 1),

    position: {
      x: 250,
      y: nodes.length * 140
    },

    data: {
      title: `${role} (${company})`,
      duration: "Target Goal",
      status: "target"
    },

    type: "custom"
  });

  // Connect roadmap nodes
  const edges = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `e${nodes[i].id}-${nodes[i + 1].id}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      animated: true
    });
  }

  return {
    nodes,
    edges
  };
}