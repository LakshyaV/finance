import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

export async function generateGoalSteps(
  title: string,
  description?: string,
  targetAmount?: string,
  deadline?: string
): Promise<string[]> {
  try {
    const prompt = `You're helping someone break down their financial goal into actionable steps. 

Goal: ${title}
${description ? `Context: ${description}` : ""}
${targetAmount ? `Target Amount: $${targetAmount}` : ""}
${deadline ? `Deadline: ${deadline}` : ""}

Generate 3-5 specific, actionable steps they can take to achieve this goal. Each step should be:
- Concrete and measurable
- Motivating but realistic  
- Ordered from immediate to longer-term

Return ONLY a JSON array of strings, nothing else.`;

    const response = await cohere.chat({
      model: "command-r-plus-08-2024",
      message: prompt,
      responseFormat: {
        type: "json_object",
        schema: {
          type: "object",
          properties: {
            steps: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["steps"]
        }
      },
      maxTokens: 400,
    });

    const content = response.text;
    if (!content) return [];

    const result = JSON.parse(content);
    return result.steps || [];
  } catch (error) {
    console.error("Failed to generate goal steps:", error);
    return [];
  }
}
