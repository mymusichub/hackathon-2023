'use server';

import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import {ThreadMessage} from "openai/resources/beta/threads";
import {CursorPage} from "openai/pagination";
import {RunSubmitToolOutputsParams} from "openai/src/resources/beta/threads/runs/runs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_TOKENS = 300;
const SYSTEM_PROMPT = `
  You are a recording label manager with experience in helping musicians promote their music, you should offer valid advice to any user questions in relation to their music career. 
  Reply in a friendly informal way and highlight the best options without too much detail unless specifically asked to expand.
`;
const ASSISTANT_INSTRUCTIONS = ` 
You are an assistant for the music distribution platform MusicHub, helping emerging musicians promoting their to be 
released new music to social media, playlist curators, radio stations, press and fans. 
Users are using MusicHub to distribute their music, so don't recommend any competitors like DistroKid or TuneCore.
Limit your answers to three bullet points.
The artist is named RebelLog and describes themselves as "#Electronic,Ambient/Experimental  #TheatricalElectronicMusic - RebelLog is a multidisciplinary artist - composer, singer, music producer and choreographer - originally from Rio de Janeiro and based in Frankfurt. She creates music for voice, electronics/analogue synths and also develops soundscapes for dance, theatre and film. She was a member of the project #AlienCafe (RoyalFlameMusic) and #TapeFive (ChinChinRecords) among many others. As a dancer she was a guest of the legendary #PinaBausch Co.".
She has a new album in the Electro/Ambient genre called "Ec(h)o Melancholia", which is described as "Ec(h)o Melancholia wants to offer a moment to reflect upon the ongoing changes in our eco-logical environment and let this moment echo in the eardrums. The album also wants to be a stimulus to imagine a possible transformation beyond "The Anthropocene", a necessary utopia. The original creations use a great deal of echo effects, analogue synthesizers, indigenous tribal rhythms, vocalises, "spoken word" in different languages, viola solo, sounds of fire / crystals and a little bossa nova. Support: Funded by the Federal Government Commissioner for Culture and the Media as part of the NEUSTART KULTUR Corona funding initiative by Gema Germany."
The release date was 1st December 2023 and can be listened to at https://listen.music-hub.com/yomDbQ.
`;
const LABEL_MANAGER_ASSISTANT_ID = 'asst_W5d2gyzp6OiXjsbLvbIPL8Nv'

export interface AssistantIds {
    id: string;
    threadId: string;
}

export const startThread = async (): Promise<AssistantIds> => {
  /*const assistant = await openai.beta.assistants.create({
    model: "gpt-4",
    instructions: ASSISTANT_INSTRUCTIONS,
    name: "MusicHub Assistant",
    tools: [],
  })
  console.log("Created assistant with id " + assistant.id)*/
  const assistant = await openai.beta.assistants.retrieve(LABEL_MANAGER_ASSISTANT_ID);
  console.log("Retrieved assistant with id " + assistant.id)

  const thread = await openai.beta.threads.create();
  console.log("Created thread with id " + thread.id)
  return {id: assistant.id, threadId: thread.id};
}

export const addToThread = async (assistantIds: AssistantIds, newUserPrompt: string): Promise<CursorPage<ThreadMessage>> => {
  console.log("Adding to thread with id " + assistantIds.threadId)
  await openai.beta.threads.messages.create(assistantIds.threadId, {
    role: "user",
    content: newUserPrompt,
  });

  console.log("Running assistant with id " + assistantIds.id + " on thread with id " + assistantIds.threadId + " with prompt " + newUserPrompt)
  // Use runs to wait for the assistant response and then retrieve it
  const run = await openai.beta.threads.runs.create(assistantIds.threadId, {
    assistant_id: assistantIds.id,
  });

  let runStatus = await openai.beta.threads.runs.retrieve(
      assistantIds.threadId,
      run.id
  );

  // Polling mechanism to see if runStatus is completed
  // This should be made more robust.
  while (runStatus.status !== "completed") {
    console.log("Still running... " + runStatus.status)
    if (runStatus.status === "requires_action" && runStatus.required_action?.type === "submit_tool_outputs") {
      console.log("Requires action")
      console.log(runStatus.required_action.submit_tool_outputs.tool_calls)
      /*[
          {
            id: 'call_KjQIIRvD7S5PuQTr292BQFHH',
            type: 'function',
            function: {
              name: 'getRadioStations',
              arguments: '{"country":"Germany","genre":"Ambient"}'
            }
          }
        ]
       */
      const toolOutputs: RunSubmitToolOutputsParams.ToolOutput[]  = runStatus.required_action.submit_tool_outputs.tool_calls.map(toolCall => {
        if (toolCall.function.name === "getRadioStations") {
          const argumentsJson = JSON.parse(toolCall.function.arguments)
          return {
            tool_call_id: toolCall.id,
            output:  getRadioStations(argumentsJson.country,  argumentsJson.genre).join(",")
          } as RunSubmitToolOutputsParams.ToolOutput
        } else return {
              tool_call_id: toolCall.id,
              output: ""
        } as RunSubmitToolOutputsParams.ToolOutput
      })

      openai.beta.threads.runs.submitToolOutputs(assistantIds.threadId, run.id, {tool_outputs: toolOutputs})
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    runStatus = await openai.beta.threads.runs.retrieve(assistantIds.threadId, run.id);
  }

  // Get the last assistant message from the messages array
  console.log("Thread with id " + assistantIds.threadId + " has finished run with status " + runStatus.status)
  return openai.beta.threads.messages.list(assistantIds.threadId)
}

const getRadioStations = (country: string, genre: string) => {
  console.log("Getting radio stations for country " + country + " and genre " + genre)
   if (genre === "Ambient" && country === "Germany")
     return ["MyAmbientRadio", "AmbientFM 123"]
   else if (genre === "Electronic")
     return ["UmpfUmpfRadio", "ElectronicFM", "Doktor Mottes Schießbude"]
   else
     return ["FluxFM", "RadioEins"]
}

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
