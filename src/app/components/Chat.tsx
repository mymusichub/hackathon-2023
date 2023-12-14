"use client";

import { ChatCompletionMessageParam } from "openai/resources";
import {FormEventHandler, useEffect, useState} from "react";
import {AssistantIds, promptServerAction, startThread, addToThread} from "../actions";
import styles from "./chat.module.css";
import {ThreadMessage} from "openai/resources/beta/threads";

const Chat = () => {
  const [formInput, setFormInput] = useState<string>('');
  const [conversation, setConversation] = useState<ChatCompletionMessageParam[]>([]);
  const [assistantConversation, setAssistantConversation] = useState<ThreadMessage[]>([]); // [
  const [assistantIds, setThreadId] = useState<AssistantIds>()
  useEffect(() => { startThread().then(setThreadId) }, []);

  const handleAssistantSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (assistantIds) {
      const response = await addToThread(assistantIds, formInput)
      setAssistantConversation(response.data)
    }
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setFormInput('');
    const updatedConversation: ChatCompletionMessageParam[] = [
      ...conversation,
      {
        role: 'user',
        content: formInput
      },
    ];
    setConversation([
      ...updatedConversation,
      {
        role: 'assistant',
        content: '...',
      }
    ])
    const response = await promptServerAction(
      updatedConversation,
      formInput
    );
    setConversation(response);
  };

  return (
    <div className={styles.chatWrapper}>
      <ul className={styles.choiceList}>
        {assistantConversation?.flatMap((it, index) => {
          return it.content.map((content, index2) => {
            if (content.type === "text") {
               const key = "idx-" + index + "-" + index2
               return (<li className={styles.choiceListItem} key={key}>
                <h3 className={styles.choiceListItemHeader}>{it.role}</h3>
                <p>{content.text.value}</p>
              </li>)
            } else {
              return (<li key={index}></li>)
            }
          })
        })}
      </ul>
      <form onSubmit={handleAssistantSubmit} className={styles.chatForm}>
        <textarea value={formInput} placeholder="Ask me something about music promotion" onChange={e => setFormInput(e.currentTarget.value)} onKeyDown={event => {
        if (event.key === 'Enter') {
          handleAssistantSubmit(event as any);
        }
      }} className={styles.chatInput} />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Chat;