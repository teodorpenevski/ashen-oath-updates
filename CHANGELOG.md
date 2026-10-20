# Ashen Oath changelog

Short player-facing notes for every published updater version. Earlier development is summarized in the initial published baseline. Repeated publications under one version are combined into one entry.

[GitHub Releases](https://github.com/teodorpenevski/ashen-oath-updates/releases)

## 1.0.23

- Wand attacks now flow through three distinct arm and body movements, followed by an 800 ms wind-up after the third shot. Individual shot damage and the stronger third hit remain unchanged.
- Quick wand bolts register individually instead of being swallowed by enemy damage-immunity frames. Spell Power, elemental scaling and finite special charges still apply.
- Elemental Vortex now charges after six landed normal wand shots instead of recharging over time. Firing no normal attack for three seconds resets the counter; casting the special consumes the charge. The Epic Fight icon shows hit progress.
- Fixed the vortex-effect class-loading crash after a local update. Updates now require stopped targets before replacing mod JARs; controls, Punchy profiles and player progress are preserved.
- Pack owners can now run PUBLISH-VERSION.cmd to build, test and publish one grouped update with the latest draft notes, without a Codex session.
- Server owners: stop the server and apply this version's matching portable server ZIP with UPDATE-SERVER.cmd. Clients receive the published update at launch.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.23) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.22...v1.0.23)

## 1.0.22

- Wands now chain three casts with forehand, backhand and forward-snap animations. The third shot deals 150% damage; bolts scale with Spell Power and the selected element's school power.
- Wands support Epic Fight combat mode: Left Mouse fires normal selected ammunition, and Right Mouse casts Elemental Vortex every 10 seconds. The vortex pulls enemies within 4 blocks and deals 200% selected-shot damage over 3 seconds. Basic bolts remain unlimited; elemental charges are consumed by both normal and special attacks.
- Elemental Vortex has a dark core and colored spiral effects for arcane, fire, frost and storm. Own-projectile trails no longer appear inside the first-person camera. Storm Charges use a softer electrical zap.
- The wand special uses Epic Fight's native skill icon and radial cooldown display. Ammunition counts have an outlined tab above the icon, and charge tooltips show damage and finisher damage.
- Wands can roll suitable Apotheosis affixes and appear in affix loot. Iron's magic gems, including Perfect Storm Gem, now work in compatible staff and wand sockets.
- Corpse Transfer Items restores equipped Curios, including spellbooks and backpacks, to valid empty slots. Occupied or unavailable slots use the normal inventory transfer instead.
- Fixed Epic Fight's custom armor conversion errors so wizard outfits and pointed hats keep their custom models in combat. Joining a world now starts in first person; camera toggles remain available afterward.
- Portable servers include UPDATE-SERVER.cmd, with package verification, backups, preservation of world/settings and rollback on failure.
- Restart your client to receive this grouped update. Server owners should stop the server and apply the matching 1.0.22 server ZIP through UPDATE-SERVER.cmd. Existing controls, Punchy profiles and player progress are preserved.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.22) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.21...v1.0.22)

## 1.0.21

- The free central Awakening node now grants +3 Attack Damage, +2 Maximum Health and +5% Movement Speed. Existing builds migrate automatically without losing allocated skills or points.
- Rebalanced the main class trees: reduced Warrior's accumulated damage bonuses and Berserk to +10% damage while keeping its +15% attack speed; increased small Mage spell-power bonuses and several weaker spells.
- Bows and crossbows fire instantly, with attack-speed-based recovery shared across hands and weapon swaps. Draw Speed is now Bow Attack Speed; Ranger also gains modest flat bow damage. Basic ammo remains unlimited and selected special ammo is consumed.
- Ranger's level-10 core spell is now Poison Arrow I. Existing Rangers receive the replacement once without losing their old books. Rogue keeps Poison Splash.
- Added craftable Apprentice, Runic and Archmage Wands with unlimited arcane bolts and selectable Ember, Frost and Storm charges. Powered shots consume charges without mana; wands lose one durability per four successful hits. The magic tutorial explains wandcraft.
- Fixed dual axes and mixed axe/sword/dagger pairs showing and attacking with both hands. Berserk's buff indicator correctly follows equipped melee weapons.
- Made the ammo badge and cycling panel smaller, restored clipped ammo names/icons and added padding to buff cards.
- Restart the client to download this grouped update; the server must run the matching pack. Existing keybinds and Punchy profiles are preserved.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.21) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.20...v1.0.21)

## 1.0.20

- Added a compact selected-ammunition icon to the right of the hotbar while holding a bow or crossbow. It shows the real remaining count for special ammo, or ∞ for unlimited basic ammo.
- Cycling ammunition now shows a brief animated vertical selector with item icons, distinct potion-arrow names, counts and your current keybind. It fades away after switching; crossbows label the selection for the next load.
- Berserk now grants its +12% attack damage and +15% attack speed when holding any recognised melee weapon in either hand, including Agony and other modded weapons. Mining tools, ranged weapons and shields do not activate it. Updated its tooltip.
- Restart both client and server to activate the update. Personal keybinds and Punchy settings are preserved.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.20) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.19...v1.0.20)

## 1.0.19

- Fixed mount exploration tracking for connected players and removed an ambiguous FTB quest API call that caused server script errors.
- Added a crafting recipe for the **Mythical Mounts** guide: one book and one leather, in any crafting grid. The mount quest now names the book and explains how to obtain it.
- Keeps the five new biomes, 14 mounts and exploration → boss → flight progression from 1.0.18. Restart both sides after updating; existing controls and Punchy settings are preserved.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.19) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.18...v1.0.19)

## 1.0.18

- Added a light Windswept expansion: Chestnut Forest, Snowy Chestnut Forest, Pine Barrens, Snowy Pine Barrens and Tundra, at reduced generation weights. New biomes appear in unexplored chunks; existing terrain and builds are retained.
- Added Mythic Mounts Forge with 14 ground, flying and aquatic creatures, including dire wolves, riding lizards, griffons, dragons and giant moths. Spawn density is reduced.
- Added eight optional mount quests. FTB teams unlock ground/aquatic riding by visiting three Overworld biomes and using a crafted Earthbound Oath, then earn flying mounts through a major-boss victory and a crafted Skybound Oath.
- Added server-side riding checks, persistent team unlocks and bonding recipes; another player's owned mounts retain pet damage protection.
- Update both client and server and restart to load the new mods. Existing keybinds and personal Punchy profiles are preserved.

[Release page](https://github.com/teodorpenevski/ashen-oath-updates/releases/tag/v1.0.18) | [Full changes](https://github.com/teodorpenevski/ashen-oath-updates/compare/v1.0.17...v1.0.18)

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
