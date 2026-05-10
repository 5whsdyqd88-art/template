export const codeMockupContent = {
  eyebrow: 'DEVELOPERS',
  headline: 'Integrate Relay in five lines',
  body: 'Drop-in replacement for your existing HTTP client. Works with Node.js, Python, or curl. No server changes required.',
  docsLink: 'Read the docs →',
  copyLabel: 'Copy code',
  tabs: {
    node: { label: 'Node.js', sample: `const relay = require('relay-sdk');

relay.send({
  to: '+1234567890',
  from: '+0987654321',
  body: 'Hello from Relay!',
});` },
    python: { label: 'Python', sample: `import relay

relay.send(
  to="+1234567890",
  from="+0987654321",
  body="Hello from Relay!"
)` },
    curl: { label: 'curl', sample: `curl https://api.relay.com/v1/messages \\
  -u your_api_key: \\
  -d from="+1234567890" \\
  -d to="+0987654321" \\
  -d body="Hello from Relay!"` }
  }
} as const;
