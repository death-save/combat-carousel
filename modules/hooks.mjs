import CombatCarousel from "./combat-carousel.mjs";
import registerSettings from "./settings.mjs";
import overrideMethods from "./overrides.mjs";
import { NAME, SETTING_KEYS } from "./config.mjs";
import { getTokenFromCombatantId } from "./util.mjs";
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
        
        if (game.combat) {
            ui.combatCarousel.render(true);
        }
    });

    /* -------------------------------------------- */
    /*                 Entity Hooks                 */
    /* -------------------------------------------- */

    /* ------------------ Combat ------------------ */

    /**
     * Create Combat hook
     */
    Hooks.on("createCombat", (combat, createData, options, userId) => {
        
        ui.combatCarousel.render(true);
    });

    Hooks.on("updateCombat", (combat, update, options, userId) => {
        if (hasProperty(update, "turn")) {
            if (update.turn != ui.combatCarousel.turn) {
                ui.combatCarousel.splide.go(update.turn);
                return ui.combatCarousel.turn = update.turn;
            }
        }

        ui.combatCarousel.render(true);
        console.log("combat update", {combat, update, options, userId});
    });
    
    Hooks.on("deleteCombat", (combat, options, userId) => {
        //ui.combatCarousel.close();
        ui.combatCarousel.toggleVisibility();
    });
    
    /* ----------------- Combatant ---------------- */

    /**
     * Create Combatant hook
     */
    Hooks.on("createCombatant", async (combat, createData, options, userId) => {
        console.log("create combatantant:", {combat, createData, options, userId});
        
        const templateData = CombatCarousel.prepareCombatantData(createData);
        const combatantCard = await renderTemplate("./templates/combatant-card.hbs", templateData);
        ui.combatCarousel.splide.add(combatantCard);
        //ui.combatCarousel.render(true);
    });
    
    /**
     * Update Combatant hook
     */
    Hooks.on("updateCombatant", (combat, update, options, userId) => {
        console.log("combatant update", {combat, update, options, userId});
        //ui.combatCarousel.splide.go()
        //ui.combatCarousel.splide.refresh();
        ui.combatCarousel.render();
    });

    /**
     * Delete Combatant hook
     */
    Hooks.on("deleteCombatant", (combat, combatant, options, userId) => {
        console.log("delete combatant:", {combat, combatant, options, userId});
        const slides = ui.combatCarousel.splide.root.querySelectorAll("li");
        const combatantIds = slides.map(s => s.dataset.combatantId);
        const index = combatantIds.indexOf(combatant._id);

        ui.combatCarousel.splide.remove(index)
        //ui.combatCarousel.render(true);
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
            ui.combatCarousel.element.find(".toggle").css({"top": "47px"});
        } else {
            ui.combatCarousel.element.css({"top": `${app.element.height() + 12 + 5}px`});
            ui.combatCarousel.element.find(".toggle").css({"top": "auto"});
        }
    });

    /**
     * SceneNavigation collapse/expand hook
     */
    Hooks.on("collapseSceneNavigation", (app, collapsed) => {
        if (!ui.combatCarousel) return;

        if (collapsed) {
            ui.combatCarousel.element.css({"top": "12px"});
            ui.combatCarousel.element.find(".toggle").css({"top": "42px"});
        } else {
            ui.combatCarousel.element.css({"top": `${app.element.height() + 12 + 5}px`});
            ui.combatCarousel.element.find(".toggle").css({"top": "auto"});
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
