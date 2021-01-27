# Changelog

## Known Issues
- ~~Encounters on non-active scenes do not appear in the Carousel~~
- Newly Added/Removed Combatants on non-active scenes do not appear in the Carousel
- Tested exclusively with `dnd5e` system -- other systems may encounter errors at this time
- Initiative icon assumes `d20`-based initiative
- Some strings are still not setup for translation

## [0.2.0] - 2021-01-24
- The Carousel can now be moved ⬆↗⬅↘↖⬇➡↙: 
- - Use the `Drag Handle` ≡ to move the Carousel
- - Carousel position is saved when you finish dragging
- - The Carousel will automatically expand to the right based on the number of Combatants in the combat.
- - ...but the Carousel will automatically resize itself when it butts up against the Sidebar (expanded or collapsed). Just imagine it's magnetised or something.
- Oh and you can also change the overall size of the Carousel! (choose from 4 preset sizes: `Large`, `Medium`, `Small`, `Extra Small`)
- - Note: the HUD elements do not resize.
- The **Combat Carousel** button has been moved to the Scene Controls. The button has the following magic powers:
- - 🖱 Left-click to shown/hide the Carousel
- - 🖱 Right-click to reset the Carousel position on the screen (top-left corner by default)
- - The icons for Carousel state remain the same: unlit empty Carousel for No Combat, lit empty Carousel for Combat with no Combatants, lit full Carousel for Combat with Combatants
- - The `Collapse Indicator` triangle 🔼 shows the state of the Carousel: down for hidden, up for shown
- GMs can control the Encounter directly from the Carousel (ie. Roll, and Reset Initiative, Create and Delete Encounters)
- The Carousel should correctly detect the combat (if any) on the currently viewed Scene
- The `Active Combatant` indicator is now an orange-red triangle 🔻 on the bottom of the `Combatant Card`
- The `Combatant Card` image is now globally configurable. Choose from: `Actor`, `Token Actor`, or `Token`
- - The image is now resized to fit the vertical space of the container
- `Pagination Dots` now show below the Carousel and allow you to jump to a specific `Combatant Card` without changing the `Active Combatant`
- 👉Interacting with the Carousel has changed:
- - The Carousel `HUD` is hidden until the mouse enters its space.
- - 🖱 Left-click the `Encounter Controls` to perform the actions therein (eg. Roll All NPCs)
- - 🖱 Left-click and drag the `Drag Handle` ≡ to move the Carousel
- - 🖱 Right-click the `Drag Handle` ≡ to reset the Carousel position
- 👉Interacting with the Combatant Cards has also changed:
- - 🖱 Left-click to control the token and pan the canvas to it
- - `CTRL` + 🖱 Left-click to change the Active Combatant
- 👉Interacting with the Initiative has changed:
- - 🖱 Left-click the Initiative icon to roll initiative
- - 🖱 Left-click the Initiative Value to edit it
- - 🖱 Right-click the Initiative Value to reset it
- The Overlay Config is now available in the Module Settings
- The `Resource Bar` Attribute and Name are now configurable! The default is `attributes.hp`, `HP`
- A range of configuration/permission options have been added to the Module Settings, including:
- - Overlay Visibility and Permission
- - Initiative Visibility and Permission
- - Resource Bar Visibility, Attribute, Name, and Permission
- Hidden Combatants no longer cause the incorrect Combatant Card to be shown as Active
- Changelog format switched to a more conversational, feature-based style

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