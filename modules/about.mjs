/**
 * AboutApp module
 * @module about
 */

/**
 * About this module FormApp
 * @extends FormApplication
 */
export default class AboutApp extends FormApplication {
    constructor(options={}) {
        super(options);
    }

    /**
     * Call app default options
     * @override
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "combat-carousel-about",
            title: "About Combat Carousel",
            template: "modules/combat-carousel/templates/about.hbs",
            popOut: true,
            width: 500,
            height: 605
        });
    }

    /**
     * Supplies data to the template
     */
    async getData() {
        return {
            version: game.modules.get("combat-carousel").version,
            patrons: await this.fetchPatrons()
        }
    }

    /**
     * Fetches a list of Patrons to display on the About page
     */
    async fetchPatrons() {
        const jsonPath = "modules/combat-carousel/patrons.json";
        const response = await fetch(jsonPath);
        if (!response.ok) return null;

        const json = await response.json();
        return json;
    }
}