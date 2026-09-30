import { writeFileSync } from 'fs';

interface RawTurn {
  id?: string;
  spkKey: 'parv' | 'sarah' | 'alex' | 'rachel' | 'marcus' | 'emily' | 'daniel' | 'priya';
  text: string;
}

const dialogue: RawTurn[] = [
  // =========================================================================
  // SECTION 1: 00:00 - 07:00 (Opening, Objectives & Q3 Retrospective) [30 turns]
  // =========================================================================
  { spkKey: 'sarah', text: "Good morning everyone. Let's kick off our Q4 Product Strategy and Enterprise Planning sync. We have 62 minutes on the calendar and six critical agenda items to lock down today." },
  { spkKey: 'parv', text: "Thanks Sarah. To frame the session: our primary objectives are finalizing our enterprise pricing tiers, locking the Q4 roadmap deliverables, committing to our sub-800ms search SLA, and signing off on the SOC2 Type II audit timeline." },
  { spkKey: 'sarah', text: "Before we begin, is the meeting recorder active and transcribing properly?" },
  { spkKey: 'alex', text: "Yes, Fathom is active, streaming live audio and identifying all eight speakers in real time." },
  { spkKey: 'sarah', text: "Awesome. Let's start with a quick three-minute retrospective on Q3 performance. Rachel, how did we wrap up the quarter on top-line revenue?" },
  { spkKey: 'rachel', text: "We officially closed Q3 at $3.8M ARR, which represents a 42% quarter-over-quarter growth. That beat our revised target by about $180,000." },
  { spkKey: 'emily', text: "Net Retention Rate also held strong at 118%, with expansion primarily coming from mid-market engineering and product teams upgrading to organization-wide workspaces." },
  { spkKey: 'sarah', text: "What were our primary churn reasons in Q3, Emily?" },
  { spkKey: 'emily', text: "We had four churned accounts totaling about $38k ARR. The primary reason cited was lack of native task management sync—specifically Jira and Slack webhook export." },
  { spkKey: 'alex', text: "On the engineering side, Q3 was centered on transcription accuracy. We upgraded our core ASR pipeline to Whisper large-v3, which dropped our word error rate by 18% on technical vocabulary and acronyms." },
  { spkKey: 'marcus', text: "And we migrated the Whisper inference pipeline to NVIDIA A10G GPUs with TensorRT-LLM, which slashed transcription latency from 4.2 seconds down to 1.1 seconds per audio chunk." },
  { spkKey: 'sarah', text: "Did that GPU migration impact our AWS infrastructure bill?" },
  { spkKey: 'marcus', text: "Actually, because TensorRT batches 16 streams simultaneously, our per-minute compute cost dropped by 34% compared to our previous CPU worker fleet." },
  { spkKey: 'marcus', text: "And infrastructure stability held up really well. With PgBouncer connection pooling and vector index read replicas, uptime was 99.98% through the September traffic rush." },
  { spkKey: 'daniel', text: "From the design side, we delivered the full v2 design tokens, dark mode palette, and the interactive clip trimmer interface on schedule." },
  { spkKey: 'priya', text: "And on compliance, we completed our preliminary SOC2 gap assessment with A-LIGN last Tuesday. We only have four remediation items to clear before our formal observation window starts on November 1st." },
  { spkKey: 'sarah', text: "That is tremendous execution across the board. But as we look at Q4, the profile of our buyers is changing dramatically. Rachel, can you speak to the enterprise shift?" },
  { spkKey: 'rachel', text: "Yes. In Q3, our average deal size was $14k ARR. In our current Q4 pipeline, over 65% of opportunities are enterprise deals with 500-plus seats, looking at contracts between $45k and $120k ARR." },
  { spkKey: 'parv', text: "And with larger buyers comes a much higher bar for precision. If an AI summary invents a single commitment or attributes an action item to the wrong executive, it destroys buyer trust instantly." },
  { spkKey: 'alex', text: "Which is why we invested so heavily in grounded retrieval and citation verification rather than relying on standard black-box LLM prompts." },
  { spkKey: 'sarah', text: "Exactly. Enterprise buyers test us rigorously. If an answer doesn't have an exact second-level timestamp, they assume it is a hallucination." },
  { spkKey: 'emily', text: "That leads directly into our customer feedback data. Sarah, should I pull up the CS insights deck?" },
  { spkKey: 'sarah', text: "Yes Emily, let's transition right into section two: Customer feedback and recurring friction points." },
  { spkKey: 'daniel', text: "I'll take notes on the UI requests as Emily walks through the feedback." },
  { spkKey: 'emily', text: "Awesome. Let me share my screen." },
  { spkKey: 'parv', text: "We're seeing your screen clearly, Emily. Go ahead." },
  { spkKey: 'emily', text: "Great. Let's break down the feedback from 340 customer tickets and 28 executive interviews." },
  { spkKey: 'rachel', text: "I also have some direct feedback from the FinTech Global and Memorial Health discovery calls to add." },
  { spkKey: 'sarah', text: "Perfect, Rachel. Let's make sure sales and CS feedback are merged." },
  { spkKey: 'alex', text: "Marcus and I will track any architectural requirements that come out of this." },
  { spkKey: 'parv', text: "Let's dive into the citation accuracy findings first." },

  // =========================================================================
  // SECTION 2: 07:00 - 18:00 (Customer Feedback & Recurring Problems) [46 turns]
  // =========================================================================
  { spkKey: 'emily', text: "The overwhelming number one theme is trust in AI citations. Customers told us repeatedly: 'We love the summaries, but our executives will not circulate notes unless every claim links to a verifiable timestamp.'" },
  { spkKey: 'rachel', text: "I hear this on almost every sales call. During our demo with FinTech Global on Thursday, their CTO said verbatim: 'If your AI claims we agreed to a target launch date of October 15th, I need to click that bullet and hear our VP actually say it.'" },
  { spkKey: 'parv', text: "This reinforces why our grounded RAG architecture with citation validation is our biggest competitive moat against generic ChatGPT wrappers." },
  { spkKey: 'sarah', text: "Alex, how are we enforcing citation accuracy technically?" },
  { spkKey: 'alex', text: "Marcus and I built a citation validation layer in the backend. When OpenAI generates a response with citation objects, we compare the timestamp and quote against the exact retrieved transcript segments." },
  { spkKey: 'marcus', text: "If the model hallucinates a timestamp that doesn't exist in the context, our validator snaps it to the nearest valid segment startTime or discards it if the quote text doesn't overlap." },
  { spkKey: 'daniel', text: "In the UI, we render those validated citations as clickable pill badges. Clicking one immediately seeks the audio player to that exact second." },
  { spkKey: 'daniel', text: "And we added an amber glow highlight animation to the corresponding transcript card so users never lose their place in the dialogue." },
  { spkKey: 'emily', text: "Users love that interaction. The second major customer request is template customization." },
  { spkKey: 'sarah', text: "Can you elaborate on what specific templates customers are demanding, Emily?" },
  { spkKey: 'emily', text: "Sales leaders want MEDDIC qualification summaries with Metrics, Economic Buyers, and Pain Points. Engineering managers want sprint retrospectives with blockers and PR references. And hiring managers want structured interview scorecards." },
  { spkKey: 'daniel', text: "Right now we have six static template presets, but enterprise admins want to build their own custom templates." },
  { spkKey: 'parv', text: "We can support custom template definitions by allowing admins to supply a custom JSON schema and system prompt guidance. Because we use OpenAI structured JSON mode, the model adheres strictly to the defined schema." },
  { spkKey: 'alex', text: "We just need token guardrails. If someone submits an 80-minute meeting with a template requesting 20 deep sections, we must chunk the transcript to stay within token budgets." },
  { spkKey: 'marcus', text: "We can use rolling chunk summarization for long calls over 45 minutes, then synthesize the section takeaways in a final consolidation pass." },
  { spkKey: 'emily', text: "The third friction point is action item follow-through. Users say action items are captured beautifully in Fathom, but they die in the meeting notes because they don't sync to task trackers." },
  { spkKey: 'rachel', text: "Three large accounts—including Apex Care and FinTech Global—specifically listed missing Jira and Linear integrations as a blocker for their Q4 enterprise rollouts." },
  { spkKey: 'sarah', text: "Marcus, what is the level of effort to build native Jira and Slack webhook export integrations in early Q4?" },
  { spkKey: 'marcus', text: "We already have event webhooks firing on action item creation. Building native Jira and Slack webhook export integrations will take about three weeks for two backend engineers." },
  { spkKey: 'sarah', text: "Let's commit to that. Marcus, let's schedule the Jira and Slack webhook export integration for Sprint 24 starting October 14th." },
  { spkKey: 'marcus', text: "Agreed. I will publish the webhook export API specification by this Friday, October 4th." },
  { spkKey: 'marcus', text: "The payload will include the action item title, assignee name, due date, context timestamp, and a direct deep link back to the exact meeting second." },
  { spkKey: 'alex', text: "That deep link back into Fathom makes the task actionable for Jira assignees who were not on the call." },
  { spkKey: 'daniel', text: "On the sharing side, Emily mentioned earlier that users wanted public clip sharing. We deployed the `/shared/[token]` route yesterday." },
  { spkKey: 'emily', text: "I saw that! A customer shared a 45-second clip with their external vendor this morning, and the vendor watched it instantly on mobile without needing to log in." },
  { spkKey: 'rachel', text: "That zero-friction clip sharing is a massive viral growth loop for our sales pipeline." },
  { spkKey: 'parv', text: "Because the clip token encodes the start and end timestamp in a base64url payload, it resolves statelessly without hitting our core database on every view." },
  { spkKey: 'priya', text: "And from a compliance angle, the shared clip only exposes the selected transcript range, keeping the rest of the meeting confidential." },
  { spkKey: 'emily', text: "What about clip expiration? Can enterprise admins configure link lifespans?" },
  { spkKey: 'daniel', text: "Yes, we have 7-day, 30-day, and permanent link options in the trimmer modal." },
  { spkKey: 'alex', text: "And admins can revoke any shared link instantly from the security console." },
  { spkKey: 'emily', text: "Can we also ensure users can download clips directly as MP4 or text snippets?" },
  { spkKey: 'daniel', text: "Yes, we have a 'Copy Transcript Excerpt' button right inside the shared player header." },
  { spkKey: 'sarah', text: "That addresses the core enterprise sharing requirements. Any other CS topics before pricing?" },
  { spkKey: 'emily', text: "Just one quick note: customers asked for search highlighting when filtering transcripts." },
  { spkKey: 'daniel', text: "That's already implemented! When you type in the transcript search bar, matching words highlight in amber and the count updates in real time." },
  { spkKey: 'emily', text: "Users also asked whether search handles partial word matches or semantic intent." },
  { spkKey: 'parv', text: "We combine exact token stemming with BM25 lexical ranking so queries like 'price' match 'pricing' and 'priced' seamlessly." },
  { spkKey: 'alex', text: "And our client-side search indexing executes in under 4 milliseconds across 200 transcript segments." },
  { spkKey: 'emily', text: "Awesome. That covers everything from Customer Success." },
  { spkKey: 'parv', text: "Let's make sure we document these customer quotes in our Q4 PRD." },
  { spkKey: 'rachel', text: "I'll link the recording clips in our CRM account notes as well." },
  { spkKey: 'alex', text: "And Marcus and I will prioritize the webhook queue architecture." },
  { spkKey: 'sarah', text: "Great. Let's transition to section three at the 18-minute mark: Enterprise Pricing & Commercial Packaging." },
  { spkKey: 'rachel', text: "Ready. Let's look at the proposed rate card." },
  { spkKey: 'sarah', text: "Take it away Rachel." },

  // =========================================================================
  // SECTION 3: 18:00 - 30:00 (Enterprise Pricing Discussion) [48 turns]
  // =========================================================================
  { spkKey: 'rachel', text: "Let's turn to enterprise pricing. Right now, our Pro plan is $19 per user per month. For Enterprise, we've been doing custom quotes between $24k and $48k, which creates friction and slows down deal velocity." },
  { spkKey: 'rachel', text: "I propose standardizing our Enterprise tier at $32 per user per month on an annual contract, with a mandatory 25-seat minimum commitment. That creates a $9,600 annual contract floor." },
  { spkKey: 'sarah', text: "Let's evaluate the feature gates. Rachel, what features are exclusive to that $32 Enterprise tier versus Pro?" },
  { spkKey: 'rachel', text: "Enterprise will include: SAML SSO with Okta and Azure AD, centralized audit logs, dedicated CSM, HIPAA BAA execution, zero-retention DPA agreements, custom prompt templates, and multi-year cross-meeting search." },
  { spkKey: 'parv', text: "I want to push back slightly on gating cross-meeting search entirely behind Enterprise. Cross-meeting search is one of our stickiest features. What if Pro users get 30 days of cross-meeting search, and Enterprise gets unlimited history?" },
  { spkKey: 'rachel', text: "I like that compromise, Parv. 30 days of search history gives Pro users a powerful taste of the intelligence, while driving them to upgrade when they need historical quarterly recall." },
  { spkKey: 'emily', text: "What about paid pilot evaluations? Many enterprise buyers insist on a 30-day trial with their team before committing to a six-figure contract." },
  { spkKey: 'rachel', text: "I propose a standardized 30-day Enterprise pilot capped at 50 seats for a flat $2,500 pilot fee. If they execute the annual contract within 45 days, 100% of that $2,500 gets credited toward their annual invoice." },
  { spkKey: 'sarah', text: "That is a clean commercial structure. It filters out non-serious prospects and accelerates legal review. Priya, can we sign standard enterprise DPAs during paid pilots?" },
  { spkKey: 'priya', text: "Yes. Our standard Data Processing Agreement has been vetted by external counsel. It explicitly includes our zero-data-retention terms with OpenAI so customer audio and text are never used for model training." },
  { spkKey: 'alex', text: "And on the infrastructure side, we enforce TLS 1.3 in transit and AES-256 encryption at rest across all customer tenant databases." },
  { spkKey: 'marcus', text: "For seat enforcement, backend has automated Redis license metering. When an account exceeds their provisioned seats, we alert the workspace admin instead of abruptly locking users out." },
  { spkKey: 'emily', text: "That soft warning prevents embarrassing interruptions during important client calls." },
  { spkKey: 'sarah', text: "What happens if a customer has 500 seats? Do we offer volume discount brackets?" },
  { spkKey: 'rachel', text: "Yes. For 100 to 250 seats, $28 per user per month. For 250-plus seats, $24 per user per month with custom invoicing." },
  { spkKey: 'parv', text: "That maintains healthy 82% software gross margins even at the highest discount tier." },
  { spkKey: 'emily', text: "Are we including dedicated white-glove onboarding for accounts over 100 seats?" },
  { spkKey: 'rachel', text: "Yes, accounts with 100+ seats receive four tailored onboarding workshops led by Customer Success." },
  { spkKey: 'sarah', text: "That will ensure high initial adoption and safeguard our 118% net retention rate." },
  { spkKey: 'daniel', text: "Will enterprise admins have self-serve seat management in the settings console?" },
  { spkKey: 'marcus', text: "Yes, the billing dashboard lets admins invite users, reassign seats, and view monthly active usage metrics in real time." },
  { spkKey: 'emily', text: "What about monthly vs annual billing? Are we allowing month-to-month on Enterprise?" },
  { spkKey: 'rachel', text: "No, Enterprise is strictly annual prepaid. Pro can remain monthly at $24 or annual at $19 per user per month." },
  { spkKey: 'sarah', text: "That ensures strong cash flow and predictable revenue. Let's check legal readiness. Priya, any issues with the $9,600 annual floor?" },
  { spkKey: 'priya', text: "None from legal. Our standard terms of service and DPA cover that floor cleanly." },
  { spkKey: 'alex', text: "Marcus, how quickly does the automated license metering sync between Stripe webhooks and our Redis session store?" },
  { spkKey: 'marcus', text: "Stripe webhook events update Redis tenant limits within 250 milliseconds with guaranteed idempotency." },
  { spkKey: 'sarah', text: "Let's lock this decision: Enterprise tier is $32 per seat per month (annual contract), 25-seat minimum commitment ($9,600 floor), and $2,500 30-day pilots credited upon contract signing. Rachel, when can sales collateral be updated?" },
  { spkKey: 'rachel', text: "I will have the updated enterprise rate cards and standard order form templates ready by next Tuesday, October 8th." },
  { spkKey: 'priya', text: "I will also provide the security one-pager attachment for Rachel's sales collateral packet." },
  { spkKey: 'rachel', text: "Thank you Priya. That will help us close the FinTech Global pilot by mid-October." },
  { spkKey: 'emily', text: "Our CS team will also prepare onboarding runbooks tailored to the 25-seat minimum cohort." },
  { spkKey: 'parv', text: "Great. Now let's move into section four at the 30-minute mark: The Q4 Product Roadmap." },
  { spkKey: 'daniel', text: "I have the roadmap wireframes ready to share." },
  { spkKey: 'sarah', text: "Go ahead Daniel." },

  // =========================================================================
  // SECTION 4: 30:00 - 40:00 (Q4 Product Roadmap) [38 turns]
  // =========================================================================
  { spkKey: 'parv', text: "For Q4, we are focusing on three core roadmap themes: First, Deep Cross-Meeting Intelligence; Second, Workspace Custom Templates; Third, Real-time Collaborative Notetaking." },
  { spkKey: 'daniel', text: "Let me share my screen to show the Figma prototypes for Cross-Meeting Ask Fathom. We built a Command-K global launcher, speaker filter chips, and interactive citation popovers." },
  { spkKey: 'daniel', text: "Notice the audio waveform visualizer at the bottom. It pulses in sync with the active playback second, giving a lively tactile feel." },
  { spkKey: 'parv', text: "That waveform interaction makes the playback feel much more engaging than a plain progress bar." },
  { spkKey: 'sarah', text: "Daniel, how does the interface adapt for mobile viewports? Many executives read meeting takeaways on their phones between meetings." },
  { spkKey: 'daniel', text: "On viewports under 640px, the transcript and overview collapse into a fluid swipeable sheet, and the audio scrubber uses a tactile touch slider with large timestamp targets." },
  { spkKey: 'alex', text: "Regarding the Collaborative Notetaking theme: were we planning full WebSocket CRDT multi-cursor sync in Q4, or optimistic local state with REST polling?" },
  { spkKey: 'parv', text: "Let's keep it scoped to optimistic local state with REST persistence for Q4. A full Yjs CRDT implementation would add significant complexity and distract from our search latency SLA target." },
  { spkKey: 'sarah', text: "I completely agree with Parv. We must keep our engineering focus razor-sharp on sub-800ms search latency and transcription accuracy. Let's formally defer CRDT multi-cursor sync to Q1." },
  { spkKey: 'emily', text: "Can we also ensure the 'Copy Notes' markdown export feature is highlighted in the app? Our engineering customers love copying formatted markdown directly into Notion and GitHub." },
  { spkKey: 'daniel', text: "Yes! The 'Copy Notes' button in the top header is already live. One click copies the executive summary, key decisions, and action items formatted in clean markdown." },
  { spkKey: 'emily', text: "I will highlight that in our upcoming customer newsletter on Friday, October 4th." },
  { spkKey: 'alex', text: "Let's make sure the action item checklist in the Overview tab also updates completion state in real time." },
  { spkKey: 'marcus', text: "That is already wired up to our store reducer with instant visual feedback." },
  { spkKey: 'daniel', text: "And we added a visual progress bar that recalculates the completion percentage whenever an item is checked off." },
  { spkKey: 'sarah', text: "That visual feedback is super rewarding for users." },
  { spkKey: 'parv', text: "What about keyboard shortcuts? Power users love navigating meetings without touching the mouse." },
  { spkKey: 'daniel', text: "Space toggles play/pause, J and L skip backward and forward 10 seconds, and ? opens the keyboard shortcuts cheat sheet modal." },
  { spkKey: 'alex', text: "We tested the keyboard latency and it responds within 8 milliseconds of keypress." },
  { spkKey: 'rachel', text: "Can sales reps trigger email summaries directly from the keyboard shortcuts?" },
  { spkKey: 'daniel', text: "We can add 'E' for email draft generation in our next minor UI patch." },
  { spkKey: 'sarah', text: "Daniel, how are the accessibility and contrast ratios on the dark mode palette?" },
  { spkKey: 'daniel', text: "All text elements exceed WCAG AA 4.5:1 contrast standards, and our focus outlines are fully visible for keyboard-only navigation." },
  { spkKey: 'parv', text: "Let's make sure Daniel delivers the final mobile scrubber UI specs by Friday, October 11th." },
  { spkKey: 'daniel', text: "Confirmed. The mobile timeline design specs will be in Figma by October 11th." },
  { spkKey: 'sarah', text: "Let's finalize that roadmap scope. Now let's move to section five at the 40-minute mark: Engineering Architecture, Performance, and Latency SLAs." },
  { spkKey: 'alex', text: "Marcus and I are ready to present the architecture benchmarks." },

  // =========================================================================
  // SECTION 5: 40:00 - 49:00 (Engineering Architecture, Performance & SLAs) [34 turns]
  // =========================================================================
  { spkKey: 'alex', text: "Let's talk system architecture and latency benchmarks. In Q3, our P95 latency for Ask Fathom queries was 2.4 seconds. That felt noticeably sluggish to users." },
  { spkKey: 'alex', text: "For Q4, our goal is establishing a non-negotiable P95 latency SLA of sub-800 milliseconds for all grounded AI queries. Marcus and I benchmarked a two-stage hybrid retrieval pipeline that achieves this." },
  { spkKey: 'marcus', text: "Here is the technical breakdown: Instead of sending the full 60-minute transcript into the LLM context—which costs 15,000 tokens and 6 cents per question—we run localized lexical BM25 scoring to find the top 8 relevant dialogue turns." },
  { spkKey: 'marcus', text: "Then stage two attaches the adjacent turns for context and passes only 600 tokens to OpenAI gpt-4o-mini." },
  { spkKey: 'parv', text: "Because gpt-4o-mini has sub-second generation speeds and native JSON mode, our end-to-end response time dropped to 680 milliseconds in benchmarks, and our OpenAI API costs dropped by 84%." },
  { spkKey: 'sarah', text: "That is a massive win for both user experience and gross margins. What happens if OpenAI experiences an API slowdown or outage?" },
  { spkKey: 'alex', text: "We built a zero-failure deterministic fallback engine. If the OpenAI request fails, times out after 25 seconds, or validation fails, our deterministic synthesis engine immediately produces verified transcript citations." },
  { spkKey: 'marcus', text: "And our citation validator guarantees that every citation timestamp accurately snaps to the ground-truth segment startTime, preventing hallucinated timestamps." },
  { spkKey: 'priya', text: "That verification is essential for enterprise security audits. What is our database connection headroom as concurrent users scale in Q4?" },
  { spkKey: 'marcus', text: "With PgBouncer configured at 800 pooled connections and Redis caching transcript chunks with a 91% cache hit rate, Postgres CPU utilization remains below 22% under 5,000 simulated concurrent users." },
  { spkKey: 'alex', text: "And read-heavy search requests are routed directly to our Postgres read replicas, keeping primary database writes free for live recording streams." },
  { spkKey: 'parv', text: "What is the replication lag between primary Postgres and read replicas during peak recording hours?" },
  { spkKey: 'marcus', text: "Replication lag stays under 12 milliseconds across all availability zones in us-east-1." },
  { spkKey: 'sarah', text: "Outstanding engineering work. Let's formally establish the sub-800ms P95 latency threshold as a hard release blocker for all production deployments." },
  { spkKey: 'alex', text: "Alex will configure automated Datadog P95 latency monitors and alert channels by Monday, October 7th." },
  { spkKey: 'parv', text: "And Marcus, let's ensure we track cache hit ratios in the same Datadog dashboard." },
  { spkKey: 'marcus', text: "Will do. Redis eviction rates and cache latency are already instrumented." },
  { spkKey: 'sarah', text: "Great. Let's move into section six at the 49-minute mark: Security, Compliance, and Enterprise Certifications." },
  { spkKey: 'priya', text: "I have the security timeline ready to review." },

  // =========================================================================
  // SECTION 6: 49:00 - 56:00 (Security, Compliance & Enterprise Certifications) [28 turns]
  // =========================================================================
  { spkKey: 'priya', text: "Let's review our SOC2 Type II certification timeline. Our three-month observation window with our auditor A-LIGN is scheduled from November 1st to January 31st." },
  { spkKey: 'priya', text: "We have two prerequisite engineering tasks before November 1st: First, automated quarterly access reviews for AWS IAM and GitHub; Second, customer-specific KMS envelope encryption for Redis cache keys." },
  { spkKey: 'marcus', text: "AWS IAM quarterly review is already automated via Terraform scripts. I will complete the Redis KMS envelope encryption by October 20th." },
  { spkKey: 'rachel', text: "Priya, what is our status on HIPAA compliance? We have two healthcare hospital network deals worth $220k combined ARR that require signed Business Associate Agreements (BAAs)." },
  { spkKey: 'priya', text: "We completed our HIPAA readiness audit with external security counsel. Because we do not store raw unencrypted audio and support dedicated customer encryption keys, we are cleared to execute BAAs starting November 15th." },
  { spkKey: 'rachel', text: "That unlocks both healthcare deals for our Q4 sales quota! I will notify the procurement teams at Memorial Health and Apex Care today." },
  { spkKey: 'sarah', text: "Priya, what is our policy for GDPR right-to-be-forgotten requests and customer data deletion upon contract termination?" },
  { spkKey: 'priya', text: "Our automated data deletion pipeline cascades deletions across Postgres transcripts, vector embeddings, and backup snapshots within 72 hours of request receipt. A signed certificate of destruction is auto-generated for the customer." },
  { spkKey: 'parv', text: "And crucially, our OpenAI enterprise agreement guarantees zero data retention for model training, meaning customer dialogue is never cached or trained upon by third-party model providers." },
  { spkKey: 'alex', text: "Did we schedule our annual external penetration test as well?" },
  { spkKey: 'priya', text: "Yes, NCC Group is conducting our third-party grey-box penetration test during the week of October 21st." },
  { spkKey: 'priya', text: "I've also published the Enterprise Security Whitepaper detailing all these controls on our trust center at trust.fathom.work." },
  { spkKey: 'rachel', text: "Having that public trust center URL will dramatically shorten security questionnaires for our sales team." },
  { spkKey: 'sarah', text: "Excellent. Let's move into our final section at the 56-minute mark: Final Decisions, Deadlines, and Action Items." },

  // =========================================================================
  // SECTION 7: 56:00 - 62:00 (Final Decisions, Deadlines & Action Items) [26 turns]
  // =========================================================================
  { spkKey: 'sarah', text: "We are at the 56-minute mark. Let's review the key decisions we locked today and confirm owners and deadlines for every action item." },
  { spkKey: 'parv', text: "Decision 1: We locked our Enterprise pricing tier at $32 per user per month (annual contract) with a 25-seat minimum commitment ($9,600 annual floor)." },
  { spkKey: 'rachel', text: "Decision 2: Standardizing 30-day Enterprise pilots at $2,500 flat fee (capped at 50 users), 100% credited toward annual contracts executed within 45 days." },
  { spkKey: 'alex', text: "Decision 3: Establishing a strict P95 search latency SLA of sub-800 milliseconds using our two-stage hybrid BM25 and chunk retrieval pipeline." },
  { spkKey: 'marcus', text: "Decision 4: Deploying Jira and Slack webhook export integrations in Sprint 24, with API specifications published by Friday, October 4th." },
  { spkKey: 'priya', text: "Decision 5: Launching the SOC2 Type II three-month observation window on November 1st with A-LIGN and executing HIPAA BAAs starting November 15th." },
  { spkKey: 'daniel', text: "Decision 6: Delivering custom template builder UI and responsive mobile timeline scrubber prototypes by October 11th." },
  { spkKey: 'emily', text: "Decision 7: Launching monthly customer newsletter with 'Copy Notes' markdown export feature spotlight on Friday, October 4th." },
  { spkKey: 'sarah', text: "Decision 8: Scope discipline — formally deferring multi-user WebSocket CRDT cursor synchronization to Q1 to keep engineering focused on core retrieval reliability." },
  { spkKey: 'parv', text: "Now for action item assignments: Rachel owns updating enterprise sales collateral and rate cards by October 8th. Marcus owns publishing the Jira and Slack webhook export specs by October 4th." },
  { spkKey: 'sarah', text: "Priya owns completing the Redis KMS encryption by October 20th. Daniel owns finalizing mobile touch scrubber specs by October 11th. Emily owns publishing the CS product newsletter on October 4th." },
  { spkKey: 'alex', text: "Alex owns deploying the Datadog P95 latency monitoring alerts across staging and production clusters by October 7th. Parv owns finalizing the Q4 Product Requirements Document by October 9th." },
  { spkKey: 'sarah', text: "Sarah Chen will schedule the formal Q4 OKR executive review for October 10th." },
  { spkKey: 'marcus', text: "Marcus will also wire up the Redis seat metering alerts by October 16th." },
  { spkKey: 'priya', text: "And Priya will distribute the HIPAA BAA execution packets to Memorial Health and Apex Care by November 15th." },
  { spkKey: 'sarah', text: "Are there any final blockers or open questions before we adjourn?" },
  { spkKey: 'priya', text: "All clear on security and compliance." },
  { spkKey: 'rachel', text: "Sales team is fully aligned and ready to execute." },
  { spkKey: 'emily', text: "Customer success is excited to share the new updates with our accounts." },
  { spkKey: 'alex', text: "Engineering is ready for Sprint 24 kickoff." },
  { spkKey: 'parv', text: "Let's make Q4 our highest-impact quarter to date." },
  { spkKey: 'sarah', text: "Thank you everyone for an incredibly productive session. Meeting adjourned right on time at 62 minutes." }
];

console.log(`Total structured dialogue turns: ${dialogue.length}`);

const speakersData = [
  { id: "spk-parv", name: "Parv", role: "Product & AI Lead", email: "parv@fathom.work", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
  { id: "spk-sarah", name: "Sarah Chen", role: "VP of Product", email: "sarah.chen@fathom.work", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
  { id: "spk-alex", name: "Alex Rivera", role: "Engineering Lead", email: "alex.rivera@fathom.work", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { id: "spk-rachel", name: "Rachel Green", role: "Enterprise Sales Director", email: "rachel.green@fathom.work", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
  { id: "spk-marcus", name: "Marcus Vance", role: "Lead Backend Engineer", email: "marcus.vance@fathom.work", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
  { id: "spk-emily", name: "Emily Carter", role: "Head of Customer Success", email: "emily.carter@fathom.work", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" },
  { id: "spk-daniel", name: "Daniel Kim", role: "Principal Product Designer", email: "daniel.kim@fathom.work", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" },
  { id: "spk-priya", name: "Priya Shah", role: "Head of Security & Compliance", email: "priya.shah@fathom.work", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
];

const spkLookup: Record<string, typeof speakersData[0]> = {
  parv: speakersData[0],
  sarah: speakersData[1],
  alex: speakersData[2],
  rachel: speakersData[3],
  marcus: speakersData[4],
  emily: speakersData[5],
  daniel: speakersData[6],
  priya: speakersData[7],
};

const totalDuration = 3720;
const step = totalDuration / dialogue.length;

const segments = dialogue.map((item, idx) => {
  const startTime = Math.round(idx * step);
  const endTime = Math.min(Math.round((idx + 1) * step), totalDuration);
  const spk = spkLookup[item.spkKey];
  return {
    id: `tr-flagship-${idx + 1}`,
    speakerId: spk.id,
    speakerName: spk.name,
    speakerRole: spk.role,
    speakerAvatar: spk.avatar,
    startTime,
    endTime,
    text: item.text,
  };
});

// Helper to find exact segment by keyword in text
function findTurnTimestamp(keyword: string): { startTime: number; text: string } {
  const match = segments.find(s => s.text.toLowerCase().includes(keyword.toLowerCase()));
  if (!match) throw new Error(`Could not find turn with keyword: ${keyword}`);
  return { startTime: match.startTime, text: match.text };
}

const arrTurn = findTurnTimestamp("officially closed Q3 at $3.8M ARR");
const nrrTurn = findTurnTimestamp("Net Retention Rate also held strong at 118%");
const priceTurn = findTurnTimestamp("Enterprise tier at $32 per user per month");
const pilotTurn = findTurnTimestamp("standardized 30-day Enterprise pilot");
const latencyTurn = findTurnTimestamp("establishing a non-negotiable P95 latency SLA");
const costTurn = findTurnTimestamp("OpenAI API costs dropped by 84%");
const soc2Turn = findTurnTimestamp("SOC2 Type II certification timeline");
const baaTurn = findTurnTimestamp("cleared to execute BAAs starting November 15th");
const crdtTurn = findTurnTimestamp("formally defer CRDT multi-cursor sync to Q1");
const jiraTurn = findTurnTimestamp("Jira and Slack webhook export integration for Sprint 24");
const trustTurn = findTurnTimestamp("overwhelming number one theme is trust in AI citations");

const NOW = Date.now();
const HOUR = 1000 * 60 * 60;

const actionItems = [
  {
    id: "act-flag-1",
    text: "Update enterprise sales collateral and standard order forms with $32/seat pricing and 25-seat minimum",
    assignee: {
      name: "Rachel Green",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    completed: false,
    dueDate: "Oct 8, 2026",
    priority: "high",
    timestamp: priceTurn.startTime,
  },
  {
    id: "act-flag-2",
    text: "Publish Jira and Slack webhook export API specifications and webhook event schemas",
    assignee: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    completed: false,
    dueDate: "Oct 4, 2026",
    priority: "high",
    timestamp: jiraTurn.startTime,
  },
  {
    id: "act-flag-3",
    text: "Configure Datadog P95 latency monitors, sub-800ms alert thresholds, and on-call escalation channels",
    assignee: {
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    completed: false,
    dueDate: "Oct 7, 2026",
    priority: "high",
    timestamp: latencyTurn.startTime,
  },
  {
    id: "act-flag-4",
    text: "Implement customer-specific KMS envelope encryption for Redis cache keys ahead of SOC2 window",
    assignee: {
      name: "Priya Shah",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    completed: false,
    dueDate: "Oct 20, 2026",
    priority: "high",
    timestamp: soc2Turn.startTime,
  },
  {
    id: "act-flag-5",
    text: "Deliver mobile touch timeline scrubber and custom template builder UI specifications in Figma",
    assignee: {
      name: "Daniel Kim",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    },
    completed: false,
    dueDate: "Oct 11, 2026",
    priority: "medium",
    timestamp: findTurnTimestamp("tactile touch slider with large timestamp targets").startTime,
  },
  {
    id: "act-flag-6",
    text: "Publish monthly CS customer newsletter spotlighting 'Copy Notes' markdown export feature",
    assignee: {
      name: "Emily Carter",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
    completed: false,
    dueDate: "Oct 4, 2026",
    priority: "medium",
    timestamp: findTurnTimestamp("highlight that in our upcoming customer newsletter").startTime,
  },
  {
    id: "act-flag-7",
    text: "Finalize and circulate Q4 Product Requirements Document (PRD) incorporating enterprise gating decisions",
    assignee: {
      name: "Parv",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
    completed: false,
    dueDate: "Oct 9, 2026",
    priority: "high",
    timestamp: findTurnTimestamp("finalizing the Q4 Product Requirements Document").startTime,
  },
  {
    id: "act-flag-8",
    text: "Schedule formal Q4 OKR executive review and sign-off meeting with department heads",
    assignee: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    completed: false,
    dueDate: "Oct 10, 2026",
    priority: "medium",
    timestamp: findTurnTimestamp("schedule the formal Q4 OKR executive review").startTime,
  },
  {
    id: "act-flag-9",
    text: "Implement Redis seat count metering and soft warning alerts in the admin console",
    assignee: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    completed: false,
    dueDate: "Oct 16, 2026",
    priority: "medium",
    timestamp: findTurnTimestamp("backend has automated Redis license metering").startTime,
  },
  {
    id: "act-flag-10",
    text: "Distribute HIPAA BAA execution packets to Memorial Health and Apex Care procurement teams",
    assignee: {
      name: "Priya Shah",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    completed: false,
    dueDate: "Nov 15, 2026",
    priority: "high",
    timestamp: baaTurn.startTime,
  },
];

const highlights = [
  {
    id: "hl-flag-1",
    startTime: arrTurn.startTime,
    endTime: nrrTurn.startTime + 25,
    text: "Q3 Business Performance: Closed quarter at $3.8M ARR (42% QoQ growth) with 118% Net Retention Rate and Whisper v3 upgrade reducing word error rate by 18%.",
    color: "blue",
    label: "Key Point",
    createdByType: "ai",
    createdAt: new Date(NOW - HOUR * 3).toISOString(),
  },
  {
    id: "hl-flag-2",
    startTime: trustTurn.startTime,
    endTime: trustTurn.startTime + 45,
    text: "Customer Trust Imperative: Enterprise executives mandate verifiable transcript timestamps for every AI-generated claim before circulating notes.",
    color: "purple",
    label: "Key Point",
    createdByType: "ai",
    createdAt: new Date(NOW - HOUR * 3).toISOString(),
  },
  {
    id: "hl-flag-3",
    startTime: priceTurn.startTime,
    endTime: priceTurn.startTime + 40,
    text: "Enterprise Pricing Strategy: Standardized $32/user/month (annual contract) with 25-seat minimum commitment ($9,600 annual floor).",
    color: "green",
    label: "Decision",
    createdByType: "ai",
    createdAt: new Date(NOW - HOUR * 3).toISOString(),
  },
  {
    id: "hl-flag-4",
    startTime: findTurnTimestamp("push back slightly on gating cross-meeting search").startTime,
    endTime: findTurnTimestamp("driving them to upgrade when they need historical quarterly recall").startTime + 20,
    text: "Cross-Meeting Search Packaging Compromise: 30-day search history on Pro tier; unlimited multi-year search history on Enterprise.",
    color: "yellow",
    label: "Decision",
    createdByType: "ai",
    createdAt: new Date(NOW - HOUR * 3).toISOString(),
  },
  {
    id: "hl-flag-5",
    startTime: latencyTurn.startTime,
    endTime: costTurn.startTime + 25,
    text: "Sub-800ms Latency SLA & 2-Stage Retrieval: Hybrid BM25 chunk scoring cuts prompt tokens to 600 tokens, slashing latency to 680ms and OpenAI cost by 84%.",
    color: "blue",
    label: "Key Point",
    createdByType: "ai",
    createdAt: new Date(NOW - HOUR * 3).toISOString(),
  },
  {
    id: "hl-flag-6",
    startTime: soc2Turn.startTime,
    endTime: baaTurn.startTime + 25,
    text: "SOC2 Type II & HIPAA Readiness: A-LIGN observation window opens Nov 1; executing Business Associate Agreements starting November 15th to unlock $220k healthcare pipeline.",
    color: "green",
    label: "Decision",
    createdByType: "ai",
    createdAt: new Date(NOW - HOUR * 3).toISOString(),
  },
  {
    id: "hl-flag-7",
    startTime: crdtTurn.startTime - 15,
    endTime: crdtTurn.startTime + 30,
    text: "Product Scope Discipline: Defer multi-user WebSocket CRDT cursor synchronization to Q1 to protect search latency reliability.",
    color: "yellow",
    label: "Decision",
    createdByType: "ai",
    createdAt: new Date(NOW - HOUR * 3).toISOString(),
  },
];

const summary = {
  templateId: "default",
  templateName: "Executive Planning Overview",
  headline: "Q4 Strategy Locked: $32 Enterprise Pricing Tier, Sub-800ms Latency SLA, and SOC2 Observation on Nov 1st.",
  overview: "The executive leadership team aligned on core Q4 objectives across 62 minutes of structured planning. Key milestones include launching standardized $32/seat enterprise pricing with 25-seat minimums ($9,600 floor), establishing a strict sub-800ms P95 search latency SLA powered by two-stage hybrid retrieval, deploying Jira/Slack webhook sync in Sprint 24, and kicking off the SOC2 Type II observation window on November 1st. Multi-user CRDT cursor sync was deferred to Q1 to protect engineering focus.",
  sections: [
    {
      id: "sec-flag-1",
      title: "Q3 Business Performance & ARR Growth",
      bullets: [
        "Finished Q3 at $3.8M ARR representing 42% quarter-over-quarter growth, with 118% Net Retention Rate.",
        "Enterprise sales pipeline shifted heavily to 500+ seat deals across eight Fortune 500 prospective pilots.",
        "Whisper large-v3 upgrade reduced transcription word error rates by 18% across domain jargon.",
      ],
      citations: [
        { timestamp: arrTurn.startTime, quote: "We officially closed Q3 at $3.8M ARR, which represents a 42% quarter-over-quarter growth" },
        { timestamp: nrrTurn.startTime, quote: "Net Retention Rate also held strong at 118%" },
      ],
    },
    {
      id: "sec-flag-2",
      title: "Enterprise Pricing & Commercial Packaging",
      bullets: [
        "Standardized Enterprise tier at $32 per user per month (annual contract), requiring a 25-seat minimum commitment ($9,600 annual floor).",
        "Enterprise package gates SAML SSO (Okta/Azure), HIPAA BAA execution, zero-retention DPA, custom templates, and multi-year cross-meeting search.",
        "30-day paid pilots standardized at flat $2,500 for up to 50 users, 100% credited upon annual contract signing within 45 days.",
      ],
      citations: [
        { timestamp: priceTurn.startTime, quote: "Enterprise tier at $32 per user per month on an annual contract, with a mandatory 25-seat minimum commitment" },
        { timestamp: pilotTurn.startTime, quote: "standardized 30-day Enterprise pilot capped at 50 seats for a flat $2,500 pilot fee" },
      ],
    },
    {
      id: "sec-flag-3",
      title: "Engineering Architecture & Sub-800ms Latency SLA",
      bullets: [
        "Established non-negotiable P95 latency threshold of sub-800ms for all grounded Ask Fathom AI queries.",
        "Two-stage retrieval architecture (BM25 lexical scoring + adjacent turn expansion) reduces context token size to 600 tokens, slashing LLM cost by 84%.",
        "Deterministic zero-failure fallback engine ensures 100% uptime with verified transcript citations even during OpenAI API disruptions.",
        "PgBouncer configured at 800 pooled connections with Redis chunk cache hit rate at 91%, keeping Postgres CPU under 22%.",
      ],
      citations: [
        { timestamp: latencyTurn.startTime, quote: "establishing a non-negotiable P95 latency SLA of sub-800 milliseconds for all grounded AI queries" },
        { timestamp: costTurn.startTime, quote: "end-to-end response time dropped to 680 milliseconds in benchmarks, and our OpenAI API costs dropped by 84%" },
      ],
    },
    {
      id: "sec-flag-4",
      title: "Security, SOC2 Type II & HIPAA Readiness",
      bullets: [
        "SOC2 Type II three-month observation window with A-LIGN scheduled from November 1st to January 31st.",
        "Customer-specific KMS envelope encryption for Redis cache keys scheduled for deployment by October 20th.",
        "HIPAA Business Associate Agreements (BAAs) approved for execution starting November 15th, unlocking $220k healthcare pipeline.",
        "Strict zero-data-retention DPA in place for OpenAI inference with automated GDPR 72-hour hard-deletion cascades.",
      ],
      citations: [
        { timestamp: soc2Turn.startTime, quote: "SOC2 Type II certification timeline. Our three-month observation window with our auditor A-LIGN is scheduled from November 1st" },
        { timestamp: baaTurn.startTime, quote: "we are cleared to execute BAAs starting November 15th" },
      ],
    },
  ],
  keyDecisions: [
    "Lock Enterprise pricing tier at $32/user/month (annual contract) with 25-seat minimum commitment ($9,600 annual floor).",
    "Standardize 30-day Enterprise pilots at $2,500 flat fee (credited 100% upon annual contract execution).",
    "Mandate strict P95 search latency SLA of sub-800ms as a release blocker for all production deployments.",
    "Schedule Jira and Slack webhook export integrations for Sprint 24 (Oct 14) with specs published by Oct 4.",
    "Launch SOC2 Type II three-month observation window on Nov 1 with A-LIGN and execute HIPAA BAAs starting Nov 15.",
    "Defer real-time WebSocket CRDT cursor synchronization to Q1 to protect core retrieval and latency focus.",
    "Provide 30-day cross-meeting search on Pro tier and multi-year cross-meeting search on Enterprise.",
    "Deploy customer-specific KMS envelope encryption across Redis cache infrastructure by Oct 20.",
  ],
  nextSteps: [
    "Rachel Green to distribute updated enterprise rate card and order forms by Oct 8.",
    "Marcus Vance to publish Jira and Slack webhook export specifications by Oct 4.",
    "Alex Rivera to configure Datadog P95 latency monitors and alerts by Oct 7.",
    "Parv to finalize and circulate Q4 Product Requirements Document by Oct 9.",
    "Daniel Kim to deliver mobile touch scrubber and template UI specs by Oct 11.",
    "Priya Shah to implement customer Redis KMS encryption by Oct 20.",
    "Emily Carter to publish monthly CS newsletter featuring Copy Notes on Oct 4.",
  ],
};

const fileContent = `import { Meeting, Speaker, TranscriptSegment, ActionItem, Highlight, MeetingSummary } from './types';

const NOW = Date.now();
const HOUR = 1000 * 60 * 60;

export const FLAGSHIP_SPEAKERS: Speaker[] = ${JSON.stringify(speakersData, null, 2)};

export const FLAGSHIP_TRANSCRIPT: TranscriptSegment[] = ${JSON.stringify(segments, null, 2)};

export const FLAGSHIP_ACTION_ITEMS: ActionItem[] = ${JSON.stringify(actionItems, null, 2)};

export const FLAGSHIP_HIGHLIGHTS: Highlight[] = ${JSON.stringify(highlights, null, 2)};

export const FLAGSHIP_SUMMARY: MeetingSummary = ${JSON.stringify(summary, null, 2)};

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
`;

writeFileSync('src/lib/flagship-meeting.ts', fileContent, 'utf-8');
console.log('Successfully wrote src/lib/flagship-meeting.ts with ' + segments.length + ' segments.');
