/**
 * Settings module
 * @module settings
 */

import AboutApp from "./about.mjs";
import CombatCarouselConfig from "./config-form.mjs";
import { DEFAULT_CONFIG } from "./config.mjs";
import { SETTING_KEYS } from "./config.mjs";
import { NAME } from "./config.mjs";
import { getKeyByValue } from "./util.mjs";

/**
 * Wrapper to call settings registration
 */
export default function registerSettings() {
    game.settings.registerMenu(NAME, SETTING_KEYS.about, {
        name: "SETTINGS.AboutN",
        label: "ABOUT.Label",
        hint: "SETTINGS.AboutH",
        icon: "fas fa-question",
        type: AboutApp,
        restricted: false
    });

    game.settings.registerMenu(NAME, SETTING_KEYS.overlayConfigMenu, {
        name: "COMBAT_CAROUSEL.OverlayConfig.Name",
        label: "COMBAT_CAROUSEL.OverlayConfig.Name",
        hint: "SETTINGS.OverlayConfigH",
        icon: "fas fa-th-list",
        type: CombatCarouselConfig,
        restricted: true
    });

    game.settings.register(NAME, SETTING_KEYS.showOverlay, {
        name: "SETTINGS.ShowOverlayN",
        hint: "SETTINGS.ShowOverlayH",
        scope: "client",
        type: Boolean,
        default: true,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.overlayPermission, {
        name: "SETTINGS.OverlayPermissionN",
        hint: "SETTINGS.OverlayPermissionH",
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

    game.settings.register(NAME, SETTING_KEYS.collapseNav, {
        name: "SETTINGS.CollapseNavN",
        hint: "SETTINGS.CollapseNavH",
        scope: "client",
        type: Boolean,
        default: false,
        config: true,
        onChange: s => {

        }
    });

    game.settings.register(NAME, SETTING_KEYS.collapsed, {
        name: "SETTINGS.CollapsedN",
        hint: "SETTINGS.CollapsedH",
        scope: "client",
        type: Boolean,
        default: false,
        config: false,
        onChange: s => {

        }
    });

    game.settings.register(NAME, SETTING_KEYS.showBar1, {
        name: "SETTINGS.ShowBar1N",
        hint: "SETTINGS.ShowBar1H",
        scope: "client",
        type: Boolean,
        default: true,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.bar1Permission, {
        name: "SETTINGS.Bar1PermissionN",
        hint: "SETTINGS.Bar1PermissionH",
        scope: "world",
        type: String,
        default: "owner",
        choices: DEFAULT_CONFIG.bar1Permission.choices,
        config: true,
        onChange: s => {
            if (!game.user.isGM) {
                ui.combatCarousel.render(true);
            }
        }
    });

    game.settings.register(NAME, SETTING_KEYS.bar1Attribute, {
        name: "SETTINGS.Bar1AttributeN",
        hint: "SETTINGS.Bar1AttributeH",
        scope: "world",
        type: String,
        default: DEFAULT_CONFIG.bar1Attribute,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.bar1Title, {
        name: "SETTINGS.Bar1TitleN",
        hint: "SETTINGS.Bar1TitleH",
        scope: "world",
        type: String,
        default: DEFAULT_CONFIG.bar1Title,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.overlaySettings, {
        name: "SETTINGS.PropertyOverlayN",
        hint: "SETTINGS.PropertyOverlayH",
        scope: "world",
        type: Object,
        default: DEFAULT_CONFIG.overlaySettings,
        config: false,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.carouselSize, {
        name: "SETTINGS.CarouselSizeN",
        hint: "SETTINGS.CarouselSizeH",
        scope: "client",
        type: String,
        default: getKeyByValue(DEFAULT_CONFIG.carouselSize.sizeScaleMap.med),
        choices: DEFAULT_CONFIG.carouselSize.choices,
        config: true,
        onChange: async s => {
            await ui.combatCarousel.render(true);
            ui.combatCarousel.element.addClass(s);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.showInitiative, {
        name: "SETTINGS.ShowInitiativeN",
        hint: "SETTINGS.ShowInitiativeH",
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
        name: "SETTINGS.ShowInitiativeIconN",
        hint: "SETTINGS.ShowInitiativeIconH",
        scope: "world",
        type: String,
        default: "always",
        choices: DEFAULT_CONFIG.showInitiativeIcon.choices,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.imageType, {
        name: "SETTINGS.ImageTypeN",
        hint: "SETTINGS.ImageTypeH",
        scope: "world",
        type: String,
        default: "actor",
        choices: DEFAULT_CONFIG.imageType.choices,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });
}