import assert from "node:assert";

async function verifyHttpEndpoints() {
  console.log("Testing live HTTP endpoints on http://localhost:3000...\n");

  // 1. Test POST /api/ask with single meeting
  console.log("1. Testing POST /api/ask (Single Meeting)...");
  const res1 = await fetch("http://localhost:3000/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      meetingId: "meet-1",
      question: "What decisions were made about latency SLA?",
    }),
  });
  assert.strictEqual(res1.status, 200, "POST /api/ask should return 200");
  const data1 = await res1.json();
  assert.ok(data1.answer, "Should have answer field");
  assert.ok(Array.isArray(data1.citations), "Should have citations array");
  assert.ok(typeof data1.confidence === "number", "Should have confidence");
  console.log("   ✅ Answer:", data1.answer.slice(0, 80) + "...");
  console.log("   ✅ Citations Count:", data1.citations.length);

  // 2. Test POST /api/ask (Global Cross-Meeting)
  console.log("\n2. Testing POST /api/ask (Cross-Meeting)...");
  const res2 = await fetch("http://localhost:3000/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: "What pricing concerns or pilot requirements were discussed?",
    }),
  });
  assert.strictEqual(res2.status, 200, "POST /api/ask cross-meeting should return 200");
  const data2 = await res2.json();
  assert.ok(data2.answer, "Should have answer field");
  assert.ok(Array.isArray(data2.citations), "Should have citations array");
  console.log("   ✅ Answer:", data2.answer.slice(0, 80) + "...");

  // 3. Test POST /api/meetings/ask
  console.log("\n3. Testing POST /api/meetings/ask...");
  const res3 = await fetch("http://localhost:3000/api/meetings/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: "What are customers requesting most?",
    }),
  });
  assert.strictEqual(res3.status, 200, "POST /api/meetings/ask should return 200");
  const data3 = await res3.json();
  assert.ok(data3.answer, "Should have answer field");
  assert.ok(typeof data3.meetingsAnalyzed === "number", "Should have meetingsAnalyzed");
  console.log("   ✅ Meetings Analyzed:", data3.meetingsAnalyzed);

  // 4. Test POST /api/meetings/[id]/summarize
  console.log("\n4. Testing POST /api/meetings/meet-1/summarize (Sales MEDDIC Template)...");
  const res4 = await fetch("http://localhost:3000/api/meetings/meet-1/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      templateId: "sales_meddic",
    }),
  });
  assert.strictEqual(res4.status, 200, "POST /api/meetings/meet-01/summarize should return 200");
  const data4 = await res4.json();
  assert.ok(data4.overview, "Should have overview");
  assert.ok(Array.isArray(data4.keyTopics), "Should have keyTopics");
  assert.ok(Array.isArray(data4.decisions), "Should have decisions");
  assert.ok(Array.isArray(data4.actionItems), "Should have actionItems");
  assert.ok(Array.isArray(data4.highlights), "Should have highlights");
  console.log("   ✅ Overview:", data4.overview.slice(0, 80) + "...");
  console.log("   ✅ Action Items Count:", data4.actionItems.length);

  // 5. Test validation error (empty question)
  console.log("\n5. Testing validation on invalid input...");
  const res5 = await fetch("http://localhost:3000/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: "" }),
  });
  assert.strictEqual(res5.status, 400, "Empty question should return 400 Bad Request");
  console.log("   ✅ Correctly rejected invalid input with 400 status");

  console.log("\n🎉 ALL LIVE HTTP ENDPOINTS VERIFIED SUCCESSFULLY!\n");
}

verifyHttpEndpoints().catch((e) => {
  console.error("HTTP verification error:", e);
  process.exit(1);
});
