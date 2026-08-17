// ---------------------------------------------------------------------------
// errors.js — typed error taxonomy for the Automation Platform.
//
// Architecture V2 §2.9: "fail loud, fail safe, never fabricate". Every failure
// mode the engine can hit is one of these types, so the Automation Engine can
// decide how to react (retry, block promotion, escalate to a human) without
// string-matching messages.
//
//   ConfigError       — missing/invalid config or brand facts (bug or setup).
//   IntegrationError  — an external system (BigCommerce) failed or is unreachable.
//   RenderError       — the Rendering Engine could not assemble valid HTML
//                       (e.g. a required [[TOKEN]] had no value — STOP, never invent).
//   QaBlocker         — a QA validator found a defect that blocks promotion to Output.
//   ApprovalRequired  — the run needs a human decision before it can continue.
//
// A QaBlocker is deliberately NOT fatal to the run: the build still lands in
// Output/ for preview (CLAUDE.md §4.1), and the blocker is recorded in the QA
// report. The other four abort the run with a clear, actionable message.
// ---------------------------------------------------------------------------

'use strict';

class PlatformError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
  }
}

class ConfigError extends PlatformError {}
class IntegrationError extends PlatformError {}
class RenderError extends PlatformError {}
class ApprovalRequired extends PlatformError {}

// QaBlocker carries the structured finding so the report layer can render it.
class QaBlocker extends PlatformError {
  constructor(message, finding = {}) {
    super(message, finding);
    this.finding = finding;
  }
}

module.exports = {
  PlatformError,
  ConfigError,
  IntegrationError,
  RenderError,
  ApprovalRequired,
  QaBlocker,
};
