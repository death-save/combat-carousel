/**
 * CombatCarouselConfig module
 * @module config-form
 */

import { NAME, SETTING_KEYS, TEMPLATE_PATH } from "./config.mjs";

/**
 * A form-app for setting the icons and properties to use in the Combat Carousel Overlay
 * @extends FormApplication
 */
export default class CombatCarouselConfig extends FormApplication {
    /**
     * Class instance constructor
     * @param args 
     */
    constructor(...args) {
        super(...args);
    }

    /**
     * Get the default options for the class
     * @override
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "combat-carousel-config",
            template: `${TEMPLATE_PATH}/config-form.hbs`,
            title: "COMBAT_CAROUSEL.OVERLAY_CONFIG.Title",
            width: 400,
            height: "auto",
            resizable: true,
            classes: ["sheet"]
        });
    }

    /**
     * Gets data for the template
     */
    getData() {
        const overlaySettings = game.settings.get(NAME, SETTING_KEYS.overlaySettings);
        return {
            overlaySettings,
            barAttributes: this.getAttributeChoices()
        }
    }

    /**
     * Update handler following form submission
     * @param {Event} event form submit event
     * @param {Object} formData 
     */
    async _updateObject(event, formData) {
        const oldValues = game.settings.get(NAME, SETTING_KEYS.overlaySettings);
        const newValues = oldValues ? duplicate(oldValues) : [];
        const names = [];
        const icons = [];
        const actorProperties = [];

        const nameRegex = new RegExp("name", "i");
        const iconRegex = new RegExp("icon", "i");
        const actorPropertyRegex = new RegExp("actor-property", "i");
        const indexRegex = /\d+/;

        for (const key in formData) {
            const index = key.match(indexRegex)[0];

            if (key.match(nameRegex)) {
                //names.splice(index, 0, value);
                newValues[index].name = formData[key];
            } else if (key.match(iconRegex)) {
                //icons.splice(index, 0, value);
                newValues[index].img = formData[key];
            } else if (key.match(actorPropertyRegex)) {
                //actorProperties.splice(index, 0, value);
                newValues[index].value = formData[key];
            }
        }

        await game.settings.set(NAME, SETTING_KEYS.overlaySettings, newValues);
        ui?.combatCarousel?.render();
    }

    /**
     * Attach listeners
     * @param html 
     */
    activateListeners(html) {
        const imgPathInput = html.find("input.icon-path");
        const cancelButton = html.find("button[name='cancel']");

        imgPathInput.on("change", (event, html) => this._onImgPathChange(event, html));
        cancelButton.on("click", (event) => this.close());

        super.activateListeners(html);
    }

    /**
     * Img Path Change handler
     * @param event 
     * @param html 
     */
    _onImgPathChange(event, html) {
        const row = event.currentTarget.closest("div.overlay-row");
        const index = row ? row.dataset.row : null;
        const icon = row.querySelector("img");
        icon.src = event.currentTarget.value;
    }

    /**
     * Get an Array of attribute choices which could be tracked for Actors in the Combat Tracker
     * @return {Promise<Array>}
     */
    getAttributeChoices() {
        const actorData = {};
        for ( let model of Object.values(game.system.model.Actor) ) {
            mergeObject(actorData, model);
        }
        const attributes = TokenDocument.getTrackedAttributes(actorData, []);
        //attributes.bar.forEach(a => a.push("value"));
        return TokenDocument.getTrackedAttributeChoices(attributes);
    }
}