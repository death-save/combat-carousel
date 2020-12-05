/**
 * CombatCarousel module
 * @module combat-carousel
 */

import CombatCarouselConfig from "./config-form.mjs";
import { CAROUSEL_ICONS } from "./config.mjs";
import { NAME, SETTING_KEYS } from "./config.mjs";
import FixedDraggable from "./fixed-draggable.mjs";
import { getAllElementSiblings } from "./util.mjs";
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

        new FixedDraggable(this, this.element, this.element.find(".drag-handle")[0], this.options.resizeable);

        const collapseNavSetting = game.settings.get(NAME, SETTING_KEYS.collapseNav);

        if (collapseNavSetting && game.combat) {
            ui.nav.collapse();
        }

        /*
        // Find the Scene Nav and ensure to render outside it
        const sceneNav = ui.nav;
        const sceneNavHeight = sceneNav.element.height(); 

        if (sceneNav && sceneNav._collapsed) {
            this.element.css({"top":"12px"});
            //this.element.find(".carousel-icon").css({"top": "47px"});
        } else {
            this.element.css({"top":`${sceneNavHeight + 12 + 5}px`});
            //this.element.find(".carousel-icon").css({"top": "auto"});
        }
        */
        
        /**
        * Create a Splide instance and store it for later use
        */
        const splide = this.splide = new Splide(".splide", {
            //perMove: 1,
            perPage: 24,
            start: this.turn ?? 0,
            //focus: false,
            cover: true,
            pagination: true,
            arrows: false,
            keyboard: false,
            drag: false,
            height: 150,
            fixedWidth: 100,
            breakpoints: {
                1920: {
                    perPage: 12
                },
                1680: {
                    perPage: 9
                },
                1366: {
                    perPage: 6
                }
            },
            classes: {
                pagination: "splide__pagination combat-carousel-pagination hidden"
            }
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

            const slideIndex = this.getCombatantSlideIndex(game.combat.combatant);
            const activeCombatantSlide = slides[slideIndex];
            activeCombatantSlide.classList.add("is-active-combatant");
            activeCombatantSlide.style.height = "158px";

            const combatState = CombatCarousel.getCombatState(game.combat);

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

        // this.splide.on("pagination:updated", (data, prevItem, activeItem) => {
        //     if (!prevItem) return;

        //     //console.log("prev",prevItem, "active",activeItem);
        // });

        // this.splide.on("active", slide => {
        //     //console.log(slide);
        //     const $slide = $(slide.slide);
        //     $slide.height("153px"); 
        // });

        // this.splide.on("inactive", slide => {
        //     //console.log(slide);
        //     const $slide = $(slide.slide);
        //     $slide.height("150px"); 
        // });

        this.splide.on("click", async slide => {
            const combatantId = slide.slide.dataset.combatantId;
            
            if (!combatantId) return;

            const combatant = game.combat.getCombatant(combatantId);

            if (!combatant) return;

            const token = canvas.tokens.get(combatant.tokenId);
            
            return await token.control();
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
            hasNextTurn,
            canControlCombat
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
        const splide = html.find(".splide").first();
        const rollInit = html.find("a.roll-init");
        const initiativeInput = html.find(".initiative input");
        const card = html.find(".splide__slide");
        const combatantControl = html.find("a.combatant-control");
        const combatControl = html.find(".combat-control a");
        const encounterIcon = html.find(".encounter-info .encounter");

        app.on("mouseenter", event => this._onHoverApp(event, html)).on("mouseleave", event => this._onHoverOutApp(event, html));

        moduleIcon.on("click", event => this._onModuleIconClick(event, html));
        moduleIcon.on("contextmenu", event => this._onModuleIconContext(event, html));

        rollInit.on("click", this._onRollInitiative);
        rollInit.on("contextmenu", event => this._onEditInitiative(event, html));

        initiativeInput.on("change", event => this._onInitiativeChange(event, html));
        initiativeInput.on("focusout", event => this._onInitiativeFocusOut(event, html));

        splide.on("mouseenter", event => this._onHoverSplide(event, html)).on("mouseleave", event => this._onHoverOutSplide(event, html));

        card.on("mouseenter", event => this._onHoverCard(event, html)).on("mouseleave", event => this._onHoverOutCard(event, html));
        card.on("contextmenu", event => this._onContextMenuCard(event, html));
        card.on("dblclick", event => this._onCardDoubleClick(event, html));

        combatantControl.on("click", event => this._onCombatantControl(event, html));

        combatControl.on("click", event => this._onCombatControlClick(event, html));

        encounterIcon.on("click", event => this._onClickEncounterIcon(event, html));
        encounterIcon.on("contextmenu", event => this._onEncounterIconContext(event, html));
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
        encounterInfo.classList.remove("visible");
    }

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
        
        if (!combatantId) return;

        const combatant = game.combat.getCombatant(combatantId);

        if (!combatant) return;

        const token = canvas.tokens.get(combatant.tokenId);
        
        if (!token.owner) return;

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

        // Hide pagination during a hover event
        const splideSlider = hoveredCard.closest(".splide__slider");
        const sliderSiblings = getAllElementSiblings(splideSlider);
        const splidePagination = sliderSiblings.find(e => e.classList.contains("combat-carousel-pagination")); 
        splidePagination.classList.remove("visible");
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

        if (!combatantId || !game.user.isGM) return;

        const turn = game.combat.turns.find(t => t._id === combatantId);

        if (!turn) return;

        const turnIndex = game.combat.turns.indexOf(turn);

        await game.combat.update({turn: turnIndex});
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
        //game.combat.endCombat();
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
        const $icon = this.element.find(".carousel-icon img").first();
        const img = $icon.attr("src");
        combatState = combatState ? combatState : CombatCarousel.getCombatState(game?.combat);

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

