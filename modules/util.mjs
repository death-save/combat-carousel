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
    const combatant = game?.combat?.combatants.find(c => c._id === combatantId);
    if (!combatant) return;

    const token = combatant.tokenId ? canvas.tokens.get(combatant.tokenId) : null;

    return token;
}


/**
 * For a given Combat instance, calculate the new turn order and return it
 * @param {Combat} combat  a given Combat instance (default: active combat)
 */
export function calculateTurns(combat=game.combat) {
    if (!combat) return null;

    // Populate additional data for each combatant
    let turns = combat.combatants.map(c => setupTurn(c, combat.scene)).filter(c => c.token && c.visible);

    // Sort turns into initiative order: (1) initiative, (2) name, (3) tokenId
    turns = turns.sort((a, b) => {
        const ia = Number.isNumeric(a.initiative) ? a.initiative : -9999;
        const ib = Number.isNumeric(b.initiative) ? b.initiative : -9999;
        let ci = ib - ia;
        if ( ci !== 0 ) return ci;
        let [an, bn] = [a.token.name || "", b.token.name || ""];
        let cn = an.localeCompare(bn);
        if ( cn !== 0 ) return cn;
        return a.tokenId - b.tokenId;
    });

    return turns;
}

/**
 * Enriches combatant data to prepare for use in the CombatTracker
 * @param combatant 
 */
export function setupTurn(combatant, scene=game.combat.scene) {
    if (!combatant || !scene) return;
        
    const players = game.users.players;
    const decimals = CONFIG.Combat.initiative.decimals;

    // Duplicate the combatant for comparison or rollback
    let c = duplicate(combatant);

    // Basic data
    c.token = scene.getEmbeddedEntity("Token", c.tokenId);
    if ( !c.token ) return c;
    c.actor = Actor.fromToken(new Token(c.token, scene));
    c.players = c.actor ? players.filter(u => c.actor.hasPerm(u, "OWNER")) : [];
    c.owner = game.user.isGM || (c.actor ? c.actor.owner : false);
    c.visible = c.owner || !c.hidden;

    // Name and Image
    c.name = c.token.name || c.actor.name;

    // Turn order and initiative
    c.initiative = isNaN(parseFloat(c.initiative)) ? null : Number(c.initiative).toFixed(decimals);
    c.hasRolled = c.initiative !== null;

    return c;
}