export function getRandomPokemonId() {
    return Math.floor(Math.random() * 898) + 1; // Всего 898 покемонов 
}

export function simulateBattle(pokemon1, pokemon2) {
    // Простая логика определения победителя
    const score1 = calculateBattleScore(pokemon1);
    const score2 = calculateBattleScore(pokemon2);
    
    return score1 > score2 ? pokemon1 : pokemon2;
}

function calculateBattleScore(pokemon) {
    return pokemon.stats.attack * 0.4 + 
           pokemon.stats.defense * 0.3 + 
           pokemon.stats.hp * 0.2 + 
           pokemon.stats.speed * 0.1;
}