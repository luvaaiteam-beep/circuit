const fs = require('fs');
let code = fs.readFileSync('src/content/posts/how-to-make-a-simple-circuit.ts', 'utf8');

code = code.replace(
  "metaTitle: 'How to Make a Simple Circuit Online | CircuitForge',",
  "metaTitle: 'How to Make a Simple Circuit Online (Free Simulator)',"
);
code = code.replace(
  "metaDescription: 'Learn how to make a simple electric circuit in your browser. Discover what makes a circuit complete and avoid common mistakes. Start building!',",
  "metaDescription: 'Learn how to make a simple electric circuit in your browser. Discover what makes a circuit complete and avoid common mistakes.',"
);
code = code.replace(
  "ogTitle: 'How to Make a Simple Circuit — Free Online Guide with Live Simulator',",
  "ogTitle: 'How to Make a Simple Circuit Online (Free Simulator)',"
);
code = code.replace(
  "ogDescription: 'Learn how to make a simple electric circuit in your browser. Discover what makes a circuit complete and avoid common mistakes. Start building!',",
  "ogDescription: 'Learn how to make a simple electric circuit in your browser. Discover what makes a circuit complete and avoid common mistakes.',"
);
code = code.replace(
  "twitterTitle: 'How to Make a Simple Circuit — Free Online Guide with Live Simulator',",
  "twitterTitle: 'How to Make a Simple Circuit Online (Free Simulator)',"
);
code = code.replace(
  "twitterDescription: 'Learn how to make a simple electric circuit in your browser. Discover what makes a circuit complete and avoid common mistakes. Start building!',",
  "twitterDescription: 'Learn how to make a simple electric circuit in your browser. Discover what makes a circuit complete and avoid common mistakes.',"
);

fs.writeFileSync('src/content/posts/how-to-make-a-simple-circuit.ts', code);
console.log("Patched meta");
