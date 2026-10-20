# Community launch playbook

Read each community’s live rules immediately before posting. Do not automate submission, coordinate votes, cross-post the same text on the same day, or hide that you built the product. Answer questions, including uncomfortable compatibility questions, with specifics.

## r/macapps — important 2026 constraints

Current r/macapps guidance is unusually strict:

- self-promotion is limited to once per developer per 30 days, including removed posts;
- the developer relationship must be disclosed;
- main-feed promotion depends on community trust/transparency; a non-App-Store app without qualifying history may belong in the monthly **App Pile** megathread;
- the current App Pile asks for a short PCP format: Problem, explicit Comparison, and Pricing, with a screenshot/video for consideration;
- a verified email, subreddit participation/karma, and “read the rules” process may affect approval;
- comment hijacking for self-promotion is not acceptable.

MixBar is outside the Mac App Store, so assume the App Pile is the correct route unless a moderator or the live rules clearly say otherwise. Check the current pinned thread; rules can change.

### App Pile draft

**MixBar — per-app and supported browser-tab volume for Mac**

**Problem:** macOS gives every app one shared master volume, so calls, music, browser videos, and notifications compete with each other.

**Comparison:** MixBar focuses on a compact native menu-bar mixer using Apple’s process-tap APIs, with per-app volume/mute/EQ, saved settings, Audio Autopilot scenes, and supported browser tabs without a permanent virtual audio driver. Studio routing tools remain better for recording and complex device graphs; MixBar is intended for everyday listening and productivity.

**Pricing:** $21 USD once for the current feature release, including its fix updates. macOS 14.2+, Apple silicon and Intel. https://getmixbar.com/?utm_source=reddit&utm_medium=organic&utm_campaign=macapps_launch

I’m the developer. Audio is processed locally in memory. Chrome/Opera tab control uses a free extension; Safari supports standard web media; Firefox shows detected audio subprocesses rather than named tabs. I’d value feedback on permission onboarding and the browser setup.

Before posting, name the actual competitors only after personally testing their current versions, per the current PCP comparison rule. Do not invent a superiority claim.

## r/SideProject

The community is for sharing projects and receiving constructive feedback. Check its live rules/flairs first and participate before launching.

### Draft

**Title:** I built a native Mac volume mixer after getting tired of calls fighting with music

I kept running into the same small macOS problem: one master volume was controlling a call, music, a browser video, and notifications that did not belong at the same level.

So I built MixBar, a menu-bar app that gives active Mac apps independent volume, mute, and three-band EQ. It can remember settings, switch outputs, and activate saved audio scenes from app/site/device/time triggers. Chrome and Opera tabs can also be chosen through a companion extension. Safari and Firefox have different platform limits, which I explain on the site rather than hiding.

The app uses Apple’s Core Audio process-tap APIs, processes sound locally in memory, and does not install a permanent virtual audio driver. It is a $21 one-time purchase for the current feature release.

The hardest engineering decision was fail-safe behavior: if an app cannot be processed, its normal sound path should remain available rather than getting trapped in silence.

I’m looking for feedback on two things: does the landing page explain the browser limitations clearly, and is the first-run permission flow understandable to someone who has never seen Apple’s “System Audio Recording” wording?

https://getmixbar.com/?utm_source=reddit&utm_medium=organic&utm_campaign=sideproject_launch

## Hacker News / Show HN

Current Show HN guidance says the audience must be able to try the thing, barriers should be low, the maker must be present to discuss it, upgrades alone are usually insufficient, and vote solicitation is forbidden. HN’s current general guidelines also say not to post generated or AI-edited text. Therefore the founder must rewrite the outline below personally rather than paste it.

**Suggested title:** `Show HN: MixBar – a native per-app volume mixer for macOS`

Personal points to cover in the founder’s own words:

- the concrete call/music/notification problem that caused the build;
- why Apple’s Core Audio process taps were chosen instead of a permanent virtual device;
- fail-safe behavior when taps fail;
- how subprocess grouping and browser native messaging work;
- the real limits: macOS 14.2+, named Chrome/Opera tabs only after explicit extension capture, Safari standard media, Firefox subprocesses;
- local in-memory processing and the absence of microphone capture;
- $21 one-time pricing and an easy way for HN readers to try/evaluate the product;
- one technical question where experienced macOS/audio developers could give useful feedback.

Be ready to answer why it is not open source, why it is outside the App Store, what permissions it needs, and how it differs from personally tested alternatives. Do not use promotional superlatives.

Rules: https://news.ycombinator.com/showhn.html and https://news.ycombinator.com/newsguidelines.html

## Other relevant channels

- **Indie Hackers:** build story and verified conversion lessons, not a link-only promotion.
- **MacStories/9to5Mac tips:** a concise, individualized press email only after screenshots and a stable public release exist. Do not send a bulk template.
- **Chrome Web Store listing:** improve description/screenshots and link to the Mac app explanation; store visitors already express tab-audio intent.
- **Product Hunt:** use the dedicated package and be present all day.
- **Relevant Discord/Slack groups:** post only in explicit showcase/self-promotion channels and disclose the developer relationship.

Avoid r/apple and r/macOS self-promotion unless the live rules explicitly allow this non-App-Store product. A 2025 r/macOS policy restricted self-promotion to Mac App Store apps, so MixBar should not assume eligibility.

## Reply bank

**Why does it need System Audio Recording?** Apple uses that permission name for access to outgoing application audio. MixBar uses it to apply volume/EQ locally; it does not save recordings or capture microphone audio.

**Why not the Mac App Store?** Answer with the factual distribution/entitlement reasons from the current release process; do not criticize Apple or imply review that did not occur.

**Does it control every browser tab?** No. State the exact browser behavior and link to the compatibility guide.

**Is it lifetime?** The purchased feature release remains usable forever and includes its fix updates. Later feature releases may be separate optional purchases. Pre-policy buyers keep their promised 1.x entitlement.

**Can I test it free?** There is no public trial currently. Do not imply one. Point to compatibility details and the 14-day refund policy.

## Conduct checklist

- [ ] Founder rewrites each post for that community and verifies current rules.
- [ ] Relationship and exact price disclosed near the top.
- [ ] Screenshot from the shipped build attached.
- [ ] UTM identifies community/post without personal data.
- [ ] No vote request, giveaway-for-upvotes, fake review, or repeated bump.
- [ ] Replies sent promptly and transparently for at least 48 hours.
- [ ] Feedback themes recorded; support issues handled privately when they contain personal data.
