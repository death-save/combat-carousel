/**
 * CombatCarousel module
 * @module combat-carousel
 */

import CombatCarouselConfig from "./config-form.mjs";
import { CAROUSEL_ICONS } from "./config.mjs";
import { NAME, SETTING_KEYS } from "./config.mjs";
import { getKeyByValue } from "./util.mjs";
import { getTokenFromCombatantId, calculateTurns } from "./util.mjs";

/**
 * Main app class
 * @extends Application
 */
export default class CombatCarousel extends Application {
    constructor(options={}) {
        super(options);

        this.turn = null;
        this._collapsed = false;
    }

    /**
     * Call app default options
     * @override
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "combat-carousel",
            template: "modules/combat-carousel/templates/combat-carousel.hbs",
            popOut: false
        });
    }

    /**
    * Render worker
    * @param {Array} ...args  Any arguments passed
    * @override
    */
    async _render(force, options={}) {
        await super._render(force, options);

        const collapseNavSetting = game.settings.get(NAME, SETTING_KEYS.collapseNav);

        if (collapseNavSetting) {
            ui.nav.collapse();
        }

        // Find the Scene Nav and ensure to render outside it
        const sceneNav = ui.nav;
        const sceneNavHeight = sceneNav.element.height(); 

        if (sceneNav && sceneNav._collapsed) {
            this.element.css({"top":"12px"});
            this.element.find(".carousel-icon").css({"top": "47px"});
        } else {
            this.element.css({"top":`${sceneNavHeight + 12 + 5}px`});
            this.element.find(".carousel-icon").css({"top": "auto"});
        }
        
        /**
        * Create a Splide instance and store it for later use
        */
        const splide = this.splide = new Splide(".splide", {
            perMove: 0,
            start: this.turn ?? 0,
            focus: "center",
            cover: true,
            pagination: false,
            arrows: false,
            keyboard: false,
            drag: false,
            height: 150,
            fixedWidth: 100
        });
        
        /**
         * Hook on mount to add animation
         */
        this.splide.on("mounted", () => {
            const slides = document.querySelectorAll(".splide__slide");
            
            const $slides = $(slides);

            if (force || this._rendered === false) {
                for (let i = 0; i < slides.length; i++) {
                    
                    slides[i].classList.add("fly");
                    slides[i].style.animationDelay = `${0.1 * i}s`;

                    slides[i].addEventListener("animationend", event => {
                        event.target.classList.remove("fly");
                        event.target.style.animationDelay = null;
                        if (i === slides.length - 1) this.activateCombatantSlide();
                    });
                }
            }

            const combatState = this.getCombatState(game.combat);

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
        });

        this.splide.on("click", async slide => {
            if (slide.slide.dataset.action === "nextRound") {
                await game.combat.nextRound();
                return this.render();
            }

            if (slide.slide.dataset.action === "previousRound") {
                await game.combat.previousRound();
                return this.render();
            }

            return await game.combat.update({turn: slide.index});
        });

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
           
            const newElement = $element[0].outerHTML;

            // add the element in the new position
            this.splide.add(newElement, index);
        });

        return await this.splide.mount();
    }

    /**
     * Takes a standard combat turn and prepare data for Combat Carousel rendering
     * @param {Turn | Object} turn  the combat turn object
     * @returns {Object} preparedData  data ready for template
     */
    static prepareTurnData(turn) {
        const token = canvas.tokens.get(turn.tokenId);
        const hp = token?.actor?.data?.data?.attributes?.hp || null;
        const overlaySettings = game.settings.get(NAME, SETTING_KEYS.overlaySettings);
        const showHealthSetting = game.settings.get(NAME, SETTING_KEYS.showHealth);
        const healthBarPermissionSetting = game.settings.get(NAME, SETTING_KEYS.healthBarPermission);
        let showHealth = (game.user.isGM && showHealthSetting) ? true : false;

        if (showHealthSetting === true && !game.user.isGM) {
            switch (healthBarPermissionSetting) {
                case "owner":
                    showHealth = token.owner;
                    break;

                case "token":
                    showHealth = token._canViewMode(token.data.displayBars);
                    break;
    
                case "none":
                default:
                    break;
            }
        }

        if (hp) {
            hp.low = hp.max * 0.34;
            hp.high = hp.max * 0.6;
            hp.optimum = hp.max * 0.9;
        }

        const preparedData = {
            id: turn._id,
            name: turn.name,
            img: token.actor.img ?? turn.img,
            initiative: turn.initiative,
            hidden: turn.hidden,
            defeated: turn.defeated,
            carousel: {
                isGM: game.user.isGM,
                owner: token.owner,
                showHealth,
                hp,
                overlayProperties: CombatCarousel.getOverlayProperties(token, overlaySettings),
                overlayEffect: token?.data?.overlayEffect || null,
                effects: token?.data?.effects || null
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
        const encounter = hasCombat ? currentCombatIdx + 1 : null;
        const round = game.combat ? game.combat.round : null;
        const previousRound = round > 0 ? round - 1 : null;
        const nextRound = Number.isNumeric(round) ? round + 1 : null;
        //@todo use util method to setup turns -- need to filter out non-visible turns
        const turns = game.combat?.turns ? calculateTurns(game.combat).map(t => CombatCarousel.prepareTurnData(t)): [];
        
        const combatState = this.getCombatState(game.combat);
        const carouselIcon = CAROUSEL_ICONS[combatState];
                
        this.turn = turns.length ? game.combat.turn : null;
        const canControlCombat = game.user.isGM;
        const combatant = game?.combat?.combatant;
        const canAdvanceTurn = combatant?.players?.includes(game.user);
        const hasPreviousTurn = canControlCombat && Number.isNumeric(this.turn) && turns.length;
        const hasNextTurn = (canControlCombat || canAdvanceTurn) && Number.isNumeric(this.turn);
        const hasPreviousRound = canControlCombat && Number.isNumeric(previousRound);
        const hasNextRound = canControlCombat && Number.isNumeric(nextRound);
        
        return {
            carouselIcon,
            turns,
            encounter,
            round,
            previousRound,
            nextRound,
            hasPreviousRound,
            hasNextRound,
            hasPreviousTurn,
            hasNextTurn
        }
    }

    /**
     * Activate listeners on the DOM element
     * @param {Object} html  the app element
     */
    activateListeners(html) {
        super.activateListeners(html);

        const moduleIcon = html.find("a#combat-carousel-toggle");
        const splide = html.find(".splide").first();
        const rollInit = html.find("a.roll-init");
        const initiativeInput = html.find(".initiative input");
        const card = html.find(".splide__slide");
        const combatantControl = html.find("a.combatant-control");
        const combatControl = html.find(".combat-control a");
        
        moduleIcon.on("click", event => this._onModuleIconClick(event, html));
        moduleIcon.on("contextmenu", event => this._onModuleIconContext(event, html));
        rollInit.on("click", this._onRollInitiative);
        rollInit.on("contextmenu", event => this._onEditInitiative(event, html));
        initiativeInput.on("change", event => this._onInitiativeChange(event, html));
        initiativeInput.on("focusout", event => this._onInitiativeFocusOut(event, html));
        splide.on("mouseenter", event => this._onHoverSplide(event, html)).on("mouseleave", event => this._onHoverOutSplide(event, html));
        card.on("mouseenter", event => this._onHoverCard(event, html)).on("mouseleave", event => this._onHoverOutCard(event, html));
        card.on("dblclick", event => this._onCardDoubleClick(event, html));
        combatantControl.on("click", event => this._onCombatantControl(event, html));
        combatControl.on("click", event => this._onCombatControlClick(event, html));
    }

    /* -------------------------------------------- */
    /*                Event Handlers                */
    /* -------------------------------------------- */

    /**
     * Module Icon click handler
     * @param event 
     * @param html 
     * @todo #6 #5 add visual indicator of collapse state on icon
     */
    _onModuleIconClick(event, html) {
        this.toggleVisibility();
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
     * Roll Initiative handler
     * @param {*} event 
     */
    _onRollInitiative(event) {
        const parentLi = event.currentTarget.closest("li");
        const combatantId = parentLi.dataset.combatantId;
        
        if (!combatantId || !game.user.isGM) return;

        game.combat.rollInitiative(combatantId);
    }

    /**
     * Edit Initiative handler
     * @param event 
     * @param html 
     */
    _onEditInitiative(event, html) {
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

        // Hide scrollbars during a hover event
        const splideTrack = hoveredCard.closest(".splide__track");
        splideTrack.style.overflow = "hidden";
    }

    /**
     * Card Hover-out handler
     * @param event 
     * @param html 
     */
    _onHoverOutCard(event, html) {
        const hoveredCard = event.currentTarget;

        if ( this._highlightedToken ) this._highlightedToken._onHoverOut(event);

        const splideTrack = hoveredCard.closest(".splide__track");
        splideTrack.style.overflowX = "scroll";
        splideTrack.style.overflowY = "visible";
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
        token.actor.sheet.render(true);
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
        const combatant = game.combat.getCombatant(li.dataset.combatantId);

        // Switch control action
        switch (button.dataset.control) {

            // Toggle combatant visibility
            case "toggleHidden":
                await game.combat.updateCombatant({_id: combatant._id, hidden: !combatant.hidden});
                break;
    
            // Toggle combatant defeated flag
            case "toggleDefeated":
                let isDefeated = !combatant.defeated;
                await game.combat.updateCombatant({_id: combatant._id, defeated: isDefeated});
                const token = canvas.tokens.get(combatant.tokenId);
                if ( token ) {
                    if ( isDefeated && !token.data.overlayEffect ) token.toggleOverlay(CONFIG.controlIcons.defeated);
                    else if ( !isDefeated && token.data.overlayEffect === CONFIG.controlIcons.defeated ) token.toggleOverlay(null);
                }
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
    _onCombatControlClick(event, html) {
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
     * Hover splide handler
     * @param event 
     * @param html 
     */
    _onHoverSplide(event, html) {
        const splideTrack = event.currentTarget.querySelector(".splide__track");

        splideTrack.style.overflowX = "scroll";
        splideTrack.style.overflowY = "visible";
    }

    /**
     * Hover Out splide handler
     * @param event 
     * @param html 
     */
    _onHoverOutSplide(event, html) {
        const splideTrack = event.currentTarget.querySelector(".splide__track");

        splideTrack.style.overflowX = "hidden";
        splideTrack.style.overflowY = "visible";
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
        const collapseIndicator = this.element.find("i.collapse-indicator");

        return new Promise(resolve => {
            const $splide = $(this.splide.root);

            if (forceCollapse) {
                $splide.slideUp(200, () => {
                    collapseIndicator.removeClass("fa-caret-down").addClass("fa-caret-up");
                    this._collapsed = true;
                });

                return resolve(true);
            }

            $(this.splide.root).slideToggle(200, () => {
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
            const $splide = $(this.splide.root);
            const collapseIndicator = this.element.find("i.collapse-indicator");

            $splide.slideDown(200, () => {
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
            const $splide = $(this.splide.root);
            const collapseIndicator = this.element.find("i.collapse-indicator");

            $splide.slideUp(200, () => {
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
    getCombatState(combat) {
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
        const $icon = this.element.find(".carousel-icon img").first();
        const img = $icon.attr("src");
        combatState = combatState ? combatState : this.getCombatState(game?.combat);

        $icon.attr("src", CAROUSEL_ICONS[combatState]);
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
}
