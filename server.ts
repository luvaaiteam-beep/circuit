import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

admin.initializeApp();

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

const verifyFirebaseToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authentication token' });
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    return res.status(401).json({ error: 'Unauthorized access' });
  }
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      const allowedOrigins = ['https://luvaai.in', 'http://localhost:3000', 'http://localhost:5173'];
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.run.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };
  
  app.use(cors(corsOptions));
  app.use(express.json());

  app.get('/api/ping', (req, res) => {
    res.status(200).send('pong');
  });

  const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 requests per minute
    message: { error: 'Too many requests, please try again later.' }
  });

  app.post('/api/askQuick', aiLimiter, async (req, res) => {
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

  app.post('/api/streamAsk', aiLimiter, verifyFirebaseToken, async (req, res) => {
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
    
    // Set 410 status for unknown non-asset routes but let SPA handle rendering
    app.use((req, res, next) => {
      const isInternal = req.path.startsWith('/@') || req.path.startsWith('/src/') || req.path.startsWith('/node_modules/');
      const hasExt = /\.[a-zA-Z0-9]+$/.test(req.path);
      const isSpa = VALID_ROUTES.has(req.path) || VALID_PREFIXES.some(p => req.path.startsWith(p));
      const isApi = req.path.startsWith('/api/');
      
      if (!isInternal && !hasExt && !isSpa && !isApi) {
        res.status(410);
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      const isSpa = VALID_ROUTES.has(req.path) || VALID_PREFIXES.some(p => req.path.startsWith(p));
      if (!isSpa) {
        res.status(410);
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
