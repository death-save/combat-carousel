import CombatCarousel from "./combat-carousel.mjs";
import registerSettings from "./settings.mjs";
import overrideMethods from "./overrides.mjs";
import { NAME, SETTING_KEYS } from "./config.mjs";
import { getTokenFromCombatantId, calculateTurns } from "./util.mjs";
import { preloadHandlebarsTemplates } from "./templates.mjs";

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
        ui.combatCarousel = new CombatCarousel();
        ui.combatCarousel.render(true);
    });

    /* -------------------------------------------- */
    /*                 Entity Hooks                 */
    /* -------------------------------------------- */

    /* ------------------ Combat ------------------ */

    /**
     * Create Combat hook
     */
    Hooks.on("createCombat", (combat, createData, options, userId) => {
        ui.combatCarousel.render();
        /*
        if (ui.combatCarousel._collapsed) {
            ui.combatCarousel.expand();
        }
        ui.combatCarousel.setToggleIcon();
        */
    });

    Hooks.on("updateCombat", (combat, update, options, userId) => {
        console.log("combat update", {combat, update, options, userId});
        /*
        if (hasProperty(update, "turn")) {
            if (update.turn != ui.combatCarousel.turn) {
                ui.combatCarousel.splide.go(update.turn);
                return ui.combatCarousel.turn = update.turn;
            }
        }

        ui.combatCarousel.render(true);
        */

        if (combat.turns.length <= 0) {
            ui.combatCarousel.collapse();
            ui.combatCarousel.setToggleIcon("noTurns");
        }
        
    });
    
    Hooks.on("deleteCombat", (combat, options, userId) => {
        ui.combatCarousel.render();
    });
    
    /* ----------------- Combatant ---------------- */

    /**
     * Create Combatant hook
     */
    Hooks.on("createCombatant", async (combat, createData, options, userId) => {
        console.log("create combatantant:", {combat, createData, options, userId});
        
        // calculate the new turn order
        const newTurns = calculateTurns(combat);

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
    });
    
    /**
     * Update Combatant hook
     */
    Hooks.on("updateCombatant", async (combat, update, options, userId) => {
        console.log("combatant update", {combat, update, options, userId});
        //ui.combatCarousel.splide.go()
        //ui.combatCarousel.splide.refresh();

        await ui.combatCarousel.render();
    });

    /**
     * Delete Combatant hook
     */
    Hooks.on("deleteCombatant", (combat, combatant, options, userId) => {
        console.log("delete combatant:", {combat, combatant, options, userId});
        
        const index = ui.combatCarousel.getCombatantSlideIndex(combatant);

        if (index < 0) return;

        ui.combatCarousel.splide.remove(index);
    });

    /* -------------------------------------------- */
    /*                 Render Hooks                 */
    /* -------------------------------------------- */

    /**
     * SceneNavigation render hook
     */
    Hooks.on("renderSceneNavigation", (app, html, data) => {
        if (!ui.combatCarousel) return;

        const collapsed = data?.collapsed || app?.data?.collapsed || null;

        if (collapsed) {
            ui.combatCarousel.element.css({"top": "12px"});
            ui.combatCarousel.element.find(".carousel-icon").css({"top": "47px"});
        } else {
            ui.combatCarousel.element.css({"top": `${app.element.height() + 12 + 5}px`});
            ui.combatCarousel.element.find(".carousel-icon").css({"top": "auto"});
        }
    });

    /**
     * SceneNavigation collapse/expand hook
     */
    Hooks.on("collapseSceneNavigation", (app, collapsed) => {
        if (!ui.combatCarousel) return;

        if (collapsed) {
            ui.combatCarousel.element.css({"top": "12px"});
            ui.combatCarousel.element.find(".carousel-icon").css({"top": "42px"});
        } else {
            ui.combatCarousel.element.css({"top": `${app.element.height() + 12 + 5}px`});
            ui.combatCarousel.element.find(".carousel-icon").css({"top": "auto"});
        }
    });

    /**
     * CombatCarousel render hook
     */
    Hooks.on("renderCombatCarousel", (app, html, data) => {
    });

    /* -------------------------------------------- */
    /*              Miscellaneous Hooks             */
    /* -------------------------------------------- */

    /**
     * Hover Token hook
     */
    Hooks.on("hoverToken", (token, hovered) => {
        if (!ui?.combatCarousel?.splide || !game.combat) return;

        if (hovered) {
            const combatant = game.combat.combatants.find(c => c.tokenId === token.id);
            const borderColor = PIXI.utils.hex2string(token._getBorderColor());

            if (!combatant) return;
            const slide = ui.combatCarousel?.splide?.root.querySelector(`li.splide__slide[data-combatant-id="${combatant._id}"]`);
            if (!slide) return;
            return slide.style.borderColor = borderColor;
        }

        const slides = ui.combatCarousel.splide.root.querySelectorAll("li.splide__slide");
        return slides.forEach(s => s.style.borderColor = null);
    });
}
