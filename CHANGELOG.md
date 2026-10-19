# Ashen Oath changelog

Short player-facing notes for every published updater version. Earlier development is summarized in the initial published baseline. Repeated publications under one version are combined into one entry.

[GitHub Releases](https://github.com/teodorpenevski/ashen-oath-updates/releases)

## 1.0.17

Originally published: 2026-10-19.

- Fixed Silly Punchies' wake-up gesture looping after sleeping by making that animation play once.
- Allowed Epic Fight to lock onto Target Dummies while retaining exclusions for players, pets and passive animals.
- Protected other players' owned pets and mounts from player-attributed melee, arrows, spells, owned companions and the pack's poison damage, including when the pet owner is offline.
- Preserved all 225 saved keybindings and the personal Punchy profile; verified the fixes in native server and client checks.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.17) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.16...v1.0.17)

## 1.0.16

Originally published: 2026-10-18.

- Buffed 57 Iron's spell damage profiles, with larger boosts for Warrior, Rogue and Ranger and smaller base changes for Mage.
- At 100% spell power, level-5 Stomp increases from 16 to 80 damage for non-Mage classes (32 for Mage/base); level-5 Fireball increases from 30 to 75 (45 for Mage/base).
- Synchronized spell damage tooltips with actual class-dependent damage. Kept normal spell-power scaling and existing utility, mana, cooldown and enemy-spell behavior.
- Fixed Agony attacks forcibly dropping camera lock; manual unlock and normal invalid-target release remain available.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.16) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.15...v1.0.16)

## 1.0.15

Originally published: 2026-10-18.

- Replaced Shield Hider with Passive Shield: offhand shields are hidden while idle and shown during normal or Epic Fight blocking, including Punchy rendering.
- Kept passive shield damage reduction disabled so hiding a shield does not grant free protection.
- Corrected Agony's left-hand item transforms and extended Colossal Grip support to its own weapon preset.
- Fixed an offhand greatsword disappearing when Agony is held in the main hand; retained Agony's solo moveset.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.15) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.14...v1.0.15)

## 1.0.14

Originally published: 2026-10-18.

- Added startup restoration of saved native keybindings after mod key registration, preserving configured modifiers and personal settings.
- Changed Glass Juggernaut's armor penalty to -35%.
- Raised ordinary hostile mob health to 4x and Apotheosis-enhanced rare health to 2x its already-enhanced value, without repeatedly stacking the multiplier. Bosses, pets, passive animals and training dummies are excluded.
- Added left-mouse dragging to pan the passive tree while retaining node clicks, right-click refunds and middle-mouse panning.
- Added offhand shield hiding; 1.0.15 refines it to show the shield while blocking.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.14) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.13...v1.0.14)

## 1.0.13

Originally published: 2026-10-18.

- Fixed the Advanced Compass compatibility Mixin that caused a mod-loading failure on client startup.
- Adjusted the hook to the installed mod's native class-initialization boundary; the existing compass preferences and bindings are retained.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.13) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.12...v1.0.13)

## 1.0.12

Originally published: 2026-10-18.

- Reworked Vanguard around Living Fortress, Reprisal, Juggernaut and Stand Together.
- Living Fortress grants +8 armor, +4 toughness and 20% knockback resistance. Reprisal stores up to five guard stacks for +20% damage and 3% maximum-health healing per consumed stack.
- Juggernaut empowers a melee hit after one second of moving sprint. Stand Together grants nearby party members 15% damage reduction and heals 10% maximum health per second; multiple auras do not stack.
- Extended unlimited ordinary ammunition to crossbows. Added a configurable ammunition-selection key for finite special arrows; retained native Multishot/Infinity handling.
- Removed overlapping Sophisticated storage sorting controls while keeping Inventory Profiles Next controls.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.12) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.11...v1.0.12)

## 1.0.11

Originally published: 2026-10-18.

- Reduced sprinting and sprint-jumping hunger exhaustion to 25% of the previous cost.
- Added FTB teammate position sharing to Xaero's tracked-player renderer, keeping online teammates visible at the minimap edge beyond entity-loading range.
- Added a compact Advanced Compass ribbon with Xaero waypoints, distances and coordinates, and left its duplicate waypoint-menu defaults unbound.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.11) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.10...v1.0.11)

## 1.0.10

Originally published: 2026-10-18.

- Phantom Ascent's extra airborne jump now works in mining mode as well as combat mode when the skill is equipped.
- Retained the configured Jump key, one-extra-jump limit, landing reset and existing resource/fall-protection behavior.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.10) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.9...v1.0.10)

## 1.0.9

Originally published: 2026-10-18.

- Removed Spartan Weaponry's hidden two-handed Mining Fatigue penalty, including when mining with a pickaxe while holding a two-handed weapon offhand.
- Elder Guardian and other externally applied Mining Fatigue effects remain functional. The separate weapon damage penalty and Colossal Grip exemption retain their previous rules.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.9) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.8...v1.0.9)

## 1.0.8

Originally published: 2026-10-18.

- Bows can fire ordinary arrows without an ammo supply; special arrows still use real ammunition. Crossbow support is added later in 1.0.12.
- Restored the standard crosshair instead of the custom arrow-shaped crosshair.
- Added a craftable saddle recipe using five leather and two iron ingots.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.8) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.7...v1.0.8)

## 1.0.7

Originally published: 2026-10-18.

- Weapons no longer automatically force Epic Fight combat mode. Use the configured combat-mode key to switch while holding a weapon.
- Non-weapons still use mining mode, so switching to blocks, tools and ordinary items exits combat mode.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.7) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.6...v1.0.7)

## 1.0.6

Originally published: 2026-10-18.

- Expanded and reorganized the other tutorials and all five story chapters. The questbook now contains 464 quests across 14 chapters while preserving existing quest identities and progress.
- Added the Bosses: Hunting Ledger chapter, covering 13 major bosses and 21 additional miniboss/elite categories from the installed pack.
- Added first-victory, veteran and repeatable farming contracts, with direct XP and practical rewards; added an optional major-boss grand tour.
- Expanded Apotheosis, Thermal, Refined Storage, base, backpack, combat and exploration instruction, and fixed missing trophy/proof item textures.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.6) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.5...v1.0.6)

## 1.0.5

Originally published: 2026-10-17.

- Rearranged the magic chapter into a compact main progression with nearby branches for schools, inks, armor, spellbooks and optional encounters.
- Removed 16 redundant dependency arrows while preserving all 71 quest identities, rewards and equivalent unlock conditions.
- Reduced the layout bounding area by 77.8% and dependency crossings from 237 to 3; added distinct shapes and sizes for milestones and objectives.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.5) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.4...v1.0.5)

## 1.0.4

Originally published: 2026-10-17.

- Reworked the 71-quest Iron's magic chapter into five stages using the installed version's real items, recipes and mechanics, from first spells through the Dead King.
- Added Nature's Compass and optional navigation lessons for Nature's Compass and the already-installed Explorer's Compass.
- Replaced experience-bottle quest rewards with increased direct XP rewards that auto-claim. The questbook now contains 217 quests.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.4) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.3...v1.0.4)

## 1.0.3

Originally published: 2026-10-17.

- Removed the 18 empty preparation nodes before main-tree majors. The 12 major abilities connect directly to their preceding stat nodes and each cost one point.
- Added allocation migration that removes only retired nodes, refunds their points once, and keeps other learned passives.
- Disabled Mouse Tweaks wheel transfer so Inventory Profiles Next handles scrolling without moving twice as many items. Drag behavior is retained.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.3) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.2...v1.0.3)

## 1.0.2

Originally published: 2026-10-17.

- Added Open Parties and Claims with Xaero map integration, team claims and chunk force-loading. Uses the existing FTB Teams party system rather than FTB Chunks.
- Added Crafting Station with a persistent crafting grid and Effortless Building. Server-side Double Doors opens matching paired doors together.
- Quest item objectives detect inventory ownership without consuming the requested items; existing quest identities and progress are retained.
- Limited Epic Fight manual/automatic lock-on to hostile targets, excluding players and pets.
- Fixed update setup handling of the published feed on Windows PowerShell and included the updated class-kit migration and compatibility data.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.2) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.1...v1.0.2)

## 1.0.1

Originally published: 2026-10-17.

This is the first retained Git updater snapshot. Earlier unversioned development is included in this baseline rather than assigned invented release dates.

- First published client update feed, with launch-time updates that preserve personal keybinds, Punchy profiles and client settings. Includes fixes for exact file hashes across Windows and GitHub.
- Initial baseline includes Warrior, Mage, Ranger and Rogue class selection, once-per-class starter kits, subclasses, a shared passive tree, batched allocation and connected-node refunds.
- Includes the existing major-ability reworks, level-10 core spell unlocks, Warrior damage improvements, stacking poison and Catalytic Strike, compact buffs/cooldowns, target debuffs and colored damage numbers.
- Includes dual two-handed weapon support through Colossal Grip, offhand rendering fixes, weapon sheathing and animation, hold-to-attack, and a craftable DPS/total-damage dummy.
- Includes Punchy with Epic Fight compatibility and selected animation packs, weapon expansions, 3D item visuals, camera/lock-on improvements, inventory controls, AppleSkin and always-visible mana.
- Includes the five story chapters and optional tutorials: 214 quests across 13 chapters, including the detailed 71-quest Iron's magic progression and Graybeard Staff Mage starter kit.
- Includes the accumulated connection, skill-data synchronization, poison display, food-model, key-label and resource-pack fixes shipped before the public updater history began.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.1)
