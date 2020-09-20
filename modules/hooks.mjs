import CombatCarousel from "./combat-carousel.mjs";
import registerSettings from "./settings.mjs";
import overrideMethods from "./overrides.mjs";
import { NAME, SETTING_KEYS } from "./config.mjs";
import { getTokenFromCombatantId } from "./util.mjs";

/**
 * Registers hooks needed throughout the module
 */
export default function registerHooks() {
    Hooks.on("init", () => {
        registerSettings();
        overrideMethods();
    }); 

    Hooks.on("ready", () => {
        ui.combatCarousel = new CombatCarousel();
        
        if (game.combat) {
            ui.combatCarousel.render(true);
        }
    });

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
    
    Hooks.on("createCombat", (combat, createData, options, userId) => {
        
        ui.combatCarousel.render(true);
    });
    
    Hooks.on("createCombatant", (combat, createData, options, userId) => {
        console.log("create combatantant:", {combat, createData, options, userId});
        ui.combatCarousel.render(true);
    });
    
    Hooks.on("updateCombatant", (combat, update, options, userId) => {
        console.log("combatant update", {combat, update, options, userId});
        //ui.combatCarousel.splide.go()
        //ui.combatCarousel.splide.refresh();
        ui.combatCarousel.render(true);
    });

    Hooks.on("deleteCombatant", (combat, combatant, options, userId) => {
        console.log("delete combatant:", {combat, combatant, options, userId});
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

    Hooks.on("renderCombatCarousel", (app, html, data) => {
    });

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
