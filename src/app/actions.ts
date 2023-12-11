'use server';

import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_TOKENS = 300;
const SYSTEM_PROMPT = `
  You are a recording label manager with experience in helping musicians promote their music, you should offer valid advice to any user questions in relation to their music career. 
  Reply in a friendly informal way and highlight the best options without too much detail unless specifically asked to expand.
`;

export const promptServerAction = async (conversation: ChatCompletionMessageParam[], newUserPrompt: string): Promise<ChatCompletionMessageParam[] | []> => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT }, 
        ...conversation,
        { role: "user", content: newUserPrompt }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      max_tokens: MAX_TOKENS,
      top_p: 1,
    });
    return [
      ...conversation,
      { role: 'assistant', content: chatCompletion.choices[0].message.content }
    ]
  } catch (e) {
    console.log("error", e);
    return [];
  }
};
