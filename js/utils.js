// Функция для генерации случайного ID покемона
export function getRandomPokemonId() {
    // Math.random() дает число от 0 (включительно) до 1 (не включительно)
    // Умножаем на 898, чтобы получить число от 0 до 897.999...
    // Math.floor округляет вниз до целого (0-897)
    // +1 сдвигает диапазон на 1-898
    return Math.floor(Math.random() * 898) + 1; // Всего 898 покемонов в API
}

// Функция симуляции битвы между двумя покемонами
export function simulateBattle(pokemon1, pokemon2) {
    // Рассчитываем боевые очки для каждого покемона
    const score1 = calculateBattleScore(pokemon1);
    const score2 = calculateBattleScore(pokemon2);
    
    // Сравниваем очки и возвращаем покемона с более высоким счетом
    // Если очки равны, победителем будет pokemon2 (из-за условия ">")
    return score1 > score2 ? pokemon1 : pokemon2;
}

// Вспомогательная функция для расчета боевого рейтинга покемона
function calculateBattleScore(pokemon) {
    // Формула расчета:
    // Атака (40% веса) + Защита (30%) + HP (20%) + Скорость (10%)
    // Это взвешенная сумма характеристик, где атака имеет наибольший вес
    return pokemon.stats.attack * 0.4 +    // 40% от атаки
           pokemon.stats.defense * 0.3 +   // 30% от защиты
           pokemon.stats.hp * 0.2 +       // 20% от здоровья
           pokemon.stats.speed * 0.1;     // 10% от скорости
}