## Modules

<dl>
<dt><a href="#module_about">about</a></dt>
<dd><p>AboutApp module</p>
</dd>
<dt><a href="#module_combat-carousel">combat-carousel</a></dt>
<dd><p>CombatCarousel module</p>
</dd>
<dt><a href="#module_config-form">config-form</a></dt>
<dd><p>CombatCarouselConfig module</p>
</dd>
<dt><a href="#module_config">config</a></dt>
<dd><p>Config module</p>
</dd>
<dt><a href="#module_hooks">hooks</a></dt>
<dd><p>Hooks module</p>
</dd>
<dt><a href="#module_overrides">overrides</a></dt>
<dd><p>Overrides module</p>
</dd>
<dt><a href="#module_settings">settings</a></dt>
<dd><p>Settings module</p>
</dd>
<dt><a href="#module_templates">templates</a></dt>
<dd><p>Templates module</p>
</dd>
<dt><a href="#module_util">util</a></dt>
<dd><p>Util module</p>
</dd>
<dt><a href="#module_init">init</a></dt>
<dd></dd>
</dl>

<a name="module_about"></a>

## about
AboutApp module


* [about](#module_about)
    * [~AboutApp](#module_about..AboutApp) ⇐ <code>FormApplication</code>
        * _instance_
            * [.getData()](#module_about..AboutApp+getData)
            * [.fetchPatrons()](#module_about..AboutApp+fetchPatrons)
        * _static_
            * [.defaultOptions](#module_about..AboutApp.defaultOptions)

<a name="module_about..AboutApp"></a>

### about~AboutApp ⇐ <code>FormApplication</code>
About this module FormApp

**Kind**: inner class of [<code>about</code>](#module_about)  
**Extends**: <code>FormApplication</code>  

* [~AboutApp](#module_about..AboutApp) ⇐ <code>FormApplication</code>
    * _instance_
        * [.getData()](#module_about..AboutApp+getData)
        * [.fetchPatrons()](#module_about..AboutApp+fetchPatrons)
    * _static_
        * [.defaultOptions](#module_about..AboutApp.defaultOptions)

<a name="module_about..AboutApp+getData"></a>

#### aboutApp.getData()
Supplies data to the template

**Kind**: instance method of [<code>AboutApp</code>](#module_about..AboutApp)  
<a name="module_about..AboutApp+fetchPatrons"></a>

#### aboutApp.fetchPatrons()
Fetches a list of Patrons to display on the About page

**Kind**: instance method of [<code>AboutApp</code>](#module_about..AboutApp)  
<a name="module_about..AboutApp.defaultOptions"></a>

#### AboutApp.defaultOptions
Call app default options

**Kind**: static property of [<code>AboutApp</code>](#module_about..AboutApp)  
<a name="module_combat-carousel"></a>

## combat-carousel
CombatCarousel module


* [combat-carousel](#module_combat-carousel)
    * [~CombatCarousel](#module_combat-carousel..CombatCarousel) ⇐ <code>Application</code>
        * _instance_
            * [._render()](#module_combat-carousel..CombatCarousel+_render)
            * [.getData()](#module_combat-carousel..CombatCarousel+getData)
            * [.activateListeners(html)](#module_combat-carousel..CombatCarousel+activateListeners)
            * [._onModuleIconClick(event, html)](#module_combat-carousel..CombatCarousel+_onModuleIconClick)
            * [._onModuleIconContext(event, html)](#module_combat-carousel..CombatCarousel+_onModuleIconContext)
            * [._onRollInitiative(event)](#module_combat-carousel..CombatCarousel+_onRollInitiative)
            * [._onEditInitiative(event, html)](#module_combat-carousel..CombatCarousel+_onEditInitiative)
            * [._onInitiativeChange(event, html)](#module_combat-carousel..CombatCarousel+_onInitiativeChange)
            * [._onInitiativeFocusOut(event, html)](#module_combat-carousel..CombatCarousel+_onInitiativeFocusOut)
            * [._onHoverCard(event)](#module_combat-carousel..CombatCarousel+_onHoverCard)
            * [._onHoverOutCard(event, html)](#module_combat-carousel..CombatCarousel+_onHoverOutCard)
            * [._onCardDoubleClick(event, html)](#module_combat-carousel..CombatCarousel+_onCardDoubleClick)
            * [._onContextMenuCard(event, html)](#module_combat-carousel..CombatCarousel+_onContextMenuCard)
            * [._onCombatantControl(event, html)](#module_combat-carousel..CombatCarousel+_onCombatantControl)
            * [._onCombatControlClick(event, html)](#module_combat-carousel..CombatCarousel+_onCombatControlClick)
            * [._onHoverSplide(event, html)](#module_combat-carousel..CombatCarousel+_onHoverSplide)
            * [._onHoverOutSplide(event, html)](#module_combat-carousel..CombatCarousel+_onHoverOutSplide)
            * [._onClickEncounterIcon(event, html)](#module_combat-carousel..CombatCarousel+_onClickEncounterIcon)
            * [._onEncounterIconContext(event, html)](#module_combat-carousel..CombatCarousel+_onEncounterIconContext)
            * [.safeRender()](#module_combat-carousel..CombatCarousel+safeRender)
            * [.toggleVisibility()](#module_combat-carousel..CombatCarousel+toggleVisibility)
            * [.expand()](#module_combat-carousel..CombatCarousel+expand)
            * [.collapse()](#module_combat-carousel..CombatCarousel+collapse)
            * [.getCombatState(combat)](#module_combat-carousel..CombatCarousel+getCombatState)
            * [.getToggleIconState()](#module_combat-carousel..CombatCarousel+getToggleIconState)
            * [.setToggleIcon(combatState)](#module_combat-carousel..CombatCarousel+setToggleIcon)
            * [.activateCombatantSlide(combatant)](#module_combat-carousel..CombatCarousel+activateCombatantSlide)
            * [.getCombatantSlideIndex(combatant)](#module_combat-carousel..CombatCarousel+getCombatantSlideIndex)
        * _static_
            * [.defaultOptions](#module_combat-carousel..CombatCarousel.defaultOptions)
            * [.prepareTurnData(turn)](#module_combat-carousel..CombatCarousel.prepareTurnData) ⇒ <code>Object</code>
            * [.getOverlayProperties(token, overlaySettings)](#module_combat-carousel..CombatCarousel.getOverlayProperties)

<a name="module_combat-carousel..CombatCarousel"></a>

### combat-carousel~CombatCarousel ⇐ <code>Application</code>
Main app class

**Kind**: inner class of [<code>combat-carousel</code>](#module_combat-carousel)  
**Extends**: <code>Application</code>  

* [~CombatCarousel](#module_combat-carousel..CombatCarousel) ⇐ <code>Application</code>
    * _instance_
        * [._render()](#module_combat-carousel..CombatCarousel+_render)
        * [.getData()](#module_combat-carousel..CombatCarousel+getData)
        * [.activateListeners(html)](#module_combat-carousel..CombatCarousel+activateListeners)
        * [._onModuleIconClick(event, html)](#module_combat-carousel..CombatCarousel+_onModuleIconClick)
        * [._onModuleIconContext(event, html)](#module_combat-carousel..CombatCarousel+_onModuleIconContext)
        * [._onRollInitiative(event)](#module_combat-carousel..CombatCarousel+_onRollInitiative)
        * [._onEditInitiative(event, html)](#module_combat-carousel..CombatCarousel+_onEditInitiative)
        * [._onInitiativeChange(event, html)](#module_combat-carousel..CombatCarousel+_onInitiativeChange)
        * [._onInitiativeFocusOut(event, html)](#module_combat-carousel..CombatCarousel+_onInitiativeFocusOut)
        * [._onHoverCard(event)](#module_combat-carousel..CombatCarousel+_onHoverCard)
        * [._onHoverOutCard(event, html)](#module_combat-carousel..CombatCarousel+_onHoverOutCard)
        * [._onCardDoubleClick(event, html)](#module_combat-carousel..CombatCarousel+_onCardDoubleClick)
        * [._onContextMenuCard(event, html)](#module_combat-carousel..CombatCarousel+_onContextMenuCard)
        * [._onCombatantControl(event, html)](#module_combat-carousel..CombatCarousel+_onCombatantControl)
        * [._onCombatControlClick(event, html)](#module_combat-carousel..CombatCarousel+_onCombatControlClick)
        * [._onHoverSplide(event, html)](#module_combat-carousel..CombatCarousel+_onHoverSplide)
        * [._onHoverOutSplide(event, html)](#module_combat-carousel..CombatCarousel+_onHoverOutSplide)
        * [._onClickEncounterIcon(event, html)](#module_combat-carousel..CombatCarousel+_onClickEncounterIcon)
        * [._onEncounterIconContext(event, html)](#module_combat-carousel..CombatCarousel+_onEncounterIconContext)
        * [.safeRender()](#module_combat-carousel..CombatCarousel+safeRender)
        * [.toggleVisibility()](#module_combat-carousel..CombatCarousel+toggleVisibility)
        * [.expand()](#module_combat-carousel..CombatCarousel+expand)
        * [.collapse()](#module_combat-carousel..CombatCarousel+collapse)
        * [.getCombatState(combat)](#module_combat-carousel..CombatCarousel+getCombatState)
        * [.getToggleIconState()](#module_combat-carousel..CombatCarousel+getToggleIconState)
        * [.setToggleIcon(combatState)](#module_combat-carousel..CombatCarousel+setToggleIcon)
        * [.activateCombatantSlide(combatant)](#module_combat-carousel..CombatCarousel+activateCombatantSlide)
        * [.getCombatantSlideIndex(combatant)](#module_combat-carousel..CombatCarousel+getCombatantSlideIndex)
    * _static_
        * [.defaultOptions](#module_combat-carousel..CombatCarousel.defaultOptions)
        * [.prepareTurnData(turn)](#module_combat-carousel..CombatCarousel.prepareTurnData) ⇒ <code>Object</code>
        * [.getOverlayProperties(token, overlaySettings)](#module_combat-carousel..CombatCarousel.getOverlayProperties)

<a name="module_combat-carousel..CombatCarousel+_render"></a>

#### combatCarousel.\_render()
Render worker

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>Array</code> | Any arguments passed |

<a name="module_combat-carousel..CombatCarousel+getData"></a>

#### combatCarousel.getData()
Get data required for template

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  
<a name="module_combat-carousel..CombatCarousel+activateListeners"></a>

#### combatCarousel.activateListeners(html)
Activate listeners on the DOM element

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param | Type | Description |
| --- | --- | --- |
| html | <code>Object</code> | the app element |

<a name="module_combat-carousel..CombatCarousel+_onModuleIconClick"></a>

#### combatCarousel.\_onModuleIconClick(event, html)
Module Icon click handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  
**Todo**

- [ ] #6 #5 add visual indicator of collapse state on icon


| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onModuleIconContext"></a>

#### combatCarousel.\_onModuleIconContext(event, html)
Module Icon context click handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onRollInitiative"></a>

#### combatCarousel.\_onRollInitiative(event)
Roll Initiative handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param | Type |
| --- | --- |
| event | <code>\*</code> | 

<a name="module_combat-carousel..CombatCarousel+_onEditInitiative"></a>

#### combatCarousel.\_onEditInitiative(event, html)
Edit Initiative handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onInitiativeChange"></a>

#### combatCarousel.\_onInitiativeChange(event, html)
Change Initiative handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onInitiativeFocusOut"></a>

#### combatCarousel.\_onInitiativeFocusOut(event, html)
Focus Out Initiative handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onHoverCard"></a>

#### combatCarousel.\_onHoverCard(event)
Card Hover handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param | Type |
| --- | --- |
| event | <code>\*</code> | 

<a name="module_combat-carousel..CombatCarousel+_onHoverOutCard"></a>

#### combatCarousel.\_onHoverOutCard(event, html)
Card Hover-out handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onCardDoubleClick"></a>

#### combatCarousel.\_onCardDoubleClick(event, html)
Card double click handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onContextMenuCard"></a>

#### combatCarousel.\_onContextMenuCard(event, html)
Handle card right-click

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onCombatantControl"></a>

#### combatCarousel.\_onCombatantControl(event, html)
Combatant Control handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onCombatControlClick"></a>

#### combatCarousel.\_onCombatControlClick(event, html)
Combat Control click handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onHoverSplide"></a>

#### combatCarousel.\_onHoverSplide(event, html)
Hover splide handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onHoverOutSplide"></a>

#### combatCarousel.\_onHoverOutSplide(event, html)
Hover Out splide handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onClickEncounterIcon"></a>

#### combatCarousel.\_onClickEncounterIcon(event, html)
Context Encounter Icon handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+_onEncounterIconContext"></a>

#### combatCarousel.\_onEncounterIconContext(event, html)
Context Encounter Icon handler

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| event | 
| html | 

<a name="module_combat-carousel..CombatCarousel+safeRender"></a>

#### combatCarousel.safeRender()
Safe render for multiple embedded entity updates

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  
<a name="module_combat-carousel..CombatCarousel+toggleVisibility"></a>

#### combatCarousel.toggleVisibility()
Toggles visibility of the carousel

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  
<a name="module_combat-carousel..CombatCarousel+expand"></a>

#### combatCarousel.expand()
Expand the Combat Carousel

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  
<a name="module_combat-carousel..CombatCarousel+collapse"></a>

#### combatCarousel.collapse()
Collapse the Combat Carousel

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  
<a name="module_combat-carousel..CombatCarousel+getCombatState"></a>

#### combatCarousel.getCombatState(combat)
Gets the state of a combat instance

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| combat | 

<a name="module_combat-carousel..CombatCarousel+getToggleIconState"></a>

#### combatCarousel.getToggleIconState()
Gets the current combat state of the toggle icon

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  
<a name="module_combat-carousel..CombatCarousel+setToggleIcon"></a>

#### combatCarousel.setToggleIcon(combatState)
Sets the Combat Carousel icon based on the app and combat state

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param | Type | Default |
| --- | --- | --- |
| combatState | <code>String</code> | <code></code> | 

<a name="module_combat-carousel..CombatCarousel+activateCombatantSlide"></a>

#### combatCarousel.activateCombatantSlide(combatant)
Activates the given combatant's slide

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param | Default |
| --- | --- |
| combatant | <code></code> | 

<a name="module_combat-carousel..CombatCarousel+getCombatantSlideIndex"></a>

#### combatCarousel.getCombatantSlideIndex(combatant)
Get the matching slide for the provided combatant

**Kind**: instance method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| combatant | 

<a name="module_combat-carousel..CombatCarousel.defaultOptions"></a>

#### CombatCarousel.defaultOptions
Call app default options

**Kind**: static property of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  
<a name="module_combat-carousel..CombatCarousel.prepareTurnData"></a>

#### CombatCarousel.prepareTurnData(turn) ⇒ <code>Object</code>
Takes a standard combat turn and prepare data for Combat Carousel rendering

**Kind**: static method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  
**Returns**: <code>Object</code> - preparedData  data ready for template  

| Param | Type | Description |
| --- | --- | --- |
| turn | <code>Turn</code> \| <code>Object</code> | the combat turn object |

<a name="module_combat-carousel..CombatCarousel.getOverlayProperties"></a>

#### CombatCarousel.getOverlayProperties(token, overlaySettings)
Get the data for the Combat Carousel property overlay for a given token

**Kind**: static method of [<code>CombatCarousel</code>](#module_combat-carousel..CombatCarousel)  

| Param |
| --- |
| token | 
| overlaySettings | 

<a name="module_config-form"></a>

## config-form
CombatCarouselConfig module


* [config-form](#module_config-form)
    * [~CombatCarouselConfig](#module_config-form..CombatCarouselConfig) ⇐ <code>FormApplication</code>
        * [new CombatCarouselConfig(...args)](#new_module_config-form..CombatCarouselConfig_new)
        * _instance_
            * [.getData()](#module_config-form..CombatCarouselConfig+getData)
            * [._updateObject(event, formData)](#module_config-form..CombatCarouselConfig+_updateObject)
            * [.activateListeners(html)](#module_config-form..CombatCarouselConfig+activateListeners)
            * [._onImgPathChange(event, html)](#module_config-form..CombatCarouselConfig+_onImgPathChange)
        * _static_
            * [.defaultOptions](#module_config-form..CombatCarouselConfig.defaultOptions)

<a name="module_config-form..CombatCarouselConfig"></a>

### config-form~CombatCarouselConfig ⇐ <code>FormApplication</code>
A form-app for setting the icons and properties to use in the Combat Carousel Overlay

**Kind**: inner class of [<code>config-form</code>](#module_config-form)  
**Extends**: <code>FormApplication</code>  

* [~CombatCarouselConfig](#module_config-form..CombatCarouselConfig) ⇐ <code>FormApplication</code>
    * [new CombatCarouselConfig(...args)](#new_module_config-form..CombatCarouselConfig_new)
    * _instance_
        * [.getData()](#module_config-form..CombatCarouselConfig+getData)
        * [._updateObject(event, formData)](#module_config-form..CombatCarouselConfig+_updateObject)
        * [.activateListeners(html)](#module_config-form..CombatCarouselConfig+activateListeners)
        * [._onImgPathChange(event, html)](#module_config-form..CombatCarouselConfig+_onImgPathChange)
    * _static_
        * [.defaultOptions](#module_config-form..CombatCarouselConfig.defaultOptions)

<a name="new_module_config-form..CombatCarouselConfig_new"></a>

#### new CombatCarouselConfig(...args)
Class instance constructor


| Param |
| --- |
| ...args | 

<a name="module_config-form..CombatCarouselConfig+getData"></a>

#### combatCarouselConfig.getData()
Gets data for the template

**Kind**: instance method of [<code>CombatCarouselConfig</code>](#module_config-form..CombatCarouselConfig)  
<a name="module_config-form..CombatCarouselConfig+_updateObject"></a>

#### combatCarouselConfig.\_updateObject(event, formData)
Update handler following form submission

**Kind**: instance method of [<code>CombatCarouselConfig</code>](#module_config-form..CombatCarouselConfig)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Event</code> | form submit event |
| formData | <code>Object</code> |  |

<a name="module_config-form..CombatCarouselConfig+activateListeners"></a>

#### combatCarouselConfig.activateListeners(html)
Attach listeners

**Kind**: instance method of [<code>CombatCarouselConfig</code>](#module_config-form..CombatCarouselConfig)  

| Param |
| --- |
| html | 

<a name="module_config-form..CombatCarouselConfig+_onImgPathChange"></a>

#### combatCarouselConfig.\_onImgPathChange(event, html)
Img Path Change handler

**Kind**: instance method of [<code>CombatCarouselConfig</code>](#module_config-form..CombatCarouselConfig)  

| Param |
| --- |
| event | 
| html | 

<a name="module_config-form..CombatCarouselConfig.defaultOptions"></a>

#### CombatCarouselConfig.defaultOptions
Get the default options for the class

**Kind**: static property of [<code>CombatCarouselConfig</code>](#module_config-form..CombatCarouselConfig)  
<a name="module_config"></a>

## config
Config module


* [config](#module_config)
    * [.NAME](#module_config.NAME)
    * [.TITLE](#module_config.TITLE)
    * [.CAROUSEL_ICONS](#module_config.CAROUSEL_ICONS)
    * [.SETTING_KEYS](#module_config.SETTING_KEYS)
    * [.DEFAULT_CONFIG](#module_config.DEFAULT_CONFIG)

<a name="module_config.NAME"></a>

### config.NAME
Module Name

**Kind**: static constant of [<code>config</code>](#module_config)  
<a name="module_config.TITLE"></a>

### config.TITLE
Module title

**Kind**: static constant of [<code>config</code>](#module_config)  
<a name="module_config.CAROUSEL_ICONS"></a>

### config.CAROUSEL\_ICONS
Module Icon Paths

**Kind**: static constant of [<code>config</code>](#module_config)  
<a name="module_config.SETTING_KEYS"></a>

### config.SETTING\_KEYS
Settings Keys

**Kind**: static constant of [<code>config</code>](#module_config)  
<a name="module_config.DEFAULT_CONFIG"></a>

### config.DEFAULT\_CONFIG
Default Config

**Kind**: static constant of [<code>config</code>](#module_config)  
<a name="module_hooks"></a>

## hooks
Hooks module

<a name="exp_module_hooks--module.exports"></a>

### module.exports() ⏏
Registers hooks needed throughout the module

**Kind**: Exported function  
<a name="module_overrides"></a>

## overrides
Overrides module


* [overrides](#module_overrides)
    * [module.exports()](#exp_module_overrides--module.exports) ⏏
        * [~sceneNavExpandOverride()](#module_overrides--module.exports..sceneNavExpandOverride)
        * [~sceneNavCollapseOverride()](#module_overrides--module.exports..sceneNavCollapseOverride)

<a name="exp_module_overrides--module.exports"></a>

### module.exports() ⏏
Wrapper to call overrides

**Kind**: Exported function  
<a name="module_overrides--module.exports..sceneNavExpandOverride"></a>

#### module.exports~sceneNavExpandOverride()
Override sceneNavExpand to move Hook call into promise

**Kind**: inner method of [<code>module.exports</code>](#exp_module_overrides--module.exports)  
<a name="module_overrides--module.exports..sceneNavCollapseOverride"></a>

#### module.exports~sceneNavCollapseOverride()
Override sceneNavCollapse to move Hook call into promise

**Kind**: inner method of [<code>module.exports</code>](#exp_module_overrides--module.exports)  
<a name="module_settings"></a>

## settings
Settings module

<a name="exp_module_settings--module.exports"></a>

### module.exports() ⏏
Wrapper to call settings registration

**Kind**: Exported function  
<a name="module_templates"></a>

## templates
Templates module

<a name="module_templates.preloadHandlebarsTemplates"></a>

### templates.preloadHandlebarsTemplates ⇒ <code>Promise</code>
Define a set of template paths to pre-load
Pre-loaded templates are compiled and cached for fast access when rendering
Taken from dnd5e system (see link)

**Kind**: static constant of [<code>templates</code>](#module_templates)  
**Link**: https://gitlab.com/foundrynet/dnd5e/-/blob/master/module/templates.js  
<a name="module_util"></a>

## util
Util module


* [util](#module_util)
    * [.getKeyByValue(object, value)](#module_util.getKeyByValue)
    * [.getTokenFromCombatantId(combatantId)](#module_util.getTokenFromCombatantId)
    * [.calculateTurns(combat)](#module_util.calculateTurns)
    * [.setupTurn(combatant)](#module_util.setupTurn)

<a name="module_util.getKeyByValue"></a>

### util.getKeyByValue(object, value)
Retrieves a key using the given value

**Kind**: static method of [<code>util</code>](#module_util)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | - the object that contains the key/value |
| value | <code>\*</code> |  |

<a name="module_util.getTokenFromCombatantId"></a>

### util.getTokenFromCombatantId(combatantId)
Helper to get Token instance based on Combatant Id

**Kind**: static method of [<code>util</code>](#module_util)  

| Param | Type |
| --- | --- |
| combatantId | <code>\*</code> | 

<a name="module_util.calculateTurns"></a>

### util.calculateTurns(combat)
For a given Combat instance, calculate the new turn order and return it

**Kind**: static method of [<code>util</code>](#module_util)  

| Param | Type | Description |
| --- | --- | --- |
| combat | <code>Combat</code> | a given Combat instance (default: active combat) |

<a name="module_util.setupTurn"></a>

### util.setupTurn(combatant)
Enriches combatant data to prepare for use in the CombatTracker

**Kind**: static method of [<code>util</code>](#module_util)  

| Param |
| --- |
| combatant | 

<a name="module_init"></a>

## init
