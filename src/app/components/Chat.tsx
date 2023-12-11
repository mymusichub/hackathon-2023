"use client";

import { ChatCompletionMessageParam } from "openai/resources";
import { FormEventHandler, useState } from "react";
import { promptServerAction } from "../actions";
import styles from "./chat.module.css";

const Chat = () => {
  const [formInput, setFormInput] = useState<string>('');
  const [conversation, setConversation] = useState<ChatCompletionMessageParam[]>([]);

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
        {conversation?.map((it, index) => (
          <li className={styles.choiceListItem} key={index}>
            <h3 className={styles.choiceListItemHeader}>{it.role}</h3>
            <p>{it.content as string}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className={styles.chatForm}>
        <textarea value={formInput} placeholder="Ask me something about music promotion" onChange={e => setFormInput(e.currentTarget.value)} onKeyDown={event => {
        if (event.key === 'Enter') {
          handleSubmit(event as any);
        }
      }} className={styles.chatInput} />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Chat;