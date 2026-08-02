const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `const chat = client.chats.create({
        model: GEMINI_MODEL,
        config: {
          systemInstruction: \`\${SYSTEM_PROMPT}\\n\\nCurrent Circuit Context:\\n\${circuitContext}\`,
        },
      });`;

const replacement = `const chat = client.chats.create({
        model: "gemini-3.1-pro-preview",
        config: {
          systemInstruction: \`\${SYSTEM_PROMPT}\\n\\nCurrent Circuit Context:\\n\${circuitContext}\`,
          thinkingConfig: { thinkingLevel: 'HIGH' }
        },
      });`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('server.ts', code);
  console.log("Patched streamAsk");
} else {
  console.log("Could not find target in server.ts");
}
