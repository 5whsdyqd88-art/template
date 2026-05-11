export const codeMockupContent = {
  eyebrow: "DEVELOPERS",
  headline: "Send your first message in five lines.",
  body: "Authenticate, build a payload, hit one endpoint. The same call shape spans SMS, WhatsApp, and voice — pick any language.",
  docsLink: "Read the docs",
  tabs: {
    node: "Node.js",
    python: "Python",
    curl: "curl",
  },
  copyButton: {
    label: "Copy code sample",
    copied: "Copied",
  },
  samples: {
    node: `import { Relay } from "@relay/sdk";
const relay = new Relay(process.env.RELAY_API_KEY);
await relay.messages.create({
  to: "+14155550182", from: "+14155550199", channel: "sms", body: "Your code is 482910",
});`,
    python: `import os
from relay import Client

relay = Client(api_key=os.environ["RELAY_API_KEY"])
relay.messages.create(
    to="+14155550182",
    from_="+14155550199",
    channel="sms",
    body="Your code is 482910",
)`,
    curl: `curl -X POST https://api.relay.dev/v1/messages \\
  -H "Authorization: Bearer $RELAY_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+14155550182",
    "from": "+14155550199",
    "channel": "sms",
    "body": "Your code is 482910"
  }'`,
  },
} as const;
