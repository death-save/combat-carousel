import CombatCarouselConfig from "./config-form.mjs";
import { SETTING_KEYS } from "./config.mjs";
import { NAME } from "./config.mjs";

/**
 * Main app class
 */
export default class CombatCarousel extends Application {
    constructor(options={}) {
        super(options);

        this.turn = null;
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
        this.element.css({"top":`${sceneNavHeight ? sceneNavHeight + 12 + 5 : 12}px`});
        
        // Only create and mount the splide on the forced or first render
        if (force || !this.rendered) {
            
            if (!this.splide) {
                /**
                * Create a Splide instance and store it for later use
                */
                const splide = this.splide = new Splide(".splide", {
                    perMove: 0,
                    focus: "center",
                    cover: true,
                    pagination: false,
                    arrows: "slider",
                    keyboard: false,
                    height: 150,
                    fixedWidth: 100
                });
            
                /**
                 * Hook on mount to add animation
                 */
                splide.on("mounted", () => {
                    const slides = document.querySelectorAll(".splide__slide");
                    
                    for (let i = 0; i < slides.length; i++) {
                        slides[i].classList.add("fly");
                        slides[i].style.animationDelay = `${0.1 * i}s`;
                    }

                    $(slides).on("webkitAnimationEnd oanimationend msAnimationEnd animationend", (event) => {
                        event.target.classList.remove("fly");
                        event.target.style.animationDelay = null;
                        splide.go(this.turn);
                    });
                    
                });

                splide.on("click", slide => {
                    splide.go(slide.index);
                });

                splide.on("active", async slide => {
                    if (game.combat.turn !== slide.index) {
                        await game.combat.update({turn:slide.index});
                    }
                });
            }
            
            this.splide.mount();
        }
    }

    /**
     * Get data required for template
     */
    getData() {
        const view = canvas.scene;
        const combats = view ? game.combats.entities.filter(c => c.data.scene === view._id) : [];
        const overlaySettings = game.settings.get(NAME, SETTING_KEYS.overlaySettings);
        const currentCombatIdx = combats.findIndex(c => c === game.combat);
        const hasCombat = currentCombatIdx > -1;

        if (hasCombat < 0) return;

        const encounter = currentCombatIdx + 1;
        const round = game.combat.round;
        const turns = game.combat.turns.map(t => {
            const token = canvas.tokens.get(t.tokenId);
            const hp = token?.actor?.data?.data?.attributes?.hp || null;
            

            if (hp) {
                hp.low = hp.max * 0.34;
                hp.high = hp.max * 0.6;
                hp.optimum = hp.max * 0.9;
            }

            return {
                id: t._id,
                name: t.name,
                img: token.actor.img ?? t.img,
                initiative: t.initiative,
                hidden: t.hidden,
                defeated: t.defeated,
                carousel: {
                    hp,
                    overlayProperties: this.getOverlayProperties(token, overlaySettings),
                    overlayEffect: token?.data?.overlayEffect || null,
                    effects: token?.data?.effects || null
                }                
            }
        });
        
        this.turn = turns.length ? game.combat.turn : null;

        return {
            turns,
            encounter,
            round
        }
    }

    /**
     * Activate listeners on the DOM element
     * @param {Object} html  the app element
     */
    activateListeners(html) {
        super.activateListeners(html);

        const moduleIcon = html.find("a#combat-carousel-toggle");
        const rollInit = html.find(".fa-dice-d20");
        const initiativeInput = html.find(".initiative input");
        const card = html.find(".splide__slide");
        const combatantControl = html.find("a.combatant-control");
        
        moduleIcon.on("click", (event) => this._onModuleIconClick(event, html));
        moduleIcon.on("contextmenu", (event) => this._onModuleIconContext(event, html));
        rollInit.on("click", this._onRollInitiative);
        rollInit.on("contextmenu", (event) => this._onEditInitiative(event, html));
        initiativeInput.on("change", (event, html) => this._onInitiativeChange(event, html));
        initiativeInput.on("focusout", (event, html) => this._onInitiativeFocusOut(event, html));
        card.on("mouseenter", (event) => this._onHoverCard(event, html)).on("mouseleave", (event, html) => this._onHoverOutCard(event, html));
        combatantControl.on("click", (event, html) => this._onCombatantControl(event, html));

    }

    /**
     * Module Icon click handler
     * @param event 
     * @param html 
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

        game.combat.rollInitiative(combatantId);
    }

    /**
     * Edit Initiative handler
     * @param event 
     * @param html 
     */
    _onEditInitiative(event, html) {
        const input = event.target.nextElementSibling;
        const $input = $(input);

        input.removeAttribute("disabled");
        $input.focus().select();
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
        const token = this.getTokenFromCombatantId(combatantId);

        if ( token && token.isVisible ) {
            if ( !token._controlled ) token._onHoverIn(event);
            this._highlightedToken = token;
        }
    }

    /**
     * Card Hover-out handler
     * @param event 
     * @param html 
     */
    _onHoverOutCard(event, html) {
        if ( this._highlightedToken ) this._highlightedToken._onHoverOut(event);
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
     * Toggles visibility of the carousel
     */
    toggleVisibility() {
        $(this.splide.root).slideToggle(200, () => {
            this._collapsed = !this._collapsed;
        });
    }

    /**
     * Get the overlay properties for a given token
     * @param token 
     * @param overlaySettings
     */
    getOverlayProperties(token, overlaySettings) {
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
}

