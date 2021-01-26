/**
 * CombatCarousel module
 * @module combat-carousel
 */

import CombatCarouselConfig from "./config-form.mjs";
import { CAROUSEL_ICONS, DEFAULT_CONFIG, NAME, SETTING_KEYS } from "./config.mjs";
import FixedDraggable from "./fixed-draggable.mjs";
import { toTitleCase } from "./util.mjs";
import { getAllElementSiblings, getKeyByValue, getTokenFromCombatantId } from "./util.mjs";

/**
 * Main app class
 * @extends Application
 */
export default class CombatCarousel extends Application {
    constructor(options={}) {
        super(options);

        this.combat = null;
        this.turn = null;
        this._collapsed = game.settings.get(NAME, SETTING_KEYS.collapsed) ?? false;
        this.slides = null;
        this.sizeFactor = 1;
    }

    /**
     * Call app default options
     * @override
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "combat-carousel",
            template: "modules/combat-carousel/templates/combat-carousel.hbs",
            popOut: false,
            top: 0,
            left: 0
        });
    }

    /**
    * Render worker
    * @param {Array} ...args  Any arguments passed
    * @override
    */
    async _render(force, options={}) {
        // Render the super first to create the element
        await super._render(force, options);

        // Instantiate the Fixed Draggable to make this app draggable
        new FixedDraggable(this, this.element, this.element.find(".drag-handle")[0], this.options.resizeable, {onDragMouseUp: this._onDragEnd});

        // If set, collapse the Nav bar
        const collapseNavSetting = game.settings.get(NAME, SETTING_KEYS.collapseNav);

        if (collapseNavSetting && game.combat) ui.nav.collapse();

        const sizeSetting = game.settings.get(NAME, SETTING_KEYS.carouselSize);
        const scale = this.sizeFactor = sizeSetting ? DEFAULT_CONFIG.carouselSize.sizeScaleMap[sizeSetting] : 1;
        
        /**
        * Create a Splide instance and store it for later use
        */
        const splide = this.splide = new Splide(".splide", {
            perMove: 1,
            perPage: 24,
            start: this.turn ?? 0,
            focus: 0,
            cover: true,
            pagination: true,
            arrows: false,
            keyboard: false,
            drag: false,
            trimSpace: true,
            fixedHeight: 150 * scale,
            fixedWidth: 100 * scale,
            classes: {
                pagination: "splide__pagination combat-carousel-pagination hidden"
            }
        });
        
        /**
         * Hook on mount to add animation
         */
        this.splide.on("mounted", () => {
            const slides = this.slides = document.querySelectorAll(".splide__slide");
            const $slides = $(slides);
            const $track = this.element.find(".splide__track");

            if (force || this._rendered === false) {
                for (let i = 0; i < slides.length; i++) {
                    slides[i].classList.add("fly");
                    slides[i].style.animationDelay = `${0.1 * (i ? i : 1)}s`;

                    slides[i].addEventListener("animationend", event => {
                        event.target.classList.remove("fly");
                        event.target.style.animationDelay = null;

                        if (i === slides.length - 1) {
                            this.activateCombatantSlide();
                        }
                    });
                }
            }

            const controlledTokens = canvas?.tokens?.controlled;
            const controlledCombatants = game?.combat?.combatants?.filter(c => controlledTokens.some(t => c.tokenId === t.id));

            for (const slide of slides) {
                const combatantId = slide.dataset.combatantId;
                if (controlledCombatants.some(c => c._id === combatantId)) {
                    const combatant = controlledCombatants.find(c => c._id === combatantId);
                    const token = controlledTokens.find(t => t.id === combatant.tokenId);
                    const borderColor = PIXI.utils.hex2string(token._getBorderColor());
                    slide.style.borderColor = borderColor;
                }
            }

            if (game?.combat?.combatant) {
                this.setActiveCombatant(game.combat.combatant);
            }
            
            const combatState = CombatCarousel.getCombatState(game.combat);
            /*
            switch (combatState) {
                case "noCombat":
                case "noTurns":
                    this.collapse();
                    break;
                
                case "hasTurns":
                default:
                    this.expand();
                    break;
            }
            */
        });

        this.splide.on("active", async (slide) => {
            const card = slide.slide;
            const combatantId = card.dataset.combatantId;
            
            if (!combatantId) return;

            const combatant = game.combat.getCombatant(combatantId);

            if (!combatant) return;

            const token = canvas.tokens.get(combatant.tokenId);
            const index = this.getCombatantSlideIndex(combatant);

            return await token.control();
        });

        /**
         * Handle adding a new combatant
         */
        this.splide.on("addCombatant", (element, index) => {
            const $element = $(element);
            
            if (this.splide.length > 0) {
                $element.addClass("fly");
                $element.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", (event) => {
                    event.target.classList.remove("fly");
                    event.target.style.animationDelay = null;
                    //this.activateCombatantSlide();
                });
            }

            const controlledTokens = canvas?.tokens?.controlled;
            const controlledCombatants = game?.combat?.combatants?.filter(c => controlledTokens.some(t => c.tokenId === t.id));
            const combatantId = $element.data().combatantId;

            if (controlledCombatants.some(c => c._id === combatantId)) {
                const combatant = controlledCombatants.find(c => c._id === combatantId);
                const token = controlledTokens.find(t => t.id === combatant.tokenId);
                const borderColor = PIXI.utils.hex2string(token._getBorderColor());
                $element.css("border-color", borderColor);
            }
           
            const newElement = $element[0].outerHTML;

            // add the element in the new position
            this.splide.add(newElement, index);
            this.setPosition({width: this._getMinimumWidth()});
        });

        await this.splide.mount();

        this.setPosition({width: this._getMinimumWidth(), height: 205 * scale});
    }

    /**
     * Takes a standard combat turn and prepare data for Combat Carousel rendering
     * @param {Turn | Object} turn  the combat turn object
     * @returns {Object} preparedData  data ready for template
     */
    prepareTurnData(turn) {
        const token = canvas.tokens.get(turn.tokenId);

        if (!token) return null;

        const isActiveTurn = game.combat.turn === game.combat.turns.indexOf(turn);

        const showOverlay = this._calculateOverlayVisibility(token, {isActive: isActiveTurn});

        const overlaySettings = game.settings.get(NAME, SETTING_KEYS.overlaySettings);
        
        const showInitiativeValue = this._calculateInitiativeValueVisibility(token, {isActive: isActiveTurn});
        const showInitiativeIcon = this._calculateInitiativeIconVisibility(token, {isActive: isActiveTurn});
        const showInitiative = showInitiativeValue || showInitiativeIcon;

        const imageTypeSetting = game.settings.get(NAME, SETTING_KEYS.imageType);
        let img = turn.img;

        switch (imageTypeSetting) {
            case "actor":
                const actorId = token.data.actorId;
                const actor = game.actors.get(actorId);
                img = actor?.img ?? turn.img;
                break;

            case "tokenActor":
                const tokenActor = token.actor;
                img = tokenActor?.img ?? turn.img;
                break;

            case "token":
                img = token.data.img ?? turn.img;
                break;

            default:
                break;
        }

        const showBar1 = this._calculateBarVisibility(token, "bar1", {isActive: isActiveTurn});
        let bar1 = {};

        const bar1AttributeSetting = game.settings.get(NAME, SETTING_KEYS.bar1Attribute);
        bar1 = bar1AttributeSetting ? token.getBarAttribute("bar1", {alternative: bar1AttributeSetting}) : null;
          
        bar1.title = game.settings.get(NAME, SETTING_KEYS.bar1Title);

        if (bar1?.type === "bar") {
                bar1.low = bar1.max * 0.34;
                bar1.high = bar1.max * 0.6;
                bar1.optimum = bar1.max * 0.9;
        }

        // @todo add some setting to configure this (Eg. for owned combatants)
        const canEditInitiative = game.user.isGM;

        const preparedData = {
            id: turn._id,
            name: turn.name,
            img,
            initiative: turn.initiative,
            hidden: turn.hidden,
            visible: turn.visible,
            defeated: turn.defeated,
            carousel: {
                isGM: game.user.isGM,
                owner: token.owner,
                showBar1,
                bar1,
                overlayProperties: CombatCarousel.getOverlayProperties(token, overlaySettings),
                overlayEffect: token?.data?.overlayEffect || null,
                effects: token?.data?.effects || null,
                showInitiativeValue,
                showInitiativeIcon,
                showInitiative,
                canEditInitiative,
                showOverlay
            }
        }

        return preparedData;
    }

    /**
     * Get data required for template
     */
    getData() {
        const view = canvas.scene;
        const combats = view ? game.combats.entities.filter(c => c.data.scene === view._id) : [];
        const currentCombatIdx = combats.findIndex(c => c === game.combat);
        const hasCombat = currentCombatIdx > -1;
        const combat = this.combat = hasCombat ? game.combat : null;
        const encounterCount = combats?.length ?? 0;
        const encounter = hasCombat ? currentCombatIdx + 1 : null;
        const previousEncounter = encounter > 1 ? encounter - 1 : null;
        const nextEncounter = encounter < encounterCount ? encounter + 1 : null;
        const round = game.combat ? game.combat.round : null;
        const previousRound = round > 0 ? round - 1 : null;
        const nextRound = Number.isNumeric(round) ? round + 1 : null;
        //@todo use util method to setup turns -- need to filter out non-visible turns
        const turns = game?.combat?.turns.map(t => this.prepareTurnData(t)) ?? [];
        const visibleTurns = turns.filter(t => t.visible);

        const combatState = CombatCarousel.getCombatState(game.combat);
        const carouselIcon = CAROUSEL_ICONS[combatState];
                
        this.turn = turns.length ? game.combat.turn : null;
        const canControlCombat = game.user.isGM;
        const combatant = game?.combat?.combatant;
        const canAdvanceTurn = combatant?.players?.includes(game.user);
        const hasPreviousTurn = canControlCombat && Number.isNumeric(this.turn) && turns.length;
        const hasNextTurn = (canControlCombat || canAdvanceTurn) && Number.isNumeric(this.turn);
        const hasPreviousRound = canControlCombat && Number.isNumeric(previousRound);
        const hasNextRound = canControlCombat && Number.isNumeric(nextRound);
        const canAdvanceEncounter = !!(canControlCombat && nextEncounter);
        const canReverseEncounter = !!(canControlCombat && previousEncounter);
        
        return {
            carouselIcon,
            turns,
            visibleTurns,
            encounter,
            encounterCount,
            round,
            previousRound,
            nextRound,
            hasPreviousRound,
            hasNextRound,
            hasPreviousTurn,
            hasNextTurn,
            canControlCombat,
            canAdvanceEncounter,
            canReverseEncounter
        }
    }

    /**
     * Activate listeners on the DOM element
     * @param {Object} html  the app element
     */
    activateListeners(html) {
        super.activateListeners(html);

        const app = html;
        const header = html.find("header");
        const moduleIcon = html.find("a#combat-carousel-toggle");
        const dragHandle = html.find(".drag-handle");
        const splide = html.find(".splide").first();
        const initSpan = html.find("div.initiative > span")
        const rollInit = html.find("a.roll-init");
        const initiativeInput = html.find(".initiative input");
        const card = html.find(".splide__slide");
        const combatantControl = html.find("a.combatant-control");
        const combatControls = html.find(".combat-controls a");
        const encounterControls = html.find(".encounter-controls a");
        const encounterCycleControls = html.find(".encounter a.encounter-control");
        const encounterControlsToggle = html.find(".encounter-info .encounter-controls-toggle");

        app.on("mouseenter", event => this._onHoverApp(event, html))
            .on("mouseleave", event => this._onHoverOutApp(event, html));

        moduleIcon.on("click", event => this._onModuleIconClick(event, html))
            .on("contextmenu", event => this._onModuleIconContext(event, html));

        dragHandle.on("contextmenu", event => this._onContextDragHandle(event));

        
        initSpan.on("click", event => this._onEditInitiative(event, html))
            .on("contextmenu", event => this._onContextInitiative(event, html));
        
        rollInit.on("click", this._onRollInitiative);

        initiativeInput.on("change", event => this._onInitiativeChange(event, html))
            .on("focusout", event => this._onInitiativeFocusOut(event, html));

        splide.on("mouseenter", event => this._onHoverSplide(event, html))
            .on("mouseleave", event => this._onHoverOutSplide(event, html));

        card.on("mouseenter", event => this._onHoverCard(event, html))
            .on("mouseleave", event => this._onHoverOutCard(event, html))
            .on("click", event => this._onClickCard(event, html))
            .on("contextmenu", event => this._onContextMenuCard(event, html))
            .on("dblclick", event => this._onCardDoubleClick(event, html));


        combatantControl.on("click", event => this._onCombatantControl(event, html));

        combatControls.on("click", event => this._onClickCombatControls(event, html));

        encounterControls.on("click", event => this._onClickEncounterControls(event, html));

        // encounterIcon.on("click", event => this._onClickEncounterIcon(event, html));
        // encounterIcon.on("contextmenu", event => this._onEncounterIconContext(event, html));
        encounterCycleControls.on("click", event => this._onClickEncounterControls(event, html));
        encounterControlsToggle.on("click", event => this._onClickEncounterControlsToggle(event, html));
        //this._contextMenu(html);
    }

    /* -------------------------------------------- */
    /*                Event Handlers                */
    /* -------------------------------------------- */

    /**
     * Hover app handler
     * @param event 
     * @param html 
     */
    _onHoverApp(event, html) {
        const appElement = event.currentTarget;

        // Reveal hidden UI during hover
        const encounterInfo = appElement.querySelector(".encounter-info");

        if (!encounterInfo) return;

        encounterInfo.classList.add("visible");
    }

    /**
     * Hover out app handler
     * @param event 
     * @param html 
     */
    _onHoverOutApp(event, html) {
        const appElement = event.currentTarget;

        // Hide UI after hover
        const encounterInfo = appElement.querySelector(".encounter-info");

        if (!encounterInfo) return;

        encounterInfo.classList.remove("visible");
    }

    /**
     * Module Icon click handler
     * @param event 
     * @param html 
     */
    async _onModuleIconClick(event, html) {
        event.preventDefault();
        //this.toggleVisibility();
        const newState = this._state == 2 ? "closed" : (this._state <= 0 ? "open" : "unknown");
        let newSettingValue = null;

        switch (newState) {
            case "closed":
                this._collapsed = newSettingValue = true;
                await this.close();
                break;
            
            case "open":
                this._collapsed = newSettingValue = false;
                await this.render(true);
                break;

            default:
                break;
        }
        
        if (newSettingValue !== null) await game.settings.set(NAME, SETTING_KEYS.collapsed, newSettingValue);
        if (newState != "unknown") this.setToggleIconIndicator(newState);
    }

    /**
     * Module Icon context click handler
     * @param event 
     * @param html 
     */
    _onModuleIconContext(event, html) {
        event.preventDefault();
        new CombatCarouselConfig().render(true);
    }

    /**
     * Drag Handle context click handler
     * @param event 
     * @param html 
     */
    _onContextDragHandle(event, html) {
        event.preventDefault();

        this.resetPosition();
    }

    /**
     * Roll Initiative handler
     * @param {*} event 
     */
    _onRollInitiative(event) {
        const parentLi = event.currentTarget.closest("li");
        const combatantId = parentLi.dataset.combatantId;
        
        if (!combatantId) return;

        const combatant = game.combat.getCombatant(combatantId);

        if (!combatant) return;

        const token = canvas.tokens.get(combatant.tokenId);
        
        if (!token.owner) return;

        if (!combatant.initiative) game.combat.rollInitiative(combatantId);
    }

    /**
     * Edit Initiative handler
     * @param event 
     * @param html 
     */
    _onEditInitiative(event, html) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (!game.user.isGM) return;

        const input = event.currentTarget.querySelector("input");
        const $input = $(input);

        $input.attr("disabled", null).focus().select();
    }

    /**
     * Change Initiative handler
     * @param event 
     * @param html 
     */
    _onInitiativeChange(event, html) {
        const input = event.target;
        const card = event.target.closest("li.card");
        const combatantId = card ? card.dataset.combatantId : null;

        input.setAttribute("disabled", "disabled");
        const init = parseFloat(input.value);
        game.combat.setInitiative(combatantId, Math.round(init * 100) / 100);
    }

    /**
     * Initiative context click handler
     * @param event 
     * @param html 
     */
    async _onContextInitiative(event, html) {
        event.preventDefault();
        event.stopPropagation();

        if (!game.user.isGM) return;

        const parentLi = event.currentTarget.closest("li");
        const combatantId = parentLi.dataset.combatantId;
        
        if (!combatantId) return;

        await game.combat.updateCombatant({_id: combatantId, initiative: null});
    }

    /**
     * Focus Out Initiative handler
     * @param event 
     * @param html 
     */
    _onInitiativeFocusOut(event, html) {
        const input = event.target;
        input.setAttribute("disabled", "disabled");
    }

    /**
     * Card Hover handler
     * @param {*} event 
     */
    _onHoverCard(event, html) {
        event.preventDefault();
        const hoveredCard = event.currentTarget;
        const combatantId = hoveredCard.dataset.combatantId;
        const token = getTokenFromCombatantId(combatantId);

        if ( token && token.isVisible ) {
            if ( !token._controlled ) token._onHoverIn(event);
            this._highlightedToken = token;
        }

        // Hide pagination during a hover event
        const splideSlider = hoveredCard.closest(".splide__slider");
        const sliderSiblings = getAllElementSiblings(splideSlider);
        const splidePagination = sliderSiblings.find(e => e.classList.contains("combat-carousel-pagination")); 
        splidePagination.classList.remove("visible");

        // Grow the track
        const splideTrack = hoveredCard.closest(".splide__track");
        splideTrack.style.height = `${splideTrack.offsetHeight * 1.2}px`;

        // Unhide elements based on settings
        const overlaySelector = ".overlay-properties";
        const initiativeDivSelector = "div.initiative";
        const initiativeValueSelector = `${initiativeDivSelector} input`;
        const initiativeIconSelector = `${initiativeDivSelector} i.fas`;
        const bar1Selector = ".bar1";

        const showOverlay = this._shouldShowElement(hoveredCard, "overlay", overlaySelector);
        const showInitiativeValue = this._shouldShowElement(hoveredCard, "initiativeValue", initiativeValueSelector);
        const showInitiativeIcon = this._shouldShowElement(hoveredCard, "initiativeIcon", initiativeIconSelector);
        const showBar1 = this._shouldShowElement(hoveredCard, "bar", bar1Selector);

        if (showOverlay) this._toggleElementVisibility(hoveredCard, overlaySelector, {show: true});
        if (showInitiativeValue) this._toggleElementVisibility(hoveredCard, initiativeValueSelector, {show: true});
        if (showInitiativeIcon) this._toggleElementVisibility(hoveredCard, initiativeIconSelector, {show: true});
        if (showInitiativeValue || showInitiativeIcon) this._toggleElementVisibility(hoveredCard, initiativeDivSelector, {show: true});
        if (showBar1) this._toggleElementVisibility(hoveredCard, bar1Selector, {show: true});
    }

    /**
     * Card Hover-out handler
     * @param event 
     * @param html 
     */
    _onHoverOutCard(event, html) {
        const hoveredCard = event.currentTarget;

        if ( this._highlightedToken ) this._highlightedToken._onHoverOut(event);

        // Reveal pagination after a hover event
        const splideSlider = hoveredCard.closest(".splide__slider");
        const sliderSiblings = getAllElementSiblings(splideSlider);
        const splidePagination = sliderSiblings.find(e => e.classList.contains("combat-carousel-pagination")); 
        splidePagination.classList.add("visible");

        // Reset the track height
        const splideTrack = hoveredCard.closest(".splide__track");
        splideTrack.style.height = "";

        // Rehide any elements if those setting is selected
        const overlaySelector = ".overlay-properties";
        const initiativeDivSelector = "div.initiative";
        const initiativeValueSelector = `${initiativeDivSelector} input`;
        const initiativeIconSelector = `${initiativeDivSelector} i.fas`;
        const bar1Selector = ".bar1";

        const showOverlay = this._shouldShowElement(hoveredCard, "overlay", overlaySelector);
        const showInitiativeValue = this._shouldShowElement(hoveredCard, "initiativeValue", initiativeValueSelector);
        const showInitiativeIcon = this._shouldShowElement(hoveredCard, "initiativeIcon", initiativeIconSelector);
        const showBar1 = this._shouldShowElement(hoveredCard, "bar", bar1Selector);

        if (!showOverlay) this._toggleElementVisibility(hoveredCard, overlaySelector, {hide: true});
        if (!showInitiativeValue) this._toggleElementVisibility(hoveredCard, initiativeValueSelector, {hide: true});
        if (!showInitiativeIcon) this._toggleElementVisibility(hoveredCard, initiativeIconSelector, {hide: true});
        if (!showInitiativeValue && !showInitiativeIcon) this._toggleElementVisibility(hoveredCard, initiativeDivSelector, {hide: true});
        if (!showBar1) this._toggleElementVisibility(hoveredCard, bar1Selector, {hide: true});
    }

    /**
     * Card click handler
     * @param event 
     * @param html 
     */
    async _onClickCard(event, html) {
        const card = event.currentTarget;
        const combatantId = card.dataset.combatantId;
            
        if (!combatantId) return;

        const combatant = game.combat.getCombatant(combatantId);

        if (!combatant) return;

        const isCtrl = game.keyboard.isCtrl(event);

        if (isCtrl && game.user.isGM) {
            
            const turn = game.combat.turns.find(t => t._id === combatantId);

            if (!turn) return;

            const turnIndex = game.combat.turns.indexOf(turn);

            return await game.combat.update({turn: turnIndex});
        }

        const token = canvas.tokens.get(combatant.tokenId);
        const index = this.getCombatantSlideIndex(combatant);
        if (Number.isFinite(index)) this.splide.go(index);

        await canvas.animatePan({x: token.x, y: token.y});
        return await token.control();
    }

    /**
     * Card double click handler
     * @param event 
     * @param html 
     */
    _onCardDoubleClick(event, html) {
        const card = event.currentTarget;
        const combatantId = card.dataset.combatantId;
        const token = getTokenFromCombatantId(combatantId);

        if (!game.user.isGM || !token.owner) return;

        token.actor.sheet.render(true);
    }

    /**
     * Handle card right-click
     * @param event 
     * @param html 
     */
    async _onContextMenuCard(event, html) {
        const combatantId = event.currentTarget.dataset.combatantId;

        
    }

    /**
     * Combatant Control handler
     * @param event 
     * @param html 
     */
    async _onCombatantControl(event, html) {
        event.preventDefault();
        event.stopPropagation();
        const button = event.currentTarget;
        const li = button.closest(".card");
        const combat = game?.combat;

        if (!combat) return;

        const combatant = combat.getCombatant(li.dataset.combatantId);

        // Switch control action
        switch (button.dataset.control) {

            // Toggle combatant visibility
            case "toggleHidden":
                await game.combat.updateCombatant({_id: combatant._id, hidden: !combatant.hidden});
                break;
    
            // Toggle combatant defeated flag
            case "toggleDefeated":
                // let isDefeated = !combatant.defeated;
                // await game.combat.updateCombatant({_id: combatant._id, defeated: isDefeated});
                // const token = canvas.tokens.get(combatant.tokenId);
                // if ( token ) {
                //     if ( isDefeated && !token.data.overlayEffect ) token.toggleOverlay(CONFIG.controlIcons.defeated);
                //     else if ( !isDefeated && token.data.overlayEffect === CONFIG.controlIcons.defeated ) token.toggleOverlay(null);
                // }
                ui?.combat?._onToggleDefeatedStatus(combatant);
                break;
    
            // Roll combatant initiative
            case "remove":
                await game.combat.deleteCombatant([combatant._id]);
                break;
        }
  
        // Render tracker updates
        ui.combat.render();
    }

    /**
     * Combat Control click handler
     * @param event 
     * @param html 
     */
    _onClickCombatControls(event, html) {
        const action = event.currentTarget.dataset.action;

        switch (action) {
            case "nextTurn":
                game.combat.nextTurn();
                break;
            
            case "nextRound":
                game.combat.nextRound();
                break;

            case "previousTurn":
                game.combat.previousTurn();
                break;

            case "previousRound":
                game.combat.previousRound();
                break;

            default:
                break;
        }
    }

    /**
     * Combat Control click handler
     * @param event 
     * @param html 
     */
    async _onClickEncounterControls(event, html) {
        event.preventDefault();
        const action = event.currentTarget.dataset.action;

        switch (action) {
            case "create":
                return await ui.combat._onCombatCreate(event);
            
            case "delete":
                return await this.combat.delete();

            case "config":
                return new CombatTrackerConfig().render(true);

            case "rollAll":
                return this.combat.rollAll()

            case "rollNPC":
                return this.combat.rollNPC();
                
            case "resetAll":
                return this.combat.resetAll();

            case "nextEncounter":
                return this._cycleEncounter("next");

            case "previousEncounter":
                return this._cycleEncounter("previous");

            default:
                break;
        }
    }

    /**
     * Hover splide handler
     * @param event 
     * @param html 
     */
    _onHoverSplide(event, html) {
        // Reveal pagination during a hover event
        const splidePagination = event.currentTarget.querySelector(".combat-carousel-pagination");
        splidePagination.classList.add("visible");
    }

    /**
     * Hover Out splide handler
     * @param event 
     * @param html 
     */
    _onHoverOutSplide(event, html) {
        // Hide pagination after a hover event
        const splidePagination = event.currentTarget.querySelector(".combat-carousel-pagination");
        splidePagination.classList.remove("visible");
    }

    /**
     * Context Encounter Icon handler
     * @param event 
     * @param html 
     */
    _onClickEncounterIcon(event, html) {
        if (!game.user.isGM) return;

        game.combat.endCombat();
    }

    /**
     * Context Encounter Icon handler
     * @param event 
     * @param html 
     */
    _onEncounterIconContext(event, html) {
        event.preventDefault();
        this._contextMenu(html);
        //game.combat.endCombat();
    }

    /**
     * Click encounter controls handler
     * @param event 
     * @param html 
     */
    _onClickEncounterControlsToggle(event, html) {
        event.preventDefault();
        const button = event.currentTarget;
        const encounterInfo = button.closest(".encounter-info");
        const encounterControls = encounterInfo.querySelector(".encounter-controls");

        encounterControls.classList.add("visible");
    }

    /**
     * 
     * @param event 
     * @param finalPosition 
     * @param initialPosition
     */
    _onDragMouseUp(event, finalPosition, initialPosition) {
        // If position is unchanged, nothing to do
        if (finalPosition == initialPosition) return;

        // If position is changed, save to settings
        this._savePosition();
    }

    /**
     * Context menu handler
     * @param html 
     */
    _contextMenu(html) {
        const encounterOptions = this._getEncounterContextOptions();

        if (encounterOptions) new ContextMenu(html, ".encounter-info", encounterOptions);
    }

    /* -------------------------------------------- */
    /*                  UI Methods                  */
    /* -------------------------------------------- */

    /**
     * Safe render for multiple embedded entity updates
     */
    safeRender() {
        debounce(() => {
            this.render(), 100
        });
    }

    /**
     * Toggles visibility of the carousel
     */
    async toggleVisibility(forceCollapse=false) {
        const collapseIndicator = ui.controls.element.find("i.collapse-indicator");

        return new Promise(resolve => {
            const $el = this.element;

            if (forceCollapse) {
                $el.slideUp(200, () => {
                    collapseIndicator.removeClass("fa-caret-down").addClass("fa-caret-up");
                    this._collapsed = true;
                });

                return resolve(true);
            }

            $el.slideToggle(200, () => {
                const currentDirection = collapseIndicator.hasClass("fa-caret-down") ? "down" : "up";
                const newDirection = currentDirection ? (currentDirection === "down" ? "up" : "down") : null;

                if(newDirection) {
                    collapseIndicator.removeClass(`fa-caret-${currentDirection}`).addClass(`fa-caret-${newDirection}`)
                }

                this._collapsed = !this._collapsed;
            });

            return resolve(true);
        });
    }

    /**
     * Expand the Combat Carousel
     */
    async expand() {
        return new Promise(resolve => {
            // const $splide = $(this.splide.root);
            const $el = this.element;
            const collapseIndicator = ui.controls.element.find("i.collapse-indicator");

            $el.slideDown(200, () => {
                this._collapsed = false;
                collapseIndicator.removeClass("fa-caret-down").addClass("fa-caret-up");
                resolve(true);
            });        
        });
    }

    /**
     * Collapse the Combat Carousel
     */
    async collapse() {
        return new Promise(resolve => {
            // const $splide = $(this.splide.root);
            const $el = this.element;
            const collapseIndicator = ui.controls.element.find("i.collapse-indicator");

            $el.slideUp(200, () => {
                this._collapsed = true;
                collapseIndicator.removeClass("fa-caret-up").addClass("fa-caret-down");
                resolve(true);
            });
        });
    }

    /**
     * Gets the state of a combat instance
     * @param combat 
     */
    static getCombatState(combat) {
        const hasCombat = !!combat;
        const turns = hasCombat ? combat.turns : null;
        
        if (!turns) return "noCombat";
        
        if (!turns.length) return "noTurns";
        
        if (turns.length) return "hasTurns";
    }

    /**
     * Gets the current combat state of the toggle icon
     */
    getToggleIconState() {
        const $icon = this.element.find("img.carousel-icon").first();
        const img = $icon.attr("src");

        return getKeyByValue(CAROUSEL_ICONS, img);
    }

    /**
     * Sets the Combat Carousel icon based on the app and combat state
     * @param {String} combatState
     */
    setToggleIcon(combatState=null) {
        const $icon = ui.controls.element.find(".carousel-icon").first();
        const img = $icon.attr("src");
        combatState = combatState ? combatState : CombatCarousel.getCombatState(game?.combat);

        $icon.attr("src", CAROUSEL_ICONS[combatState]);
    }

    /**
     * Sets the Active Combatant, applying style to the combatant's card
     * @param combatant 
     */
    setActiveCombatant(combatant=null) {
        combatant = combatant ?? game?.combat?.combatant;
        
        if (!combatant || !combatant?.visible) return;

        const slideIndex = this.getCombatantSlideIndex(combatant);
        const activeCombatantSlide = this.slides[slideIndex];
        activeCombatantSlide.classList.add("is-active-combatant");
        this.splide.go(slideIndex);
    }

    /**
     * Activates the given combatant's slide
     * @param combatant 
     */
    activateCombatantSlide(combatant=null) {
        combatant = combatant || game?.combat?.combatant || null;

        if (!combatant) return;

        const activeCombatantIndex = this.getCombatantSlideIndex(combatant);
        this.splide.go(activeCombatantIndex);
    }

    /**
     * Returns Encounter Info context menu options
     */
    _getEncounterContextOptions() {
        return [
            {
              name: "COMBAT_CAROUSEL.EncounterOptions.Create",
              icon: `<i class="fas fa-plus"></i>`,
              condition: () => game.user.isGM,
              callback: event => ui.combat._onCombatCreate(event)
            },
            {
                name: "COMBAT_CAROUSEL.EncounterOptions.Delete",
                icon: `<i class="fas fa-trash"></i>`,
                condition: () => game.user.isGM,
                callback: event => ui.combat._onCombatDelete(event)
            }
        ]
    }

    /**
     * Set app position
     * @param left 
     * @param top 
     * @param width 
     * @param height 
     * @param scale 
     * @returns {Object} newPosition
     * @override
     */
    setPosition({left, top, width, height, scale}={}) {
        //if ( !this.popOut ) return; // Only configure position for popout apps
        const el = this.element[0];
        const p = this.position;
        const pop = this.popOut;
        const styles = window.getComputedStyle(el);

        // If Height is "auto" unset current preference
        if ( (height === "auto") || (this.options.height === "auto") ) {
            el.style.height = "";
            height = null;
        }

        const originalWidth = el.offsetWidth;
        const availableWidth = this._getAvailableWidth({left});

        if (!el.style.maxWidth || (parseInt(el.style.maxWidth) > availableWidth)) {
            el.style.maxWidth = `${availableWidth}px`;
        }

        const minimumWidth = this._getMinimumWidth();

        // if (!el.style.minWidth || (parseInt(el.style.minWidth) > availableWidth) || (parseInt(el.style.minWidth) < minimumWidth)) el.style.minWidth = `${minimumWidth}px`;
        if (!el.style.minWidth || (parseInt(el.style.minWidth) != minimumWidth)) el.style.minWidth = `${minimumWidth}px`;

        // Update width if an explicit value is passed, or if no width value is set on the element
        if ( !el.style.width || width ) {
            const tarW = width || el.offsetWidth;
            const minW = parseInt(el.style.minWidth) || (pop ? MIN_WINDOW_WIDTH : 0);
            const maxW = parseInt(el.style.maxWidth) || window.innerWidth;
            p.width = width = Math.clamped(tarW, minW, maxW);
            el.style.width = width+"px";
            if ( (width + p.left) > window.innerWidth ) left = p.left;
        }
        width = el.offsetWidth;
        if (width != originalWidth) this._setSplidePagination();

        // Update height if an explicit value is passed, or if no height value is set on the element
        if ( !el.style.height || height ) {
            const tarH = height || (el.offsetHeight + 1);
            const minH = parseInt(styles.minHeight) || (pop ? MIN_WINDOW_HEIGHT : 0);
            const maxH = Number.isFinite(parseInt(styles.maxHeight)) ? parseInt(styles.maxHeight) : window.innerHeight;
            p.height = height = Math.clamped(tarH, minH, maxH);
            el.style.height = height+"px";
            if ( (height + p.top) > window.innerHeight ) top = p.top;
        }
        height = el.offsetHeight;

        // Update Left
        if ( (pop && !el.style.left) || Number.isFinite(left) ) {
            const tarL = Number.isFinite(left) ? left : (window.innerWidth - width) / 2;
            const maxL = Math.max(window.innerWidth - width, 0);
            p.left = left = Math.clamped(tarL, 0, maxL);
            el.style.left = left+"px";
        }

        // Update Top
        if ( (pop && !el.style.top) || Number.isFinite(top) ) {
            const tarT = Number.isFinite(top) ? top : (window.innerHeight - height) / 2;
            const maxT = Math.max(window.innerHeight - height, 0);
            p.top = top = Math.clamped(tarT, 0, maxT);
            el.style.top = p.top+"px";
        }

        // Update Scale
        if ( scale ) {
            p.scale = Math.max(scale, 0);
            if ( scale === 1 ) el.style.transform = "";
            else el.style.transform = `scale(${scale})`;
        }

        // Return the updated position object
        return p;
    }

    /**
     * Resets Carousel to its default position and sets width based on contents
     */
    resetPosition() {
        const defaultPosition = mergeObject(DEFAULT_CONFIG.appPosition, {
            width: this._getMinimumWidth()
        });

        this.setPosition(defaultPosition);
        this._setSplidePagination();
        this._savePosition();
    }
    

    /**
     * Calculates the width space available for the Carousel accounting for the sidebar
     * @param {Number} [sidebarWidth]
     * @param {Number} [left] 
     */
    _getAvailableWidth({sidebarWidth=null, left=null}={}) {
        // If no sidebarWidth is provided, calculate its width including any positional buffer
        sidebarWidth = sidebarWidth ?? (ui.sidebar.element.outerWidth() + (window.innerWidth - ui.sidebar.element.offset().left - ui.sidebar.element.outerWidth()) + 5);
        const carouselLeft = left ?? this.element.offset().left;
        const availableWidth = Math.floor(window.innerWidth - (carouselLeft + sidebarWidth));

        return availableWidth;
    }

    /**
     * Calculates the minimum width that should be used
     */
    _getMinimumWidth() {
        const scale = this.sizeFactor;

        // the lesser of (number of cards * 100 + ui) or available width
        // always leave room for 1 card (for dropzone)
        const numCards = this?.splide?.length || 1;
        const absoluteMinimum = 230;
        // Multiply number of cards by card width, add UI buffer, add scale buffer
        const desiredWidth = (numCards * (100 * scale)) + 110 + 20;
        const availableWidth = this._getAvailableWidth();
        const minimumWidth = (desiredWidth <= availableWidth) ? desiredWidth : availableWidth;
        
        return (minimumWidth > absoluteMinimum) ? minimumWidth : absoluteMinimum;
    }

    /**
     * Saves the current position of the Combat Carousel to storage
     */
    _savePosition() {
        const safePosition = duplicate(this.position);
        delete safePosition.width;
        delete safePosition.height;

        game.settings.set(NAME, SETTING_KEYS.appPosition, safePosition);
    }

    /**
     * Sets the number of slides per page based on the width of the Carousel
     */
    _setSplidePagination() {
        if (!this.splide) return;

        const width = this.element.outerWidth();
        const uiBuffer = 110;
        const slideWidth = 100;
        const numSlides = Number.isFinite(width) ? Math.floor((width - uiBuffer) / slideWidth) : 0;

        this.splide.options = { perPage: numSlides }
    }

    /**
     * Determines if a particular Combatant Card's overlay should be shown or not
     */
    _shouldShowElement(card, type, elementSelector) {

        const cardElement = this._getCardElement(card);

        // determine if card is hovered, or active combatant
        const isHovered = cardElement.matches(":hover") ?? false;
        const isActive = cardElement.classList.contains("is-active-combatant") ?? false;
        
        // next find the element
        const element = cardElement.querySelector(elementSelector);
        
        if (!element) return false;

        // get the combatant and token
        const combatant = this._getCombatantFromCard(card);
        
        if (!combatant) return false;

        const token = combatant.token;

        switch (type) {
            case "overlay":
                return this._calculateOverlayVisibility(token, {isActive, isHovered});

            case "initiativeValue":
                return this._calculateInitiativeValueVisibility(token, {isActive, isHovered});

            case "initiativeIcon":
                return this._calculateInitiativeIconVisibility(token, {isActive, isHovered});

            case "bar":
                const match = elementSelector.match(/bar\d+/);
                if (!match) return false;
                const barName = match[0];
                return this._calculateBarVisibility(token, barName, {isActive, isHovered});

            default:
                return false;
        }        
    }

    /**
     * Calculates overlay visibility for the given token and user
     */
    _calculateOverlayVisibility(token, {user=game.user, isActive=false, isHovered=false}={}) {
        if (!token) return false;
        
        const showOverlaySetting = game.settings.get(NAME, SETTING_KEYS.showOverlay);

        const showAlways = getKeyByValue(DEFAULT_CONFIG.showOverlay.choices, DEFAULT_CONFIG.showOverlay.choices.always);
        const showHover = getKeyByValue(DEFAULT_CONFIG.showOverlay.choices, DEFAULT_CONFIG.showOverlay.choices.hover);
        const showActive = getKeyByValue(DEFAULT_CONFIG.showOverlay.choices, DEFAULT_CONFIG.showOverlay.choices.active);
        const showActiveHover = getKeyByValue(DEFAULT_CONFIG.showOverlay.choices, DEFAULT_CONFIG.showOverlay.choices.activeHover)
        const showNever = getKeyByValue(DEFAULT_CONFIG.showOverlay.choices, DEFAULT_CONFIG.showOverlay.choices.never);

        // If the overlay should never be shown, return false
        if (showOverlaySetting === showNever) return false;

        // determine visibility
        //const tokenData = combatant?.token;
        

        const overlayPermissionSetting = game.settings.get(NAME, SETTING_KEYS.overlayPermission);

        const permAll = getKeyByValue(DEFAULT_CONFIG.overlayPermission.choices, DEFAULT_CONFIG.overlayPermission.choices.all);
        const permOwner = getKeyByValue(DEFAULT_CONFIG.overlayPermission.choices, DEFAULT_CONFIG.overlayPermission.choices.owned);
        const permObserver = getKeyByValue(DEFAULT_CONFIG.overlayPermission.choices, DEFAULT_CONFIG.overlayPermission.choices.observed);
        const permNone = getKeyByValue(DEFAULT_CONFIG.overlayPermission.choices, DEFAULT_CONFIG.overlayPermission.choices.none);

        const actor = token?.actor ?? game.actors.get(token.actorId);
        const hasPerm = game.user.isGM 
            || (overlayPermissionSetting === permAll) 
            || ((overlayPermissionSetting === permOwner) && actor.hasPerm(user, CONST.ENTITY_PERMISSIONS.OWNER)) 
            || ((overlayPermissionSetting === permObserver) && actor.hasPerm(user, CONST.ENTITY_PERMISSIONS.OBSERVER));

        switch (showOverlaySetting) {
            case showAlways:
                return hasPerm;

            case showHover:
                if (isHovered) return hasPerm;
                return false;

            case showActive:
                if (isActive) return hasPerm;
                return false;

            case showActiveHover:
                if (isHovered || isActive) return hasPerm;
                return false;
        
            default:
                return false;
        }
    }

    /**
     * Determines if a particular Combatant Card's overlay should be shown or not
     */
    _calculateInitiativeValueVisibility(token, {user=game.user, isActive=false, isHovered=false}={}) {
        const showInitiativeSetting = game.settings.get(NAME, SETTING_KEYS.showInitiative);

        const showAlways = getKeyByValue(DEFAULT_CONFIG.showInitiative.choices, DEFAULT_CONFIG.showInitiative.choices.always);
        const showHover = getKeyByValue(DEFAULT_CONFIG.showInitiative.choices, DEFAULT_CONFIG.showInitiative.choices.hover);
        const showActive = getKeyByValue(DEFAULT_CONFIG.showInitiative.choices, DEFAULT_CONFIG.showInitiative.choices.active);
        const showActiveHover = getKeyByValue(DEFAULT_CONFIG.showInitiative.choices, DEFAULT_CONFIG.showInitiative.choices.activeHover)
        const showNever = getKeyByValue(DEFAULT_CONFIG.showInitiative.choices, DEFAULT_CONFIG.showInitiative.choices.never);

        // If the initiative should never be shown, return false
        if (showInitiativeSetting === showNever) return false;

        const initiativePermissionSetting = game.settings.get(NAME, SETTING_KEYS.initiativePermission);

        const permAll = getKeyByValue(DEFAULT_CONFIG.initiativePermission.choices, DEFAULT_CONFIG.initiativePermission.choices.all);
        const permOwner = getKeyByValue(DEFAULT_CONFIG.initiativePermission.choices, DEFAULT_CONFIG.initiativePermission.choices.owned);
        const permObserver = getKeyByValue(DEFAULT_CONFIG.initiativePermission.choices, DEFAULT_CONFIG.initiativePermission.choices.observed);
        const permNone = getKeyByValue(DEFAULT_CONFIG.initiativePermission.choices, DEFAULT_CONFIG.initiativePermission.choices.none);

        const actor = token?.actor ?? game.actors.get(token.actorId);
        const hasPerm = game.user.isGM 
            || (initiativePermissionSetting === permAll) 
            || ((initiativePermissionSetting === permOwner) && actor.hasPerm(user, CONST.ENTITY_PERMISSIONS.OWNER)) 
            || ((initiativePermissionSetting === permObserver) && actor.hasPerm(user, CONST.ENTITY_PERMISSIONS.OBSERVER));

        switch (showInitiativeSetting) {
            case showAlways:
                return hasPerm;

            case showHover:
                if (isHovered) return hasPerm;
                return false;

            case showActive:
                if (isActive) return hasPerm;
                return false;

            case showActiveHover:
                if (isHovered || isActive) return hasPerm;
                return false;
        
            default:
                return false;
        }
    }

    /**
     * Determines if a particular Combatant Card's overlay should be shown or not
     */
    _calculateInitiativeIconVisibility(token, {user=game.user}={}) {
        const showInitiativeIconSetting = game.settings.get(NAME, SETTING_KEYS.showInitiativeIcon);

        const showAlways = getKeyByValue(DEFAULT_CONFIG.showInitiativeIcon.choices, DEFAULT_CONFIG.showInitiativeIcon.choices.always);
        const showWithInit = getKeyByValue(DEFAULT_CONFIG.showInitiativeIcon.choices, DEFAULT_CONFIG.showInitiativeIcon.choices.withInit);
        const showUnrolled = getKeyByValue(DEFAULT_CONFIG.showInitiativeIcon.choices, DEFAULT_CONFIG.showInitiativeIcon.choices.unrolled);
        const showWithInitUnrolled = getKeyByValue(DEFAULT_CONFIG.showInitiativeIcon.choices, DEFAULT_CONFIG.showInitiativeIcon.choices.withInitUnrolled)
        const showNever = getKeyByValue(DEFAULT_CONFIG.showInitiativeIcon.choices, DEFAULT_CONFIG.showInitiativeIcon.choices.never);

        // If the initiative should never be shown, return false
        if (showInitiativeIconSetting === showNever) return false;

        
        // determine if intiative will be shown
        const initiativeShown = this._calculateInitiativeValueVisibility(token, user);
        
        // get the combatant and determine if the user is an owner of its token
        const actor = token?.actor ?? game.actors.get(token.actorId);
        const tokenId = token?.id ?? token?._id;
        const combatant = game?.combat?.combatants.find(c => c.tokenId === tokenId);
        const unrolledCombatant = combatant?.initiative === null;

        const initiativePermissionSetting = game.settings.get(NAME, SETTING_KEYS.initiativePermission);

        const permAll = getKeyByValue(DEFAULT_CONFIG.initiativePermission.choices, DEFAULT_CONFIG.initiativePermission.choices.all);
        const permOwner = getKeyByValue(DEFAULT_CONFIG.initiativePermission.choices, DEFAULT_CONFIG.initiativePermission.choices.owned);
        const permObserver = getKeyByValue(DEFAULT_CONFIG.initiativePermission.choices, DEFAULT_CONFIG.initiativePermission.choices.observed);
        const permNone = getKeyByValue(DEFAULT_CONFIG.initiativePermission.choices, DEFAULT_CONFIG.initiativePermission.choices.none);

        const hasPerm = game.user.isGM 
            || (initiativePermissionSetting === permAll) 
            || ((initiativePermissionSetting === permOwner) && actor.hasPerm(user, CONST.ENTITY_PERMISSIONS.OWNER)) 
            || ((initiativePermissionSetting === permObserver) && actor.hasPerm(user, CONST.ENTITY_PERMISSIONS.OBSERVER));

        switch (showInitiativeIconSetting) {
            case showAlways:
                return hasPerm;

            case showWithInit:
                if (initiativeShown) return hasPerm;
                return false;

            case showUnrolled:
                if (unrolledCombatant) return hasPerm;
                return false;

            case showWithInitUnrolled:
                if (initiativeShown || unrolledCombatant) return hasPerm;
                return false;
        
            default:
                return false;
        }
    }

    /**
     * Calculate bar visibility
     * @param token 
     * @param barName 
     */
    _calculateBarVisibility(token, barName, {user=game.user, isActive=false, isHovered=false}={}) {
        if (!token || !barName) return false;

        const titledBarName = typeof barName === "string" ? toTitleCase(barName) : null;

        if (!titledBarName) return false;

        const showBarSetting = game.settings.get(NAME, SETTING_KEYS[`show${titledBarName}`]);

        if (!showBarSetting) return false;

        const showAlways = getKeyByValue(DEFAULT_CONFIG.showBar.choices, DEFAULT_CONFIG.showBar.choices.always);
        const showHover = getKeyByValue(DEFAULT_CONFIG.showBar.choices, DEFAULT_CONFIG.showBar.choices.hover);
        const showActive = getKeyByValue(DEFAULT_CONFIG.showBar.choices, DEFAULT_CONFIG.showBar.choices.active);
        const showActiveHover = getKeyByValue(DEFAULT_CONFIG.showBar.choices, DEFAULT_CONFIG.showBar.choices.activeHover)
        const showNever = getKeyByValue(DEFAULT_CONFIG.showBar.choices, DEFAULT_CONFIG.showBar.choices.never);

        if (showBarSetting === showNever) return false;

        const barPermissionSetting = game.settings.get(NAME, SETTING_KEYS[`${barName}Permission`]);

        const actor = token?.actor ?? game.actors.get(token.actorId);
        const combatant = game?.combat?.combatants.find(c => c.tokenId === token._id);

        const permAll = getKeyByValue(DEFAULT_CONFIG[`${barName}Permission`].choices, DEFAULT_CONFIG[`${barName}Permission`].choices.all);
        const permOwner = getKeyByValue(DEFAULT_CONFIG[`${barName}Permission`].choices, DEFAULT_CONFIG[`${barName}Permission`].choices.owned);
        const permObserver = getKeyByValue(DEFAULT_CONFIG[`${barName}Permission`].choices, DEFAULT_CONFIG[`${barName}Permission`].choices.observed);
        const permNone = getKeyByValue(DEFAULT_CONFIG[`${barName}Permission`].choices, DEFAULT_CONFIG[`${barName}Permission`].choices.none);

        const hasPerm = game.user.isGM 
            || (barPermissionSetting === permAll) 
            || ((barPermissionSetting === permOwner) && actor.hasPerm(user, CONST.ENTITY_PERMISSIONS.OWNER)) 
            || ((barPermissionSetting === permObserver) && actor.hasPerm(user, CONST.ENTITY_PERMISSIONS.OBSERVER));

        switch (showBarSetting) {
            case showAlways:
                return hasPerm;
    
            case showHover:
                if (isHovered) return hasPerm;
                return false;
    
            case showActive:
                if (isActive) return hasPerm;
                return false;
    
            case showActiveHover:
                if (isHovered || isActive) return hasPerm;
                return false;
            
            default:
                return false;
        }
    }

    /**
     * Toggles visibility of the overlay
     * @param card 
     */
    _toggleElementVisibility(card, elementSelector, {show=false, hide=false}={}) {
        const cardElement = this._getCardElement(card);
        const element = cardElement.querySelector(elementSelector);
        const isHidden = element.classList.contains("hidden");

        switch (isHidden) {
            case true:
                if (!hide) return element.classList.remove("hidden");
                return true;
            
            case false:
                if (!show) return element.classList.add("hidden");
                return true;

            default:
                return false;
        }
    }

    /**
     * Returns the Element of a given DOM Element or Jquery Object
     * @param card 
     */
    _getCardElement(card) {
        // Ensure the card param is usable
        if (!card) throw "Card Not Provided";
        if (!(card instanceof Element) && !(card instanceof $)) throw "Card is not an Element or JQuery Element";

        return card instanceof $ ? card[0] : card;
    }

    /**
     * Set the indicator on the toggle button
     */
    setToggleIconIndicator(state) {
        const $indicator = ui.controls.element.find("li[data-control='combat-carousel'] i.collapse-indicator");
        const currentDirection = $indicator.hasClass("fa-caret-down") ? "down" : "up";
        let newDirection = null;

        if (!state) return;
        
        newDirection = state === "open" ? "up" : "down"; 

        if(newDirection && (newDirection !== currentDirection)) {
            $indicator.removeClass(`fa-caret-${currentDirection}`).addClass(`fa-caret-${newDirection}`)
        }
    }

    /* -------------------------------------------- */
    /*                 Data Methods                 */
    /* -------------------------------------------- */

    /**
     * Get the data for the Combat Carousel property overlay for a given token
     * @param token 
     * @param overlaySettings
     */
    static getOverlayProperties(token, overlaySettings) {
        // Only return if value mask is set
        const tokenOverlay = overlaySettings.filter(o => o.value).map(o => {
            return {
                name: o.name,
                img: o.img,
                value: getProperty(token, `actor.data.${o.value}`)
            }
        });

        return tokenOverlay;
    }

    /**
     * Get the matching slide for the provided combatant
     * @param combatant 
     */
    getCombatantSlideIndex(combatant) {
        const slides = ui.combatCarousel.splide.root.querySelectorAll("li");

        if (!slides.length) return;

        const combatantIds = [];

        // Manually iterate throught the slides NodeList (no array methods possible)
        for (const s of slides) {
            combatantIds.push(s.dataset.combatantId);
        }

        const index = combatantIds.indexOf(combatant._id);

        return index;
    }

    /**
     * Returns the combatant (if any) for a given card element
     * @param card 
     * @param [combat]  
     */
    _getCombatantFromCard(card, combat=game.combat) {
        const cardElement = this._getCardElement(card);

        if (!cardElement) return null;

        const combatantId = cardElement.dataset.combatantId;

        if (!combatantId) return null;

        const combatant = combat.getCombatant(combatantId);

        return combatant ?? null;
    }

    /**
     * Cycles the Active Encounter
     * @param direction 
     */
    async _cycleEncounter(direction) {
        const combats = game.combats.entities;

        if (!combats?.length) return;

        const sceneCombats = combats.filter(c => c.scene.id === canvas.scene.id);
        const currentId = this?.combat?.id;

        if (!currentId) return;

        const currentIndex = sceneCombats.findIndex(c => c.id === currentId);
        let newCombat = null;

        switch(direction) {
            case "next":
               if ((currentIndex + 1) <= sceneCombats.length) newCombat = sceneCombats[currentIndex + 1];

            case "previous":
                if ((currentIndex - 1) >= 0) newCombat = sceneCombats[currentIndex - 1];
        }   

        if ( !newCombat ) return;

        return await newCombat.activate();
    }
}

