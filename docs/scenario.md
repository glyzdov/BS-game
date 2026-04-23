# Scenario

Beer Station Pub is a basement craft-beer bar. The player enters from the
street and must first descend a narrow staircase to reach the pub floor. The
game splits into two parallel campaigns that share the same world and
eventually interact.

## Title screen

Portrait layout, 720×1280 base.

- Top: BS logo (from `reference/BS_logo.cd9217e5.png`).
- Middle: two large tap targets, stacked vertically.
  - **Enter as Guest** — civilian campaign, evening out at the pub.
  - **Enter as Bartender** — work shift campaign.
- Bottom: small "tap to start" hint is replaced once the role is picked.

The role selection persists for the session and can be changed only by
returning to the title screen.

## First quest — Stair Descent

Both campaigns begin at the top of the staircase, outside the pub. Before
any dialog, shop, or interaction is available, the player must make it down
the stairs. This is the game's tutorial for timing-based input.

The mechanic is identical for Guest and Bartender: a straight staircase,
alternate left/right taps in rhythm, don't stumble. Full mechanic is
documented in [minigames/stairs-descent.md](minigames/stairs-descent.md).

After the stair descent both campaigns converge on the pub floor, where
role-specific quests begin (guest: order a beer, meet regulars; bartender:
tap the keg, take first order).

## Later content (placeholder)

- Beer pong mini-game (the real pub has a table — see
  `reference/photo_2026-03-26_*.jpg`).
- Dialog system with regulars.
- Meta layer: money, reputation, quest progress shared across mini-games.

These are tracked in the root `CLAUDE.md` "Next planned steps" section and
will get their own docs once scoped.
