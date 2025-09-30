import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Generate Notes Feature
export const generateNotes = async (topic) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Create clear study notes about "${topic}" in simple Markdown format.

- Use 3 short paragraphs with proper spacing.

- Highlight key terms in **bold**.

- At the end, include 4–5 key points as bullet points.`;

  const result = await model.generateContent(prompt);
  const text = result.response.candidates[0].content.parts[0].text;

  return text;
};

// Summarize Text Feature
export const summarizeText = async (text) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `Summarize this text into short, easy notes:\n\n${text}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Generate Quiz Feature
export const generateQuiz = async (topic, numQuestions = 10) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Generate ${numQuestions} multiple-choice questions on "${topic}". 
Each question must have 4 options with letters A, B, C, D followed by a colon and the option text.
Return ONLY a valid JSON array in this format:
[
  { 
    "question": "What is the past participle of 'eat'?", 
    "options": ["A: Ate", "B: Eating", "C: Eaten", "D: Eat"], 
    "answer": "C" 
  }
]`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  // Remove markdown code block if it exists
  if (text.startsWith("```")) {
    text = text.replace(/```(json)?/g, "").trim();
    text = text.replace(/```$/, "").trim();
  }

  // Try parsing the JSON safely
  try {
    return JSON.parse(text);
  } catch (err) {
    console.warn("AI returned invalid JSON. Attempting manual fix…");

    text = text.replace(/\n/g, " "); // Replace newlines
    text = text.replace(/,(\s*[\]}])/g, "$1"); // Remove trailing commas

    try {
      return JSON.parse(text);
    } catch (err2) {
      console.error("Failed to parse AI output:", text);
      return [];
    }
  }
};

