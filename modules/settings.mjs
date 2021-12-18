/**
 * Settings module
 * @module settings
 */

import AboutApp from "./about.mjs";
import CombatCarousel from "./combat-carousel.mjs";
import CombatCarouselConfig from "./config-form.mjs";
import { DEFAULT_CONFIG } from "./config.mjs";
import { SETTING_KEYS } from "./config.mjs";
import { NAME } from "./config.mjs";
import { getKeyByValue } from "./util.mjs";

/**
 * Wrapper to call settings registration
 */
export default function registerSettings() {

    /* -------------------------------------------------------------------------- */
    /*                                    Menus                                   */
    /* -------------------------------------------------------------------------- */

    game.settings.registerMenu(NAME, SETTING_KEYS.about, {
        name: "COMBAT_CAROUSEL.SETTINGS.AboutN",
        label: "COMBAT_CAROUSEL.ABOUT.Label",
        hint: "COMBAT_CAROUSEL.SETTINGS.AboutH",
        icon: "fas fa-question",
        type: AboutApp,
        restricted: false
    });

    game.settings.registerMenu(NAME, SETTING_KEYS.overlayConfigMenu, {
        name: "COMBAT_CAROUSEL.OVERLAY_CONFIG.Name",
        label: "COMBAT_CAROUSEL.OVERLAY_CONFIG.Name",
        hint: "COMBAT_CAROUSEL.SETTINGS.OverlayConfigH",
        icon: "fas fa-th-list",
        type: CombatCarouselConfig,
        restricted: true
    });

    /* -------------------------------------------------------------------------- */
    /*                               Basic Settings                               */
    /* -------------------------------------------------------------------------- */

    game.settings.register(NAME, SETTING_KEYS.enabled, {
        name: "COMBAT_CAROUSEL.SETTINGS.EnableModuleN",
        hint: "COMBAT_CAROUSEL.SETTINGS.EnableModuleH",
        scope: "client",
        type: Boolean,
        default: true,
        config: true,
        onChange: async (s) => {
            if (s) {
                const controlsHtml = ui.controls.element;
                await CombatCarousel._onRenderSceneControls(null, controlsHtml, null);
                return CombatCarousel._onReady();
            }

            if (s === false) {
                if (ui.combatCarousel?.rendered) ui.combatCarousel.close();
                const controlsHtml = ui.controls.element;
                const ccButton = controlsHtml.find("li[data-control='combat-carousel']");
                ccButton.remove();
            }
        }
    });

    game.settings.register(NAME, SETTING_KEYS.collapseNav, {
        name: "COMBAT_CAROUSEL.SETTINGS.CollapseNavN",
        hint: "COMBAT_CAROUSEL.SETTINGS.CollapseNavH",
        scope: "client",
        type: Boolean,
        default: false,
        config: true,
        onChange: s => {

        }
    });

    game.settings.register(NAME, SETTING_KEYS.openOnCombatCreate, {
        name: "COMBAT_CAROUSEL.SETTINGS.OpenOnCombatCreateN",
        hint: "COMBAT_CAROUSEL.SETTINGS.OpenOnCombatCreateH",
        scope: "client",
        type: Boolean,
        default: false,
        config: true,
        onChange: s => {

        }
    });

    game.settings.register(NAME, SETTING_KEYS.carouselSize, {
        name: "COMBAT_CAROUSEL.SETTINGS.CarouselSizeN",
        hint: "COMBAT_CAROUSEL.SETTINGS.CarouselSizeH",
        scope: "client",
        type: String,
        default: getKeyByValue(DEFAULT_CONFIG.carouselSize.choices, DEFAULT_CONFIG.carouselSize.choices.med),
        choices: DEFAULT_CONFIG.carouselSize.choices,
        config: true,
        onChange: async s => {
            if (ui.combatCarousel?.rendered) {
                await ui.combatCarousel.render(true);
                ui.combatCarousel.element.addClass(s);
            }
        }
    });

    game.settings.register(NAME, SETTING_KEYS.imageType, {
        name: "COMBAT_CAROUSEL.SETTINGS.ImageTypeN",
        hint: "COMBAT_CAROUSEL.SETTINGS.ImageTypeH",
        scope: "world",
        type: String,
        default: "actor",
        choices: DEFAULT_CONFIG.imageType.choices,
        config: true,
        onChange: s => {
            if (ui.combatCarousel?.rendered) ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.controlActiveCombatantToken, {
        name: "COMBAT_CAROUSEL.SETTINGS.ControlActiveCombatantTokenN",
        hint: "COMBAT_CAROUSEL.SETTINGS.ControlActiveCombatantTokenH",
        scope: "client",
        type: Boolean,
        default: false,
        config: true,
        onChange: s => {
        }
    });

    game.settings.register(NAME, SETTING_KEYS.panOnClick, {
        name: "COMBAT_CAROUSEL.SETTINGS.PanOnClickN",
        hint: "COMBAT_CAROUSEL.SETTINGS.PanOnClickH",
        scope: "client",
        type: Boolean,
        default: false,
        config: true,
        onChange: s => {
        }
    });

    game.settings.register(NAME, SETTING_KEYS.alwaysOnTop, {
        name: "COMBAT_CAROUSEL.SETTINGS.AlwaysOnTopN",
        hint: "COMBAT_CAROUSEL.SETTINGS.AlwaysOnTopH",
        scope: "client",
        type: Boolean,
        default: false,
        config: true,
        onChange: s => {
            if (ui.combatCarousel?.rendered) ui.combatCarousel.render(true);
        }
    });

    /* -------------------------------------------------------------------------- */
    /*                              Overlay Settings                              */
    /* -------------------------------------------------------------------------- */

    game.settings.register(NAME, SETTING_KEYS.showOverlay, {
        name: "COMBAT_CAROUSEL.SETTINGS.ShowOverlayN",
        hint: "COMBAT_CAROUSEL.SETTINGS.ShowOverlayH",
        scope: "client",
        type: String,
        default: getKeyByValue(DEFAULT_CONFIG.showOverlay.choices, DEFAULT_CONFIG.showOverlay.choices.hover),
        choices: DEFAULT_CONFIG.showOverlay.choices,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.overlayPermission, {
        name: "COMBAT_CAROUSEL.SETTINGS.OverlayPermissionN",
        hint: "COMBAT_CAROUSEL.SETTINGS.OverlayPermissionH",
        scope: "world",
        type: String,
        default: "owner",
        choices: DEFAULT_CONFIG.overlayPermission.choices,
        config: true,
        onChange: s => {
            if (!game.user.isGM) {
                ui.combatCarousel.render(true);
            }
        }
    });

    game.settings.register(NAME, SETTING_KEYS.showEffects, {
        name: "COMBAT_CAROUSEL.SETTINGS.ShowEffectsN",
        hint: "COMBAT_CAROUSEL.SETTINGS.ShowEffectsH",
        scope: "world",
        type: String,
        default: "all",
        choices: DEFAULT_CONFIG.showEffects.choices,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    /* -------------------------------------------------------------------------- */
    /*                             Initiative Settings                            */
    /* -------------------------------------------------------------------------- */

    game.settings.register(NAME, SETTING_KEYS.showInitiative, {
        name: "COMBAT_CAROUSEL.SETTINGS.ShowInitiativeN",
        hint: "COMBAT_CAROUSEL.SETTINGS.ShowInitiativeH",
        scope: "world",
        type: String,
        default: "always",
        choices: DEFAULT_CONFIG.showInitiative.choices,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.showInitiativeIcon, {
        name: "COMBAT_CAROUSEL.SETTINGS.ShowInitiativeIconN",
        hint: "COMBAT_CAROUSEL.SETTINGS.ShowInitiativeIconH",
        scope: "world",
        type: String,
        default: "always",
        choices: DEFAULT_CONFIG.showInitiativeIcon.choices,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.initiativePermission, {
        name: "COMBAT_CAROUSEL.SETTINGS.InitiativePermissionN",
        hint: "COMBAT_CAROUSEL.SETTINGS.InitiativePermissionH",
        scope: "world",
        type: String,
        default: "owned",
        choices: DEFAULT_CONFIG.initiativePermission.choices,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    /* -------------------------------------------------------------------------- */
    /*                                Bar Settings                                */
    /* -------------------------------------------------------------------------- */

    game.settings.register(NAME, SETTING_KEYS.showBar1, {
        name: "COMBAT_CAROUSEL.SETTINGS.ShowBar1N",
        hint: "COMBAT_CAROUSEL.SETTINGS.ShowBar1H",
        scope: "client",
        type: String,
        choices: DEFAULT_CONFIG.showBar.choices,
        default: "always",
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.bar1Permission, {
        name: "COMBAT_CAROUSEL.SETTINGS.Bar1PermissionN",
        hint: "COMBAT_CAROUSEL.SETTINGS.Bar1PermissionH",
        scope: "world",
        type: String,
        default: "owned",
        choices: DEFAULT_CONFIG.bar1Permission.choices,
        config: true,
        onChange: s => {
            if (!game.user.isGM) {
                ui.combatCarousel.render(true);
            }
        }
    });

    game.settings.register(NAME, SETTING_KEYS.bar1Attribute, {
        name: "COMBAT_CAROUSEL.SETTINGS.Bar1AttributeN",
        hint: "COMBAT_CAROUSEL.SETTINGS.Bar1AttributeH",
        scope: "world",
        type: String,
        default: "attributes.hp",
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.bar1Title, {
        name: "COMBAT_CAROUSEL.SETTINGS.Bar1TitleN",
        hint: "COMBAT_CAROUSEL.SETTINGS.Bar1TitleH",
        scope: "world",
        type: String,
        default: DEFAULT_CONFIG.bar1Title,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    /* -------------------------------------------------------------------------- */
    /*                                Data Storage                                */
    /* -------------------------------------------------------------------------- */

    game.settings.register(NAME, SETTING_KEYS.overlaySettings, {
        name: "COMBAT_CAROUSEL.SETTINGS.PropertyOverlayN",
        hint: "COMBAT_CAROUSEL.SETTINGS.PropertyOverlayH",
        scope: "world",
        type: Object,
        default: DEFAULT_CONFIG.overlaySettings,
        config: false,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.appPosition, {
        name: "COMBAT_CAROUSEL.SETTINGS.AppPositionN",
        hint: "COMBAT_CAROUSEL.SETTINGS.AppPositionH",
        scope: "client",
        type: Object,
        default: DEFAULT_CONFIG.appPosition,
        config: false,
        onChange: s => {

        }
    });

    game.settings.register(NAME, SETTING_KEYS.collapsed, {
        name: "COMBAT_CAROUSEL.SETTINGS.CollapsedN",
        hint: "COMBAT_CAROUSEL.SETTINGS.CollapsedH",
        scope: "client",
        type: Boolean,
        default: false,
        config: false,
        onChange: s => {

        }
    });
}