# Changelog

## Unreleased/To-do
- "Flip" defeated cards
- Show blood splatter on card on actor/token damage
- Set status effects from the combatant card
- Drag/drop reordering
- Drag token/actor into Carousel
- Drag card out of Carousel to remove

## Known Issues
- Encounters on non-active scenes do not appear in the Carousel
- Tested exclusively with `dnd5e` system -- other systems may encounter errors at this time
- Initiative icon assumes `d20`-based initiative
- Some strings are still not setup for translation

## [0.1.3] - 2020-10-12
### Added
- You can now End a Combat Encounter by clicking the Encounter icon (fist) on the right side of the Carousel

### Changed
- The Active Turn in the current Combat is now indicated by a red bookmark icon at the top of the card (the orange border around card has been removed)
- Interacting with the Combatant Card has changed:
- - Clicking on the card now `selects` / `controls` the matching token
- - Right-clicking on the card now sets that Combatant as the Active Turn in Combat
- - Double-clicking on the card still opens the Actor sheet

### Fixed
- Players can no longer reroll initiative
- Players can no longer double-click a Combatant Card to open an Actor sheet which they do not own
- The Combatant Control buttons (which appear when you hover over a Combatant name) are now brighter
- Combat Tracker Indicators (Defeated, and Visibility) now have a background so they are easier to see

## [0.1.2] - 2020-09-29
### Fixed
- Players can now roll initiative again
- Players can no longer change the active combatant by clicking a Combatant Card

## [0.1.1] - 2020-09-29
### Added
- Translations:
- - Español (Spanish) by Viriato139ac#0342
- - Français (French) by Meï#4242
- - 日本語 (Japanese) by Brother Sharp#6921
- - português do Brasil (Brazilian Portuguese) by Miriadis#9152
- Additional translation strings

### Changed
- The Read Me link in the About (in Module Settings) now links to the Public Wiki instead
- Patron list is now generated programmatically using the Patreon API

### Fixed
- Removed the ability for players to control combat via the Combat Controls (Next/Previous Turn/Round) -- players can still advance the Turn on their Turn
- Removed the ability for players to reroll initiative -- a future update will provide a setting so GMs can toggle this behaviour if they want

## [0.1.0] - 2020-09-26
### Added
- Initial release

### Changed
### Fixed