import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatCompletionService = async (req: any, res: any) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: req.body.prompt }],
      model: "gpt-3.5-turbo",
    });
    console.log(chatCompletion);
    res.status(200).json({ data: chatCompletion });
  } catch (e) {
    console.log("error", e);
    res.status(400).json({ error: e });
  }
};

export default chatCompletionService;
