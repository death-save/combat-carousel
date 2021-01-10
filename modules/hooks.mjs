/**
 * Hooks module
 * @module hooks
 */
import CombatCarousel from "./combat-carousel.mjs";
import registerSettings from "./settings.mjs";
import overrideMethods from "./overrides.mjs";
import { NAME, SETTING_KEYS, CAROUSEL_ICONS } from "./config.mjs";
import { getTokenFromCombatantId } from "./util.mjs";
import { preloadHandlebarsTemplates } from "./templates.mjs";
import { DEFAULT_CONFIG } from "./config.mjs";
import { TEMPLATE_PATH } from "./config.mjs";

/**
 * Registers hooks needed throughout the module
 */
export default function registerHooks() {

    /* -------------------------------------------- */
    /*                 System Hooks                 */
    /* -------------------------------------------- */

    /**
     * Init hook
     */
    Hooks.on("init", () => {
        registerSettings();
        overrideMethods();
        preloadHandlebarsTemplates();
    }); 

    /**
     * Ready hook
     */
    Hooks.on("ready", () => {
        const position = game.settings.get(NAME, SETTING_KEYS.appPosition);
        
        ui.combatCarousel = new CombatCarousel(position);

        const collapsed = ui.combatCarousel._collapsed;
        const state = collapsed ? "closed" : "open";
        ui.combatCarousel.setToggleIconIndicator(state);

        if (!collapsed) ui.combatCarousel.render(true);
    });

    /* -------------------------------------------- */
    /*                 Entity Hooks                 */
    /* -------------------------------------------- */

    /* ------------------ Combat ------------------ */

    /**
     * Create Combat hook
     */
    Hooks.on("createCombat", (combat, options, userId) => {
        const collapsed = ui.combatCarousel._collapsed;

        if (!collapsed) ui.combatCarousel.render(true);
        
        const hasTurns = combat?.turns?.length;
        const carouselImg = ui?.controls?.element.find("img.carousel-icon");
        const newImgSrc = hasTurns ? CAROUSEL_ICONS.hasTurns : CAROUSEL_ICONS.noTurns;
        
        carouselImg.attr("src", newImgSrc);
    });

    /**
     * Update Combat hook
     */
    Hooks.on("updateCombat", (combat, update, options, userId) => {
        //console.log("combat update", {combat, update, options, userId});
        const collapsed = ui.combatCarousel._collapsed;
        
        if (collapsed) return;

        if (getProperty(update, "active") === true || hasProperty(update, "round")) {
            return ui.combatCarousel.render(true);
        }

        if (hasProperty(update, "turn")) {
            if (update.turn !== ui.combatCarousel.turn) {
                const combatant = combat.turns[update.turn];

                if (!combatant) return;

                ui.combatCarousel.turn = update.turn;
                
                return ui.combatCarousel.render();
                //return ui.combatCarousel.setActiveCombatant(combatant);
            }

            //ui.combatCarousel.render();
        }
        
        

        /*
        if (combat.turns.length <= 0) {
            ui.combatCarousel.collapse();
            ui.combatCarousel.setToggleIcon("noTurns");
        }
        */
        return ui.combatCarousel.render();
    });
    
    /**
     * Delete Combat hook
     */
    Hooks.on("deleteCombat", async (combat, options, userId) => {
        const collapsed = ui.combatCarousel._collapsed;
        const hasCombat = game.combats.entities?.length;
        if (!collapsed && !hasCombat) {
            ui.combatCarousel.close();
            //await ui.combatCarousel.render(true);
            //ui.combatCarousel.collapse();
        }


        const carouselImg = ui.controls.element.find("img.carousel-icon");
        carouselImg.attr("src", CAROUSEL_ICONS.noCombat);
    });
    
    /* ----------------- Combatant ---------------- */

    /**
     * Create Combatant hook
     */
    Hooks.on("createCombatant", async (combat, createData, options, userId) => {
        //console.log("create combatantant:", {combat, createData, options, userId});
        
        // calculate the new turn order
        const newTurns = combat.setupTurns();

        // grab the new combatant
        const turn = newTurns.find(t => t._id === createData._id);

        if (!turn) return;

        const templateData = {
            combatant: CombatCarousel.prepareTurnData(turn)
        };

        if (!templateData) return;

        const combatantCard = await renderTemplate("modules/combat-carousel/templates/combatant-card.hbs", templateData);
        const index = newTurns.map(t => t._id).indexOf(createData._id) ?? -1;
        
        await ui.combatCarousel.splide.emit("addCombatant", combatantCard, index);
        
        ui.combatCarousel.setToggleIcon();

        if (ui.combatCarousel._collapsed) {
            ui.combatCarousel.expand();
        }

        ui.combatCarousel.render();

        const carouselImg = ui.controls.element.find("img.carousel-icon");

        if (carouselImg.attr("src") != CAROUSEL_ICONS.hasTurns) carouselImg.attr("src", CAROUSEL_ICONS.hasTurns);
    });
    
    /**
     * Update Combatant hook
     */
    Hooks.on("updateCombatant", async (combat, update, options, userId) => {
        //console.log("combatant update", {combat, update, options, userId});
        //ui.combatCarousel.splide.go()
        //ui.combatCarousel.splide.refresh();
        /*
        const turn = combat.turns.find(t => t._id === update._id);
        const combatant = CombatCarousel.prepareTurnData(turn);
        const template = await renderTemplate("modules/combat-carousel/templates/combatant-card.hbs", {combatant});
        const cardToReplace = ui.combatCarousel.element.find(`li[data-combatant-id="${update._id}"]`);
        cardToReplace.replaceWith(template);
        ui.combatCarousel.splide.refresh();
        */
        const safeRender = debounce(() => {
            ui.combatCarousel.render(), 100
        });
        
        safeRender();
    });

    /**
     * Delete Combatant hook
     */
    Hooks.on("deleteCombatant", (combat, combatant, options, userId) => {
        //console.log("delete combatant:", {combat, combatant, options, userId});
        
        const index = ui.combatCarousel.getCombatantSlideIndex(combatant);

        if (index < 0) return;

        ui.combatCarousel.splide.remove(index);
        ui.combatCarousel.setPosition({width: ui.combatCarousel._getMinimumWidth()});

        const combatHasTurns = combat?.turns?.length;

        const carouselImg = ui.controls.element.find("img.carousel-icon");

        if (!combatHasTurns) carouselImg.attr("src", CAROUSEL_ICONS.noTurns);
    });

    /* ------------------- Actor ------------------ */

    Hooks.on("updateActor", (actor, update, options, userId) => {
        if (!hasProperty(update, "data.attributes.hp.value") && !hasProperty(update, "img")) return;
        // find any matching combat carousel combatants
        
        // update their hp bar

        ui.combatCarousel.render();
    });

    /* ------------------- Token ------------------ */

    Hooks.on("updateToken", (scene, token, update, options, userId) => {
        //console.log("token update:", scene,token,update,options,userId);
        if (
            !hasProperty(update, "effects") 
            && !hasProperty(update, "overlayEffect") 
            && !hasProperty(update, "actorData.data.attributes.hp.value") 
            && !hasProperty(update, "img")
            && !hasProperty(update, "actorData.img")
        ) return;
        // find any matching combat carousel combatants
        
        // update their hp bar and effects
        ui.combatCarousel.render();
    });

    /* -------------------------------------------- */
    /*                 Render Hooks                 */
    /* -------------------------------------------- */

    /**
     * SceneNavigation render hook
     */
    Hooks.on("renderSceneNavigation", (app, html, data) => {
        // if (!ui.combatCarousel) return;

        // const collapsed = data?.collapsed || app?.data?.collapsed || null;
        
        // if (collapsed) {
        //     ui.combatCarousel.element.css({"top": "12px"});
        //     ui.combatCarousel.element.find(".carousel-icon").css({"top": "47px"});
        // } else {
        //     ui.combatCarousel.element.css({"top": `${app.element.height() + 12 + 5}px`});
        //     ui.combatCarousel.element.find(".carousel-icon").css({"top": "auto"});
        // }
    });

    /**
     * SceneNavigation collapse/expand hook
     */
    Hooks.on("collapseSceneNavigation", (app, collapsed) => {
        if (!ui.combatCarousel) return;

        /**
        if (collapsed) {
            ui.combatCarousel.element.css({"top": "12px"});
            ui.combatCarousel.element.find(".carousel-icon").css({"top": "42px"});
        } else {
            ui.combatCarousel.element.css({"top": `${app.element.height() + 12 + 5}px`});
            ui.combatCarousel.element.find(".carousel-icon").css({"top": "auto"});
        }
        */
    });

    Hooks.on("sidebarCollapse", (app, collapsed) => {
        console.log(collapsed);

        if (!ui.combatCarousel) return;

        ui.combatCarousel.setPosition();

    });

    Hooks.on("renderCombatTracker", (app, html, data) => {
        const rendered = ui?.combatCarousel?.rendered;
        const collapsed = ui?.combatCarousel?._collapsed;

        if (!data?.hasCombat && rendered) {
            ui.combatCarousel.close();
        }

        if (data?.hasCombat && collapsed === false) {
            ui.combatCarousel.render(!rendered);
        }

        ui.combatCarousel.setToggleIcon();
        //console.log("combat tracker rendered:", app, html, data);
    });

    /**
     * CombatCarousel render hook
     */
    Hooks.on("renderCombatCarousel", (app, html, data) => {
        //app.activateCombatantSlide();
    });

    /* -------------------------------------------- */
    /*              Miscellaneous Hooks             */
    /* -------------------------------------------- */

    /**
     * Hover Token hook
     */
    Hooks.on("hoverToken", (token, hovered) => {
        if (!ui?.combatCarousel?.splide || !game.combat) return;

        if (!ui?.combatCarousel?.splide || !game.combat) return;

        const combatant = game.combat.combatants.find(c => c.tokenId === token.id);

        if (!combatant) return;

        const slide = ui.combatCarousel?.splide?.root.querySelector(`li.splide__slide[data-combatant-id="${combatant._id}"]`);
        
        if (!slide) return;

        switch (hovered) {
            case true:
                const borderColor = PIXI.utils.hex2string(token._getBorderColor());
                return slide.style.borderColor = borderColor;
                
            case false:
                if (token._controlled) return;
                return slide.style.borderColor = null;

            default:
                return;
        }
        /*
        if (hovered) {
            const combatant = game.combat.combatants.find(c => c.tokenId === token.id);
            const borderColor = PIXI.utils.hex2string(token._getBorderColor());

            if (!combatant) return;
            const slide = ui.combatCarousel?.splide?.root.querySelector(`li.splide__slide[data-combatant-id="${combatant._id}"]`);
            if (!slide) return;
            return slide.style.borderColor = borderColor;
        }

        const controlledTokens = canvas.tokens.controlled;
        const controlledTokenIds = controlledTokens ? controlledTokens.map(t => t.id) : [];
        const controlledCombatants = game.combat.combatants.filter(c => controlledTokenIds.includes(c.tokenId));
        const controlledCombatantIds = controlledCombatants ? controlledCombatants.map(c => c._id) : [];
        const slides = ui.combatCarousel.splide.root.querySelectorAll("li.splide__slide");
        return slides.forEach(s => {
            if (controlledCombatantIds.includes(s.dataset.combatantId)) return;
            s.style.borderColor = null;
        });
        */
    });

    Hooks.on("controlToken", (token, controlled) => {
        if (!ui?.combatCarousel?.splide || !game.combat) return;

        const combatant = game.combat.combatants.find(c => c.tokenId === token.id);

        if (!combatant) return;

        const slide = ui.combatCarousel?.splide?.root.querySelector(`li.splide__slide[data-combatant-id="${combatant._id}"]`);
        
        if (!slide) return;

        switch (controlled) {
            case true:
                const borderColor = PIXI.utils.hex2string(token._getBorderColor());
                return slide.style.borderColor = borderColor;
                
            case false:
                return slide.style.borderColor = null;

            default:
                return;
        }
    });

    /**
     * Render Scene Controls Hook
     */
    Hooks.on("renderSceneControls", async (app, html, data) => {
        const combatState = CombatCarousel.getCombatState(game.combat);
        const carouselIcon = CAROUSEL_ICONS[combatState];

        const ccButtonHtml = await renderTemplate(`${TEMPLATE_PATH}/combat-carousel-button.hbs`,{carouselIcon});
        
        html.append(ccButtonHtml);

        const ccButton = html.find("li[data-control='combat-carousel']");
        
        ccButton
            .on("click", event => ui.combatCarousel._onModuleIconClick(event))
            .on("contextmenu", event => ui.combatCarousel.resetPosition(event))
    });
}
