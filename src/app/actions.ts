"use server";

import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { Track } from "./components/Artwork";
import { describe } from "node:test";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_TOKENS = 300;
const SYSTEM_PROMPT = `
  You are a recording label manager with experience in helping musicians promote their music, you should offer valid advice to any user questions in relation to their music career. 
  Reply in a friendly informal way and highlight the best options without too much detail unless specifically asked to expand.
`;

export const promptServerAction = async (
  conversation: ChatCompletionMessageParam[],
  newUserPrompt: string
): Promise<ChatCompletionMessageParam[] | []> => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversation,
        { role: "user", content: newUserPrompt },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      max_tokens: MAX_TOKENS,
      top_p: 1,
    });

    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A cute baby sea otter",
    });

    console.log(image.data);
    return [
      ...conversation,
      { role: "assistant", content: chatCompletion.choices[0].message.content },
    ];
  } catch (e) {
    console.log("error", e);
    return [];
  }
};

export const createArtwork = async ({ title, moods, description }: Track) => {
  const prompt = `Create an artistic and abstract representation of a song titled ${title} with no text in the image. The song is set in ${moods} moods. The song can be described as ${description}`;
  const images = await openai.images.generate({
    model: "dall-e-2",
    prompt,
    n: 3,
    quality: "standard",
    size: "1024x1024",
  });
  return images.data;
};

export const createAudienceAgeRange = async ({ genre }: Track) => {
  try {
    const prompt = `In different age ranges, what are the percentage share of popularity for ${genre} music. The output should be of the form {age_range: percentage}`;
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });

    return response.choices[0].message.content;
  } catch (e) {
    console.log("error", e);
    return [];
  }
};

export const createAudienceTopCountries = async ({ genre }: Track) => {
  try {
    const prompt = `Name top three countries where ${genre} music is popular. The output should be an array of the form {topCountries: []}`;
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });

    return response.choices[0].message.content;
  } catch (e) {
    console.log("error", e);
    return [];
  }
};

export const createPromoText = async ({
  title,
  genre,
  moods,
  artist,
}: Track) => {
  try {
    const prompt = `You are a musician called ${artist}. Please write a text to pitch your upcoming track titled ${title} to a music supervisor. The genre of the track is ${genre}. The track is set in mood ${moods}. Keep it short and professional.`;
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      max_tokens: MAX_TOKENS,
      top_p: 1,
    });

    return response.choices[0].message.content;
  } catch (e) {
    console.log("error", e);
    return [];
  }
};

export const createSocialText = async ({
  title,
  genre,
  moods,
  artist,
}: Track) => {
  try {
    const prompt = `You are a musician called ${artist}. Please write a catchy caption to create buzz about your upcoming track titled ${title} for social media posts. The genre of the track is ${genre}. The track is set in mood ${moods}. Keep it short.`;
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      max_tokens: MAX_TOKENS,
      top_p: 1,
    });

    return response.choices[0].message.content;
  } catch (e) {
    console.log("error", e);
    return [];
  }
};

export const createInstagramStory = async (
  title: string,
  description: string
) => {
  const prompt = `Create an image that I can share as my instagram story for creating buzz and hype around my new song. My song is a ${description} titled ${title}`;
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    quality: "standard",
    size: "1024x1792",
  });
  return image.data[0].url;
};
