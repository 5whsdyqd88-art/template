export const testimonialsContent = {
  eyebrow: "CUSTOMERS",
  headline: "Built by teams who ship",
  quotes: [
    {
      quote:
        "The first webhook moved through Relay before our standup ended. The SDK reads like something an engineer wrote, not a committee. We stopped writing wrappers around our communications layer.",
      name: "Hannah Voss",
      role: "Staff Engineer",
      company: "Pylon",
      initials: "HV",
    },
    {
      quote:
        "We pushed forty million messages through during launch week and the dashboard never blinked. Retries and idempotency are handled at the protocol layer, so the on-call rotation finally got quiet. Nothing about scale feels improvised anymore.",
      name: "Diego Marín",
      role: "Head of Infrastructure",
      company: "Beacon",
      initials: "DM",
    },
    {
      quote:
        "Relay collapsed two homegrown notification systems into one weekend's work. The team that maintained the old stack now ships product features instead of patching glue. Our roadmap got six weeks of capacity back.",
      name: "Priya Subramanian",
      role: "Platform Lead",
      company: "Mira",
      initials: "PS",
    },
  ],
} as const;
