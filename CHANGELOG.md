# Changelog

## Known Issues
- Tested (almost) exclusively with `dnd5e` system -- other systems may encounter errors -- please report in Issue Log
- Initiative icon assumes `d20`-based initiative
- Some strings are still not setup for translation
- When multiple combatants are added to combat at the same time, and the `Control Active Combatant` setting is enabled, there will be an error in console. It doesn't appear to prevent any Carousel behaviour.
- Currently only the attribute set as the 1st Token bar is able to be set as the Carousel 1st bar (eg. if your Token config is set to `system.attributes.hp` then this is the only attribute Combat Carousel will work with for now)

## [0.3.1] - 2022-11-12
> This update adds compatibility for Foundry VTT v10.290
- Combat Carousel now supports combatants with no Actor/Token (thanks @BoltsJ! 🎉)
- Changed the behaviour of the Next Round button on Round 0: it now shows a `B` (for "Begin Combat") and correctly calls the matching functionality in Foundry's native tracker
- Fixed some issues with Combatant visibility (thanks @DavidAremaCarretero! 🎉)
- PF2e: the roll Initiative dialog setting is now respected (eg. dialog won't be shown if it is turned off)
- Made reference to `denim075.png` relative in CSS so that it should work with a wider range of server configurations
- Updated the Splide library to v4.1.3. This should fix some minor UI bugs with Splide

## [0.3.0] - 2022-08-12
> This update adds compatibility for Foundry VTT v10

- Updated to respect PF1E's 'Hide From Tokens' setting on buffs. (thanks @Fair-Strides 🎉)
- Allow Carousel updates to occur even when there is no active combatant (thanks @BoltsJ 🎉)
- The Carousel will now refresh when Active Effects are updated
- Ensure user has permission before controlling token when turn changes
- **Japanese** translation updated (thanks @brothersharper 🎉)
- **Spanish** translation updated (thanks @lozalojo ! 🎉)

## [0.2.5] - 2021-12-27
> This update adds compatibility for Foundry VTT V9

- Combat Carousel no longer throws an error if you have a world with no active combat
- Spanish translation update (again, thanks @lozalojo 🎉)
- Nav bar automagically re-expands after combat if the collapse setting is enabled (thanks @sirrus233 🎉)
- Added a setting to open the Carousel on combat creation
- Lengthened the delay for the fly-in effect on cards when the Carousel is opened
- Occasionally the Carousel got confused about its collapsed/expanded state. Should happen less now
- Added additional update properties for actors and tokens that cause the Carousel UI to update
- Carousel now collapses when combat is deleted

## [0.2.3] - 2021-10-11
- Spanish translation updated (thanks @lozalojo ! 🎉)
- Added options for `Limited` Actor permission to settings that support permissions (thanks @SovietVVinter ! 🎉)
- Hovering combatant cards in the carousel hovers the token again 🛸
- Panning for gold is fun, but panning to the active combatant might not be for you, so there's now a setting for that!
- Clicking a combatant card now bubbles that click to the matching token, which provides better support for modules that override the native left click
- Added support for the  🐛`Bug Reporter` module!

## [0.2.2] - 2021-09-03
- The evil incantation causing **hidden combatants** to be revealed has been dispelled. GMs: rest easy knowing your secret invisible party-killing superbeast surprise is no longer spoiled. (thanks @JamzTheMan 🎉)
- For SOME REASON some systems don't use `attributes.hp` for health bars. Weird huh! Combat Carousel works with these systems again. 
- Combatants who don't make the cut can be **deleted** from the Carousel again. (Yikes Roger, you really screwed up that death save...)
- - ...also added a **confirmation dialog** in case you accidentally click the wrong combatant (like anyone except Roger...) 
- Sidebar hidden (eg. by some other module) but the **Carousel doesn't fill the space**? Now it does! (thanks @sPOIDar 🎉)
- **No combat**? No problem (any longer)! (thanks @DavidAremaCarretero 🎉)
- Apparently having every single Active Effect on the Combatant Card wasn't desirable in all situations (PF2e users I see you!). Well now you can **choose which Effects to show** (All, Temporary + Passive, Temporary Only, Passive Only) (thanks @Drental 🎉 for contributing code to this)
- In case you don't like to be in control, there's now a setting to control whether you **control the active Combatant** when it changes
- Updated **Spanish** translation (thanks @lozalojo 🎉)
- Updated **Japanese** translation (thanks `touge` and @brothersharper 🎉)
- Confirmed compatibility with Foundry VTT 0.8.9

## [0.2.1] - 2021-07-06
> This release marks the public beta for the 0.2.x series of Combat Carousel.
- Added compatibility for Foundry VTT v0.8.x
- You can now disable the module even if your GM was nice enough to install and enable it! Simply uncheck the `Enable Combat Carousel` setting to disable its functionality... you monster.
- Added `Combatant` option for **Combat Carousel** card images. This will use the image you've set for combatant--overriding their token image--but defaults to the token image if none exists.
- Carousel is no longer forcefully rendered during combat updates *except* when Combat Carousel is enabled and combat is created
- In case you have second thoughts you now get a prompt (same as core Foundry) when deleting a combat/encounter.
- **Combat Carousel** should be approximately 43.51629% more efficient due to more stringent checks when processing actor/token updates.
- Active/Status Effects are visible again. Yes Gary... for the last time, your character is still petrified!

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