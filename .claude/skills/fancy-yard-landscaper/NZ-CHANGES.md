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

## Verification status

Checked on 2026-09-30. The NZ government sites (building.govt.nz, mpi.govt.nz, legislation.govt.nz) were blocked by this environment's network policy, so only web search summaries were available. Nothing was read from the primary source.

**Confirmed by search summary (secondary):**
- Fences and hoardings up to 2.5 m are exempt from building consent; pool barriers never are.
- Retaining walls up to 1.5 m with no surcharge are exempt.
- District plans may still need resource consent for fences over about 2 m.
- Tree privet and Pittosporum undulatum are on the NPPA.

**Not confirmed. Verify before relying on them:**
- Chinese privet and Japanese honeysuckle on the NPPA (search did not show them)
- Fencing Act 1978 and Property Law Act 2007 details, including section numbers
- Species growth rates, sizes and frost tolerance (indicative only)
- The claim that arborvitae is less common in NZ and has different problems here
- Phone numbers (MPI, National Poisons Centre) and website addresses
- Myrtle rust host list and kauri dieback advice

## Updating

`skills-lock.json` records the upstream hash. Running `npx skills update` may overwrite these NZ changes with the upstream version. Keep a copy or remove the lock entry if you want to keep this version.
