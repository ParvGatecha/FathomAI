export type MeetingCategory =
  | 'all'
  | 'sales'
  | 'engineering'
  | '1-on-1'
  | 'executive'
  | 'product'
  | 'research'
  | 'demo'
  | 'hiring'
  | 'design';

export type MeetingPlatform = 'zoom' | 'google_meet' | 'teams' | 'in_person';

export interface Speaker {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  color?: string;
}

export interface TranscriptWord {
  word: string;
  start: number; // seconds
  end: number;
}

export interface TranscriptSegment {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerAvatar?: string;
  speakerRole?: string;
  startTime: number; // seconds
  endTime: number;
  text: string;
  words?: TranscriptWord[];
  highlightId?: string;
}

export interface ActionItem {
  id: string;
  text: string;
  assignee?: {
    name: string;
    avatar: string;
  };
  completed: boolean;
  timestamp: number; // seconds to jump to
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface Highlight {
  id: string;
  segmentId?: string;
  startTime: number;
  endTime: number;
  text: string;
  color: 'yellow' | 'green' | 'blue' | 'purple' | 'red';
  label: 'Decision' | 'Action' | 'Question' | 'Blocker' | 'Praise' | 'Key Point';
  createdByType: 'ai' | 'user';
  createdAt?: string;
}

export interface SummarySection {
  id: string;
  title: string;
  icon?: string;
  bullets: string[];
  citations?: { timestamp: number; quote: string }[];
}

export interface MeetingSummary {
  templateId: 'default' | 'sales_meddic' | 'eng_sprint' | 'one_on_one' | 'exec_brief' | 'user_research' | 'interview_scorecard' | 'design_critique';
  templateName: string;
  headline: string;
  overview: string;
  sections: SummarySection[];
  keyDecisions: string[];
  nextSteps: string[];
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  duration: number; // in seconds
  category: MeetingCategory;
  meetingType?: string; // e.g. "Roadmap Review", "MEDDIC Discovery", "Architecture Sync", "Sprint Planning", "Interview"
  platform: MeetingPlatform;
  mediaUrl?: string;
  speakers: Speaker[];
  transcript: TranscriptSegment[];
  summary: MeetingSummary;
  availableSummaries?: Record<string, MeetingSummary>;
  actionItems: ActionItem[];
  highlights: Highlight[];
  isFavorite?: boolean;
  tags: string[];
  createdAt: string;
}

export interface ChatCitation {
  meetingId: string;
  meetingTitle: string;
  timestamp: number;
  snippet: string;
  speakerName: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: ChatCitation[];
  timestamp: string;
}

export interface SearchResultMatch {
  meetingId: string;
  meetingTitle: string;
  meetingDate: string;
  category: string;
  matchType: 'title' | 'transcript' | 'summary' | 'action_item' | 'highlight';
  timestamp?: number;
  speakerName?: string;
  snippet: string;
}

export interface MeetingClip {
  id: string;
  meetingId: string;
  title: string;
  startTime: number;
  endTime: number;
  createdAt: string;
  createdBy?: string;
  notes?: string;
}

