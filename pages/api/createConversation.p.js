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


export default async function handler(req, res) {
  let uuid = uuidv4();
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings({
    openAIApiKey: "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"
  }));
  const memory = new VectorStoreRetrieverMemory({
    // 1 is how many documents to return, you might want to return more, eg. 4
    vectorStoreRetriever: vectorStore.asRetriever(4),
    memoryKey: "history",
  });
  // console.log(memory, memory.saveContext)
  await memory.saveContext({
    input: `Introduction and Background:

Can you tell me a bit about yourself and your journey as a Python developer?
What motivated you to pursue a career in Python development?
Project Experience:

Could you describe a challenging Python project you've worked on in the past? What were your responsibilities, and how did you overcome any obstacles?
Have you been involved in any projects where you had to optimize performance or troubleshoot issues? Can you share your approach?
Problem-Solving Skills:

Can you walk me through a complex problem you faced in your previous role and how you went about solving it using Python?
How do you approach debugging and troubleshooting in Python? Can you share an example?
Collaboration and Teamwork:

Describe a situation where you had to collaborate with other team members on a Python project. What was the outcome, and what role did you play?
How do you handle disagreements or differing opinions within a development team?
Learning and Professional Development:

How do you stay updated on the latest developments and best practices in the Python ecosystem?
Can you share an instance where you had to quickly learn a new Python library or framework? How did you go about it?
Coding Practices and Style:

What coding practices and design patterns do you consider essential for writing clean and maintainable Python code?
How do you ensure your code is readable and adheres to PEP 8 guidelines?
Future Goals:

Where do you see yourself in the next few years in terms of your Python development career?
Are there any specific areas or technologies within Python that you're interested in exploring further?
Scenario-Based Questions:

If you were to start a new Python project from scratch, how would you go about structuring the code and selecting the right libraries or frameworks?
How would you approach the optimization of a Python application for better performance?
`}, { output: "ok" }
  )
  const prompt =
    PromptTemplate.fromTemplate(`You are the Hiring Manager. The Manager is kind and know how to hire the best guy and you need to collect all the possible information that is required for hiring. you are looking for  python developer with strictly 3 years of experience in Rest APIS and excellence in english

    dont ask lot of questions (max 10)
    keep your questions short and easy to understand
    if user says they don't want to be a part or are not perfect fit, say thank you and end the conversation without asking any question

Relevant pieces of previous conversation:
{history}

Never share complete requirement of skills until user is good in task
(You do not need to use these pieces of information if not relevant)

Current conversation:
Person: {input}
Hiring Director:`)
  const model = new OpenAI({ temperature: 0.4, openAIApiKey: "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" });

  const chain = new LLMChain({ llm: model, prompt, memory });

  ConversationManager[uuid] = {
    "chain": chain
  };
  res.json({
    "id": uuid
  });
}
