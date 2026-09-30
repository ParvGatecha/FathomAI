import { Meeting } from './types';

const NOW = Date.now();
const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

export const SEED_MEETINGS: Meeting[] = [
  {
    id: "meet-1",
    title: "Product Strategy Review: Q3 AI Copilot & SLAs",
    description: "Quarterly alignment on AI assistant features, sub-800ms latency SLAs, and beta customer rollout.",
    date: new Date(NOW - HOUR * 2).toISOString(), // 2 hours ago (Today)
    duration: 2520, // 42 mins
    category: "product",
    meetingType: "Strategy Review",
    platform: "zoom",
    tags: ["Product", "Roadmap", "AI Copilot", "Latency SLA", "Q3"],
    isFavorite: true,
    createdAt: new Date(NOW - HOUR * 2).toISOString(),
    speakers: [
      {
        id: "spk-1",
        name: "Sarah Chen",
        role: "VP of Product",
        email: "sarah.chen@fathom.work",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-2",
        name: "Alex Rivera",
        role: "Head of AI Research",
        email: "alex.rivera@fathom.work",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-3",
        name: "Marcus Vance",
        role: "Lead Systems Architect",
        email: "marcus.vance@fathom.work",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-4",
        name: "Elena Rostova",
        role: "Principal Product Designer",
        email: "elena.rostova@fathom.work",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
    ],
    summary: {
      templateId: "default",
      templateName: "Executive Overview",
      headline: "AI Copilot v2 beta locked for August 15th with sub-800ms latency SLA and MEDDIC sales template support.",
      overview: "The team reviewed technical benchmarks for the AI Copilot upgrade. Alex demonstrated that chunk-level embedding caching reduces query latency from 2.1s to 680ms. The team agreed on tiered rollout starting with 50 design partners, transitioning to general availability in September.",
      sections: [
        {
          id: "sec-1",
          title: "AI Inference Benchmarks & Latency Targets",
          bullets: [
            "Alex demonstrated sub-800ms time-to-first-token using the optimized hybrid RAG pipeline.",
            "Transcript chunk caching in Redis shaved 45% off recurring Q&A queries.",
            "Marcus confirmed the backend infrastructure will easily handle 10,000 concurrent streaming connections."
          ],
          citations: [
            { timestamp: 240, quote: "Our P95 latency dropped from 2.4 seconds to 780 milliseconds." },
            { timestamp: 410, quote: "Redis cache hit rate for transcript chunks is sitting at 91%." }
          ]
        },
        {
          id: "sec-2",
          title: "UX Design & Inline Highlights Interaction",
          bullets: [
            "Elena presented the new floating highlight toolbar for instant transcript clipping.",
            "User testing showed a 40% increase in summary shareability when action items had direct timestamp badges.",
            "Dark mode palette updated to deep slate with indigo accent glowing indicators."
          ],
          citations: [
            { timestamp: 920, quote: "Users want to click any citation chip and jump directly to that exact second." }
          ]
        }
      ],
      keyDecisions: [
        "Approved August 15th as the hard launch date for the AI Copilot v2 closed beta.",
        "Set strict P95 latency threshold of 800ms for all transcript-grounded chat responses.",
        "Selected MEDDIC and Engineering Sprint as default out-of-the-box summary templates."
      ],
      nextSteps: [
        "Alex to finalize streaming API error recovery handlers by Friday.",
        "Elena to publish updated Figma specs for the Clip Sharing modal.",
        "Marcus to provision staging environment with load-balanced Redis clusters."
      ]
    },
    availableSummaries: {
      default: {
        templateId: "default",
        templateName: "Executive Overview",
        headline: "AI Copilot v2 beta locked for August 15th with sub-800ms latency SLA and MEDDIC sales template support.",
        overview: "The team reviewed technical benchmarks for the AI Copilot upgrade. Alex demonstrated that chunk-level embedding caching reduces query latency from 2.1s to 680ms.",
        sections: [
          {
            id: "sec-1",
            title: "Performance & Latency",
            bullets: [
              "Sub-800ms response latency achieved with chunk caching.",
              "10,000 concurrent streaming connections validated."
            ]
          }
        ],
        keyDecisions: ["Approved August 15th beta launch", "Strict 800ms SLA"],
        nextSteps: ["Finalize streaming API", "Publish Figma clip modal specs"]
      }
    },
    actionItems: [
      {
        id: "act-1",
        text: "Finalize streaming SSE error recovery handlers in the API layer",
        assignee: { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
        completed: false,
        timestamp: 320,
        priority: "high",
        dueDate: "Aug 5, 2026"
      },
      {
        id: "act-2",
        text: "Deliver interactive clip trimming modal design specs in Figma",
        assignee: { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
        completed: true,
        timestamp: 945,
        priority: "medium",
        dueDate: "Aug 4, 2026"
      },
      {
        id: "act-3",
        text: "Provision Redis caching cluster on staging for load testing",
        assignee: { name: "Marcus Vance", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
        completed: false,
        timestamp: 610,
        priority: "high",
        dueDate: "Aug 6, 2026"
      }
    ],
    highlights: [
      {
        id: "hl-1",
        startTime: 240,
        endTime: 275,
        text: "Our P95 latency dropped from 2.4 seconds to 780 milliseconds when we moved to chunk-level caching.",
        color: "green",
        label: "Decision",
        createdByType: "ai"
      },
      {
        id: "hl-2",
        startTime: 915,
        endTime: 955,
        text: "Users love clicking any citation chip in Ask Fathom and immediately seeing the video scrub to that exact phrase.",
        color: "blue",
        label: "Key Point",
        createdByType: "ai"
      }
    ],
    transcript: [
      {
        id: "tr-1",
        speakerId: "spk-1",
        speakerName: "Sarah Chen",
        speakerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        speakerRole: "VP of Product",
        startTime: 0,
        endTime: 45,
        text: "Good morning everyone. Welcome to our Q3 product strategy review. Today we have three core topics: first, the latency benchmarks on our new AI Copilot; second, Elena's UX designs for clip sharing; and third, finalizing our beta rollout calendar."
      },
      {
        id: "tr-2",
        speakerId: "spk-2",
        speakerName: "Alex Rivera",
        speakerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Head of AI Research",
        startTime: 46,
        endTime: 180,
        text: "Thanks Sarah. Let's dive straight into the AI performance numbers. In our previous architecture, querying meeting history took between 2 and 3 seconds because we were doing whole-transcript scans. We restructured the retrieval pipeline into 120-second rolling chunks with vector embeddings."
      },
      {
        id: "tr-3",
        speakerId: "spk-3",
        speakerName: "Marcus Vance",
        speakerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Lead Systems Architect",
        startTime: 181,
        endTime: 239,
        text: "And Marcus here. On the infrastructure side, pairing Alex's chunking strategy with a lightweight Redis semantic cache delivered a massive win."
      },
      {
        id: "tr-4",
        speakerId: "spk-2",
        speakerName: "Alex Rivera",
        speakerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Head of AI Research",
        startTime: 240,
        endTime: 340,
        text: "Exactly. Our P95 latency dropped from 2.4 seconds to 780 milliseconds. When users ask questions like 'What were the action items for Marcus?', the answer streams in virtually instantaneously with exact timestamp citations."
      }
    ]
  },
  {
    id: "meet-2",
    title: "Customer Discovery — Acme Corporation",
    description: "Initial discovery with Acme Corp VP of Engineering and Procurement lead regarding 450-seat rollout.",
    date: new Date(NOW - HOUR * 5).toISOString(), // 5 hours ago (Today)
    duration: 1920, // 32 mins
    category: "sales",
    meetingType: "Customer Discovery",
    platform: "google_meet",
    tags: ["Sales", "Enterprise", "MEDDIC", "Deal", "Acme Corp"],
    isFavorite: true,
    createdAt: new Date(NOW - HOUR * 5).toISOString(),
    speakers: [
      {
        id: "spk-5",
        name: "David Kim",
        role: "Strategic Account Executive",
        email: "david.kim@fathom.work",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-6",
        name: "Rachel Green",
        role: "VP of Technology, Acme Corp",
        email: "rachel.g@acmecorp.com",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-7",
        name: "Michael Chang",
        role: "Director of InfoSec, Acme Corp",
        email: "michael.c@acmecorp.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      }
    ],
    summary: {
      templateId: "sales_meddic",
      templateName: "MEDDIC Sales Discovery",
      headline: "Acme Corp evaluating 450 seats for Q4; SOC2 compliance and automated CRM sync are key decision criteria.",
      overview: "Productive discovery call with Rachel Green (VP Tech) and Michael Chang (InfoSec). Acme is currently losing an estimated 6 hours per engineer weekly to manual documentation and sync meetings. Budget is pre-approved for up to $120,000 ARR under their Developer Productivity initiative.",
      sections: [
        {
          id: "med-1",
          title: "Metrics (M) & Business Impact",
          bullets: [
            "450 engineers and product managers spending 15% of weekly time on meeting notes.",
            "Targeting a 50% reduction in follow-up sync meetings.",
            "Projected ROI: $450,000 in saved engineering hours annually."
          ]
        },
        {
          id: "med-2",
          title: "Economic Buyer (E) & Champion (C)",
          bullets: [
            "Economic Buyer: Rachel Green has direct signing authority up to $150k.",
            "Champion: Michael Chang is highly enthusiastic about automated security audit trails."
          ]
        }
      ],
      keyDecisions: [
        "Agreed to start a 30-day pilot for 50 users starting next Monday.",
        "David to provide SOC2 Type II compliance package and DPA by tomorrow afternoon."
      ],
      nextSteps: [
        "David to send security questionnaire responses to Michael Chang.",
        "Rachel to invite 5 engineering team leads to the onboarding kickoff call on Tuesday."
      ]
    },
    actionItems: [
      {
        id: "act-5",
        text: "Send SOC2 Type II report and Data Processing Agreement to Michael Chang",
        assignee: { name: "David Kim", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" },
        completed: false,
        timestamp: 420,
        priority: "high",
        dueDate: "Tomorrow"
      },
      {
        id: "act-6",
        text: "Configure 50 pilot licenses with Google Workspace SSO for Acme Corp",
        assignee: { name: "David Kim", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" },
        completed: false,
        timestamp: 880,
        priority: "medium",
        dueDate: "Friday"
      }
    ],
    highlights: [
      {
        id: "hl-4",
        startTime: 180,
        endTime: 215,
        text: "We have budget already allocated under our Q3 Developer Productivity budget up to $120k.",
        color: "green",
        label: "Decision",
        createdByType: "ai"
      }
    ],
    transcript: [
      {
        id: "tr-11",
        speakerId: "spk-5",
        speakerName: "David Kim",
        speakerAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Strategic Account Executive",
        startTime: 0,
        endTime: 50,
        text: "Hi Rachel, hi Michael, great to connect with you both. The goal for today is to understand Acme's current meeting workflow across your engineering and product teams and explore how Fathom can streamline your knowledge capture."
      },
      {
        id: "tr-12",
        speakerId: "spk-6",
        speakerName: "Rachel Green",
        speakerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        speakerRole: "VP of Technology, Acme Corp",
        startTime: 51,
        endTime: 179,
        text: "Thanks David. Right now our 450 engineers spend hours writing manual notes in Confluence after standups and design reviews. Worse yet, action items get lost, and people spend 20 minutes re-discussing things that were already decided."
      },
      {
        id: "tr-13",
        speakerId: "spk-6",
        speakerName: "Rachel Green",
        speakerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        speakerRole: "VP of Technology, Acme Corp",
        startTime: 180,
        endTime: 230,
        text: "We have budget already allocated under our Q3 Developer Productivity budget up to $120k ARR. If Fathom can automatically generate accurate summaries and let people ask questions with verified timestamp citations, it's a no-brainer."
      }
    ]
  },
  {
    id: "meet-3",
    title: "Engineering Weekly & Architecture Sync",
    description: "Weekly review of distributed database routing, read-replicas, and SSE connection pooling.",
    date: new Date(NOW - DAY * 1 - HOUR * 3).toISOString(), // Yesterday
    duration: 2160, // 36 mins
    category: "engineering",
    meetingType: "Architecture Sync",
    platform: "teams",
    tags: ["Engineering", "Architecture", "Database", "SRE"],
    isFavorite: false,
    createdAt: new Date(NOW - DAY * 1 - HOUR * 3).toISOString(),
    speakers: [
      {
        id: "spk-3",
        name: "Marcus Vance",
        role: "Lead Systems Architect",
        email: "marcus.vance@fathom.work",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-8",
        name: "Devonte Washington",
        role: "Staff SRE",
        email: "devonte.w@fathom.work",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-9",
        name: "Emily Thorne",
        role: "Lead Database Administrator",
        email: "emily.t@fathom.work",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      }
    ],
    summary: {
      templateId: "eng_sprint",
      templateName: "Engineering Architecture Review",
      headline: "Postgres read-replica routing deployed to staging; PgBouncer connection limit increased to 800.",
      overview: "Engineering weekly covering database latency fixes, connection pooling, and live SSE streaming architecture. SRE confirmed zero connection drops over the last 24 hours.",
      sections: [
        {
          id: "eng-sync-1",
          title: "Database Performance & Read Replica Offload",
          bullets: [
            "Composite index on `meeting_events(workspace_id, created_at DESC)` reduced query times by 98%.",
            "Read-replica pool configured to handle all dashboard metrics queries.",
            "Connection pool headroom now sitting at 75% capacity."
          ]
        }
      ],
      keyDecisions: [
        "Promote read-replica middleware to production this Thursday night.",
        "Add automated load test alerts at 70% pool saturation."
      ],
      nextSteps: [
        "Emily to monitor production query latency curves after rollout.",
        "Devonte to document failover runbook in Notion."
      ]
    },
    actionItems: [
      {
        id: "act-7",
        text: "Deploy read-replica routing middleware to us-east-1 production",
        assignee: { name: "Marcus Vance", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
        completed: true,
        timestamp: 540,
        priority: "high",
        dueDate: "Thursday"
      },
      {
        id: "act-8",
        text: "Update SRE failover runbook with new replica promotion instructions",
        assignee: { name: "Devonte Washington", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" },
        completed: false,
        timestamp: 820,
        priority: "medium",
        dueDate: "Friday"
      }
    ],
    highlights: [
      {
        id: "hl-6",
        startTime: 310,
        endTime: 345,
        text: "The composite index brought our average analytics query time down from 4200ms to 45ms.",
        color: "green",
        label: "Decision",
        createdByType: "ai"
      }
    ],
    transcript: [
      {
        id: "tr-16",
        speakerId: "spk-8",
        speakerName: "Devonte Washington",
        speakerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Staff SRE",
        startTime: 0,
        endTime: 60,
        text: "Morning everyone. Let's do a quick check-in on the database cluster after applying the composite index on meeting_events."
      },
      {
        id: "tr-17",
        speakerId: "spk-9",
        speakerName: "Emily Thorne",
        speakerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Lead Database Administrator",
        startTime: 61,
        endTime: 190,
        text: "The results on staging have been stellar. Query latency dropped from over 4 seconds down to 45 milliseconds, and PgBouncer connection utilization is down from 95% to 22%."
      }
    ]
  },
  {
    id: "meet-4",
    title: "Q4 Planning & Resource Allocation",
    description: "Leadership alignment on Q4 headcount, infrastructure budget, and enterprise security initiatives.",
    date: new Date(NOW - DAY * 1 - HOUR * 6).toISOString(), // Yesterday
    duration: 2700, // 45 mins
    category: "executive",
    meetingType: "Planning",
    platform: "zoom",
    tags: ["Executive", "Planning", "Headcount", "Q4", "Budget"],
    isFavorite: false,
    createdAt: new Date(NOW - DAY * 1 - HOUR * 6).toISOString(),
    speakers: [
      {
        id: "spk-11",
        name: "Robert Sterling",
        role: "Chief Executive Officer",
        email: "robert.sterling@fathom.work",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-12",
        name: "Sophia Lin",
        role: "Chief Financial Officer",
        email: "sophia.lin@fathom.work",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-1",
        name: "Sarah Chen",
        role: "VP of Product",
        email: "sarah.chen@fathom.work",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      }
    ],
    summary: {
      templateId: "exec_brief",
      templateName: "Executive Planning Brief",
      headline: "Approved 8 new engineering headcount for Q4 and allocated $350k for GPU inference scaling.",
      overview: "Strategic review of Q4 growth targets. CEO Robert Sterling approved expanding the distributed AI engineering team to accelerate enterprise multi-tenant search capabilities.",
      sections: [
        {
          id: "q4-1",
          title: "Hiring & Headcount Targets",
          bullets: [
            "4 Senior Distributed Backend Engineers, 2 AI Research Engineers, 2 Enterprise Account Executives.",
            "Hiring kickoff scheduled with recruiting for next Monday."
          ]
        },
        {
          id: "q4-2",
          title: "Budget & GPU Compute Reserves",
          bullets: [
            "Reserved $350k GPU cluster capacity with tier-1 provider for predictable inferencing costs."
          ]
        }
      ],
      keyDecisions: [
        "Lock Q4 hiring target at 8 full-time hires.",
        "Sign 1-year GPU compute reservation to lock in 40% margin discounts."
      ],
      nextSteps: [
        "Sophia to execute compute reservation contract.",
        "Sarah to submit job specs for senior AI engineering roles."
      ]
    },
    actionItems: [
      {
        id: "act-12",
        text: "Submit job descriptions for Senior Distributed AI Engineers",
        assignee: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
        completed: false,
        timestamp: 450,
        priority: "high",
        dueDate: "Monday"
      }
    ],
    highlights: [
      {
        id: "hl-11",
        startTime: 200,
        endTime: 235,
        text: "Locking the 1-year GPU reservation guarantees our gross margin target stays above 80%.",
        color: "green",
        label: "Decision",
        createdByType: "ai"
      }
    ],
    transcript: [
      {
        id: "tr-30",
        speakerId: "spk-11",
        speakerName: "Robert Sterling",
        speakerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Chief Executive Officer",
        startTime: 0,
        endTime: 50,
        text: "Welcome team. Let's align on our Q4 resource commitments. Sarah, what are the must-have hires to support our enterprise customer pipeline?"
      },
      {
        id: "tr-31",
        speakerId: "spk-1",
        speakerName: "Sarah Chen",
        speakerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        speakerRole: "VP of Product",
        startTime: 51,
        endTime: 160,
        text: "We need 4 distributed systems engineers to harden the real-time transcription cluster, plus 2 applied AI researchers to specialize in real-time citation accuracy."
      }
    ]
  },
  {
    id: "meet-5",
    title: "Client Demo: Enterprise Notetaking Suite",
    description: "Product demonstration with NorthStar Labs leadership showing live AI transcription, action item sync, and sharing.",
    date: new Date(NOW - DAY * 3).toISOString(), // 3 days ago (This Week)
    duration: 1800, // 30 mins
    category: "demo",
    meetingType: "Client Demo",
    platform: "google_meet",
    tags: ["Demo", "Client", "Enterprise", "NorthStar"],
    isFavorite: true,
    createdAt: new Date(NOW - DAY * 3).toISOString(),
    speakers: [
      {
        id: "spk-5",
        name: "David Kim",
        role: "Strategic Account Executive",
        email: "david.kim@fathom.work",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-10",
        name: "Jason Miller",
        role: "Design Partner, NorthStar Labs",
        email: "jason@northstarlabs.io",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      }
    ],
    summary: {
      templateId: "default",
      templateName: "Client Demo Summary",
      headline: "NorthStar Labs rated transcript-grounded citations 10/10 and requested sandbox deployment for 25 seats.",
      overview: "Comprehensive demo showing Fathom's synchronized playback, automatic MEDDIC summaries, and interactive clip sharing. Client was particularly impressed with zero-login public sharing.",
      sections: [
        {
          id: "demo-1",
          title: "Feature Reactions & Feedback",
          bullets: [
            "Jason praised the instant timestamp jump when clicking citation pills in Ask Fathom.",
            "Requested custom template creation for their internal design sprint formats."
          ]
        }
      ],
      keyDecisions: ["Provide NorthStar Labs with 25 sandbox seats by Wednesday"],
      nextSteps: ["David to send sandbox onboarding invites and documentation"]
    },
    actionItems: [
      {
        id: "act-13",
        text: "Provision 25 sandbox seats for NorthStar Labs design team",
        assignee: { name: "David Kim", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" },
        completed: true,
        timestamp: 400,
        priority: "medium",
        dueDate: "Wednesday"
      }
    ],
    highlights: [
      {
        id: "hl-12",
        startTime: 220,
        endTime: 250,
        text: "The ability to share a 30-second trimmed video snippet without requiring a login is a game changer for our client presentations.",
        color: "purple",
        label: "Praise",
        createdByType: "ai"
      }
    ],
    transcript: [
      {
        id: "tr-40",
        speakerId: "spk-5",
        speakerName: "David Kim",
        speakerAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Strategic Account Executive",
        startTime: 0,
        endTime: 40,
        text: "Hey Jason, welcome! Today I'll walk you through how Fathom captures meeting knowledge in real-time, extracts action items, and lets you query past meetings with verified citations."
      }
    ]
  },
  {
    id: "meet-6",
    title: "Investor Discussion & Financial Review",
    description: "Quarterly business review with lead Series A investors covering ARR growth, runway, and net retention.",
    date: new Date(NOW - DAY * 4).toISOString(), // 4 days ago (This Week)
    duration: 2280, // 38 mins
    category: "executive",
    meetingType: "Investor Review",
    platform: "zoom",
    tags: ["Investor", "Financials", "ARR", "Growth", "Board"],
    isFavorite: true,
    createdAt: new Date(NOW - DAY * 4).toISOString(),
    speakers: [
      {
        id: "spk-11",
        name: "Robert Sterling",
        role: "Chief Executive Officer",
        email: "robert.sterling@fathom.work",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-12",
        name: "Sophia Lin",
        role: "Chief Financial Officer",
        email: "sophia.lin@fathom.work",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      }
    ],
    summary: {
      templateId: "exec_brief",
      templateName: "Investor Update Brief",
      headline: "ARR reached $4.82M (135% YoY expansion); net burn decreased to $85k/month with 28 months runway.",
      overview: "Investors congratulated the team on hitting 135% YoY revenue growth while expanding gross margins to 82% through inference optimizations.",
      sections: [
        {
          id: "inv-1",
          title: "Unit Economics & Runway",
          bullets: [
            "Current ARR: $4.82M (up from $2.05M last year).",
            "Cash in bank: $14.2M (28 months runway).",
            "Net Revenue Retention: 128% across mid-market tier."
          ]
        }
      ],
      keyDecisions: ["Schedule next investor sync for late October"],
      nextSteps: ["Sophia to share final audited Q2 appendix tables"]
    },
    actionItems: [
      {
        id: "act-14",
        text: "Send audited Q2 investor financial deck to venture partners",
        assignee: { name: "Sophia Lin", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" },
        completed: true,
        timestamp: 500,
        priority: "high",
        dueDate: "Done"
      }
    ],
    highlights: [
      {
        id: "hl-13",
        startTime: 180,
        endTime: 215,
        text: "We crossed $4.82M in ARR with 82% gross margins, comfortably exceeding our high-case annual plan.",
        color: "green",
        label: "Decision",
        createdByType: "ai"
      }
    ],
    transcript: [
      {
        id: "tr-50",
        speakerId: "spk-11",
        speakerName: "Robert Sterling",
        speakerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Chief Executive Officer",
        startTime: 0,
        endTime: 40,
        text: "Good afternoon. We're proud to share our Q2 operating results with our board and lead investors today."
      }
    ]
  },
  {
    id: "meet-7",
    title: "Design Review: Mobile & Web Timeline UX",
    description: "Critique of the synchronized audio scrubber, highlight color tokens, and mobile transcript reader.",
    date: new Date(NOW - DAY * 5).toISOString(), // 5 days ago (This Week)
    duration: 2100, // 35 mins
    category: "design",
    meetingType: "Design Review",
    platform: "zoom",
    tags: ["Design", "UX/UI", "Mobile", "Scrubber", "Figma"],
    isFavorite: false,
    createdAt: new Date(NOW - DAY * 5).toISOString(),
    speakers: [
      {
        id: "spk-4",
        name: "Elena Rostova",
        role: "Principal Product Designer",
        email: "elena.rostova@fathom.work",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-1",
        name: "Sarah Chen",
        role: "VP of Product",
        email: "sarah.chen@fathom.work",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      }
    ],
    summary: {
      templateId: "default",
      templateName: "Design Critique Summary",
      headline: "Approved mobile waveform touch-scrubber and unified dark mode palette tokens across web and mobile.",
      overview: "Elena presented the updated mobile transcript reading experience. The team approved high-contrast speaker badges and quick-action swipe gestures for clipping highlights.",
      sections: [
        {
          id: "des-1",
          title: "Timeline & Interaction Decisions",
          bullets: [
            "Waveform timeline scrubber supports smooth haptic scrubbing on mobile.",
            "Highlight toolbar floats above text selection with single-click color categorization."
          ]
        }
      ],
      keyDecisions: ["Lock dark mode design tokens to Slate-950 base with Indigo-500 accents"],
      nextSteps: ["Elena to hand off mobile component specs to the frontend engineering team"]
    },
    actionItems: [
      {
        id: "act-15",
        text: "Export mobile design tokens and Figma components for engineers",
        assignee: { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
        completed: false,
        timestamp: 620,
        priority: "medium",
        dueDate: "Monday"
      }
    ],
    highlights: [
      {
        id: "hl-14",
        startTime: 300,
        endTime: 330,
        text: "The floating highlight pill lets people highlight text with zero friction and immediately assign action items.",
        color: "blue",
        label: "Key Point",
        createdByType: "ai"
      }
    ],
    transcript: [
      {
        id: "tr-60",
        speakerId: "spk-4",
        speakerName: "Elena Rostova",
        speakerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Principal Product Designer",
        startTime: 0,
        endTime: 45,
        text: "Hi Sarah! Today I'm walking through the final polish for our responsive meeting detail view and mobile timeline scrubber."
      }
    ]
  },
  {
    id: "meet-8",
    title: "Senior Staff AI Engineer Hiring Interview",
    description: "Technical system design interview covering distributed vector search and low-latency streaming pipelines.",
    date: new Date(NOW - DAY * 8).toISOString(), // 8 days ago (Last Week)
    duration: 3600, // 60 mins
    category: "hiring",
    meetingType: "Hiring Interview",
    platform: "google_meet",
    tags: ["Hiring", "Interview", "AI Engineer", "Systems Design"],
    isFavorite: false,
    createdAt: new Date(NOW - DAY * 8).toISOString(),
    speakers: [
      {
        id: "spk-2",
        name: "Alex Rivera",
        role: "Head of AI Research",
        email: "alex.rivera@fathom.work",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-3",
        name: "Marcus Vance",
        role: "Lead Systems Architect",
        email: "marcus.vance@fathom.work",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      }
    ],
    summary: {
      templateId: "default",
      templateName: "Interview Scorecard",
      headline: "Strong Hire recommendation: Candidate demonstrated mastery of distributed vector indexing and cache invalidation.",
      overview: "Candidate excelled in designing a sub-50ms vector retrieval pipeline for 100M meeting segments with high recall and graceful degradation under network partition.",
      sections: [
        {
          id: "hire-1",
          title: "Technical Evaluation & Competencies",
          bullets: [
            "Distributed Systems: 5/5 — Flawless explanation of Raft consensus and replica synchronization.",
            "AI/ML Engineering: 5/5 — Deep experience with quantized embeddings and ONNX runtime optimizations."
          ]
        }
      ],
      keyDecisions: ["Extend formal offer for Senior Staff AI Engineer position"],
      nextSteps: ["Alex to submit formal scorecard in Greenhouse and draft offer compensation"]
    },
    actionItems: [
      {
        id: "act-16",
        text: "Submit formal interview scorecard and offer letter recommendation",
        assignee: { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
        completed: true,
        timestamp: 800,
        priority: "high",
        dueDate: "Done"
      }
    ],
    highlights: [
      {
        id: "hl-15",
        startTime: 410,
        endTime: 440,
        text: "The candidate's approach to rolling chunk quantization reduced RAM overhead by 4x without degrading citation accuracy.",
        color: "green",
        label: "Decision",
        createdByType: "ai"
      }
    ],
    transcript: [
      {
        id: "tr-70",
        speakerId: "spk-2",
        speakerName: "Alex Rivera",
        speakerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Head of AI Research",
        startTime: 0,
        endTime: 40,
        text: "Welcome! Today we'll spend 45 minutes on real-time streaming architectures and vector index scalability."
      }
    ]
  },
  {
    id: "meet-9",
    title: "Bi-Weekly 1-on-1: Career Growth & Staff Scope",
    description: "Career progression, cross-functional leadership on the AI streaming stack, and Q4 mentorship goals.",
    date: new Date(NOW - DAY * 9).toISOString(), // 9 days ago (Last Week)
    duration: 1320, // 22 mins
    category: "1-on-1",
    meetingType: "1-on-1 Sync",
    platform: "zoom",
    tags: ["1-on-1", "Career", "Mentorship", "Leadership"],
    isFavorite: false,
    createdAt: new Date(NOW - DAY * 9).toISOString(),
    speakers: [
      {
        id: "spk-1",
        name: "Sarah Chen",
        role: "VP of Product",
        email: "sarah.chen@fathom.work",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-3",
        name: "Marcus Vance",
        role: "Lead Systems Architect",
        email: "marcus.vance@fathom.work",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      }
    ],
    summary: {
      templateId: "one_on_one",
      templateName: "1-on-1 Sync",
      headline: "Marcus commended for driving the latency initiative; expanding scope to company-wide technical architecture council.",
      overview: "Productive sync covering Marcus's recent technical leadership on streaming RAG pipelines and career goals toward Principal Architect.",
      sections: [
        {
          id: "one-1",
          title: "Wins & Feedback",
          bullets: [
            "Marcus's work on Redis chunk caching received high praise from the executive team.",
            "Great collaboration with Elena on front-end timestamp synchronization."
          ]
        }
      ],
      keyDecisions: [
        "Marcus will lead the monthly Engineering Tech Radar meetings.",
        "Set target for Principal Architect promotion review in Q4."
      ],
      nextSteps: [
        "Sarah to submit formal nomination for the Tech Architecture Council."
      ]
    },
    actionItems: [
      {
        id: "act-9",
        text: "Draft technical roadmap outline for Tech Radar kickoff meeting",
        assignee: { name: "Marcus Vance", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
        completed: false,
        timestamp: 750,
        priority: "medium",
        dueDate: "Next Week"
      }
    ],
    highlights: [
      {
        id: "hl-8",
        startTime: 210,
        endTime: 245,
        text: "Your technical leadership on the real-time streaming pipeline was instrumental in hitting our latency SLA.",
        color: "purple",
        label: "Praise",
        createdByType: "ai"
      }
    ],
    transcript: [
      {
        id: "tr-19",
        speakerId: "spk-1",
        speakerName: "Sarah Chen",
        speakerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        speakerRole: "VP of Product",
        startTime: 0,
        endTime: 40,
        text: "Hey Marcus! How has your week been going? I wanted to spend today talking through your feedback and career growth."
      }
    ]
  },
  {
    id: "meet-10",
    title: "Customer Usability Interview: Workflow Automation",
    description: "User research session testing automatic action item syncing to Linear, Jira, and Slack.",
    date: new Date(NOW - DAY * 18).toISOString(), // 18 days ago (Earlier this month)
    duration: 2100, // 35 mins
    category: "research",
    meetingType: "User Research",
    platform: "zoom",
    tags: ["User Research", "Usability", "Integrations", "Linear", "Design"],
    isFavorite: false,
    createdAt: new Date(NOW - DAY * 18).toISOString(),
    speakers: [
      {
        id: "spk-4",
        name: "Elena Rostova",
        role: "Principal Product Designer",
        email: "elena.rostova@fathom.work",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-10",
        name: "Jason Miller",
        role: "Design Partner, NorthStar Labs",
        email: "jason@northstarlabs.io",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      }
    ],
    summary: {
      templateId: "user_research",
      templateName: "User Research Insights",
      headline: "Participants overwhelmingly prefer single-click Linear issue creation directly from highlighted transcript phrases.",
      overview: "Usability session observing how product managers interact with automated action items. Jason completed 4 tasks with a 100% success rate and rated the citation jump feature 5/5.",
      sections: [
        {
          id: "ur-1",
          title: "Key Usability Observations",
          bullets: [
            "Users loved the hover button 'Export to Linear' on action item cards.",
            "Suggested adding keyboard shortcut 'H' to quickly highlight active speaker sentence."
          ]
        }
      ],
      keyDecisions: [
        "Add keyboard shortcuts (Space for play/pause, H for highlight, C for clip)."
      ],
      nextSteps: [
        "Elena to prototype keyboard shortcut cheat sheet in the app header."
      ]
    },
    actionItems: [
      {
        id: "act-10",
        text: "Add keyboard shortcuts modal (Space, J, K, L, H, C) to the meeting player",
        assignee: { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
        completed: true,
        timestamp: 480,
        priority: "low",
        dueDate: "Done"
      }
    ],
    highlights: [
      {
        id: "hl-9",
        startTime: 420,
        endTime: 460,
        text: "Being able to click the highlight and immediately send a 20-second video snippet to my engineering lead saves 15 minutes of explanation.",
        color: "green",
        label: "Key Point",
        createdByType: "ai"
      }
    ],
    transcript: [
      {
        id: "tr-21",
        speakerId: "spk-4",
        speakerName: "Elena Rostova",
        speakerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Principal Product Designer",
        startTime: 0,
        endTime: 40,
        text: "Hi Jason! Thanks for joining today. We're testing our new meeting playback controls and action item extraction interface."
      }
    ]
  }
];
