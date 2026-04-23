# Mini-game: Stair Descent

First quest for both campaigns. Same mechanic for Guest and Bartender —
tutorializes the core timing input and sets the mood (narrow basement
staircase, muffled bar noise rising as you go down).

## Camera and layout

Portrait 720×1280, side view. A **straight staircase** runs from top to
bottom of the screen, no turns, no landings. The character is centered
horizontally; the camera is locked to the character so the staircase
scrolls upward as the player descends. Brick/wood walls frame both sides
to keep the playfield narrow.

The played area is the bottom third of the screen where both thumbs can
comfortably reach.

## Input

The screen is split into two invisible tap zones:

- **Left half** → plant the left foot.
- **Right half** → plant the right foot.

Feet must alternate strictly: L-R-L-R-… the whole way down. Each step on
the staircase has a small "footprint ghost" (L or R) that scrolls down
toward a **target line** near the bottom of the screen. The player taps
the matching side when the ghost crosses the line.

Timing windows (tuned later):

- Perfect: ±60 ms — small cream flash, no penalty.
- Good: ±150 ms — normal descent.
- Outside window, or wrong side → **stumble**.

## Success

Reach the bottom step. Bar ambience swells, the door at the bottom opens,
scene transitions to the pub floor.

## Failure / stumble

A stumble does not instantly end the run — it slows the character and
drains a **composure bar** shown as a thin horizontal strip at the top.
3 stumbles → fall, fade to black, restart from the top with the same
staircase seed (no progress loss, just a retry).

## Difficulty curve

A single staircase of ~20 steps. Tempo is constant for the tutorial:
~1 step per 500 ms. Difficulty comes only from maintaining L-R alternation
under steady rhythm.

## Audio

- Muffled bar music (bass + crowd murmur) low-passed heavily at the top,
  gradually opening up toward the bottom as the door nears.
- Footstep sample per tap, slightly different for L and R.
- Stumble: short wooden creak + muted crowd "oh".
- Success: door swings open, low-pass lifts, ambience becomes full.

## Art notes

Pixel art, following the global art direction in `CLAUDE.md`.

- Staircase tiles: 32×32, wood planks with worn edges; two variants for
  visual rhythm.
- Walls: brick on one side, dark wood panel on the other — references
  in `reference/photo_2025-12-05_*.jpg` and
  `reference/photo_2026-01-18_*.jpg`.
- Character: 48×48, two frames per foot-plant (contact + weight-shift),
  plus a stumble frame. Same sprite used for both Guest and Bartender in
  this first quest; role-specific outfits can be added later.
