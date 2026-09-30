import { Meeting } from './types';

export const SEED_MEETINGS: Meeting[] = [
  {
    id: "meet-1",
    title: "Q3 Product Strategy & AI Copilot Roadmap Review",
    description: "Quarterly alignment on AI assistant features, latency SLAs, pricing tiers, and beta launch dates.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    duration: 2520, // 42 mins (in seconds)
    category: "product",
    platform: "zoom",
    tags: ["Product", "Roadmap", "AI Assistant", "Strategy", "Q3"],
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
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
            { timestamp: 245, quote: "Our P95 latency dropped from 2.4 seconds to 780 milliseconds." },
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
        },
        {
          id: "sec-3",
          title: "Beta Launch Schedule & Customer Rollout",
          bullets: [
            "Closed beta starts August 15th with 50 high-volume enterprise teams.",
            "Sales team will be trained on the new MEDDIC summary template by August 8th.",
            "Public product launch scheduled for September 2nd on Product Hunt and TechCrunch."
          ],
          citations: [
            { timestamp: 1450, quote: "We are locking the beta freeze date to August 12th." }
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
        "Marcus to provision staging environment with load-balanced Redis clusters.",
        "Sarah to draft customer announcement email for early-access partners."
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
          },
          {
            id: "sec-2",
            title: "Go-to-Market Timeline",
            bullets: [
              "Closed beta: August 15th.",
              "Public launch: September 2nd."
            ]
          }
        ],
        keyDecisions: ["Approved August 15th beta launch", "Strict 800ms SLA"],
        nextSteps: ["Finalize streaming API", "Publish Figma clip modal specs"]
      },
      eng_sprint: {
        templateId: "eng_sprint",
        templateName: "Engineering Sprint",
        headline: "Sprint 42 Goals: Sub-800ms P95 RAG latency, Redis caching layer, and streaming SSE endpoints.",
        overview: "Detailed architectural breakdown of Sprint 42 deliverables. Marcus and Alex aligned on Redis cluster topology and WebSocket/SSE fallback mechanisms.",
        sections: [
          {
            id: "eng-1",
            title: "Technical Architecture & Blockers",
            bullets: [
              "Chunk embedding index migrated to vector namespace with 512-dim embeddings.",
              "SSE connection timeouts mitigated with 15s keep-alive heartbeats.",
              "Zero open blocker bugs on the transcript parser."
            ]
          },
          {
            id: "eng-2",
            title: "Performance Metrics & Load Testing",
            bullets: [
              "P95 query time: 780ms (exceeding 800ms goal).",
              "Memory footprint per active meeting session reduced by 30%."
            ]
          }
        ],
        keyDecisions: ["Use SSE instead of WebSocket for streaming answers", "Deploy Redis 7.2 cluster in us-east-1"],
        nextSteps: ["Marcus to deploy load testing suite", "Alex to write unit tests for citation token parser"]
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
      },
      {
        id: "act-4",
        text: "Draft customer launch email and schedule partner webinars",
        assignee: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
        completed: false,
        timestamp: 1520,
        priority: "medium",
        dueDate: "Aug 8, 2026"
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
      },
      {
        id: "hl-3",
        startTime: 1445,
        endTime: 1480,
        text: "We are locking the closed beta release to August 15th with 50 pilot customers.",
        color: "purple",
        label: "Action",
        createdByType: "user"
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
      },
      {
        id: "tr-5",
        speakerId: "spk-4",
        speakerName: "Elena Rostova",
        speakerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Principal Product Designer",
        startTime: 341,
        endTime: 480,
        text: "That latency improvement makes a huge difference in the UI feel. I tested the interactive prototype with 8 participants yesterday. The seamless citation pills allow users to click [04:12] and see the audio scrub directly to that sentence. It builds tremendous trust because they can verify the AI wasn't hallucinating."
      },
      {
        id: "tr-6",
        speakerId: "spk-1",
        speakerName: "Sarah Chen",
        speakerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        speakerRole: "VP of Product",
        startTime: 481,
        endTime: 620,
        text: "That's fantastic feedback Elena. How is the clip sharing modal performing in usability tests? Are people easily able to trim 30-second snippets to send into Slack?"
      },
      {
        id: "tr-7",
        speakerId: "spk-4",
        speakerName: "Elena Rostova",
        speakerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Principal Product Designer",
        startTime: 621,
        endTime: 810,
        text: "Yes, the drag-to-select waveform trimmer worked really well. When you select text in the transcript or drag handles on the audio timeline, it automatically generates a clean public share link with a standalone player."
      },
      {
        id: "tr-8",
        speakerId: "spk-3",
        speakerName: "Marcus Vance",
        speakerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Lead Systems Architect",
        startTime: 811,
        endTime: 1050,
        text: "On the public share link security, we generate signed short tokens so people without accounts can watch clips without exposing the full workspace or requiring authentication."
      },
      {
        id: "tr-9",
        speakerId: "spk-1",
        speakerName: "Sarah Chen",
        speakerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        speakerRole: "VP of Product",
        startTime: 1051,
        endTime: 1440,
        text: "Great. Now regarding the timeline: we want to lock down our closed beta for August 15th with 50 pilot customers. Let's make sure our templates—especially MEDDIC for sales and Sprint notes for eng—are completely polished."
      },
      {
        id: "tr-10",
        speakerId: "spk-2",
        speakerName: "Alex Rivera",
        speakerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Head of AI Research",
        startTime: 1441,
        endTime: 1520,
        text: "Sounds great. I'll make sure the prompt templates and citation formatting are locked by Friday."
      }
    ]
  },
  {
    id: "meet-2",
    title: "Enterprise Discovery Call — Acme Corporation",
    description: "Initial discovery with Acme Corp VP of Engineering and Procurement lead regarding 450-seat rollout.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    duration: 1920, // 32 mins
    category: "sales",
    platform: "google_meet",
    tags: ["Sales", "Enterprise", "MEDDIC", "Deal", "Acme Corp"],
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
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
        },
        {
          id: "med-3",
          title: "Decision Criteria (DC) & Process (DP)",
          bullets: [
            "SOC2 Type II report and HIPAA compliance required for security signoff.",
            "Must support custom summary templates for MEDDIC and sprint reviews.",
            "Decision timeline: 2-week pilot in August, contract execution by September 25th."
          ]
        }
      ],
      keyDecisions: [
        "Agreed to start a 30-day pilot for 50 users starting next Monday.",
        "David to provide SOC2 Type II compliance package and DPA by tomorrow afternoon."
      ],
      nextSteps: [
        "David to send security questionnaire responses to Michael Chang.",
        "Rachel to invite 5 engineering team leads to the onboarding kickoff call on Tuesday.",
        "David to prepare custom enterprise pilot proposal ($18/seat/mo tier)."
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
      },
      {
        id: "hl-5",
        startTime: 740,
        endTime: 780,
        text: "Our main bottleneck is that engineers forget what was agreed upon in architecture reviews.",
        color: "red",
        label: "Blocker",
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
      },
      {
        id: "tr-14",
        speakerId: "spk-7",
        speakerName: "Michael Chang",
        speakerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Director of InfoSec, Acme Corp",
        startTime: 231,
        endTime: 360,
        text: "From the security perspective, our requirements are strict: we need SOC2 Type II, zero data retention for training foundational models, and strict tenant isolation. Can you confirm your compliance posture?"
      },
      {
        id: "tr-15",
        speakerId: "spk-5",
        speakerName: "David Kim",
        speakerAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Strategic Account Executive",
        startTime: 361,
        endTime: 450,
        text: "100% Michael. We are SOC2 Type II certified, GDPR/CCPA compliant, and we have zero-data-retention agreements with our model providers. Your meeting audio and transcripts remain strictly your private property."
      }
    ]
  },
  {
    id: "meet-3",
    title: "Infrastructure Incident Post-Mortem: DB Latency Spike",
    description: "Root cause analysis of the 14-minute connection pool exhaustion during peak US traffic.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 1 day ago
    duration: 1680, // 28 mins
    category: "engineering",
    platform: "teams",
    tags: ["Engineering", "Post-Mortem", "Database", "SRE", "P1"],
    isFavorite: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
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
      templateName: "Engineering Post-Mortem",
      headline: "Unindexed analytics query caused Postgres connection exhaustion for 14 minutes; PgBouncer pool sizing increased.",
      overview: "On Tuesday at 14:22 UTC, an unindexed query on the `meeting_events` table triggered sequential table scans across 40M rows, locking connections and causing 504 gateway timeouts. SRE team killed slow transactions and provisioned read-replica offloading.",
      sections: [
        {
          id: "pm-1",
          title: "Timeline & Impact",
          bullets: [
            "14:22 UTC: Automated P1 alert fired for P99 database latency (> 5000ms).",
            "14:28 UTC: Devonte identified long-running query on `meeting_events` table.",
            "14:36 UTC: Terminated PID and applied statement timeout threshold (3000ms).",
            "Total user impact: 14 minutes of intermittent transcript save errors."
          ]
        },
        {
          id: "pm-2",
          title: "Root Cause & Preventive Actions",
          bullets: [
            "Missing composite index on `(workspace_id, created_at DESC)`.",
            "PgBouncer max client connections was set too low (200 instead of 800).",
            "Heavy analytics queries were running against the primary instance rather than read replicas."
          ]
        }
      ],
      keyDecisions: [
        "Enforce strict 3-second statement timeout on all primary database connections.",
        "Route all dashboard analytics queries exclusively to read replicas.",
        "Add automated PR check requiring index analysis for all newly added SQL queries."
      ],
      nextSteps: [
        "Emily to create the missing index on `meeting_events` during maintenance window.",
        "Devonte to update PgBouncer connection limits in Terraform.",
        "Marcus to audit all ORM queries in the dashboard service."
      ]
    },
    actionItems: [
      {
        id: "act-7",
        text: "Apply composite index on meeting_events (workspace_id, created_at)",
        assignee: { name: "Emily Thorne", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" },
        completed: true,
        timestamp: 540,
        priority: "high",
        dueDate: "Yesterday"
      },
      {
        id: "act-8",
        text: "Configure query routing middleware to split reads to replica cluster",
        assignee: { name: "Marcus Vance", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
        completed: false,
        timestamp: 820,
        priority: "high",
        dueDate: "Aug 5, 2026"
      }
    ],
    highlights: [
      {
        id: "hl-6",
        startTime: 310,
        endTime: 345,
        text: "The root cause was a sequential scan on 40 million rows locking the connection pool.",
        color: "red",
        label: "Blocker",
        createdByType: "ai"
      },
      {
        id: "hl-7",
        startTime: 620,
        endTime: 655,
        text: "We are introducing a hard 3-second statement timeout across the entire cluster.",
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
        text: "Alright team, let's walk through the post-mortem for Tuesday's P1 incident. We experienced 14 minutes of degraded performance on the core transcript API starting at 14:22 UTC."
      },
      {
        id: "tr-17",
        speakerId: "spk-9",
        speakerName: "Emily Thorne",
        speakerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Lead Database Administrator",
        startTime: 61,
        endTime: 190,
        text: "Looking at the pg_stat_activity logs, an analytics cron job kicked off without filtering by date partitions. It ran a sequential scan across 42 million rows in meeting_events, which saturated the IOPS and held all 200 connection slots."
      },
      {
        id: "tr-18",
        speakerId: "spk-3",
        speakerName: "Marcus Vance",
        speakerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Lead Systems Architect",
        startTime: 191,
        endTime: 320,
        text: "That explains why the API pods started throwing 504s. The web tier couldn't acquire a free database handle. Let's fix this in two ways: first, create the composite index; second, mandate read replica routing for all analytics."
      }
    ]
  },
  {
    id: "meet-4",
    title: "Bi-Weekly 1-on-1: Career Growth & Staff Eng Scope",
    description: "Career progression, cross-functional leadership on the AI streaming stack, and Q4 mentorship goals.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    duration: 1320, // 22 mins
    category: "1-on-1",
    platform: "zoom",
    tags: ["1-on-1", "Career", "Mentorship", "Leadership"],
    isFavorite: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
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
      overview: "Productive sync covering Marcus's recent technical leadership on streaming RAG pipelines and career goals toward Principal Architect. Discussed balancing hands-on coding with cross-team architectural reviews.",
      sections: [
        {
          id: "one-1",
          title: "Wins & Feedback",
          bullets: [
            "Marcus's work on Redis chunk caching received high praise from the executive team.",
            "Great collaboration with Elena on front-end timestamp synchronization."
          ]
        },
        {
          id: "one-2",
          title: "Career Goals & Staff/Principal Scope",
          bullets: [
            "Marcus looking to mentor 2 senior engineers on distributed systems.",
            "Sarah to sponsor Marcus for the upcoming Architecture Steering Committee."
          ]
        }
      ],
      keyDecisions: [
        "Marcus will lead the monthly Engineering Tech Radar meetings.",
        "Set target for Principal Architect promotion review in Q4."
      ],
      nextSteps: [
        "Sarah to submit formal nomination for the Tech Architecture Council.",
        "Marcus to outline mentorship curriculum for senior backend engineers."
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
        text: "Hey Marcus! How has your week been going? I wanted to spend today talking through your feedback, the AI streaming launch, and where we take your career next."
      },
      {
        id: "tr-20",
        speakerId: "spk-3",
        speakerName: "Marcus Vance",
        speakerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Lead Systems Architect",
        startTime: 41,
        endTime: 160,
        text: "Hey Sarah. Overall great! The sub-800ms latency win felt really rewarding. Right now I'm thinking about how we scale our engineering practices as the team doubles over the next two quarters."
      }
    ]
  },
  {
    id: "meet-5",
    title: "Customer Usability Interview: Workflow Automation",
    description: "User research session testing automatic action item syncing to Linear and Asana.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    duration: 2100, // 35 mins
    category: "research",
    platform: "zoom",
    tags: ["User Research", "Usability", "Integrations", "Linear", "Design"],
    isFavorite: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
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
            "Suggested adding keyboard shortcut 'H' to quickly highlight active speaker sentence.",
            "Timeline waveform scrubber was intuitive and responsive."
          ]
        }
      ],
      keyDecisions: [
        "Add keyboard shortcuts (Space for play/pause, H for highlight, C for clip).",
        "Include assignee auto-detection based on speaker names."
      ],
      nextSteps: [
        "Elena to prototype keyboard shortcut cheat sheet in the app header.",
        "Incorporate Jason's feedback into the v2 design system."
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
        text: "Hi Jason! Thanks for joining today. We're testing our new meeting playback controls and action item extraction interface. Feel free to think aloud as you navigate."
      },
      {
        id: "tr-22",
        speakerId: "spk-10",
        speakerName: "Jason Miller",
        speakerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Design Partner, NorthStar Labs",
        startTime: 41,
        endTime: 150,
        text: "Awesome. Looking at the timeline, the color blocks showing who is speaking make it super easy to jump between people. And when I click this action item on the right, it jumps right to the sentence where I promised to follow up. That is incredible."
      }
    ]
  },
  {
    id: "meet-6",
    title: "Executive Board Preparation & Q2 Financials Sync",
    description: "Revenue ARR projections, burn multiple analysis, and series B runway extension review.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    duration: 2280, // 38 mins
    category: "executive",
    platform: "zoom",
    tags: ["Executive", "Board", "Financials", "ARR", "Runway"],
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
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
      templateName: "Executive Brief",
      headline: "ARR reached $4.8M (135% YoY growth); net burn decreased to $85k/month with 28 months runway.",
      overview: "Executive review of the Q2 board deck. Revenue growth surpassed the high-case plan driven by enterprise self-serve adoption. Gross margins improved to 82% following inference cost optimizations.",
      sections: [
        {
          id: "ex-1",
          title: "Financial Performance & Runway",
          bullets: [
            "Current ARR: $4.82M (up from $2.05M in Q2 last year).",
            "Cash balance: $14.2M representing 28 months of runway at current hiring pace.",
            "Net revenue retention (NRR) at 128% among mid-market accounts."
          ]
        },
        {
          id: "ex-2",
          title: "Hiring & Expansion Plan",
          bullets: [
            "Open headcount: 6 engineering roles, 3 enterprise AEs, and 1 developer advocate.",
            "New European data center region scheduled to come online in October."
          ]
        }
      ],
      keyDecisions: [
        "Approved Q3 hiring plan of 10 headcount.",
        "Targeting next funding round outreach for Q1 next year."
      ],
      nextSteps: [
        "Sophia to finalize appendix slides for the Board meeting on August 18th.",
        "Robert to schedule 1-on-1 prep sessions with lead investors."
      ]
    },
    actionItems: [
      {
        id: "act-11",
        text: "Finalize audited GAAP financial tables for Board deck Appendix",
        assignee: { name: "Sophia Lin", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" },
        completed: false,
        timestamp: 640,
        priority: "high",
        dueDate: "Aug 10, 2026"
      }
    ],
    highlights: [
      {
        id: "hl-10",
        startTime: 180,
        endTime: 220,
        text: "Our ARR hit $4.82M, representing 135% year-over-year expansion with 82% gross margins.",
        color: "green",
        label: "Decision",
        createdByType: "ai"
      }
    ],
    transcript: [
      {
        id: "tr-23",
        speakerId: "spk-11",
        speakerName: "Robert Sterling",
        speakerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Chief Executive Officer",
        startTime: 0,
        endTime: 50,
        text: "Welcome Sophia and Sarah. Today we're reviewing the final numbers for next week's Board of Directors meeting. Sophia, could you walk us through the headline ARR and margin metrics?"
      },
      {
        id: "tr-24",
        speakerId: "spk-12",
        speakerName: "Sophia Lin",
        speakerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        speakerRole: "Chief Financial Officer",
        startTime: 51,
        endTime: 210,
        text: "Certainly Robert. Q2 was our strongest quarter to date. We crossed $4.82M in annual recurring revenue, reflecting 135% YoY growth. Thanks to the model routing efficiencies Sarah's team deployed, our gross margins expanded to 82%."
      }
    ]
  }
];
