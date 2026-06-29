import { ComponentData, WireData } from '../store';
import { auth } from '../firebase';

export type ChatMessage = { role: 'user' | 'assistant', content: string };

export const QUICK_PROMPTS = [
  "Why isn't my LED lighting up?",
  "Is my circuit safe? Check current levels.",
  "How do I add a transistor switch to control my motor?",
  "What's the power dissipation of this circuit?",
  "Explain what each component in my circuit does.",
  "How can I reduce the current through my LED?",
];

export async function buildCircuitContext(
  components: ComponentData[],
  wires: WireData[],
  simStats: { v: number, i: number, r: number, p: number, closed: boolean }
): Promise<string> {
  const compSummary = components.map(c => {
    let props = '';
    if (c.properties) {
      props = Object.entries(c.properties).map(([k, v]) => `${k}=${v}`).join(', ');
    }
    return `${c.type} (${props})`;
  }).join(', ');

  return `Circuit has ${components.length} components: ${compSummary}.
Wires: ${wires.length} connections forming a ${simStats.closed ? 'closed loop' : 'open circuit'}.
Simulation: ${simStats.closed ? 'RUNNING' : 'IDLE'} — ${(simStats.i * 1000).toFixed(1)}mA @ ${simStats.v.toFixed(1)}V, R_eq=${simStats.r.toFixed(1)}Ω, P=${(simStats.p * 1000).toFixed(1)}mW.`;
}

export async function* streamAsk(
  userMessage: string,
  history: ChatMessage[],
  circuitContext: string
): AsyncGenerator<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Please sign in to use the AI assistant.');
  }
  
  const token = await user.getIdToken();
  const response = await fetch('/api/streamAsk', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userMessage, history, circuitContext }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('Streaming not supported');

  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    
    let boundary = buffer.indexOf('\n\n');
    while (boundary !== -1) {
      const chunk = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 2);
      
      if (chunk.startsWith('data: ')) {
        const dataStr = chunk.slice(6);
        if (dataStr === '[DONE]') {
          return;
        }
        try {
          const data = JSON.parse(dataStr);
          if (data.error) throw new Error(data.error);
          if (data.text) yield data.text;
        } catch (e) {
          // parse error or handled error
        }
      }
      boundary = buffer.indexOf('\n\n');
    }
  }
}

export async function askQuick(question: string, circuitContext: string): Promise<string> {
  const response = await fetch('/api/askQuick', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, circuitContext }),
  });
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Network error');
  }

  const data = await response.json();
  return data.text;
}

