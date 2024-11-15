import ConversationManager from "@/src/constant";
import { getRandomInt } from "../dashboard.p";
import { v4 as uuidv4 } from 'uuid';
// yarn add langchain @langchain/openai

import { ChatOpenAI } from "@langchain/openai";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { VectorStoreRetrieverMemory } from "langchain/memory";
import { LLMChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PromptTemplate } from "@langchain/core/prompts";
// import 


export default async function handler(req, res) {
  let uuid = uuidv4();
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  }));
  const memory = new VectorStoreRetrieverMemory({
    // 1 is how many documents to return, you might want to return more, eg. 4
    vectorStoreRetriever: vectorStore.asRetriever(4),
    memoryKey: "history",
  });
  const prompt =
    PromptTemplate.fromTemplate(`
You are the Hiring Manager or Interviewer. The Manager is kind and know how to hire the best guy and you need to collect all the possible information that is required for hiring. you are looking for python developer with strictly 3 years of experience in Rest APIS and excellence in english

dont ask lot of questions (max 10)
never repeat any question until user ask to repeat
never ask multiple questions together
never ask the question again, if the user has already answered that
if user is not giving the answers accurately, move ahead to next question.
ask the priority questions first and try to get the detailed response from the user.
keep every question different and say thank you and end conversation when all questions are answered by user
keep your questions short and easy to understand
when ending the conversation, never say that you can assist them
if user says they don't want to be a part or are not perfect fit, say thank you and end the conversation without asking any question

Relevant pieces of previous conversation:
{history}

Never share complete requirement of skills until user is good in task
(You do not need to use these information if not relevant)


Prepare a response to user's previous query
<context>
{input}
</context>
`)
  const model = new OpenAI({ temperature: 0.6, openAIApiKey: "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" });

  const chain = new LLMChain({ llm: model, prompt, memory });

  ConversationManager[uuid] = {
    "chain": chain
  };
  res.json({
    "id": uuid
  });
}
