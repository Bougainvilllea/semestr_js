const API_BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchRandomPokemon() {
    const randomId = Math.floor(Math.random() * 898) + 1; // Всего 898 покемонов 
    return fetchPokemonDetails(randomId);
}

export async function fetchPokemonDetails(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${id}`);
        if (!response.ok) throw new Error('Pokemon not found');
        
        const data = await response.json();
        
        return {
            id: data.id,
            name: data.name,
            image: data.sprites.other['official-artwork'].front_default,
            stats: {
                hp: data.stats[0].base_stat,
                attack: data.stats[1].base_stat,
                defense: data.stats[2].base_stat,
                speed: data.stats[5].base_stat
            }
        };
    } catch (error) {
        console.error('Error fetching pokemon:', error);
        return null;
    }
}