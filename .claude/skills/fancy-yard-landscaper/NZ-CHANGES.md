# NZ adaptation notes

Upstream: https://github.com/curiositech/some_claude_skills (`.claude/skills/fancy-yard-landscaper`).
The first commit on this branch is the unmodified upstream copy. `git diff` against it shows every change.

## What changed

- **Language and units**: NZ English, metric, NZ$, macrons for te reo Māori names.
- **Seasons**: southern hemisphere calendar. Autumn (March to May) is the main planting season.
- **Aspect**: north-facing is the sunny side (the upstream text assumed the northern hemisphere).
- **Climate**: US hardiness zones replaced with NZ regions, frost, wind and salt exposure.
- **Plants**: NZ natives (kōhūhū, tōtara, kāpuka, taupata, karo, akeake, lemonwood, karamū, harakeke) and exotics common in NZ. Removed US-specific material (Eastern Red Cedar, Norway Spruce, hybrid poplar, Nellie Stevens holly, etc.).
- **Pests**: deer, bagworm and snow damage (US-focused) replaced with possums, rabbits, myrtle rust, kauri dieback and phytophthora. Arborvitae guidance rewritten to reflect that it is less common in NZ.
- **House styles**: villa, bungalow, Art Deco, state house, modern, brick-and-tile, lifestyle block.
- **Rules**: new `references/nz-rules-and-biosecurity.md` (council, boundary, services, NPPA, myrtle rust, kauri dieback, safety).
- **Permissions**: `Bash` removed from `allowed-tools`. The skill contains no scripts and does not need shell access.
- **Prices**: US dollar price bands removed. The skill now tells the user to get local quotes.

## Not verified

The author of this adaptation did not check the following against primary sources. Verify before relying on them:

- Species growth rates, sizes and frost tolerance (indicative ranges only)
- Building consent thresholds (fences, retaining walls, decks)
- Fencing Act 1978 and Property Law Act 2007 details
- Current NPPA list and regional pest plans
- Phone numbers (MPI, National Poisons Centre) and website addresses

## Updating

`skills-lock.json` records the upstream hash. Running `npx skills update` may overwrite these NZ changes with the upstream version. Keep a copy or remove the lock entry if you want to keep this version.
