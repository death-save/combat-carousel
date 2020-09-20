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
    const combatant = game?.combat?.combatants.find(c => c._id === combatantId);
    if (!combatant) return;

    const token = combatant.tokenId ? canvas.tokens.get(combatant.tokenId) : null;

    return token;
}