import { Meeting, MeetingSummary, SummarySection } from "./types";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  badge: string;
  color: string;
}

export const AVAILABLE_TEMPLATES: TemplateDefinition[] = [
  {
    id: "general",
    name: "General Overview",
    description: "Standard executive summary, core discussion topics, and next steps.",
    badge: "Executive",
    color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
  },
  {
    id: "sales",
    name: "Sales Call (MEDDIC)",
    description: "Pain points, economic buyers, decision criteria, and deal terms.",
    badge: "MEDDIC",
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  },
  {
    id: "customer_success",
    name: "Customer Success",
    description: "Adoption sentiment, feature requests, churn risks, and retention plans.",
    badge: "CS & Retention",
    color: "text-teal-400 border-teal-500/20 bg-teal-500/10",
  },
  {
    id: "product",
    name: "Product Meeting",
    description: "User pain points, PRD specs, UX tradeoffs, and release milestones.",
    badge: "Product / PRD",
    color: "text-purple-400 border-purple-500/20 bg-purple-500/10",
  },
  {
    id: "engineering",
    name: "Engineering & SRE",
    description: "System architecture, P95 latency benchmarks, blockers, and runbooks.",
    badge: "Engineering",
    color: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  },
  {
    id: "interview",
    name: "Candidate Interview",
    description: "Competencies scorecard, system design assessment, and hiring decision.",
    badge: "Scorecard",
    color: "text-orange-400 border-orange-500/20 bg-orange-500/10",
  },
];

export function generateSummaryForTemplate(
  meeting: Meeting,
  templateId: string
): MeetingSummary {
  const firstTimestamp = meeting.transcript[0]?.startTime || 0;
  const midTimestamp = meeting.transcript[Math.floor(meeting.transcript.length / 2)]?.startTime || 180;

  switch (templateId) {
    case "sales":
    case "sales_meddic":
      return {
        templateId: "sales_meddic",
        templateName: "Sales Call (MEDDIC)",
        headline: `Commercial qualification for ${meeting.title}: budget identified with SOC2 and multi-tenant security requirements.`,
        overview: `Comprehensive discovery review with ${meeting.speakers.map((s) => s.name).join(", ")}. Primary pain points center around team productivity loss and lack of automated meeting knowledge capture. Pre-approved budget identified under quarterly innovation allocations.`,
        sections: [
          {
            id: "sales-1",
            title: "Metrics (M) & Quantified Value",
            bullets: [
              `Estimated 5–8 hours saved per team member weekly via automated transcription and action item tracking.`,
              `Projected 40% reduction in follow-up alignment meetings and lost documentation.`,
              `Immediate ROI payback period estimated within 60 days of deployment.`,
            ],
            citations: [{ timestamp: firstTimestamp, quote: "Current documentation workflow is costing our team hours every week." }],
          },
          {
            id: "sales-2",
            title: "Economic Buyer (E) & Decision Process (DP)",
            bullets: [
              `Budget authority confirmed with key executive stakeholder.`,
              `Procurement timeline: 2-week pilot evaluation followed by standard MSA review.`,
              `Required approvals: InfoSec compliance review and Legal DPA signoff.`,
            ],
            citations: [{ timestamp: midTimestamp, quote: "We have budget pre-allocated under our innovation initiative." }],
          },
          {
            id: "sales-3",
            title: "Decision Criteria (DC) & Key Pain Points",
            bullets: [
              `Must support sub-second citation search and zero-login public clip sharing.`,
              `SOC2 Type II compliance and strict zero-data-retention for model training.`,
            ],
          },
        ],
        keyDecisions: [
          "Initiate 30-day pilot deployment for key stakeholders starting next week.",
          "Provide InfoSec compliance whitepaper and standard Data Processing Agreement.",
        ],
        nextSteps: [
          "Account team to configure pilot licenses and schedule onboarding kickoff.",
          "Client champion to invite initial department test cohort.",
        ],
      };    case "customer_success":
    case "user_research":
      return {
        templateId: "user_research",
        templateName: "Customer Success & Account Health",
        headline: `Account Health Score: 9/10 (Strong Adoption) — Team actively using timestamped highlights and summary exports.`,
        overview: `Customer sync evaluating adoption milestones and workflow friction. Users reported strong satisfaction with real-time transcription accuracy and requested custom template presets for their engineering standups.`,
        sections: [
          {
            id: "cs-1",
            title: "Account Health & Usage Metrics",
            bullets: [
              `Daily active users increased by 35% over the past 30 days.`,
              `Over 80% of recorded meetings have at least one action item assigned and completed.`,
              `Net promoter sentiment rated high among engineering and product leads.`,
            ],
            citations: [{ timestamp: firstTimestamp, quote: "The transcript sync has transformed how our team shares action items." }],
          },
          {
            id: "cs-2",
            title: "Feature Requests & Workflow Improvements",
            bullets: [
              `Requested Slack notification bot to broadcast meeting summary takeaways directly to channels.`,
              `Requested Jira/Linear one-click export for extracted action items.`,
            ],
          },
        ],
        keyDecisions: [
          "Add customer to the Private Beta cohort for Slack automation integration.",
          "Schedule monthly executive sponsor check-in.",
        ],
        nextSteps: [
          "Customer Success Manager to provide API documentation for custom webhook exports.",
        ],
      };

    case "product":
      return {
        templateId: "default",
        templateName: "Product Meeting (PRD & Roadmap)",
        headline: `Roadmap Alignment: Finalized v2 architecture specs with sub-800ms search SLA and mobile scrubber designs.`,
        overview: `Product and engineering alignment discussing technical trade-offs, UI performance targets, and go-to-market milestones. Agreed on phased rollout starting with design partners before public launch.`,
        sections: [
          {
            id: "prd-1",
            title: "Problem Statement & User Need",
            bullets: [
              `Users need immediate trust in AI summaries via verifiable timestamp citations.`,
              `Manual meeting clipping was previously too slow, requiring full video downloads.`,
            ],
            citations: [{ timestamp: firstTimestamp, quote: "Users want to click any citation chip and jump directly to that exact second." }],
          },
          {
            id: "prd-2",
            title: "Solution Architecture & UX Specs",
            bullets: [
              `Floating highlight action bar enables instant quote bookmarking.`,
              `Hybrid search architecture combines BM25 keyword matching with rolling chunk vectors.`,
              `Mobile responsive layout with touch-friendly scrubbing timeline.`,
            ],
            citations: [{ timestamp: midTimestamp, quote: "Our P95 latency dropped to 780 milliseconds with chunk caching." }],
          },
        ],
        keyDecisions: [
          "Lock release freeze date for the closed beta release.",
          "Mandate sub-800ms P95 latency threshold as a release blocker.",
        ],
        nextSteps: [
          "Design team to deliver finalized mobile timeline specs.",
          "Engineering team to deploy staging load testing harness.",
        ],
      };

    case "engineering":
    case "eng_sprint":
      return {
        templateId: "eng_sprint",
        templateName: "Engineering & SRE Architecture",
        headline: `Technical Review: P95 latency benchmarked at 780ms; Redis chunk caching and read-replica routing deployed.`,
        overview: `Engineering deep dive into latency benchmarks, connection pool utilization, and distributed streaming reliability. SRE confirmed zero connection drops over the staging load test run.`,
        sections: [
          {
            id: "eng-1",
            title: "System Architecture & Performance",
            bullets: [
              `Vector embeddings chunked at 120-second rolling intervals to balance semantic precision and latency.`,
              `Redis cache hit rate for recurring transcript queries measured at 91%.`,
              `PgBouncer connection limits increased to 800 with automated timeout protection.`,
            ],
            citations: [{ timestamp: firstTimestamp, quote: "Redis cache hit rate for transcript chunks is sitting at 91%." }],
          },
          {
            id: "eng-2",
            title: "SRE Reliability & Infrastructure",
            bullets: [
              `Read-heavy dashboard queries successfully offloaded to read replica instances.`,
              `Zero 504 gateway timeout regressions observed during peak traffic simulation.`,
            ],
          },
        ],
        keyDecisions: [
          "Enforce strict 3-second statement timeout across all primary database handles.",
          "Deploy streaming SSE error recovery fallback handlers.",
        ],
        nextSteps: [
          "Backend lead to monitor P99 latency metrics following production deployment.",
          "SRE team to update failover documentation in Notion.",
        ],
      };

    case "interview":
    case "interview_scorecard":
      return {
        templateId: "interview_scorecard",
        templateName: "Candidate Interview Scorecard",
        headline: `Candidate Evaluation: Strong Hire recommendation — Demonstrated mastery of distributed systems and low-latency pipelines.`,
        overview: `Comprehensive interview evaluation covering systems architecture, streaming protocols, distributed cache consistency, and communication skills. Candidate exceeded expectations across all technical dimensions.`,
        sections: [
          {
            id: "int-1",
            title: "Technical Competencies Assessment",
            bullets: [
              `Distributed Systems (5/5): Crystal clear explanation of consensus protocols and fault-tolerant replication.`,
              `AI/ML Inference (5/5): Deep understanding of embedding quantization, caching layers, and real-time streaming.`,
              `Communication & Leadership (4.8/5): Articulate, receptive to interviewer feedback, and highly collaborative.`,
            ],
            citations: [{ timestamp: firstTimestamp, quote: "Candidate demonstrated clear understanding of distributed cache invalidation." }],
          },
        ],
        keyDecisions: [
          "Proceed with formal offer extension for Senior Staff level.",
          "Schedule executive wrap-up conversation with VP of Engineering.",
        ],
        nextSteps: [
          "Recruiting team to assemble compensation package and draft offer letter.",
        ],
      };

    case "general":
    default:
      return meeting.availableSummaries?.default || {
        templateId: "default",
        templateName: "General Overview",
        headline: meeting.summary.headline,
        overview: meeting.summary.overview,
        sections: meeting.summary.sections,
        keyDecisions: meeting.summary.keyDecisions,
        nextSteps: meeting.summary.nextSteps,
      };
  }
}
