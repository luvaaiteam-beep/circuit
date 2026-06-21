import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = "You are CircuitForge AI, an expert electronics engineer and educator embedded in a 3D circuit simulator. Help users understand their circuits, debug problems, explain components, and suggest improvements. Be concise, practical, and friendly. When referencing components use their simulator names. Format numbers with units (e.g. 14.9mA, 470Ω, 9V). Never use markdown headers in responses — use plain conversational text only.";

const VALID_ROUTES = new Set([
  '/', '/sim', '/simulator', '/gallery', '/features', '/about', '/privacy', '/terms'
]);
const VALID_PREFIXES = ['/shared/', '/embed/'];

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("Gemini API key is missing. Please add GEMINI_API_KEY to your environment variables.");
    }
    geminiClient = new GoogleGenAI({ apiKey: key });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());

  app.get('/api/ping', (req, res) => {
    res.status(200).send('pong');
  });

  app.post('/api/askQuick', async (req, res) => {
    try {
      const { question, circuitContext } = req.body;
      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-2.5-pro",
        contents: question,
        config: {
          systemInstruction: `${SYSTEM_PROMPT}\n\nCurrent Circuit Context:\n${circuitContext}`,
        }
      });
      res.json({ text: response.text || '' });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Error communicating with AI' });
    }
  });

  app.post('/api/streamAsk', async (req, res) => {
    try {
      const { userMessage, history, circuitContext } = req.body;
      const client = getGeminiClient();
      const chat = client.chats.create({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: `${SYSTEM_PROMPT}\n\nCurrent Circuit Context:\n${circuitContext}`,
        },
      });

      const historyText = history.slice(-10).map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n\n');
      const fullMessage = historyText ? `Previous Conversation:\n${historyText}\n\nUser: ${userMessage}` : userMessage;

      const stream = await chat.sendMessageStream({ message: fullMessage });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of stream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (e: any) {
      if (!res.headersSent) {
          res.status(500).json({ error: e.message || 'Error communicating with AI' });
      } else {
          res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
          res.end();
      }
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    // Add middleware to block unknown non-asset routes with 410 in dev
    app.use((req, res, next) => {
      const isInternal = req.path.startsWith('/@') || req.path.startsWith('/src/') || req.path.startsWith('/node_modules/');
      const hasExt = /\.[a-zA-Z0-9]+$/.test(req.path);
      const isSpa = VALID_ROUTES.has(req.path) || VALID_PREFIXES.some(p => req.path.startsWith(p));
      const isApi = req.path.startsWith('/api/');
      
      if (!isInternal && !hasExt && !isSpa && !isApi) {
        return res.status(410).send('410 Gone - This page has been permanently removed.');
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      const isSpa = VALID_ROUTES.has(req.path) || VALID_PREFIXES.some(p => req.path.startsWith(p));
      if (isSpa) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        res.status(410).send('410 Gone - This page has been permanently removed.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
