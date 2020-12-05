/**
 * Config module
 * @module config
 */

/**
 * Module Name
 */
export const NAME = "combat-carousel";

/**
 * Module title
 */
export const TITLE = "Combat Carousel";

/**
 * Path to module
 */
export const PATH = "modules/combat-carousel";

/**
 * Path to templates
 */
export const TEMPLATE_PATH = `${PATH}/templates`;

/**
 * Module Icon Paths
 */
export const CAROUSEL_ICONS = {
    noCombat: "modules/combat-carousel/icons/empty-carousel-solid.svg",
    noTurns: "modules/combat-carousel/icons/empty-carousel-solid2.svg",
    hasTurns: "modules/combat-carousel/icons/combat-carousel-solid2.svg"
}

/**
 * Settings Keys
 */
export const SETTING_KEYS = {
    about: "about",
    appPosition: "appPosition",
    overlayConfigMenu: "overlayConfigMenu",
    collapseNav: "collapseNav",
    showHealth: "showHealthBar",
    healthBarPermission: "playerHealthBarPermission",
    overlaySettings: "overlaySettings"
}

/**
 * Default Config
 */
export const DEFAULT_CONFIG = {
    // @todo #1 Create this programmatically in the future...
    overlaySettings: [
        {
            name: "",
            img: "/icons/svg/d20-black.svg",
            value: ""
        },
        {
            name: "",
            img: "/icons/svg/d20-black.svg",
            value: ""
        },
        {
            name: "",
            img: "/icons/svg/d20-black.svg",
            value: ""
        },
        {
            name: "",
            img: "/icons/svg/d20-black.svg",
            value: ""
        }
    ],
    healthBarPermission: {
        choices: {
            owner: "All Owned",
            token: "Use Token Setting",
            none: "None" 
        }
    },
    appPosition: {
        left: 120,
        top: 0,
        width: null,
        height: null,
        scale: 1.0
    }
}