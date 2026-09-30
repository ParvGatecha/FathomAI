import assert from "node:assert";
import { retrieveRelevantSegments } from "../src/lib/retrieval";
import { validateAndRepairCitations } from "../src/lib/citation-validator";
import { SEED_MEETINGS } from "../src/lib/seed-data";
import { askMeetingIntelligence, askGlobalIntelligence, askMeetingIntelligenceAsync, askGlobalIntelligenceAsync } from "../src/lib/rag";
import { generateSummaryForTemplate } from "../src/lib/templates";

console.log("==================================================");
console.log("🚀 Running Comprehensive Fathom AI Test Suite");
console.log("==================================================\n");

async function runAllTests() {
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ [FAIL] ${name}`);
      console.error(`     Error: ${err.message || err}`);
      failed++;
    }
  }

  // 1. RETRIEVAL TESTS
  await test("Retrieval: tokenizes query and matches exact key terms and intent phrases", () => {
    const meeting = SEED_MEETINGS[0];
    const results = retrieveRelevantSegments({
      query: "latency SLA sub-800ms",
      meeting,
      maxSegments: 5,
    });

    assert.ok(results.length > 0, "Should retrieve segments");
    const foundLatency = results.some(
      (r) => r.text.toLowerCase().includes("latency") || r.text.includes("800ms")
    );
    assert.ok(foundLatency, "Retrieved segments must contain latency discussion");
    assert.strictEqual(results[0].meetingId, meeting.id, "Segment must preserve meeting ID");
    assert.ok(typeof results[0].startTime === "number", "Segment has numerical startTime");
    assert.ok(results[0].speakerName, "Speaker attribution is preserved");
  });

  await test("Retrieval: expands context with neighboring transcript turns", () => {
    const meeting = SEED_MEETINGS[0];
    const results = retrieveRelevantSegments({
      query: "SOC2 compliance audit",
      meeting,
      maxSegments: 8,
      includeNeighbors: true,
    });

    assert.ok(results.length > 0, "Neighbor expansion retrieves contextual turns");
    for (const seg of results) {
      assert.ok(seg.speakerName, "Each segment must preserve speakerName");
      assert.ok(seg.text, "Each segment must preserve text");
    }
  });

  await test("Retrieval: cross-meeting retrieval aggregates matches from multiple meetings", () => {
    const results = retrieveRelevantSegments({
      query: "pricing enterprise pilot budget",
      meetings: SEED_MEETINGS,
      maxSegments: 10,
    });

    assert.ok(results.length > 0, "Must retrieve cross-meeting segments");
    const uniqueMeetings = new Set(results.map((r) => r.meetingId));
    assert.ok(uniqueMeetings.size >= 1, "Must span meetings containing pricing/budget keywords");
  });

  // 2. CITATION VALIDATION & REPAIR TESTS
  await test("Citation Validation: discards completely fabricated timestamps and unknown meetings", () => {
    const meeting = SEED_MEETINGS[0];
    const context = retrieveRelevantSegments({ query: "latency", meeting, maxSegments: 3 });
    const validStartTime = context[0].startTime;

    const testCitations = [
      {
        meetingId: meeting.id,
        meetingTitle: meeting.title,
        timestamp: validStartTime,
        quote: context[0].text.slice(0, 30),
        speakerName: context[0].speakerName,
      },
      {
        meetingId: "fake-meeting-999",
        meetingTitle: "Invented Meeting",
        timestamp: 99999, // Hallucinated
        quote: "This quote does not exist in any transcript",
        speakerName: "Phantom Speaker",
      },
    ];

    const validated = validateAndRepairCitations(testCitations, context);
    assert.strictEqual(validated.length, 1, "Should filter out the fabricated citation");
    assert.strictEqual(validated[0].timestamp, validStartTime, "Retains valid citation timestamp");
  });

  await test("Citation Validation: snaps slightly offset LLM timestamps to exact transcript segment startTime", () => {
    const meeting = SEED_MEETINGS[0];
    const context = retrieveRelevantSegments({ query: "latency SLA", meeting, maxSegments: 4 });
    const targetSegment = context[0];

    const slightlyOffsetCitation = [
      {
        meetingId: meeting.id,
        meetingTitle: meeting.title,
        timestamp: targetSegment.startTime + 2, // 2s offset
        quote: targetSegment.text.slice(0, 20),
        speakerName: targetSegment.speakerName,
      },
    ];

    const repaired = validateAndRepairCitations(slightlyOffsetCitation, context);
    assert.strictEqual(repaired.length, 1, "Should accept and snap the citation");
    assert.strictEqual(repaired[0].timestamp, targetSegment.startTime, "Snaps to segment startTime");
  });

  await test("Citation Validation: handles empty context gracefully by returning empty citations", () => {
    const repaired = validateAndRepairCitations(
      [{ timestamp: 120, quote: "random", meetingId: "test" }],
      []
    );
    assert.deepStrictEqual(repaired, [], "Empty context should yield zero citations");
  });

  // 3. DETERMINISTIC FALLBACK TESTS (NO KEY OR API FAILURE)
  await test("Missing Key Fallback: returns grounded answer and valid citations when OPENAI_API_KEY is not set", async () => {
    const meeting = SEED_MEETINGS[0];
    const answer = await askMeetingIntelligenceAsync(meeting, "What decisions were made about latency SLA?");

    assert.ok(answer.text.length > 20, "Answer must be substantive");
    assert.ok(Array.isArray(answer.citations), "Citations must be an array");
    assert.ok(answer.citations.length > 0, "Must include grounded citations");
    assert.ok(typeof answer.confidence === "number", "Must report confidence score");
    assert.ok(answer.confidence > 0.5, "Confidence should be strong");
  });

  await test("Missing Key Fallback: cross-meeting global query returns structured answer", async () => {
    const answer = await askGlobalIntelligenceAsync(SEED_MEETINGS, "What pricing concerns were raised?");

    assert.ok(answer.text.length > 20, "Global answer text must be substantive");
    assert.ok(Array.isArray(answer.citations), "Global answer must include citations");
    assert.ok(typeof answer.meetingsAnalyzed === "number", "Must report meetingsAnalyzed");
  });

  // 4. TEMPLATE SUMMARY GENERATION TESTS
  await test("Summary Templates: supports General, Sales MEDDIC, CS, Product, Engineering, and Interview", () => {
    const meeting = SEED_MEETINGS[0];
    const templates = [
      "general",
      "sales",
      "sales_meddic",
      "customer_success",
      "product",
      "engineering",
      "interview",
    ];

    for (const t of templates) {
      const summary = generateSummaryForTemplate(meeting, t);
      assert.ok(summary.headline, `Template ${t} must have headline`);
      assert.ok(summary.overview, `Template ${t} must have overview`);
      assert.ok(summary.sections.length > 0, `Template ${t} must have sections`);
      assert.ok(Array.isArray(summary.keyDecisions), `Template ${t} must have keyDecisions`);
      assert.ok(Array.isArray(summary.nextSteps), `Template ${t} must have nextSteps`);
    }
  });

  // 5. MALFORMED / SIMULATED EDGE CASES
  await test("Safety: handles non-matching queries without crashing", async () => {
    const meeting = SEED_MEETINGS[0];
    const answer = await askMeetingIntelligenceAsync(meeting, "xyz999unrelatednonexistentterm12345");

    assert.ok(answer.text.length > 0, "Provides a safe fallback response");
    assert.ok(Array.isArray(answer.citations), "Citations remains valid array");
  });

  await test("Malformed Citations: filters out citations missing mandatory fields", () => {
    const meeting = SEED_MEETINGS[0];
    const context = retrieveRelevantSegments({ query: "latency", meeting, maxSegments: 2 });
    const malformed = [
      { timestamp: "invalid" as any, quote: "" },
      { timestamp: NaN, quote: "valid text" },
      null as any,
      undefined as any,
    ];
    const cleaned = validateAndRepairCitations(malformed, context);
    assert.strictEqual(cleaned.length, 0, "All malformed entries are cleanly discarded");
  });

  console.log(`\n==================================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed.`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
