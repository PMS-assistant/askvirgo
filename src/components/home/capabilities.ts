import { Sunrise, MessageSquare, MessageCircle, Star, Bell } from 'lucide-react';

/* What Virgo does, one entry per capability. Used by the bento grid.

   Statuses are checked against the product's own progress notes and must stay
   honest — anything not shipped carries a label saying so. Per the absolute
   rule in CLAUDE.md, nothing here may imply Virgo writes to a connected
   system; it recommends and surfaces. The one exception, guest WhatsApp
   replies, is the product's only write surface and is described as exactly
   that. */

export type CapabilityStatus = 'In progress' | 'On the roadmap';

export type Capability = {
  id: string;
  icon: typeof Sunrise;
  label: string;
  status?: CapabilityStatus;
  title: string;
  body: string;
  /** Always a CSS custom property, never a literal. */
  accent: string;
  wash: string;
};

export const CAPABILITIES: Capability[] = [
  {
    id: 'ask',
    icon: MessageSquare,
    label: 'Ask anything',
    accent: 'var(--primary)',
    wash: 'var(--primary-wash)',
    title: 'One question. Every system answers.',
    body: "Ask the way you'd ask a colleague. Virgo works out which tools hold the answer, gathers what it needs from each, and names the source of every figure.",
  },
  {
    id: 'briefing',
    icon: Sunrise,
    label: 'Morning briefing',
    accent: 'var(--amber)',
    wash: 'var(--amber-wash)',
    title: 'The day, before you open a single app.',
    body: 'At 7am Virgo reads across every connected system and writes you one briefing — what needs attention today, and why it matters.',
  },
  {
    id: 'messaging',
    icon: MessageCircle,
    label: 'Guest messaging',
    accent: 'var(--mint-deep)',
    wash: 'var(--mint-wash)',
    title: 'Guest messages that send themselves.',
    body: 'Booking confirmations, pre-arrival reminders and checkout notes go out over the official WhatsApp Business API. This is the only place Virgo ever writes anything: replies stay inside guardrails, anything unusual is escalated to your team, and one switch pauses all of it.',
  },
  {
    id: 'reviews',
    icon: Star,
    label: 'Reviews',
    status: 'In progress',
    accent: 'var(--gold)',
    wash: 'var(--gold-wash)',
    title: 'What guests are actually saying.',
    body: 'Ratings and written feedback pulled in alongside everything else, so a dip in score can be read against the week that caused it. Google and TripAdvisor connectors are being built now.',
  },
  {
    id: 'alerts',
    icon: Bell,
    label: 'Proactive alerts',
    status: 'On the roadmap',
    accent: 'var(--steel)',
    wash: 'var(--steel-wash)',
    title: 'Told before you thought to ask.',
    body: "We're building proactive monitoring on top of the live connectors: demand signals, weather impact and rate recommendations surfaced without a prompt. Not shipped yet; we'll say so when it is.",
  },
];
