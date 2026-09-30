import { Meeting, Speaker, TranscriptSegment, ActionItem, Highlight, MeetingSummary } from './types';

const NOW = Date.now();
const HOUR = 1000 * 60 * 60;

export const FLAGSHIP_SPEAKERS: Speaker[] = [
  {
    "id": "spk-parv",
    "name": "Parv",
    "role": "Product & AI Lead",
    "email": "parv@fathom.work",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "spk-sarah",
    "name": "Sarah Chen",
    "role": "VP of Product",
    "email": "sarah.chen@fathom.work",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "spk-alex",
    "name": "Alex Rivera",
    "role": "Engineering Lead",
    "email": "alex.rivera@fathom.work",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "spk-rachel",
    "name": "Rachel Green",
    "role": "Enterprise Sales Director",
    "email": "rachel.green@fathom.work",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "spk-marcus",
    "name": "Marcus Vance",
    "role": "Lead Backend Engineer",
    "email": "marcus.vance@fathom.work",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "spk-emily",
    "name": "Emily Carter",
    "role": "Head of Customer Success",
    "email": "emily.carter@fathom.work",
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "spk-daniel",
    "name": "Daniel Kim",
    "role": "Principal Product Designer",
    "email": "daniel.kim@fathom.work",
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "spk-priya",
    "name": "Priya Shah",
    "role": "Head of Security & Compliance",
    "email": "priya.shah@fathom.work",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  }
];

export const FLAGSHIP_TRANSCRIPT: TranscriptSegment[] = [
  {
    "id": "tr-flagship-1",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 0,
    "endTime": 19,
    "text": "Good morning everyone. Let's kick off our Q4 Product Strategy and Enterprise Planning sync. We have 62 minutes on the calendar and six critical agenda items to lock down today."
  },
  {
    "id": "tr-flagship-2",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 19,
    "endTime": 38,
    "text": "Thanks Sarah. To frame the session: our primary objectives are finalizing our enterprise pricing tiers, locking the Q4 roadmap deliverables, committing to our sub-800ms search SLA, and signing off on the SOC2 Type II audit timeline."
  },
  {
    "id": "tr-flagship-3",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 38,
    "endTime": 58,
    "text": "Before we begin, is the meeting recorder active and transcribing properly?"
  },
  {
    "id": "tr-flagship-4",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 58,
    "endTime": 77,
    "text": "Yes, Fathom is active, streaming live audio and identifying all eight speakers in real time."
  },
  {
    "id": "tr-flagship-5",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 77,
    "endTime": 96,
    "text": "Awesome. Let's start with a quick three-minute retrospective on Q3 performance. Rachel, how did we wrap up the quarter on top-line revenue?"
  },
  {
    "id": "tr-flagship-6",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 96,
    "endTime": 115,
    "text": "We officially closed Q3 at $3.8M ARR, which represents a 42% quarter-over-quarter growth. That beat our revised target by about $180,000."
  },
  {
    "id": "tr-flagship-7",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 115,
    "endTime": 134,
    "text": "Net Retention Rate also held strong at 118%, with expansion primarily coming from mid-market engineering and product teams upgrading to organization-wide workspaces."
  },
  {
    "id": "tr-flagship-8",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 134,
    "endTime": 153,
    "text": "What were our primary churn reasons in Q3, Emily?"
  },
  {
    "id": "tr-flagship-9",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 153,
    "endTime": 173,
    "text": "We had four churned accounts totaling about $38k ARR. The primary reason cited was lack of native task management sync—specifically Jira and Slack webhook export."
  },
  {
    "id": "tr-flagship-10",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 173,
    "endTime": 192,
    "text": "On the engineering side, Q3 was centered on transcription accuracy. We upgraded our core ASR pipeline to Whisper large-v3, which dropped our word error rate by 18% on technical vocabulary and acronyms."
  },
  {
    "id": "tr-flagship-11",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 192,
    "endTime": 211,
    "text": "And we migrated the Whisper inference pipeline to NVIDIA A10G GPUs with TensorRT-LLM, which slashed transcription latency from 4.2 seconds down to 1.1 seconds per audio chunk."
  },
  {
    "id": "tr-flagship-12",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 211,
    "endTime": 230,
    "text": "Did that GPU migration impact our AWS infrastructure bill?"
  },
  {
    "id": "tr-flagship-13",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 230,
    "endTime": 249,
    "text": "Actually, because TensorRT batches 16 streams simultaneously, our per-minute compute cost dropped by 34% compared to our previous CPU worker fleet."
  },
  {
    "id": "tr-flagship-14",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 249,
    "endTime": 268,
    "text": "And infrastructure stability held up really well. With PgBouncer connection pooling and vector index read replicas, uptime was 99.98% through the September traffic rush."
  },
  {
    "id": "tr-flagship-15",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 268,
    "endTime": 288,
    "text": "From the design side, we delivered the full v2 design tokens, dark mode palette, and the interactive clip trimmer interface on schedule."
  },
  {
    "id": "tr-flagship-16",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 288,
    "endTime": 307,
    "text": "And on compliance, we completed our preliminary SOC2 gap assessment with A-LIGN last Tuesday. We only have four remediation items to clear before our formal observation window starts on November 1st."
  },
  {
    "id": "tr-flagship-17",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 307,
    "endTime": 326,
    "text": "That is tremendous execution across the board. But as we look at Q4, the profile of our buyers is changing dramatically. Rachel, can you speak to the enterprise shift?"
  },
  {
    "id": "tr-flagship-18",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 326,
    "endTime": 345,
    "text": "Yes. In Q3, our average deal size was $14k ARR. In our current Q4 pipeline, over 65% of opportunities are enterprise deals with 500-plus seats, looking at contracts between $45k and $120k ARR."
  },
  {
    "id": "tr-flagship-19",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 345,
    "endTime": 364,
    "text": "And with larger buyers comes a much higher bar for precision. If an AI summary invents a single commitment or attributes an action item to the wrong executive, it destroys buyer trust instantly."
  },
  {
    "id": "tr-flagship-20",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 364,
    "endTime": 384,
    "text": "Which is why we invested so heavily in grounded retrieval and citation verification rather than relying on standard black-box LLM prompts."
  },
  {
    "id": "tr-flagship-21",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 384,
    "endTime": 403,
    "text": "Exactly. Enterprise buyers test us rigorously. If an answer doesn't have an exact second-level timestamp, they assume it is a hallucination."
  },
  {
    "id": "tr-flagship-22",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 403,
    "endTime": 422,
    "text": "That leads directly into our customer feedback data. Sarah, should I pull up the CS insights deck?"
  },
  {
    "id": "tr-flagship-23",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 422,
    "endTime": 441,
    "text": "Yes Emily, let's transition right into section two: Customer feedback and recurring friction points."
  },
  {
    "id": "tr-flagship-24",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 441,
    "endTime": 460,
    "text": "I'll take notes on the UI requests as Emily walks through the feedback."
  },
  {
    "id": "tr-flagship-25",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 460,
    "endTime": 479,
    "text": "Awesome. Let me share my screen."
  },
  {
    "id": "tr-flagship-26",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 479,
    "endTime": 499,
    "text": "We're seeing your screen clearly, Emily. Go ahead."
  },
  {
    "id": "tr-flagship-27",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 499,
    "endTime": 518,
    "text": "Great. Let's break down the feedback from 340 customer tickets and 28 executive interviews."
  },
  {
    "id": "tr-flagship-28",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 518,
    "endTime": 537,
    "text": "I also have some direct feedback from the FinTech Global and Memorial Health discovery calls to add."
  },
  {
    "id": "tr-flagship-29",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 537,
    "endTime": 556,
    "text": "Perfect, Rachel. Let's make sure sales and CS feedback are merged."
  },
  {
    "id": "tr-flagship-30",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 556,
    "endTime": 575,
    "text": "Marcus and I will track any architectural requirements that come out of this."
  },
  {
    "id": "tr-flagship-31",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 575,
    "endTime": 594,
    "text": "Let's dive into the citation accuracy findings first."
  },
  {
    "id": "tr-flagship-32",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 594,
    "endTime": 614,
    "text": "The overwhelming number one theme is trust in AI citations. Customers told us repeatedly: 'We love the summaries, but our executives will not circulate notes unless every claim links to a verifiable timestamp.'"
  },
  {
    "id": "tr-flagship-33",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 614,
    "endTime": 633,
    "text": "I hear this on almost every sales call. During our demo with FinTech Global on Thursday, their CTO said verbatim: 'If your AI claims we agreed to a target launch date of October 15th, I need to click that bullet and hear our VP actually say it.'"
  },
  {
    "id": "tr-flagship-34",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 633,
    "endTime": 652,
    "text": "This reinforces why our grounded RAG architecture with citation validation is our biggest competitive moat against generic ChatGPT wrappers."
  },
  {
    "id": "tr-flagship-35",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 652,
    "endTime": 671,
    "text": "Alex, how are we enforcing citation accuracy technically?"
  },
  {
    "id": "tr-flagship-36",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 671,
    "endTime": 690,
    "text": "Marcus and I built a citation validation layer in the backend. When OpenAI generates a response with citation objects, we compare the timestamp and quote against the exact retrieved transcript segments."
  },
  {
    "id": "tr-flagship-37",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 690,
    "endTime": 709,
    "text": "If the model hallucinates a timestamp that doesn't exist in the context, our validator snaps it to the nearest valid segment startTime or discards it if the quote text doesn't overlap."
  },
  {
    "id": "tr-flagship-38",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 709,
    "endTime": 729,
    "text": "In the UI, we render those validated citations as clickable pill badges. Clicking one immediately seeks the audio player to that exact second."
  },
  {
    "id": "tr-flagship-39",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 729,
    "endTime": 748,
    "text": "And we added an amber glow highlight animation to the corresponding transcript card so users never lose their place in the dialogue."
  },
  {
    "id": "tr-flagship-40",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 748,
    "endTime": 767,
    "text": "Users love that interaction. The second major customer request is template customization."
  },
  {
    "id": "tr-flagship-41",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 767,
    "endTime": 786,
    "text": "Can you elaborate on what specific templates customers are demanding, Emily?"
  },
  {
    "id": "tr-flagship-42",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 786,
    "endTime": 805,
    "text": "Sales leaders want MEDDIC qualification summaries with Metrics, Economic Buyers, and Pain Points. Engineering managers want sprint retrospectives with blockers and PR references. And hiring managers want structured interview scorecards."
  },
  {
    "id": "tr-flagship-43",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 805,
    "endTime": 825,
    "text": "Right now we have six static template presets, but enterprise admins want to build their own custom templates."
  },
  {
    "id": "tr-flagship-44",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 825,
    "endTime": 844,
    "text": "We can support custom template definitions by allowing admins to supply a custom JSON schema and system prompt guidance. Because we use OpenAI structured JSON mode, the model adheres strictly to the defined schema."
  },
  {
    "id": "tr-flagship-45",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 844,
    "endTime": 863,
    "text": "We just need token guardrails. If someone submits an 80-minute meeting with a template requesting 20 deep sections, we must chunk the transcript to stay within token budgets."
  },
  {
    "id": "tr-flagship-46",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 863,
    "endTime": 882,
    "text": "We can use rolling chunk summarization for long calls over 45 minutes, then synthesize the section takeaways in a final consolidation pass."
  },
  {
    "id": "tr-flagship-47",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 882,
    "endTime": 901,
    "text": "The third friction point is action item follow-through. Users say action items are captured beautifully in Fathom, but they die in the meeting notes because they don't sync to task trackers."
  },
  {
    "id": "tr-flagship-48",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 901,
    "endTime": 920,
    "text": "Three large accounts—including Apex Care and FinTech Global—specifically listed missing Jira and Linear integrations as a blocker for their Q4 enterprise rollouts."
  },
  {
    "id": "tr-flagship-49",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 920,
    "endTime": 940,
    "text": "Marcus, what is the level of effort to build native Jira and Slack webhook export integrations in early Q4?"
  },
  {
    "id": "tr-flagship-50",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 940,
    "endTime": 959,
    "text": "We already have event webhooks firing on action item creation. Building native Jira and Slack webhook export integrations will take about three weeks for two backend engineers."
  },
  {
    "id": "tr-flagship-51",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 959,
    "endTime": 978,
    "text": "Let's commit to that. Marcus, let's schedule the Jira and Slack webhook export integration for Sprint 24 starting October 14th."
  },
  {
    "id": "tr-flagship-52",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 978,
    "endTime": 997,
    "text": "Agreed. I will publish the webhook export API specification by this Friday, October 4th."
  },
  {
    "id": "tr-flagship-53",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 997,
    "endTime": 1016,
    "text": "The payload will include the action item title, assignee name, due date, context timestamp, and a direct deep link back to the exact meeting second."
  },
  {
    "id": "tr-flagship-54",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 1016,
    "endTime": 1035,
    "text": "That deep link back into Fathom makes the task actionable for Jira assignees who were not on the call."
  },
  {
    "id": "tr-flagship-55",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 1035,
    "endTime": 1055,
    "text": "On the sharing side, Emily mentioned earlier that users wanted public clip sharing. We deployed the `/shared/[token]` route yesterday."
  },
  {
    "id": "tr-flagship-56",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 1055,
    "endTime": 1074,
    "text": "I saw that! A customer shared a 45-second clip with their external vendor this morning, and the vendor watched it instantly on mobile without needing to log in."
  },
  {
    "id": "tr-flagship-57",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 1074,
    "endTime": 1093,
    "text": "That zero-friction clip sharing is a massive viral growth loop for our sales pipeline."
  },
  {
    "id": "tr-flagship-58",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 1093,
    "endTime": 1112,
    "text": "Because the clip token encodes the start and end timestamp in a base64url payload, it resolves statelessly without hitting our core database on every view."
  },
  {
    "id": "tr-flagship-59",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 1112,
    "endTime": 1131,
    "text": "And from a compliance angle, the shared clip only exposes the selected transcript range, keeping the rest of the meeting confidential."
  },
  {
    "id": "tr-flagship-60",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 1131,
    "endTime": 1151,
    "text": "What about clip expiration? Can enterprise admins configure link lifespans?"
  },
  {
    "id": "tr-flagship-61",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 1151,
    "endTime": 1170,
    "text": "Yes, we have 7-day, 30-day, and permanent link options in the trimmer modal."
  },
  {
    "id": "tr-flagship-62",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 1170,
    "endTime": 1189,
    "text": "And admins can revoke any shared link instantly from the security console."
  },
  {
    "id": "tr-flagship-63",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 1189,
    "endTime": 1208,
    "text": "Can we also ensure users can download clips directly as MP4 or text snippets?"
  },
  {
    "id": "tr-flagship-64",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 1208,
    "endTime": 1227,
    "text": "Yes, we have a 'Copy Transcript Excerpt' button right inside the shared player header."
  },
  {
    "id": "tr-flagship-65",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 1227,
    "endTime": 1246,
    "text": "That addresses the core enterprise sharing requirements. Any other CS topics before pricing?"
  },
  {
    "id": "tr-flagship-66",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 1246,
    "endTime": 1266,
    "text": "Just one quick note: customers asked for search highlighting when filtering transcripts."
  },
  {
    "id": "tr-flagship-67",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 1266,
    "endTime": 1285,
    "text": "That's already implemented! When you type in the transcript search bar, matching words highlight in amber and the count updates in real time."
  },
  {
    "id": "tr-flagship-68",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 1285,
    "endTime": 1304,
    "text": "Users also asked whether search handles partial word matches or semantic intent."
  },
  {
    "id": "tr-flagship-69",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 1304,
    "endTime": 1323,
    "text": "We combine exact token stemming with BM25 lexical ranking so queries like 'price' match 'pricing' and 'priced' seamlessly."
  },
  {
    "id": "tr-flagship-70",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 1323,
    "endTime": 1342,
    "text": "And our client-side search indexing executes in under 4 milliseconds across 200 transcript segments."
  },
  {
    "id": "tr-flagship-71",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 1342,
    "endTime": 1361,
    "text": "Awesome. That covers everything from Customer Success."
  },
  {
    "id": "tr-flagship-72",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 1361,
    "endTime": 1381,
    "text": "Let's make sure we document these customer quotes in our Q4 PRD."
  },
  {
    "id": "tr-flagship-73",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 1381,
    "endTime": 1400,
    "text": "I'll link the recording clips in our CRM account notes as well."
  },
  {
    "id": "tr-flagship-74",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 1400,
    "endTime": 1419,
    "text": "And Marcus and I will prioritize the webhook queue architecture."
  },
  {
    "id": "tr-flagship-75",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 1419,
    "endTime": 1438,
    "text": "Great. Let's transition to section three at the 18-minute mark: Enterprise Pricing & Commercial Packaging."
  },
  {
    "id": "tr-flagship-76",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 1438,
    "endTime": 1457,
    "text": "Ready. Let's look at the proposed rate card."
  },
  {
    "id": "tr-flagship-77",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 1457,
    "endTime": 1476,
    "text": "Take it away Rachel."
  },
  {
    "id": "tr-flagship-78",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 1476,
    "endTime": 1496,
    "text": "Let's turn to enterprise pricing. Right now, our Pro plan is $19 per user per month. For Enterprise, we've been doing custom quotes between $24k and $48k, which creates friction and slows down deal velocity."
  },
  {
    "id": "tr-flagship-79",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 1496,
    "endTime": 1515,
    "text": "I propose standardizing our Enterprise tier at $32 per user per month on an annual contract, with a mandatory 25-seat minimum commitment. That creates a $9,600 annual contract floor."
  },
  {
    "id": "tr-flagship-80",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 1515,
    "endTime": 1534,
    "text": "Let's evaluate the feature gates. Rachel, what features are exclusive to that $32 Enterprise tier versus Pro?"
  },
  {
    "id": "tr-flagship-81",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 1534,
    "endTime": 1553,
    "text": "Enterprise will include: SAML SSO with Okta and Azure AD, centralized audit logs, dedicated CSM, HIPAA BAA execution, zero-retention DPA agreements, custom prompt templates, and multi-year cross-meeting search."
  },
  {
    "id": "tr-flagship-82",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 1553,
    "endTime": 1572,
    "text": "I want to push back slightly on gating cross-meeting search entirely behind Enterprise. Cross-meeting search is one of our stickiest features. What if Pro users get 30 days of cross-meeting search, and Enterprise gets unlimited history?"
  },
  {
    "id": "tr-flagship-83",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 1572,
    "endTime": 1592,
    "text": "I like that compromise, Parv. 30 days of search history gives Pro users a powerful taste of the intelligence, while driving them to upgrade when they need historical quarterly recall."
  },
  {
    "id": "tr-flagship-84",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 1592,
    "endTime": 1611,
    "text": "What about paid pilot evaluations? Many enterprise buyers insist on a 30-day trial with their team before committing to a six-figure contract."
  },
  {
    "id": "tr-flagship-85",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 1611,
    "endTime": 1630,
    "text": "I propose a standardized 30-day Enterprise pilot capped at 50 seats for a flat $2,500 pilot fee. If they execute the annual contract within 45 days, 100% of that $2,500 gets credited toward their annual invoice."
  },
  {
    "id": "tr-flagship-86",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 1630,
    "endTime": 1649,
    "text": "That is a clean commercial structure. It filters out non-serious prospects and accelerates legal review. Priya, can we sign standard enterprise DPAs during paid pilots?"
  },
  {
    "id": "tr-flagship-87",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 1649,
    "endTime": 1668,
    "text": "Yes. Our standard Data Processing Agreement has been vetted by external counsel. It explicitly includes our zero-data-retention terms with OpenAI so customer audio and text are never used for model training."
  },
  {
    "id": "tr-flagship-88",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 1668,
    "endTime": 1687,
    "text": "And on the infrastructure side, we enforce TLS 1.3 in transit and AES-256 encryption at rest across all customer tenant databases."
  },
  {
    "id": "tr-flagship-89",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 1687,
    "endTime": 1707,
    "text": "For seat enforcement, backend has automated Redis license metering. When an account exceeds their provisioned seats, we alert the workspace admin instead of abruptly locking users out."
  },
  {
    "id": "tr-flagship-90",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 1707,
    "endTime": 1726,
    "text": "That soft warning prevents embarrassing interruptions during important client calls."
  },
  {
    "id": "tr-flagship-91",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 1726,
    "endTime": 1745,
    "text": "What happens if a customer has 500 seats? Do we offer volume discount brackets?"
  },
  {
    "id": "tr-flagship-92",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 1745,
    "endTime": 1764,
    "text": "Yes. For 100 to 250 seats, $28 per user per month. For 250-plus seats, $24 per user per month with custom invoicing."
  },
  {
    "id": "tr-flagship-93",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 1764,
    "endTime": 1783,
    "text": "That maintains healthy 82% software gross margins even at the highest discount tier."
  },
  {
    "id": "tr-flagship-94",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 1783,
    "endTime": 1802,
    "text": "Are we including dedicated white-glove onboarding for accounts over 100 seats?"
  },
  {
    "id": "tr-flagship-95",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 1802,
    "endTime": 1822,
    "text": "Yes, accounts with 100+ seats receive four tailored onboarding workshops led by Customer Success."
  },
  {
    "id": "tr-flagship-96",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 1822,
    "endTime": 1841,
    "text": "That will ensure high initial adoption and safeguard our 118% net retention rate."
  },
  {
    "id": "tr-flagship-97",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 1841,
    "endTime": 1860,
    "text": "Will enterprise admins have self-serve seat management in the settings console?"
  },
  {
    "id": "tr-flagship-98",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 1860,
    "endTime": 1879,
    "text": "Yes, the billing dashboard lets admins invite users, reassign seats, and view monthly active usage metrics in real time."
  },
  {
    "id": "tr-flagship-99",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 1879,
    "endTime": 1898,
    "text": "What about monthly vs annual billing? Are we allowing month-to-month on Enterprise?"
  },
  {
    "id": "tr-flagship-100",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 1898,
    "endTime": 1918,
    "text": "No, Enterprise is strictly annual prepaid. Pro can remain monthly at $24 or annual at $19 per user per month."
  },
  {
    "id": "tr-flagship-101",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 1918,
    "endTime": 1937,
    "text": "That ensures strong cash flow and predictable revenue. Let's check legal readiness. Priya, any issues with the $9,600 annual floor?"
  },
  {
    "id": "tr-flagship-102",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 1937,
    "endTime": 1956,
    "text": "None from legal. Our standard terms of service and DPA cover that floor cleanly."
  },
  {
    "id": "tr-flagship-103",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 1956,
    "endTime": 1975,
    "text": "Marcus, how quickly does the automated license metering sync between Stripe webhooks and our Redis session store?"
  },
  {
    "id": "tr-flagship-104",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 1975,
    "endTime": 1994,
    "text": "Stripe webhook events update Redis tenant limits within 250 milliseconds with guaranteed idempotency."
  },
  {
    "id": "tr-flagship-105",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 1994,
    "endTime": 2013,
    "text": "Let's lock this decision: Enterprise tier is $32 per seat per month (annual contract), 25-seat minimum commitment ($9,600 floor), and $2,500 30-day pilots credited upon contract signing. Rachel, when can sales collateral be updated?"
  },
  {
    "id": "tr-flagship-106",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 2013,
    "endTime": 2033,
    "text": "I will have the updated enterprise rate cards and standard order form templates ready by next Tuesday, October 8th."
  },
  {
    "id": "tr-flagship-107",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 2033,
    "endTime": 2052,
    "text": "I will also provide the security one-pager attachment for Rachel's sales collateral packet."
  },
  {
    "id": "tr-flagship-108",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 2052,
    "endTime": 2071,
    "text": "Thank you Priya. That will help us close the FinTech Global pilot by mid-October."
  },
  {
    "id": "tr-flagship-109",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 2071,
    "endTime": 2090,
    "text": "Our CS team will also prepare onboarding runbooks tailored to the 25-seat minimum cohort."
  },
  {
    "id": "tr-flagship-110",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 2090,
    "endTime": 2109,
    "text": "Great. Now let's move into section four at the 30-minute mark: The Q4 Product Roadmap."
  },
  {
    "id": "tr-flagship-111",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 2109,
    "endTime": 2128,
    "text": "I have the roadmap wireframes ready to share."
  },
  {
    "id": "tr-flagship-112",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 2128,
    "endTime": 2148,
    "text": "Go ahead Daniel."
  },
  {
    "id": "tr-flagship-113",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 2148,
    "endTime": 2167,
    "text": "For Q4, we are focusing on three core roadmap themes: First, Deep Cross-Meeting Intelligence; Second, Workspace Custom Templates; Third, Real-time Collaborative Notetaking."
  },
  {
    "id": "tr-flagship-114",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 2167,
    "endTime": 2186,
    "text": "Let me share my screen to show the Figma prototypes for Cross-Meeting Ask Fathom. We built a Command-K global launcher, speaker filter chips, and interactive citation popovers."
  },
  {
    "id": "tr-flagship-115",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 2186,
    "endTime": 2205,
    "text": "Notice the audio waveform visualizer at the bottom. It pulses in sync with the active playback second, giving a lively tactile feel."
  },
  {
    "id": "tr-flagship-116",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 2205,
    "endTime": 2224,
    "text": "That waveform interaction makes the playback feel much more engaging than a plain progress bar."
  },
  {
    "id": "tr-flagship-117",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 2224,
    "endTime": 2244,
    "text": "Daniel, how does the interface adapt for mobile viewports? Many executives read meeting takeaways on their phones between meetings."
  },
  {
    "id": "tr-flagship-118",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 2244,
    "endTime": 2263,
    "text": "On viewports under 640px, the transcript and overview collapse into a fluid swipeable sheet, and the audio scrubber uses a tactile touch slider with large timestamp targets."
  },
  {
    "id": "tr-flagship-119",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 2263,
    "endTime": 2282,
    "text": "Regarding the Collaborative Notetaking theme: were we planning full WebSocket CRDT multi-cursor sync in Q4, or optimistic local state with REST polling?"
  },
  {
    "id": "tr-flagship-120",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 2282,
    "endTime": 2301,
    "text": "Let's keep it scoped to optimistic local state with REST persistence for Q4. A full Yjs CRDT implementation would add significant complexity and distract from our search latency SLA target."
  },
  {
    "id": "tr-flagship-121",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 2301,
    "endTime": 2320,
    "text": "I completely agree with Parv. We must keep our engineering focus razor-sharp on sub-800ms search latency and transcription accuracy. Let's formally defer CRDT multi-cursor sync to Q1."
  },
  {
    "id": "tr-flagship-122",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 2320,
    "endTime": 2339,
    "text": "Can we also ensure the 'Copy Notes' markdown export feature is highlighted in the app? Our engineering customers love copying formatted markdown directly into Notion and GitHub."
  },
  {
    "id": "tr-flagship-123",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 2339,
    "endTime": 2359,
    "text": "Yes! The 'Copy Notes' button in the top header is already live. One click copies the executive summary, key decisions, and action items formatted in clean markdown."
  },
  {
    "id": "tr-flagship-124",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 2359,
    "endTime": 2378,
    "text": "I will highlight that in our upcoming customer newsletter on Friday, October 4th."
  },
  {
    "id": "tr-flagship-125",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 2378,
    "endTime": 2397,
    "text": "Let's make sure the action item checklist in the Overview tab also updates completion state in real time."
  },
  {
    "id": "tr-flagship-126",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 2397,
    "endTime": 2416,
    "text": "That is already wired up to our store reducer with instant visual feedback."
  },
  {
    "id": "tr-flagship-127",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 2416,
    "endTime": 2435,
    "text": "And we added a visual progress bar that recalculates the completion percentage whenever an item is checked off."
  },
  {
    "id": "tr-flagship-128",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 2435,
    "endTime": 2454,
    "text": "That visual feedback is super rewarding for users."
  },
  {
    "id": "tr-flagship-129",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 2454,
    "endTime": 2474,
    "text": "What about keyboard shortcuts? Power users love navigating meetings without touching the mouse."
  },
  {
    "id": "tr-flagship-130",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 2474,
    "endTime": 2493,
    "text": "Space toggles play/pause, J and L skip backward and forward 10 seconds, and ? opens the keyboard shortcuts cheat sheet modal."
  },
  {
    "id": "tr-flagship-131",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 2493,
    "endTime": 2512,
    "text": "We tested the keyboard latency and it responds within 8 milliseconds of keypress."
  },
  {
    "id": "tr-flagship-132",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 2512,
    "endTime": 2531,
    "text": "Can sales reps trigger email summaries directly from the keyboard shortcuts?"
  },
  {
    "id": "tr-flagship-133",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 2531,
    "endTime": 2550,
    "text": "We can add 'E' for email draft generation in our next minor UI patch."
  },
  {
    "id": "tr-flagship-134",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 2550,
    "endTime": 2569,
    "text": "Daniel, how are the accessibility and contrast ratios on the dark mode palette?"
  },
  {
    "id": "tr-flagship-135",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 2569,
    "endTime": 2589,
    "text": "All text elements exceed WCAG AA 4.5:1 contrast standards, and our focus outlines are fully visible for keyboard-only navigation."
  },
  {
    "id": "tr-flagship-136",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 2589,
    "endTime": 2608,
    "text": "Let's make sure Daniel delivers the final mobile scrubber UI specs by Friday, October 11th."
  },
  {
    "id": "tr-flagship-137",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 2608,
    "endTime": 2627,
    "text": "Confirmed. The mobile timeline design specs will be in Figma by October 11th."
  },
  {
    "id": "tr-flagship-138",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 2627,
    "endTime": 2646,
    "text": "Let's finalize that roadmap scope. Now let's move to section five at the 40-minute mark: Engineering Architecture, Performance, and Latency SLAs."
  },
  {
    "id": "tr-flagship-139",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 2646,
    "endTime": 2665,
    "text": "Marcus and I are ready to present the architecture benchmarks."
  },
  {
    "id": "tr-flagship-140",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 2665,
    "endTime": 2685,
    "text": "Let's talk system architecture and latency benchmarks. In Q3, our P95 latency for Ask Fathom queries was 2.4 seconds. That felt noticeably sluggish to users."
  },
  {
    "id": "tr-flagship-141",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 2685,
    "endTime": 2704,
    "text": "For Q4, our goal is establishing a non-negotiable P95 latency SLA of sub-800 milliseconds for all grounded AI queries. Marcus and I benchmarked a two-stage hybrid retrieval pipeline that achieves this."
  },
  {
    "id": "tr-flagship-142",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 2704,
    "endTime": 2723,
    "text": "Here is the technical breakdown: Instead of sending the full 60-minute transcript into the LLM context—which costs 15,000 tokens and 6 cents per question—we run localized lexical BM25 scoring to find the top 8 relevant dialogue turns."
  },
  {
    "id": "tr-flagship-143",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 2723,
    "endTime": 2742,
    "text": "Then stage two attaches the adjacent turns for context and passes only 600 tokens to OpenAI gpt-4o-mini."
  },
  {
    "id": "tr-flagship-144",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 2742,
    "endTime": 2761,
    "text": "Because gpt-4o-mini has sub-second generation speeds and native JSON mode, our end-to-end response time dropped to 680 milliseconds in benchmarks, and our OpenAI API costs dropped by 84%."
  },
  {
    "id": "tr-flagship-145",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 2761,
    "endTime": 2780,
    "text": "That is a massive win for both user experience and gross margins. What happens if OpenAI experiences an API slowdown or outage?"
  },
  {
    "id": "tr-flagship-146",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 2780,
    "endTime": 2800,
    "text": "We built a zero-failure deterministic fallback engine. If the OpenAI request fails, times out after 25 seconds, or validation fails, our deterministic synthesis engine immediately produces verified transcript citations."
  },
  {
    "id": "tr-flagship-147",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 2800,
    "endTime": 2819,
    "text": "And our citation validator guarantees that every citation timestamp accurately snaps to the ground-truth segment startTime, preventing hallucinated timestamps."
  },
  {
    "id": "tr-flagship-148",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 2819,
    "endTime": 2838,
    "text": "That verification is essential for enterprise security audits. What is our database connection headroom as concurrent users scale in Q4?"
  },
  {
    "id": "tr-flagship-149",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 2838,
    "endTime": 2857,
    "text": "With PgBouncer configured at 800 pooled connections and Redis caching transcript chunks with a 91% cache hit rate, Postgres CPU utilization remains below 22% under 5,000 simulated concurrent users."
  },
  {
    "id": "tr-flagship-150",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 2857,
    "endTime": 2876,
    "text": "And read-heavy search requests are routed directly to our Postgres read replicas, keeping primary database writes free for live recording streams."
  },
  {
    "id": "tr-flagship-151",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 2876,
    "endTime": 2895,
    "text": "What is the replication lag between primary Postgres and read replicas during peak recording hours?"
  },
  {
    "id": "tr-flagship-152",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 2895,
    "endTime": 2915,
    "text": "Replication lag stays under 12 milliseconds across all availability zones in us-east-1."
  },
  {
    "id": "tr-flagship-153",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 2915,
    "endTime": 2934,
    "text": "Outstanding engineering work. Let's formally establish the sub-800ms P95 latency threshold as a hard release blocker for all production deployments."
  },
  {
    "id": "tr-flagship-154",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 2934,
    "endTime": 2953,
    "text": "Alex will configure automated Datadog P95 latency monitors and alert channels by Monday, October 7th."
  },
  {
    "id": "tr-flagship-155",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 2953,
    "endTime": 2972,
    "text": "And Marcus, let's ensure we track cache hit ratios in the same Datadog dashboard."
  },
  {
    "id": "tr-flagship-156",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 2972,
    "endTime": 2991,
    "text": "Will do. Redis eviction rates and cache latency are already instrumented."
  },
  {
    "id": "tr-flagship-157",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 2991,
    "endTime": 3011,
    "text": "Great. Let's move into section six at the 49-minute mark: Security, Compliance, and Enterprise Certifications."
  },
  {
    "id": "tr-flagship-158",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 3011,
    "endTime": 3030,
    "text": "I have the security timeline ready to review."
  },
  {
    "id": "tr-flagship-159",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 3030,
    "endTime": 3049,
    "text": "Let's review our SOC2 Type II certification timeline. Our three-month observation window with our auditor A-LIGN is scheduled from November 1st to January 31st."
  },
  {
    "id": "tr-flagship-160",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 3049,
    "endTime": 3068,
    "text": "We have two prerequisite engineering tasks before November 1st: First, automated quarterly access reviews for AWS IAM and GitHub; Second, customer-specific KMS envelope encryption for Redis cache keys."
  },
  {
    "id": "tr-flagship-161",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 3068,
    "endTime": 3087,
    "text": "AWS IAM quarterly review is already automated via Terraform scripts. I will complete the Redis KMS envelope encryption by October 20th."
  },
  {
    "id": "tr-flagship-162",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 3087,
    "endTime": 3106,
    "text": "Priya, what is our status on HIPAA compliance? We have two healthcare hospital network deals worth $220k combined ARR that require signed Business Associate Agreements (BAAs)."
  },
  {
    "id": "tr-flagship-163",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 3106,
    "endTime": 3126,
    "text": "We completed our HIPAA readiness audit with external security counsel. Because we do not store raw unencrypted audio and support dedicated customer encryption keys, we are cleared to execute BAAs starting November 15th."
  },
  {
    "id": "tr-flagship-164",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 3126,
    "endTime": 3145,
    "text": "That unlocks both healthcare deals for our Q4 sales quota! I will notify the procurement teams at Memorial Health and Apex Care today."
  },
  {
    "id": "tr-flagship-165",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 3145,
    "endTime": 3164,
    "text": "Priya, what is our policy for GDPR right-to-be-forgotten requests and customer data deletion upon contract termination?"
  },
  {
    "id": "tr-flagship-166",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 3164,
    "endTime": 3183,
    "text": "Our automated data deletion pipeline cascades deletions across Postgres transcripts, vector embeddings, and backup snapshots within 72 hours of request receipt. A signed certificate of destruction is auto-generated for the customer."
  },
  {
    "id": "tr-flagship-167",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 3183,
    "endTime": 3202,
    "text": "And crucially, our OpenAI enterprise agreement guarantees zero data retention for model training, meaning customer dialogue is never cached or trained upon by third-party model providers."
  },
  {
    "id": "tr-flagship-168",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 3202,
    "endTime": 3221,
    "text": "Did we schedule our annual external penetration test as well?"
  },
  {
    "id": "tr-flagship-169",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 3221,
    "endTime": 3241,
    "text": "Yes, NCC Group is conducting our third-party grey-box penetration test during the week of October 21st."
  },
  {
    "id": "tr-flagship-170",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 3241,
    "endTime": 3260,
    "text": "I've also published the Enterprise Security Whitepaper detailing all these controls on our trust center at trust.fathom.work."
  },
  {
    "id": "tr-flagship-171",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 3260,
    "endTime": 3279,
    "text": "Having that public trust center URL will dramatically shorten security questionnaires for our sales team."
  },
  {
    "id": "tr-flagship-172",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 3279,
    "endTime": 3298,
    "text": "Excellent. Let's move into our final section at the 56-minute mark: Final Decisions, Deadlines, and Action Items."
  },
  {
    "id": "tr-flagship-173",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 3298,
    "endTime": 3317,
    "text": "We are at the 56-minute mark. Let's review the key decisions we locked today and confirm owners and deadlines for every action item."
  },
  {
    "id": "tr-flagship-174",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 3317,
    "endTime": 3336,
    "text": "Decision 1: We locked our Enterprise pricing tier at $32 per user per month (annual contract) with a 25-seat minimum commitment ($9,600 annual floor)."
  },
  {
    "id": "tr-flagship-175",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 3336,
    "endTime": 3356,
    "text": "Decision 2: Standardizing 30-day Enterprise pilots at $2,500 flat fee (capped at 50 users), 100% credited toward annual contracts executed within 45 days."
  },
  {
    "id": "tr-flagship-176",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 3356,
    "endTime": 3375,
    "text": "Decision 3: Establishing a strict P95 search latency SLA of sub-800 milliseconds using our two-stage hybrid BM25 and chunk retrieval pipeline."
  },
  {
    "id": "tr-flagship-177",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 3375,
    "endTime": 3394,
    "text": "Decision 4: Deploying Jira and Slack webhook export integrations in Sprint 24, with API specifications published by Friday, October 4th."
  },
  {
    "id": "tr-flagship-178",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 3394,
    "endTime": 3413,
    "text": "Decision 5: Launching the SOC2 Type II three-month observation window on November 1st with A-LIGN and executing HIPAA BAAs starting November 15th."
  },
  {
    "id": "tr-flagship-179",
    "speakerId": "spk-daniel",
    "speakerName": "Daniel Kim",
    "speakerRole": "Principal Product Designer",
    "speakerAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "startTime": 3413,
    "endTime": 3432,
    "text": "Decision 6: Delivering custom template builder UI and responsive mobile timeline scrubber prototypes by October 11th."
  },
  {
    "id": "tr-flagship-180",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 3432,
    "endTime": 3452,
    "text": "Decision 7: Launching monthly customer newsletter with 'Copy Notes' markdown export feature spotlight on Friday, October 4th."
  },
  {
    "id": "tr-flagship-181",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 3452,
    "endTime": 3471,
    "text": "Decision 8: Scope discipline — formally deferring multi-user WebSocket CRDT cursor synchronization to Q1 to keep engineering focused on core retrieval reliability."
  },
  {
    "id": "tr-flagship-182",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 3471,
    "endTime": 3490,
    "text": "Now for action item assignments: Rachel owns updating enterprise sales collateral and rate cards by October 8th. Marcus owns publishing the Jira and Slack webhook export specs by October 4th."
  },
  {
    "id": "tr-flagship-183",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 3490,
    "endTime": 3509,
    "text": "Priya owns completing the Redis KMS encryption by October 20th. Daniel owns finalizing mobile touch scrubber specs by October 11th. Emily owns publishing the CS product newsletter on October 4th."
  },
  {
    "id": "tr-flagship-184",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 3509,
    "endTime": 3528,
    "text": "Alex owns deploying the Datadog P95 latency monitoring alerts across staging and production clusters by October 7th. Parv owns finalizing the Q4 Product Requirements Document by October 9th."
  },
  {
    "id": "tr-flagship-185",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 3528,
    "endTime": 3547,
    "text": "Sarah Chen will schedule the formal Q4 OKR executive review for October 10th."
  },
  {
    "id": "tr-flagship-186",
    "speakerId": "spk-marcus",
    "speakerName": "Marcus Vance",
    "speakerRole": "Lead Backend Engineer",
    "speakerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "startTime": 3547,
    "endTime": 3567,
    "text": "Marcus will also wire up the Redis seat metering alerts by October 16th."
  },
  {
    "id": "tr-flagship-187",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 3567,
    "endTime": 3586,
    "text": "And Priya will distribute the HIPAA BAA execution packets to Memorial Health and Apex Care by November 15th."
  },
  {
    "id": "tr-flagship-188",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 3586,
    "endTime": 3605,
    "text": "Are there any final blockers or open questions before we adjourn?"
  },
  {
    "id": "tr-flagship-189",
    "speakerId": "spk-priya",
    "speakerName": "Priya Shah",
    "speakerRole": "Head of Security & Compliance",
    "speakerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "startTime": 3605,
    "endTime": 3624,
    "text": "All clear on security and compliance."
  },
  {
    "id": "tr-flagship-190",
    "speakerId": "spk-rachel",
    "speakerName": "Rachel Green",
    "speakerRole": "Enterprise Sales Director",
    "speakerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "startTime": 3624,
    "endTime": 3643,
    "text": "Sales team is fully aligned and ready to execute."
  },
  {
    "id": "tr-flagship-191",
    "speakerId": "spk-emily",
    "speakerName": "Emily Carter",
    "speakerRole": "Head of Customer Success",
    "speakerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "startTime": 3643,
    "endTime": 3662,
    "text": "Customer success is excited to share the new updates with our accounts."
  },
  {
    "id": "tr-flagship-192",
    "speakerId": "spk-alex",
    "speakerName": "Alex Rivera",
    "speakerRole": "Engineering Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "startTime": 3662,
    "endTime": 3682,
    "text": "Engineering is ready for Sprint 24 kickoff."
  },
  {
    "id": "tr-flagship-193",
    "speakerId": "spk-parv",
    "speakerName": "Parv",
    "speakerRole": "Product & AI Lead",
    "speakerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "startTime": 3682,
    "endTime": 3701,
    "text": "Let's make Q4 our highest-impact quarter to date."
  },
  {
    "id": "tr-flagship-194",
    "speakerId": "spk-sarah",
    "speakerName": "Sarah Chen",
    "speakerRole": "VP of Product",
    "speakerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "startTime": 3701,
    "endTime": 3720,
    "text": "Thank you everyone for an incredibly productive session. Meeting adjourned right on time at 62 minutes."
  }
];

export const FLAGSHIP_ACTION_ITEMS: ActionItem[] = [
  {
    "id": "act-flag-1",
    "text": "Update enterprise sales collateral and standard order forms with $32/seat pricing and 25-seat minimum",
    "assignee": {
      "name": "Rachel Green",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    "completed": false,
    "dueDate": "Oct 8, 2026",
    "priority": "high",
    "timestamp": 1496
  },
  {
    "id": "act-flag-2",
    "text": "Publish Jira and Slack webhook export API specifications and webhook event schemas",
    "assignee": {
      "name": "Marcus Vance",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    "completed": false,
    "dueDate": "Oct 4, 2026",
    "priority": "high",
    "timestamp": 959
  },
  {
    "id": "act-flag-3",
    "text": "Configure Datadog P95 latency monitors, sub-800ms alert thresholds, and on-call escalation channels",
    "assignee": {
      "name": "Alex Rivera",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    "completed": false,
    "dueDate": "Oct 7, 2026",
    "priority": "high",
    "timestamp": 2685
  },
  {
    "id": "act-flag-4",
    "text": "Implement customer-specific KMS envelope encryption for Redis cache keys ahead of SOC2 window",
    "assignee": {
      "name": "Priya Shah",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    "completed": false,
    "dueDate": "Oct 20, 2026",
    "priority": "high",
    "timestamp": 3030
  },
  {
    "id": "act-flag-5",
    "text": "Deliver mobile touch timeline scrubber and custom template builder UI specifications in Figma",
    "assignee": {
      "name": "Daniel Kim",
      "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    },
    "completed": false,
    "dueDate": "Oct 11, 2026",
    "priority": "medium",
    "timestamp": 2244
  },
  {
    "id": "act-flag-6",
    "text": "Publish monthly CS customer newsletter spotlighting 'Copy Notes' markdown export feature",
    "assignee": {
      "name": "Emily Carter",
      "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    "completed": false,
    "dueDate": "Oct 4, 2026",
    "priority": "medium",
    "timestamp": 2359
  },
  {
    "id": "act-flag-7",
    "text": "Finalize and circulate Q4 Product Requirements Document (PRD) incorporating enterprise gating decisions",
    "assignee": {
      "name": "Parv",
      "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
    },
    "completed": false,
    "dueDate": "Oct 9, 2026",
    "priority": "high",
    "timestamp": 3509
  },
  {
    "id": "act-flag-8",
    "text": "Schedule formal Q4 OKR executive review and sign-off meeting with department heads",
    "assignee": {
      "name": "Sarah Chen",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    "completed": false,
    "dueDate": "Oct 10, 2026",
    "priority": "medium",
    "timestamp": 3528
  },
  {
    "id": "act-flag-9",
    "text": "Implement Redis seat count metering and soft warning alerts in the admin console",
    "assignee": {
      "name": "Marcus Vance",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    "completed": false,
    "dueDate": "Oct 16, 2026",
    "priority": "medium",
    "timestamp": 1687
  },
  {
    "id": "act-flag-10",
    "text": "Distribute HIPAA BAA execution packets to Memorial Health and Apex Care procurement teams",
    "assignee": {
      "name": "Priya Shah",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    "completed": false,
    "dueDate": "Nov 15, 2026",
    "priority": "high",
    "timestamp": 3106
  }
];

export const FLAGSHIP_HIGHLIGHTS: Highlight[] = [
  {
    "id": "hl-flag-1",
    "startTime": 96,
    "endTime": 140,
    "text": "Q3 Business Performance: Closed quarter at $3.8M ARR (42% QoQ growth) with 118% Net Retention Rate and Whisper v3 upgrade reducing word error rate by 18%.",
    "color": "blue",
    "label": "Key Point",
    "createdByType": "ai",
    "createdAt": "2026-09-30T08:28:53.016Z"
  },
  {
    "id": "hl-flag-2",
    "startTime": 594,
    "endTime": 639,
    "text": "Customer Trust Imperative: Enterprise executives mandate verifiable transcript timestamps for every AI-generated claim before circulating notes.",
    "color": "purple",
    "label": "Key Point",
    "createdByType": "ai",
    "createdAt": "2026-09-30T08:28:53.016Z"
  },
  {
    "id": "hl-flag-3",
    "startTime": 1496,
    "endTime": 1536,
    "text": "Enterprise Pricing Strategy: Standardized $32/user/month (annual contract) with 25-seat minimum commitment ($9,600 annual floor).",
    "color": "green",
    "label": "Decision",
    "createdByType": "ai",
    "createdAt": "2026-09-30T08:28:53.016Z"
  },
  {
    "id": "hl-flag-4",
    "startTime": 1553,
    "endTime": 1592,
    "text": "Cross-Meeting Search Packaging Compromise: 30-day search history on Pro tier; unlimited multi-year search history on Enterprise.",
    "color": "yellow",
    "label": "Decision",
    "createdByType": "ai",
    "createdAt": "2026-09-30T08:28:53.016Z"
  },
  {
    "id": "hl-flag-5",
    "startTime": 2685,
    "endTime": 2767,
    "text": "Sub-800ms Latency SLA & 2-Stage Retrieval: Hybrid BM25 chunk scoring cuts prompt tokens to 600 tokens, slashing latency to 680ms and OpenAI cost by 84%.",
    "color": "blue",
    "label": "Key Point",
    "createdByType": "ai",
    "createdAt": "2026-09-30T08:28:53.016Z"
  },
  {
    "id": "hl-flag-6",
    "startTime": 3030,
    "endTime": 3131,
    "text": "SOC2 Type II & HIPAA Readiness: A-LIGN observation window opens Nov 1; executing Business Associate Agreements starting November 15th to unlock $220k healthcare pipeline.",
    "color": "green",
    "label": "Decision",
    "createdByType": "ai",
    "createdAt": "2026-09-30T08:28:53.016Z"
  },
  {
    "id": "hl-flag-7",
    "startTime": 2286,
    "endTime": 2331,
    "text": "Product Scope Discipline: Defer multi-user WebSocket CRDT cursor synchronization to Q1 to protect search latency reliability.",
    "color": "yellow",
    "label": "Decision",
    "createdByType": "ai",
    "createdAt": "2026-09-30T08:28:53.016Z"
  }
];

export const FLAGSHIP_SUMMARY: MeetingSummary = {
  "templateId": "default",
  "templateName": "Executive Planning Overview",
  "headline": "Q4 Strategy Locked: $32 Enterprise Pricing Tier, Sub-800ms Latency SLA, and SOC2 Observation on Nov 1st.",
  "overview": "The executive leadership team aligned on core Q4 objectives across 62 minutes of structured planning. Key milestones include launching standardized $32/seat enterprise pricing with 25-seat minimums ($9,600 floor), establishing a strict sub-800ms P95 search latency SLA powered by two-stage hybrid retrieval, deploying Jira/Slack webhook sync in Sprint 24, and kicking off the SOC2 Type II observation window on November 1st. Multi-user CRDT cursor sync was deferred to Q1 to protect engineering focus.",
  "sections": [
    {
      "id": "sec-flag-1",
      "title": "Q3 Business Performance & ARR Growth",
      "bullets": [
        "Finished Q3 at $3.8M ARR representing 42% quarter-over-quarter growth, with 118% Net Retention Rate.",
        "Enterprise sales pipeline shifted heavily to 500+ seat deals across eight Fortune 500 prospective pilots.",
        "Whisper large-v3 upgrade reduced transcription word error rates by 18% across domain jargon."
      ],
      "citations": [
        {
          "timestamp": 96,
          "quote": "We officially closed Q3 at $3.8M ARR, which represents a 42% quarter-over-quarter growth"
        },
        {
          "timestamp": 115,
          "quote": "Net Retention Rate also held strong at 118%"
        }
      ]
    },
    {
      "id": "sec-flag-2",
      "title": "Enterprise Pricing & Commercial Packaging",
      "bullets": [
        "Standardized Enterprise tier at $32 per user per month (annual contract), requiring a 25-seat minimum commitment ($9,600 annual floor).",
        "Enterprise package gates SAML SSO (Okta/Azure), HIPAA BAA execution, zero-retention DPA, custom templates, and multi-year cross-meeting search.",
        "30-day paid pilots standardized at flat $2,500 for up to 50 users, 100% credited upon annual contract signing within 45 days."
      ],
      "citations": [
        {
          "timestamp": 1496,
          "quote": "Enterprise tier at $32 per user per month on an annual contract, with a mandatory 25-seat minimum commitment"
        },
        {
          "timestamp": 1611,
          "quote": "standardized 30-day Enterprise pilot capped at 50 seats for a flat $2,500 pilot fee"
        }
      ]
    },
    {
      "id": "sec-flag-3",
      "title": "Engineering Architecture & Sub-800ms Latency SLA",
      "bullets": [
        "Established non-negotiable P95 latency threshold of sub-800ms for all grounded Ask Fathom AI queries.",
        "Two-stage retrieval architecture (BM25 lexical scoring + adjacent turn expansion) reduces context token size to 600 tokens, slashing LLM cost by 84%.",
        "Deterministic zero-failure fallback engine ensures 100% uptime with verified transcript citations even during OpenAI API disruptions.",
        "PgBouncer configured at 800 pooled connections with Redis chunk cache hit rate at 91%, keeping Postgres CPU under 22%."
      ],
      "citations": [
        {
          "timestamp": 2685,
          "quote": "establishing a non-negotiable P95 latency SLA of sub-800 milliseconds for all grounded AI queries"
        },
        {
          "timestamp": 2742,
          "quote": "end-to-end response time dropped to 680 milliseconds in benchmarks, and our OpenAI API costs dropped by 84%"
        }
      ]
    },
    {
      "id": "sec-flag-4",
      "title": "Security, SOC2 Type II & HIPAA Readiness",
      "bullets": [
        "SOC2 Type II three-month observation window with A-LIGN scheduled from November 1st to January 31st.",
        "Customer-specific KMS envelope encryption for Redis cache keys scheduled for deployment by October 20th.",
        "HIPAA Business Associate Agreements (BAAs) approved for execution starting November 15th, unlocking $220k healthcare pipeline.",
        "Strict zero-data-retention DPA in place for OpenAI inference with automated GDPR 72-hour hard-deletion cascades."
      ],
      "citations": [
        {
          "timestamp": 3030,
          "quote": "SOC2 Type II certification timeline. Our three-month observation window with our auditor A-LIGN is scheduled from November 1st"
        },
        {
          "timestamp": 3106,
          "quote": "we are cleared to execute BAAs starting November 15th"
        }
      ]
    }
  ],
  "keyDecisions": [
    "Lock Enterprise pricing tier at $32/user/month (annual contract) with 25-seat minimum commitment ($9,600 annual floor).",
    "Standardize 30-day Enterprise pilots at $2,500 flat fee (credited 100% upon annual contract execution).",
    "Mandate strict P95 search latency SLA of sub-800ms as a release blocker for all production deployments.",
    "Schedule Jira and Slack webhook export integrations for Sprint 24 (Oct 14) with specs published by Oct 4.",
    "Launch SOC2 Type II three-month observation window on Nov 1 with A-LIGN and execute HIPAA BAAs starting Nov 15.",
    "Defer real-time WebSocket CRDT cursor synchronization to Q1 to protect core retrieval and latency focus.",
    "Provide 30-day cross-meeting search on Pro tier and multi-year cross-meeting search on Enterprise.",
    "Deploy customer-specific KMS envelope encryption across Redis cache infrastructure by Oct 20."
  ],
  "nextSteps": [
    "Rachel Green to distribute updated enterprise rate card and order forms by Oct 8.",
    "Marcus Vance to publish Jira and Slack webhook export specifications by Oct 4.",
    "Alex Rivera to configure Datadog P95 latency monitors and alerts by Oct 7.",
    "Parv to finalize and circulate Q4 Product Requirements Document by Oct 9.",
    "Daniel Kim to deliver mobile touch scrubber and template UI specs by Oct 11.",
    "Priya Shah to implement customer Redis KMS encryption by Oct 20.",
    "Emily Carter to publish monthly CS newsletter featuring Copy Notes on Oct 4."
  ]
};

export function getFlagshipMeeting(): Meeting {
  return {
    id: "meet-1",
    title: "Q4 Product Strategy & Enterprise Planning",
    description: "Executive strategic alignment on $32 enterprise pricing, sub-800ms latency SLAs, Q4 roadmap milestones, and SOC2/HIPAA compliance.",
    date: new Date(NOW - HOUR * 2).toISOString(), // 2 hours ago (Today)
    duration: 3720, // 62 mins
    category: "executive",
    meetingType: "Strategy & Planning",
    platform: "zoom",
    tags: [
      "Flagship Meeting",
      "1h 02m · 8 participants",
      "Q4 Strategy",
      "Enterprise Pricing",
      "SOC2 & HIPAA",
      "Latency SLA",
    ],
    isFavorite: true,
    createdAt: new Date(NOW - HOUR * 2).toISOString(),
    speakers: FLAGSHIP_SPEAKERS,
    transcript: FLAGSHIP_TRANSCRIPT,
    summary: FLAGSHIP_SUMMARY,
    actionItems: FLAGSHIP_ACTION_ITEMS,
    highlights: FLAGSHIP_HIGHLIGHTS,
  };
}
