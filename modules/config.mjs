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
    enabled: "enabled",
    overlayConfigMenu: "overlayConfigMenu",
    showOverlay: "showOverlay",
    overlayPermission: "overlayPermission",
    showEffects: "showEffects",
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
    initiativePermission: "initiativePermission",
    imageType: "imageType",
    controlActiveCombatantToken: "controlActiveCombatantToken",
    panOnClick: "panOnClick",
    alwaysOnTop: "alwaysOnTop",
    openOnCombatCreate: "openOnCombatCreate"
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
    showOverlay: {
        choices: {
            never: "Never",
            hover: "On Hover",
            active: "Active Combatant",
            activeHover: "Active Combatant and On Hover",
            always: "Always"
        }
    },
    overlayPermission: {
        choices: {
            all: "All",
            owned: "Owned Actors",
            observed: "Observed Actors",
			limited: "Limited Actors",
            none: "None" 
        }
    },
    showBar: {
        choices: {
            never: "Never",
            hover: "On Hover",
            active: "Active Combatant",
            activeHover: "Active Combatant and On Hover",
            always: "Always"
        }
    },
    bar1Permission: {
        choices: {
            all: "All",
            owned: "Owned Actors",
            observed: "Observed Actors",
			limited: "Limited Actors",
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
            hover: "On Hover",
            active: "Active Combatant",
            activeHover: "Active Combatant and On Hover",
            always: "Always"
        }
    },
    showInitiativeIcon: {
        choices: {
            never: "Never",
            withInit: "With Initiative Value",
            unrolled: "For Unrolled Combatants",
            withInitUnrolled: "With Initiative and Unrolled",
            always: "Always"
        }
    },
    initiativePermission: {
        choices: {
            all: "All",
            owned: "Owned",
            observed: "Observed",
			limited: "Limited Actors",
            none: "None"
        }
    },
    imageType: {
        choices: {
            actor: "Actor",
            tokenActor: "Token Actor",
            token: "Token",
            combatant: "Combatant"
        }
    },
    showEffects: {
        choices: {
            all: "All Effects",
            none: "No Effects",
            allActive: "All Active Effects",
            activeTemporary: "Active Temporary Effects",
            activePassive: "Active Passive Effects"
        }
    }
}
