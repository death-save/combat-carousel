/**
 * Util module
 * @module util
 */

/**
 * Retrieves a key using the given value
 * @param {Object} object -- the object that contains the key/value
 * @param {*} value 
 */
export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

/**
 * Helper to get Token instance based on Combatant Id
 * @param {*} combatantId 
 */
export function getTokenFromCombatantId(combatantId) {
    const combatant = game?.combat?.combatants.find(c => c.id === combatantId);
    if (!combatant) return;

    const token = combatant.token ?? null;

    return token;
}

/**
 * Helper to get Actor instance based on Combatant Id
 * @param {*} combatantId 
 */
export function getActorFromCombatantId(combatantId) {
    const combatant = game?.combat?.combatants.find(c => c.id === combatantId);
    if (!combatant) return;

    const actor = combatant.actor ?? null;

    return actor;
}

/**
 * Gets all the siblings of a given element
 * Adapted from: https://stackoverflow.com/a/51670871/7351584
 * @param {Element} element 
 * @param {Element} [parent] 
 * @returns {Array} siblings
 */
export function getAllElementSiblings(element, parent) {
    if (!parent) parent = element.parentElement;

    const children = [...parent.children];

    return children.filter(child => child !== element);
}

/**
 * Sets a string to Title Case
 * @param {*} string 
 */
export function toTitleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
