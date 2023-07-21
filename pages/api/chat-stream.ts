// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as HttpServer } from 'http';
import type { Server as HttpsServer } from 'https';
import { WebSocketServer } from 'ws';
import { HNSWLib } from 'langchain/vectorstores/hnswlib'; // https://js.langchain.com/docs/api/vectorstores_hnswlib/classes/HNSWLib
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import {
  formatHistory,
  //makeRetrievalQAChain as makeChain,
  makeConversationalRetrievalQAChain as makeChain,
  //makeVectorDBQAChain as makeChain,
} from './util';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if ((res.socket as any).server.wss) {
    res.end();
    return;
  }

  const server = (res.socket as any).server as HttpsServer | HttpServer;
  const wss = new WebSocketServer({ noServer: true });
  (res.socket as any).server.wss = wss;
  
  server.on('upgrade', (req, socket, head) => {
    if (!req.url?.includes('/_next/webpack-hmr')) {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    }
  });

  wss.on('connection', (ws) => {
    const sendResponse = ({ sender, message, type }: { sender: string, message: string, type: string }) => {
      ws.send(JSON.stringify({ sender, message, type }));
    };

    const onNewToken = (token: string) => {
      sendResponse({
        sender: 'bot',
        message: token,
        type: 'stream',
      });
    }

    const embeddings = new OpenAIEmbeddings({
      azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME_TEXT_EMBEDDING,
    });
    const chainPromise = HNSWLib.load('data', embeddings).then((vs) => makeChain(vs, onNewToken));

    const chatHistory: [string, string][] = [];
    const encoder = new TextEncoder();

    ws.on('message', async (data) => {
      try {
        const question = data.toString();
        sendResponse({ sender: 'you', message: question, type: 'stream' });

        sendResponse({ sender: 'bot', message: '', type: 'start' });
        const chain = await chainPromise;

        const result = await chain.call({
          // Required for VectorDBQAChain
          //query: question,

          // Required for RetrievalQAChain
          //query: question,

          // Required for ConversationalRetrievalQAChain
          question: question,
          chat_history: formatHistory(chatHistory),
        });

        chatHistory.push([question, result.answer]);

        sendResponse({ sender: 'bot', message: '', type: 'end' });
      } catch (e) {
        sendResponse({
            sender: 'bot',
            message: 'Sorry, something went wrong. Try again.',
            type: 'error'
        });
      }
    })
  });

  res.end();
}
