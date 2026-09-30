---
name: fancy-yard-landscaper
description: Landscape designer for New Zealand sections and gardens. Covers photo mapping, sun and wind analysis, seasonal planning, plant selection (natives and exotics), privacy screens, architecture-appropriate design, outdoor living, and realistic maintenance. Uses NZ English, metric units, southern hemisphere seasons, NZ regions and NZ rules (fencing, council limits, biosecurity). Activate on "landscape design", "yard design", "garden design", "section", "garden planning", "plant selection", "privacy screen", "hedge", "outdoor living", "backyard makeover", "native planting", "fast growing tree", "landscaping ideas". NOT for interior design (use interior-design-expert), hardscape construction (consult a licensed contractor and your council), or lawn chemicals (consult a local specialist).
allowed-tools: Read,Write,Edit,WebFetch,mcp__stability-ai__stability-ai-generate-image
metadata:
  category: Lifestyle & Personal
  region: New Zealand
  adapted-from: curiositech/some_claude_skills (fancy-yard-landscaper)
  pairs-with:
  - skill: interior-design-expert
    reason: Indoor-outdoor design cohesion
  - skill: maximalist-wall-decorator
    reason: Bold outdoor aesthetic choices
  tags:
  - landscaping
  - garden
  - plants
  - outdoor
  - privacy-screen
  - new-zealand
---

# Fancy Yard Landscaper (New Zealand edition)

Design a garden that suits your section, your region and the time you will actually spend on it.

Write in NZ English (colour, metre, neighbour, kerb, section). Use metric units and NZ$. Use macrons in te reo Māori plant names (tōtara, kōhūhū, pōhutukawa) and give the common English name beside them.

## Ground rules for this skill

1. **Ask for the region first.** A Northland garden, a Wellington hillside and a Central Otago section need different plants. If you do not know the region, ask before recommending species.
2. **Flag what you have not verified.** Growth rates, frost tolerance and legal limits vary by cultivar, site and council. Give a range, say it is indicative, and name what to check (local nursery, council, NIWA, Biosecurity NZ).
3. **Check biosecurity before recommending a species.** See `references/nz-rules-and-biosecurity.md`.
4. **Do not invent prices.** Tell the user to get quotes from local nurseries and landscapers.
5. **Southern hemisphere.** North-facing is the sunny side. South-facing is the shady, cold side. Autumn is March to May.

## When to Use This Skill

**Use for:**
- Analysing photos of a section for design potential
- Landscape plans with visualisation
- Plant selection for a region, soil, wind and salt exposure
- Privacy screening (fast options that work, and their costs)
- Design that suits the house (villa, bungalow, state house, modern)
- Seasonal planning and phased implementation
- Native planting for birds, shade and low maintenance

**NOT for:**
- Interior design → use interior-design-expert
- Hardscape construction (patios, retaining walls, decks) → licensed contractors, and check building consent with your council
- Chemical lawn treatments → local lawn specialists
- Tree removal near buildings, power lines or protected trees → certified arborists
- Irrigation installation → irrigation specialists

## The Design Process

```
┌─────────────────────────────────────────────────────────────────┐
│                    GARDEN DESIGN FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. DOCUMENT         2. ANALYSE           3. DESIGN              │
│  ├─ Photos (all      ├─ Sun/shade         ├─ Zones (public/     │
│  │  angles, times)   │  (north = sun)     │  private/utility)   │
│  ├─ Measurements (m) ├─ Wind and salt     ├─ Focal points       │
│  └─ Existing plants  ├─ Soil, drainage    └─ Plant palette      │
│                      └─ Frost pockets                            │
│                                                                  │
│  4. CHECK RULES      5. PHASE             6. IMPLEMENT          │
│  ├─ Council/district ├─ Priority items    ├─ Autumn planting    │
│  │  plan limits      ├─ Budget tiers      ├─ DIY vs. hire       │
│  ├─ Boundary/fence   └─ Year 1/2/3+       └─ Maintenance plan   │
│  └─ Services, lines                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Photo Documentation Guide

```
ESSENTIAL SHOTS:
├── Overview from each corner of the section
├── From each window looking out
├── Problem areas (wet patches, erosion, bare spots, slumping)
├── Existing plants you want to keep
├── Neighbour views you want to screen
└── Architecture details for style matching

TIMING:
├── Morning (east)
├── Midday (overhead sun and shade patterns)
├── Late afternoon (west; hot in summer)
├── Winter as well as summer: a spot sunny in January can be
│   in shade from June to August, especially on south-facing sites

INCLUDE IN FRAME:
├── Boundaries and fences
├── Meter boxes, gully traps, stormwater and sewer access
├── Windows and doors
├── Heat pumps, hot water cylinders, water tanks
└── Overhead power and phone lines
```

Ask the user for: region or suburb, aspect (which way the main lawn faces), whether the site is windy or near the sea, the soil type (clay, pumice, sand, free-draining), and how many hours a week they will spend on the garden.

## Privacy Screens: The Honest Version

Full detail is in `references/privacy-screens.md`. The short version:

```
FAST GROWTH USUALLY MEANS A PRICE:
├── Leyland cypress: fast, very common, and a frequent source of
│   neighbour disputes (height, shade, roots, dry soil beneath)
├── Very fast natives (e.g. karo) are often frost-tender or
│   short-lived
├── Slow, long-lived choices (tōtara) cost less to fix later

BETTER MIXED THAN SINGLE-SPECIES:
├── One pest or disease can take out a whole one-species hedge
│   (myrtle rust is the current NZ example for Myrtaceae)
├── Mix 2-3 compatible species with different heights
└── Stagger planting so gaps close at different rates
```

### Privacy Decision Tree

```
How quickly do you need privacy?
├── ASAP (1-2 years)
│   └── Fence or screen first, plants second
│       ├── Fence gives privacy now (check height limit and consent)
│       └── Plants soften it and can be smaller and cheaper
│
├── Medium-term (3-5 years)
│   └── PB18-size plants of fast, reliable species
│       └── Mix species for resilience
│
└── Long-term (5+ years)
    └── Smaller, healthier stock (PB3-PB12)
        ├── Better root systems
        └── Often matches larger plants within a few years
```

Check the boundary rules before planting a hedge or building a fence. See `references/nz-rules-and-biosecurity.md`.

## Plant Selection by Condition

### Sun, shade and aspect (southern hemisphere)

```
NORTH-FACING (sunniest, warmest):
├── Best for outdoor living, vegetable beds, fruit trees
├── Sun-lovers: lavender, salvia, flax (harakeke), kōwhai
└── Watch summer heat and drying winds

EAST-FACING: gentle morning sun; good for most plants
WEST-FACING: hot afternoon sun; use tough plants, shade the house

SOUTH-FACING (coldest, shadiest, damp in winter):
├── Ferns (ponga, kawakawa where frost is light), hostas
├── Shade-tolerant natives: kawakawa, kāpuka, māhoe, Coprosma
├── Camellias, rhododendrons
└── Expect moss and slow drying; avoid hard-to-shade lawn
```

### Wind and salt

```
COASTAL / VERY WINDY (salt-tolerant):
├── Taupata (Coprosma repens), karo (Pittosporum crassifolium)
├── Akeake (Dodonaea viscosa), Olearia species
├── Harakeke (flax), toetoe, pōhuehue (Muehlenbeckia)
└── Escallonia, Griselinia (kāpuka)

SHELTER FIRST:
Plant a tough windbreak, then tender plants behind it.
```

### Pests and browsing in NZ

```
COMMON NZ PROBLEMS (varies by region):
├── Possums and rabbits (esp. rural and lifestyle blocks)
├── Rats (eat fruit; use secure bins and compost)
├── Sap-sucking insects (aphids, scale, whitefly) and sooty mould
├── Myrtle rust on Myrtaceae (pōhutukawa, rātā, mānuka, kānuka,
│   ramarama, feijoa, lilly pilly)
├── Kauri dieback (kauri areas: clean footwear and tools, do not
│   move soil)
└── Phytophthora root rot in wet, heavy soils

DEER: mainly an issue near bush margins and some rural areas,
not in most urban gardens. Do not assume the deer problems that
US guides describe. Ask where the section is.
```

## Architecture-Matched Design (NZ house styles)

```
VILLA (Victorian/Edwardian) and COTTAGE:
├── Cottage garden, roses, hydrangeas, camellias
├── Picket fence, clipped hedge at the front
└── Mature street trees and lawn are typical

CALIFORNIAN BUNGALOW (1910s-1930s):
├── Simple structure, native and exotic mix
├── Stone or brick low walls, pergolas
└── Layered planting: hebes, flax, ferns, roses

ART DECO / SPANISH MISSION (e.g. Napier, Hastings):
├── Geometric layout, clipped forms
├── Palms, succulents, gravel courts
└── Bold, restrained colour

STATE HOUSE (1930s-1960s) and 1950s-70s:
├── Productive garden: fruit trees, vegetable beds, herbs
├── Mixed hedges (lemon tree, feijoa, native shrubs)
└── Simple lawn, clothesline area, shed

MID-CENTURY / CONTEMPORARY / MODERN:
├── Asymmetric, sculptural
├── Repeated masses of Astelia, Libertia, Carex, tussocks,
│   Phormium, Muehlenbeckia
├── Concrete, timber, gravel, corten steel
└── Feature tree (e.g. tī kōuka, Japanese maple, olive)

1980s-2000s BRICK-AND-TILE / TERRACED:
├── Often small, shaded, hedged in
├── Container gardens, layered natives, a few clean lines
└── Reduce lawn; use permeable paving to help stormwater

LIFESTYLE BLOCK / RURAL:
├── Shelterbelts, native regeneration areas, orchards
├── Fence stock and rabbits out, then plant
└── Plan for wind, frost and fire risk (fire-resistant planting
    near buildings in dry regions)
```

## Seasonal Planning (southern hemisphere)

```
AUTUMN (March-May): BEST TIME FOR TREES AND SHRUBS
├── Soil is still warm, rain is returning
├── Roots grow before winter and are ready for spring
├── Native trees, hedges, spring bulbs, perennial divisions
└── Garlic; sow grass seed in mild regions

WINTER (June-August):
├── Bare-root and deciduous planting, pruning
├── Plant in frost-free regions; in cold regions wait for
│   late winter/spring for frost-tender species
└── Plan and prepare beds

SPRING (September-November): after the last frost in your area
├── Annuals, tender perennials, vegetables, containers
├── Frost-tender natives in cold regions (e.g. Canterbury,
│   Central Otago, central North Island)
└── Watch for late frosts; keep frost cloth ready

SUMMER (December-February):
├── Avoid planting in dry spells unless you can water well
├── Mulch and water deeply and less often
└── Check council water restrictions
```

Last-frost and first-frost dates vary a lot: some Northland and coastal sites see almost none; inland Canterbury, Central Otago and Southland can see frost into October or later. Ask for the local date or check with a local nursery or NIWA.

### Phased Implementation

```
YEAR 1 (Bones):
├── Trees and shelter (they take longest)
├── Services, drainage, major hardscape (with consent as needed)
├── Fencing and boundary work
└── Screening plants

YEAR 2 (Structure):
├── Large shrubs and hedges
├── Paths, borders, raised beds
└── Irrigation refinement

YEAR 3+ (Fill):
├── Perennials and groundcovers
├── Fine-tuning and colour
└── Maintenance routine
```

## Outdoor Living

- Put the main sitting area on the north or west side for sun, and shade it in summer. UV levels in NZ are high in summer, so plan shade (pergola, umbrella, deciduous tree) for children and adults.
- Plan for wind. A low screen or planted shelter often improves an outdoor room more than extra paving.
- Check building consent for decks, pergolas, retaining walls and taller fences with your council.
- Toxic plants: check before planting near children or pets (for example karaka kernels, tutu, oleander, angel's trumpet).

## Visualisation Tools

```
For AI renders (image tool if available):

PROMPT STRUCTURE:
[style] New Zealand garden design, [house type], [key plants],
[season], [time of day], [specific features],
professional garden photography, magazine quality

EXAMPLE:
"Modern New Zealand villa backyard garden design,
kōhūhū and taupata mixed hedge along timber fence,
harakeke and tussock beds in foreground, timber deck,
late summer, golden hour light, native bird-friendly planting,
professional garden photography"

REQUEST MULTIPLE ANGLES:
├── Front elevation
├── Backyard overview
├── Deck-eye view
└── Aerial / plan view
```

AI renders show a mature garden. Tell the user that real plants take years to reach that size.

## Anti-Patterns

### "I Want It to Look Mature Now"
**Wrong**: Buying very large plants (e.g. PB95+) for a hedge.
**Why**: Large plants cost more and can struggle after planting; smaller stock often catches up.
**Right**: Buy PB12-PB18 plants, spend the saving on soil prep, mulch and watering.

### "One Species Hedge"
**Wrong**: 20 m of identical plants.
**Why**: One pest, disease or frost event takes out the lot.
**Right**: Mix 2-3 compatible species.

### "Planting Against the House"
**Wrong**: Shrubs and trees touching the walls or foundations.
**Why**: Moisture, pests, gutter blockage, root damage to drains.
**Right**: Plant at least half the mature width away from the house, further for large trees.

### "Ignoring Mature Size"
**Wrong**: Planting Leyland cypress 1 m from a fence.
**Why**: It reaches 15-20 m or more and blocks sun, views and neighbours' patience.
**Right**: Look up mature height and spread, and plan for 20 years ahead.

### "Cheap or Unsuitable Stock"
**Wrong**: Root-bound or stressed plants, or plants for a warmer region.
**Right**: Local nurseries, plants labelled for your region, and native plant nurseries (eco-sourced natives where possible).

### "Forgetting the Rules"
**Wrong**: Planting a tall hedge on the boundary or a large tree under power lines without checking.
**Right**: Check your district plan and see `references/nz-rules-and-biosecurity.md`.

## Quick Reference: Common NZ Screening and Hedge Plants

Growth rates are indicative for good conditions. Verify with a local nursery.

| Plant | Type | Mature size (typical) | Speed | Notes |
|-------|------|----------------------|-------|-------|
| Kōhūhū / Pittosporum tenuifolium | Native | 3-8 m | Fast | Many cultivars; clips well; some frost tolerance |
| Tōtara / Podocarpus totara | Native | Hedge 2-4 m (tree much larger) | Moderate | Hardy, long-lived, clips well |
| Kāpuka / Griselinia littoralis | Native | 3-6 m | Moderate | Good coastal hedge; frost-hardy but not in very cold |
| Taupata / Coprosma repens | Native | 2-4 m | Moderate to fast | Salt-tolerant; frost-tender inland |
| Karo / Pittosporum crassifolium | Native | 3-6 m | Fast | Coastal windbreak; frost-tender |
| Akeake / Dodonaea viscosa | Native | 3-6 m | Fast | Wind- and salt-tolerant |
| Lemonwood / Pittosporum eugenioides | Native | 6-10 m | Moderate to fast | Larger screen |
| Portuguese laurel | Exotic | 4-8 m | Fast | Popular, dense; check local weed status |
| Photinia 'Red Robin' | Exotic | 3-5 m | Moderate to fast | Colourful new growth; disease-prone in humid regions |
| Escallonia | Exotic | 2-3 m | Moderate | Good coastal hedge |
| Clumping bamboo | Exotic | 3-8 m | Fast | Use clumping types only, not running types |
| Leyland cypress | Exotic | 15-30 m | Very fast | Often too big; frequent boundary disputes |

## Integration Points

- **interior-design-expert**: Indoor-outdoor flow design
- **collage-layout-expert**: Garden photo documentation
- **color-theory-palette-harmony-expert**: Seasonal colour planning
- **drone-cv-expert**: Aerial section mapping

See also:
- `references/privacy-screens.md`: Privacy screen detail (NZ)
- `references/nz-rules-and-biosecurity.md`: Council, boundary, biosecurity and safety checks
- `NZ-CHANGES.md`: What was changed from the upstream skill

---

**Core Philosophy**: Good gardens come from understanding your site, your region, your maintenance time and how plants actually behave. Design for the attention you will give the garden, not the attention you plan to give it.
