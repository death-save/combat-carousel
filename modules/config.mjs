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
    showOverlay: "showOverlay",
    overlayPermission: "overlayPermission",
    collapseNav: "collapseNav",
    collapsed: "carouselCollapsed",
    showBar1: "showBar1",
    bar1Permission: "playerBar1Permission",
    bar1Attribute: "bar1Attribute",
    bar1Title: "bar1Title",
    overlaySettings: "overlaySettings",
    carouselSize: "carouselSize",
    showInitiative: "showInitiative",
    showInitiativeIcon: "showInitiativeIcon",
    imageType: "imageType"
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
    overlayPermission: {
        choices: {
            all: "All",
            owned: "Owned Actors",
            observed: "Observed Actors",
            none: "None" 
        }
    },
    bar1Permission: {
        choices: {
            all: "All",
            owner: "All Owned",
            token: "Use Token Setting",
            none: "None" 
        }
    },
    bar1Attribute: "attributes.hp",
    bar1Title: "HP",
    appPosition: {
        left: 120,
        top: 0,
        scale: 1.0
    },
    carouselSize: {
        choices: {
            xs: "Extra Small",
            sm: "Small",
            med: "Medium",
            lg: "Large"
        },
        sizeScaleMap: {
            xs: 0.5,
            sm: 0.8,
            med: 1,
            lg: 1.2
        }
    },
    showInitiative: {
        choices: {
            never: "Never",
            onHover: "On Hover",
            activeCombatant: "Active Combatant",
            always: "Always"
        }
    },
    showInitiativeIcon: {
        choices: {
            never: "Never",
            onHover: "On Hover",
            activeCombatant: "Active Combatant",
            always: "Always"
        }
    },
    imageType: {
        choices: {
            actor: "Actor",
            tokenActor: "Token Actor",
            token: "Token"
        }
    }
}