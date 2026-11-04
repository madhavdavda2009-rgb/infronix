import { query, initFounderOSDb } from './founder_os_db.js';
import { normalise, TOPIC_IDS } from './chatbot-knowledge.js';

// Niya learns new phrasings from visitors: when Niya was unsure about a question and the
// visitor then picked a topic, that (phrase -> topic) pair gets a vote. Once enough different
// visitors agree, the phrase is served back to every visitor as a learned keyword.
//
// Privacy: only short, scrubbed phrases are stored (no numbers, emails or links), never the
// lead-form answers, and nothing that identifies the visitor.

export const MIN_VOTES = 3;
const TOPICS = new Set(TOPIC_IDS);

let ensured = Boolean(globalThis._niya_learning_ready);

export async function initNiyaDb() {
  await initFounderOSDb();
  if (ensured) return;
  await query(`
    CREATE TABLE IF NOT EXISTS niya_learned_phrases (
      phrase VARCHAR(120) NOT NULL,
      topic_id VARCHAR(60) NOT NULL,
      votes INTEGER NOT NULL DEFAULT 1,
      first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      PRIMARY KEY (phrase, topic_id)
    );
  `);
  ensured = true;
  globalThis._niya_learning_ready = true;
}

/** Cleans a visitor question into a short phrase that is safe to store, or '' to skip it. */
export function scrubPhrase(raw) {
  const text = String(raw || '')
    .slice(0, 300)
    .replace(/\S+@\S+/g, ' ') // emails
    .replace(/https?:\/\/\S+|www\.\S+/gi, ' ') // links
    .replace(/\d+/g, ' '); // phone numbers, amounts, pincodes
  const norm = normalise(text).trim();
  const words = norm.split(' ').filter(Boolean);
  if (words.length < 1 || words.length > 10 || norm.length < 3 || norm.length > 120) return '';
  return norm;
}

export async function recordLearning(rawPhrase, topicId) {
  const phrase = scrubPhrase(rawPhrase);
  if (!phrase || !TOPICS.has(topicId)) return false;
  await initNiyaDb();
  await query(
    `INSERT INTO niya_learned_phrases (phrase, topic_id) VALUES ($1, $2)
     ON CONFLICT (phrase, topic_id) DO UPDATE SET votes = niya_learned_phrases.votes + 1, last_seen = NOW()`,
    [phrase, topicId],
  );
  return true;
}

/** Phrases that enough visitors agreed on, each with its most-voted topic. */
export async function getLearnedPhrases() {
  await initNiyaDb();
  const { rows } = await query(
    `SELECT DISTINCT ON (phrase) phrase, topic_id AS topic, votes
       FROM niya_learned_phrases
      WHERE votes >= $1
      ORDER BY phrase, votes DESC
      LIMIT 1000`,
    [MIN_VOTES],
  );
  return rows.filter((r) => TOPICS.has(r.topic)).map(({ phrase, topic }) => ({ phrase, topic }));
}
