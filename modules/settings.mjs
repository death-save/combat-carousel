import AboutApp from "./about.mjs";
import { DEFAULT_CONFIG } from "./config.mjs";
import { SETTING_KEYS } from "./config.mjs";
import { NAME } from "./config.mjs";

export default function registerSettings() {
    game.settings.registerMenu(NAME, SETTING_KEYS.about, {
        name: "SETTINGS.AboutN",
        label: "About Combat Carousel",
        hint: "SETTINGS.AboutH",
        icon: "fas fa-question",
        type: AboutApp,
        restricted: false
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

    game.settings.register(NAME, SETTING_KEYS.showHealth, {
        name: "SETTINGS.ShowHealthN",
        hint: "SETTINGS.ShowHealthH",
        scope: "client",
        type: Boolean,
        default: true,
        config: true,
        onChange: s => {
            ui.combatCarousel.render(true);
        }
    });

    game.settings.register(NAME, SETTING_KEYS.healthBarPermission, {
        name: "SETTINGS.HealthBarPermissionN",
        hint: "SETTINGS.HealthBarPermissionH",
        scope: "world",
        type: String,
        default: "owner",
        choices: DEFAULT_CONFIG.healthBarPermission.choices,
        config: true,
        onChange: s => {
            if (!game.user.isGM) {
                ui.combatCarousel.render(true);
            }
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
}