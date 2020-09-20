import { DEFAULT_CONFIG } from "./config.mjs";
import { SETTING_KEYS } from "./config.mjs";
import { NAME } from "./config.mjs";

export default function registerSettings() {
    game.settings.register(NAME, SETTING_KEYS.collapseNav, {
        name: "SETTINGS.CollapseNavN",
        hint: "SETTINGS.CollapseNavH",
        scope: "client",
        type: Boolean,
        default: false,
        config: true,
        onchange: s => {

        }
    });

    game.settings.register(NAME, SETTING_KEYS.showHealth, {
        name: "SETTINGS.ShowHealthN",
        hint: "SETTINGS.ShowHealthH",
        scope: "client",
        type: Boolean,
        default: true,
        config: true,
        onchange: s => {

        }
    });

    game.settings.register(NAME, SETTING_KEYS.overlaySettings, {
        name: "SETTINGS.PropertyOverlayN",
        hint: "SETTINGS.PropertyOverlayH",
        scope: "world",
        type: Object,
        default: DEFAULT_CONFIG.overlaySettings,
        config: false,
        onchange: s => {

        }
    });
}