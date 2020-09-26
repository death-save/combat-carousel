export const NAME = "combat-carousel";
export const TITLE = "Combat Carousel";

export const CAROUSEL_ICONS = {
    noCombat: "modules/combat-carousel/icons/empty-carousel-solid.svg",
    noTurns: "modules/combat-carousel/icons/empty-carousel-solid2.svg",
    hasTurns: "modules/combat-carousel/icons/combat-carousel-solid2.svg"
}

export const SETTING_KEYS = {
    collapseNav: "collapseNav",
    showHealth: "showHealthBar",
    healthBarPermission: "playerHealthBarPermission",
    overlaySettings: "overlaySettings"
}

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
    }
}