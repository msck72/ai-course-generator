/**
 * Generates structured course curriculum (title, description, tags, modules, lessons)
 */
const courseOutlinePrompt = (topic) => `
You are an expert curriculum designer and educator.
Create a structured online course for the following topic: "${topic}".

Return ONLY valid JSON matching this exact structure:
{
  "title": "Course Title (clear and professional)",
  "description": "2-3 sentences summarizing what the student will learn and achieve.",
  "tags": ["tag1", "tag2", "tag3"],
  "modules": [
    {
      "title": "Module 1: Foundations",
      "lessons": [
        "Lesson 1 Title",
        "Lesson 2 Title",
        "Lesson 3 Title"
      ]
    },
    {
      "title": "Module 2: Core Concepts",
      "lessons": [
        "Lesson 1 Title",
        "Lesson 2 Title",
        "Lesson 3 Title"
      ]
    },
    {
      "title": "Module 3: Advanced Topics & Hands-on Project",
      "lessons": [
        "Lesson 1 Title",
        "Lesson 2 Title"
      ]
    }
  ]
}

Ensure the course has 3 to 4 modules, each with 2 to 3 logically progressive lessons.
`;

/**
 * Generates rich polymorphic blocks for a specific lesson:
 * - headings & paragraphs
 * - syntax-highlighted code
 * - YouTube search query
 * - interactive MCQ with options & explanation
 */
const lessonEnrichPrompt = (courseTitle, moduleTitle, lessonTitle) => `
You are an expert technical instructor.
Create the detailed learning content for the following lesson:
Course: "${courseTitle}"
Module: "${moduleTitle}"
Lesson: "${lessonTitle}"

Return ONLY valid JSON matching this exact structure:
{
  "title": "${lessonTitle}",
  "objectives": [
    "Learning objective 1",
    "Learning objective 2",
    "Learning objective 3"
  ],
  "content": [
    {
      "type": "heading",
      "text": "Introduction & Concept Overview"
    },
    {
      "type": "paragraph",
      "text": "Detailed, thorough conceptual explanation formatted with clarity."
    },
    {
      "type": "code",
      "language": "javascript",
      "text": "// Practical code example\\nconsole.log('Demonstrating concept');"
    },
    {
      "type": "heading",
      "text": "Deep Dive & Best Practices"
    },
    {
      "type": "paragraph",
      "text": "Key caveats, performance considerations, and real-world tips."
    },
    {
      "type": "video",
      "query": "${courseTitle} ${lessonTitle} tutorial"
    },
    {
      "type": "mcq",
      "question": "A conceptual multiple choice question testing understanding of this lesson.",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": 1,
      "explanation": "Clear explanation of why this option is correct."
    }
  ]
}

Important Rules:
1. In the "mcq" block, "answer" MUST be the 0-based integer index of the correct option in "options" (0, 1, 2, or 3).
2. Choose an appropriate code language (python, javascript, sql, bash, etc.) based on the lesson topic.
`;


const hinglishConversionPrompt = (lessonTitle, lessonSummary) => `You are an engaging, friendly computer science educator (like top YouTube mentors).
Explain the lesson titled "${lessonTitle}" in conversational, engaging Hinglish (Hindi written in the English/Latin alphabet, naturally mixed with English technical terms, e.g. "Aaj hum samjhenge...").
Context/Lesson Details:
${lessonSummary}
Guidelines:
1. Explain the core intuition simply, why it matters, and a quick everyday analogy.
2. Tone: Conversational, warm, and natural for spoken audio.
3. Length: 150-220 words (around 1.5 minutes of spoken audio).
4. Strictly return plain text only. Do NOT use markdown symbols, bullet points, asterisks, bolding, or quotes so it speaks smoothly with text-to-speech.`;

module.exports = {
    courseOutlinePrompt,
    lessonEnrichPrompt,
    hinglishConversionPrompt
};