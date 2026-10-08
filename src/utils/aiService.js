export async function generateRoadmap(userInput) {
  // Simulate network processing delay for realistic UX
  await new Promise(resolve => setTimeout(resolve, 1500));

  const role = userInput.role || "Software Engineer";
  const company = userInput.company || "Tech Startup";
  const known = (userInput.knownSkills || "")
    .toLowerCase()
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const roleLower = role.toLowerCase();
  let steps = [];

  // Tailor step recommendations to domain keywords
  if (roleLower.includes("ml") || roleLower.includes("machine learning") || roleLower.includes("data") || roleLower.includes("ai")) {
    steps = [
      { title: "Python & Data Science Stack", duration: "2 weeks", keyword: "python" },
      { title: "Linear Algebra & Statistics", duration: "3 weeks", keyword: "sql" },
      { title: "Machine Learning Math & Scikit-Learn", duration: "3 weeks", keyword: "math" },
      { title: "Deep Learning Frameworks (PyTorch/TF)", duration: "4 weeks", keyword: "pytorch" },
      { title: "Model Deployment & API Serving", duration: "3 weeks", keyword: "fastapi" },
      { title: `Domain Project for ${company}`, duration: "2 weeks", keyword: "project" },
    ];
  } else if (roleLower.includes("front") || roleLower.includes("web") || roleLower.includes("react") || roleLower.includes("ui")) {
    steps = [
      { title: "HTML, CSS & Modern JS (ES6+)", duration: "2 weeks", keyword: "javascript" },
      { title: "React.js Component Architecture", duration: "3 weeks", keyword: "react" },
      { title: "State Management & API Integration", duration: "2 weeks", keyword: "state" },
      { title: "UI/UX Systems & CSS Frameworks", duration: "2 weeks", keyword: "css" },
      { title: `Production Project for ${company}`, duration: "3 weeks", keyword: "project" },
    ];
  } else if (roleLower.includes("back") || roleLower.includes("node") || roleLower.includes("system") || roleLower.includes("devops")) {
    steps = [
      { title: "Data Structures & Algorithms", duration: "3 weeks", keyword: "dsa" },
      { title: "Node.js / Express Architecture", duration: "3 weeks", keyword: "node" },
      { title: "SQL & NoSQL Database Design", duration: "2 weeks", keyword: "sql" },
      { title: "System Design & Caching", duration: "3 weeks", keyword: "system" },
      { title: `Scalable Backend for ${company}`, duration: "2 weeks", keyword: "project" },
    ];
  } else {
    steps = [
      { title: "Foundational Programming", duration: "2 weeks", keyword: "code" },
      { title: "Core System Architecture", duration: "3 weeks", keyword: "core" },
      { title: "Advanced Domain Concepts", duration: "3 weeks", keyword: "advanced" },
      { title: "Industry Frameworks & Tooling", duration: "3 weeks", keyword: "framework" },
      { title: `Targeted Portfolio Project for ${company}`, duration: "2 weeks", keyword: "project" },
    ];
  }

  // Dynamically create React Flow nodes
  const nodes = steps.map((step, index) => {
    const isKnown = known.some(k => k && (step.title.toLowerCase().includes(k) || step.keyword.includes(k)));
    return {
      id: String(index + 1),
      position: { x: 250, y: index * 120 },
      data: {
        title: step.title,
        duration: isKnown ? "Already Known" : step.duration,
        status: isKnown ? "completed" : "pending"
      },
      type: "custom"
    };
  });

  // Add final Target Node
  nodes.push({
    id: String(nodes.length + 1),
    position: { x: 250, y: nodes.length * 120 },
    data: {
      title: `${role} (${company})`,
      duration: "Target Goal",
      status: "target"
    },
    type: "custom"
  });

  // Dynamically generate edges
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