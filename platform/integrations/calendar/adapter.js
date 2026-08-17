// ---------------------------------------------------------------------------
// adapter.js — Content Calendar adapter (Architecture V2 §2.5 / §6.1).
//
// Resolves an intent ("this week") to a concrete slot {type, isoWeek, ...} using
// config/content-calendar.json. Send day/time + lead times are still To Be
// Confirmed in 00-Project Overview/content-calendar.md, so the MVP resolves by
// ISO week only. It NEVER invents theme/product data — those come from the live
// catalog at generation time.
// ---------------------------------------------------------------------------

'use strict';

const { ConfigError } = require('../../common/errors');

// ISO-8601 week number + week-year for a given Date.
function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Mon=0..Sun=6
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // nearest Thursday
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((d - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return { year: d.getUTCFullYear(), week };
}

function isoWeekId(date = new Date()) {
  const { year, week } = isoWeek(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

// Resolve the slot for a brand + type for the target week.
function resolveSlot({ calendar, brandCode, type = 'weekly', date = new Date() }) {
  const weekId = isoWeekId(date);
  const brand = String(brandCode).toUpperCase();

  const exact = (calendar.slots || []).find(
    (s) => String(s.brand).toUpperCase() === brand && s.type === type && s.isoWeek === weekId
  );
  const template = (calendar.slots || []).find(
    (s) => String(s.brand).toUpperCase() === brand && s.type === type && s.isoWeek == null
  );
  const slot = exact || template;

  if (!slot) {
    const def = calendar.defaults && calendar.defaults[brand] && calendar.defaults[brand][type];
    if (!def) {
      throw new ConfigError(
        `No calendar slot or default for ${brand}/${type}. Add one to config/content-calendar.json.`,
        { brand, type }
      );
    }
    return { brand, type, isoWeek: weekId, theme: def.theme || null, objective: def.objective || '', synthesized: true };
  }

  return {
    brand,
    type: slot.type,
    isoWeek: weekId,
    theme: slot.theme || null,
    objective: slot.objective || '',
    synthesized: !exact,
  };
}

module.exports = { resolveSlot, isoWeekId, isoWeek };
