import assert from "node:assert";
import fs from "node:fs";

try {
  if (fs.existsSync(".env")) {
    process.loadEnvFile(".env");
  } else if (fs.existsSync(".env.local")) {
    process.loadEnvFile(".env.local");
  }
} catch {}

import { askMeetingIntelligenceAsync, askGlobalIntelligenceAsync } from "../src/lib/rag";
import { generateMeetingSummaryWithOpenAI } from "../src/lib/ai-grounded";
import { SEED_MEETINGS } from "../src/lib/seed-data";
import { isOpenAIConfigured, getOpenAIModel } from "../src/lib/openai";

async function verifyLiveOpenAI() {
  console.log("==================================================");
  console.log("🔍 Testing Live OpenAI Execution Verification");
  console.log("==================================================");
  console.log("IsOpenAIConfigured:", isOpenAIConfigured());
  console.log("Model:", getOpenAIModel());

  if (!isOpenAIConfigured()) {
    console.log("⚠️ OPENAI_API_KEY is not set or invalid in environment.");
    return;
  }

  const meeting = SEED_MEETINGS[0];

  // 1. Single-Meeting Live OpenAI Call
  console.log("\n1. Invoking Single-Meeting Question with OpenAI...");
  const t0 = Date.now();
  const res1 = await askMeetingIntelligenceAsync(
    meeting,
    "What specific decisions were made regarding latency SLAs and cache hit rates?"
  );
  const dur1 = Date.now() - t0;
  console.log(`   Response received in ${dur1}ms`);
  console.log(`   isRealLLM: ${res1.isRealLLM}`);
  console.log(`   Answer snippet: "${res1.text.slice(0, 160)}..."`);
  console.log(`   Citations count: ${res1.citations.length}`);
  for (const c of res1.citations) {
    console.log(`     - [${c.timestamp}s] ${c.speakerName}: "${c.quote.slice(0, 60)}..."`);
  }
  assert.strictEqual(res1.isRealLLM, true, "Must be real LLM response");
  assert.ok(res1.citations.length > 0, "Must have grounded citations");

  // 2. Cross-Meeting Live OpenAI Call
  console.log("\n2. Invoking Cross-Meeting Question with OpenAI...");
  const t1 = Date.now();
  const res2 = await askGlobalIntelligenceAsync(
    SEED_MEETINGS,
    "What pricing and security concerns (like SOC2) were raised by customers?"
  );
  const dur2 = Date.now() - t1;
  console.log(`   Response received in ${dur2}ms`);
  console.log(`   isRealLLM: ${res2.isRealLLM}`);
  console.log(`   Meetings Analyzed: ${res2.meetingsAnalyzed}`);
  console.log(`   Answer snippet: "${res2.text.slice(0, 160)}..."`);
  console.log(`   Citations count: ${res2.citations.length}`);
  assert.strictEqual(res2.isRealLLM, true, "Must be real LLM response");

  // 3. Meeting Summary Generation with OpenAI
  console.log("\n3. Invoking Meeting Summary Generation with OpenAI (Sales MEDDIC)...");
  const t2 = Date.now();
  const summaryRes = await generateMeetingSummaryWithOpenAI({
    meetingTitle: meeting.title,
    category: meeting.category,
    templateId: "sales_meddic",
    transcript: meeting.transcript,
    speakers: meeting.speakers,
  });
  const dur3 = Date.now() - t2;
  console.log(`   Summary received in ${dur3}ms`);
  console.log(`   Headline: "${summaryRes?.headline}"`);
  console.log(`   Overview: "${summaryRes?.overview.slice(0, 120)}..."`);
  console.log(`   Key Topics (${summaryRes?.keyTopics.length}):`, summaryRes?.keyTopics);
  console.log(`   Decisions (${summaryRes?.decisions.length}):`, summaryRes?.decisions);
  console.log(`   Action Items (${summaryRes?.actionItems.length}):`, summaryRes?.actionItems);
  assert.ok(summaryRes !== null, "Summary response must not be null");

  console.log("\n==================================================");
  console.log("🎉 ALL LIVE OPENAI CALLS CONFIRMED GENUINE & WORKING!");
  console.log("==================================================\n");
}

verifyLiveOpenAI().catch((err) => {
  console.error("Live OpenAI verification failed:", err);
  process.exit(1);
});
