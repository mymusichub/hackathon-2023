"use client";

import React, { useState } from "react";

const Playground = () => {
  const [prompt, setPrompt] = useState("Some prompt");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const getResponseFromOpenAI = async () => {
    setResponse("");
    console.log("Getting response from OpenAI...");
    setIsLoading(true);
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    const data = await response.json();
    setIsLoading(false);
    console.log(data);
  };

  return <button onClick={() => getResponseFromOpenAI()}>Click me!</button>;
};

export default Playground;
