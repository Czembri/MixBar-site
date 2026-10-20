# Product Hunt launch package

## Listing

**Product name:** MixBar

**Tagline (under 60 characters):** Give every Mac app and browser tab its own volume

**Short description (under 260 characters):** MixBar is a native macOS menu-bar mixer for independent app volume, mute, three-band EQ, audio scenes, output switching, and supported browser tabs. It is a $21 one-time purchase with no permanent virtual audio driver.

## Detailed description

macOS gives you a master volume, but real work is a mix: a call that must stay clear, music that should sit underneath it, alerts that can be quieter, and one browser tab that should not control every other tab.

MixBar puts that missing mixer in the menu bar. It controls each active app independently, remembers levels and names, adds Bass/Mid/Treble EQ, switches outputs, and can activate saved Audio Autopilot scenes from app, website, device, or time triggers.

Chrome and Opera tabs can be chosen with the free companion extension. Safari works with supported standard media through the bundled extension. Firefox exposes detected audio subprocesses rather than named tabs.

Audio processing stays local in memory. MixBar uses Apple’s Core Audio process-tap APIs and does not install a permanent virtual audio driver. It runs on macOS 14.2 or later, on Apple silicon and Intel. The current feature release costs $21 once; its fix updates are included.

## Key benefits

- Independent volume and mute for active Mac apps.
- Three-band EQ for apps, detected subprocesses, and controlled Chromium tabs.
- Supported Safari, Chrome, and Opera tab control; honest Firefox subprocess behavior.
- Saved levels, mute states, names, and curves.
- Audio Autopilot scenes and local rules.
- Built-in, wired, Bluetooth, and AirPlay output switching.
- No subscription and no permanent virtual audio driver.

## Maker’s first comment

Hi Product Hunt — I’m the independent developer behind MixBar.

I built it because the Mac’s single master volume kept failing a very ordinary setup: a call, a playlist, a browser video, and notifications all competing at once. I wanted a small native control in the menu bar, not a studio routing project and not another subscription.

The difficult part was making per-app control safe. MixBar uses Apple’s process-tap APIs and is designed to leave an app’s normal audio path available if processing cannot start. Browser tabs also have real platform limits, so I have tried to state them plainly: Chrome and Opera use a companion extension, Safari supports standard web media, and Firefox provides audio-process controls rather than named tabs.

MixBar is $21 once for the current feature release, with its fix updates included. Audio stays local and the app installs no permanent virtual audio driver.

I would especially value feedback on the first-run permission explanation, browser setup, and which daily audio problem you would automate first. I’ll be here throughout the day to answer technical questions.

## Gallery plan

1. Hero: real main MixBar panel with three apps at different levels.
2. App detail: expanded subprocesses and independent EQ.
3. Browser: real Chrome extension plus the resulting tab rows in MixBar.
4. Audio Autopilot: a scene and its trigger, with plain annotations.
5. Trust/pricing: `$21 once`, macOS 14.2+, Apple silicon + Intel, local audio, no permanent virtual driver.

Use a cursor-only screen recording or animated screenshot if Product Hunt strongly benefits from motion; the founder does not need to appear or narrate. Never generate a fake app interface.

## FAQ

**Is it a subscription?** No. The current feature release is $21 once and remains usable forever. Its fix updates are included; later feature releases may be optional separate purchases.

**Which Macs are supported?** macOS 14.2 or later, Apple silicon and Intel.

**Does it record audio?** It processes outgoing application audio locally in memory to apply controls. It does not save or upload audio and does not capture microphone audio.

**Does it install an audio driver?** No permanent virtual audio device, kernel extension, or system-wide driver.

**Does every browser expose named tabs?** No. Chrome/Opera use an extension and explicit tab capture; Safari supports standard media; Firefox provides detected audio subprocess controls rather than named tab names.

**How many Macs?** Up to three of the buyer’s Macs at a time, with deactivation when moving a slot.

**Can I download it again?** Yes. The restore page sends a short-lived private link for the newest release included with the purchase.

## Checklist

- [ ] Production checkout, restore email, activation, contact, and DMG tested from a clean Mac.
- [ ] Chrome public listing works; Opera status described accurately.
- [ ] Current screenshots taken from the release build and checked at Product Hunt crop sizes.
- [ ] Product URL contains `utm_source=producthunt&utm_medium=referral&utm_campaign=launch_2026`.
- [ ] Founder account has participated genuinely before launch.
- [ ] Launch scheduled for a day the founder can answer comments from 12:01 AM Pacific onward.
- [ ] Maker comment, FAQ, refund link, privacy link, and support response templates ready.
- [ ] No request for coordinated upvotes; ask people to try the product and give honest feedback.
- [ ] GA4 Realtime and Stripe monitored without exposing customer information.

Product Hunt’s current launch guide recommends a plain-language page, sharp visuals, a quick demo, and a genuine maker comment. Verify the live rules again before scheduling: https://help.producthunt.com/en/articles/17350772-launch-guide
