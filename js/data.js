// Базовый URL для API PokéAPI
const API_BASE_URL = 'https://pokeapi.co/api/v2';

// Функция для получения случайного покемона
export async function fetchRandomPokemon() {
    // Генерируем случайный ID от 1 до 898 (всего 898 покемонов в API)
    const randomId = Math.floor(Math.random() * 898) + 1;
    // Используем функцию fetchPokemonDetails для получения данных по этому ID
    return fetchPokemonDetails(randomId);
}

// Функция для получения детальной информации о покемоне по ID
export async function fetchPokemonDetails(id) {
    try {
        // Делаем запрос к API для получения данных покемона
        const response = await fetch(`${API_BASE_URL}/pokemon/${id}`);
        
        // Если ответ не успешный (статус не 200-299), выбрасываем ошибку
        if (!response.ok) throw new Error('Pokemon not found');
        
        // Парсим JSON-ответ от сервера
        const data = await response.json();
        
        // Форматируем полученные данные в удобный для приложения формат
        return {
            id: data.id,                          // ID покемона
            name: data.name,                      // Имя покемона
            // URL официального арта покемона
            image: data.sprites.other['official-artwork'].front_default,
            // Извлекаем и структурируем статистики покемона
            stats: {
                hp: data.stats[0].base_stat,      // Здоровье (HP)
                attack: data.stats[1].base_stat,  // Атака
                defense: data.stats[2].base_stat, // Защита
                speed: data.stats[5].base_stat    // Скорость
            }
        };
    } catch (error) {
        // Обработка ошибок при запросе
        console.error('Error fetching pokemon:', error);
        return null; // Возвращаем null в случае ошибки
    }
}