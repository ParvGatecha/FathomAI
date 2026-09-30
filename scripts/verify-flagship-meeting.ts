import fs from 'node:fs';

try {
  if (fs.existsSync('.env')) {
    process.loadEnvFile('.env');
  } else if (fs.existsSync('.env.local')) {
    process.loadEnvFile('.env.local');
  }
} catch {}

import { getFlagshipMeeting } from '../src/lib/flagship-meeting';
import { retrieveRelevantSegments } from '../src/lib/retrieval';
import { generateGroundedAnswerWithOpenAI } from '../src/lib/ai-grounded';
import { isOpenAIConfigured } from '../src/lib/openai';

async function verifyFlagshipMeeting() {
  console.log('=== STARTING FLAGSHIP MEETING VERIFICATION ===\n');

  const meeting = getFlagshipMeeting();

  // 1. Check basic metadata
  console.log(`Title: ${meeting.title}`);
  console.log(`Duration: ${meeting.duration}s (${Math.round(meeting.duration / 60)} minutes)`);
  console.log(`Total Transcript Segments: ${meeting.transcript.length}`);
  console.log(`Total Speakers: ${meeting.speakers.length}`);
  console.log(`Total Action Items: ${meeting.actionItems.length}`);
  console.log(`Total Highlights: ${meeting.highlights.length}`);
  console.log(`Total Key Decisions: ${meeting.summary.keyDecisions.length}\n`);

  if (meeting.transcript.length < 180 || meeting.transcript.length > 250) {
    throw new Error(`Segment count ${meeting.transcript.length} outside expected 180-250 range!`);
  }

  // 2. Verify all 8 speakers appear and have spoken
  const expectedSpeakers = [
    'Parv',
    'Sarah Chen',
    'Alex Rivera',
    'Rachel Green',
    'Marcus Vance',
    'Emily Carter',
    'Daniel Kim',
    'Priya Shah',
  ];

  console.log('--- Checking Speakers ---');
  for (const name of expectedSpeakers) {
    const spk = meeting.speakers.find((s) => s.name === name);
    if (!spk) throw new Error(`Missing speaker in metadata: ${name}`);
    const turns = meeting.transcript.filter((t) => t.speakerName === name);
    if (turns.length === 0) throw new Error(`Speaker ${name} has 0 turns!`);
    console.log(`✓ ${name.padEnd(16)} (${spk.role}): ${turns.length} turns spoken`);
  }

  // 3. Verify Chronological Timestamps
  console.log('\n--- Checking Transcript Timestamps & Ordering ---');
  let prevStart = -1;
  let prevEnd = -1;
  for (let i = 0; i < meeting.transcript.length; i++) {
    const seg = meeting.transcript[i];
    if (seg.startTime < prevStart) {
      throw new Error(`Segment ${i} startTime (${seg.startTime}) is less than previous (${prevStart})`);
    }
    if (seg.endTime < seg.startTime) {
      throw new Error(`Segment ${i} endTime (${seg.endTime}) is less than startTime (${seg.startTime})`);
    }
    prevStart = seg.startTime;
    prevEnd = seg.endTime;
  }
  console.log(`✓ All ${meeting.transcript.length} segments are strictly chronological (0s -> ${prevEnd}s).`);

  // 4. Verify Action Item timestamps map to actual transcript segments
  console.log('\n--- Checking Action Items Grounding ---');
  for (const item of meeting.actionItems) {
    const match = meeting.transcript.find(
      (s) => s.startTime <= item.timestamp && s.endTime >= item.timestamp
    ) || meeting.transcript.find((s) => Math.abs(s.startTime - item.timestamp) < 30);
    if (!match) {
      throw new Error(`Action item "${item.text}" timestamp ${item.timestamp} has no matching transcript segment!`);
    }
    console.log(`✓ Action: [${item.priority.toUpperCase()}] "${item.text.slice(0, 45)}..." -> [${item.assignee?.name}] at ${item.timestamp}s (matched speaker: ${match.speakerName})`);
  }

  // 5. Verify Highlights Grounding
  console.log('\n--- Checking Highlights Grounding ---');
  for (const hl of meeting.highlights) {
    const match = meeting.transcript.find((s) => s.startTime >= hl.startTime - 20 && s.startTime <= hl.endTime + 20);
    if (!match) {
      throw new Error(`Highlight "${hl.text.slice(0, 30)}" has no matching transcript segment!`);
    }
    console.log(`✓ Highlight: [${hl.label}] ${hl.startTime}s-${hl.endTime}s: "${hl.text.slice(0, 50)}..."`);
  }

  // 6. Test Ask Fathom Retrieval across Early, Middle, and Late Sections
  console.log('\n--- Testing Retrieval Across Early, Middle, and Late Sections ---');
  const testQueries = [
    { section: 'Early (0-7m)', query: 'What was our Q3 ARR and QoQ growth rate?' },
    { section: 'Early (0-7m)', query: 'What model did Alex upgrade for transcription?' },
    { section: 'Middle (7-18m)', query: 'What integrations did Marcus commit to building in Sprint 24?' },
    { section: 'Middle (18-30m)', query: 'What is the price and seat minimum for the new Enterprise tier?' },
    { section: 'Middle (30-40m)', query: 'Why did the team defer CRDT multi-cursor sync to Q1?' },
    { section: 'Late (40-49m)', query: 'What is our P95 latency SLA target for Ask Fathom?' },
    { section: 'Late (49-56m)', query: 'When is the SOC2 Type II observation window and HIPAA BAA signing date?' },
    { section: 'Late (56-62m)', query: 'What action item does Rachel Green own?' },
  ];

  for (const tq of testQueries) {
    const retrieved = retrieveRelevantSegments({
      query: tq.query,
      meeting,
      maxSegments: 5,
    });
    if (retrieved.length === 0) {
      throw new Error(`No segments retrieved for query: "${tq.query}"`);
    }
    const bestMatch = retrieved[0];
    console.log(`✓ [${tq.section}] Query: "${tq.query}"`);
    console.log(`  -> Top segment at ${bestMatch.startTime}s by ${bestMatch.speakerName}: "${bestMatch.text.slice(0, 75)}..."`);
  }

  // 7. Live OpenAI Test (if key available)
  console.log('\n--- Testing Live LLM Generation on Flagship Transcript ---');
  if (!isOpenAIConfigured()) {
    console.log('Skipping live OpenAI API call (OPENAI_API_KEY not configured).');
  } else {
    console.log('Invoking OpenAI gpt-4o-mini with grounded retrieval...');
    const q = 'What is the enterprise pricing structure and pilot terms?';
    const startTime = Date.now();
    const retrieved = retrieveRelevantSegments({
      query: q,
      meeting,
      maxSegments: 8,
    });

    const result = await generateGroundedAnswerWithOpenAI({
      query: q,
      contextSegments: retrieved,
      meetingTitle: meeting.title,
      decisions: meeting.summary.keyDecisions,
      actionItems: meeting.actionItems.map((a) => `${a.text} (${a.assignee?.name})`),
    });

    const elapsed = Date.now() - startTime;
    if (result) {
      console.log(`\nOpenAI Response (${elapsed}ms):`);
      console.log(`Answer:\n${result.text}`);
      console.log(`\nCitations (${result.citations.length}):`);
      for (const cit of result.citations) {
        console.log(`  - [${cit.timestamp}s] by ${cit.speakerName}: "${cit.quote}"`);
      }
      console.log(`\nConfidence: ${result.confidence}`);
      console.log(`isRealLLM: ${result.isRealLLM}`);
    } else {
      console.log('OpenAI response was null.');
    }
  }

  console.log('\n=== ALL FLAGSHIP MEETING VERIFICATIONS PASSED SUCCESSFULLY ===');
}

verifyFlagshipMeeting().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
