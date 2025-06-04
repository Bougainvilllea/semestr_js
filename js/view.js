export function showMainScreen(username) {
    document.getElementById('welcome-screen').classList.remove('active');
    const mainScreen = document.getElementById('main-screen');
    mainScreen.classList.add('active', 'animate__animated', 'animate__fadeIn');
    document.getElementById('user-name').textContent = username;
}

export function displayPokemon(pokemon, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <h3 class="animate__animated animate__bounceIn">${capitalizeFirstLetter(pokemon.name)}</h3>
        <img class="animate__animated animate__zoomIn" src="${pokemon.image}" alt="${pokemon.name}">
        <div class="stats animate__animated animate__fadeInUp">
            <p>❤️ HP: ${pokemon.stats.hp}</p>
            <p>⚔️ Атака: ${pokemon.stats.attack}</p>
            <p>🛡️ Защита: ${pokemon.stats.defense}</p>
            <p>🏃 Скорость: ${pokemon.stats.speed}</p>
        </div>
    `;
    document.getElementById('selected-pokemon').classList.remove('hidden');
}

export function showBattleScreen() {
    document.getElementById('pokemon-selection').classList.add('hidden');
    document.getElementById('battle-screen').classList.remove('hidden');
}

export function displayBattlePokemons(playerPokemon, enemyPokemon) {
    displayPokemon(playerPokemon, 'player-pokemon');
    displayPokemon(enemyPokemon, 'enemy-pokemon');
}

export function showBetButtons(playerPokemon, enemyPokemon, callback) {
    const buttonsContainer = document.getElementById('bet-buttons');
    buttonsContainer.innerHTML = '';
    
    const playerBtn = document.createElement('button');
    playerBtn.textContent = capitalizeFirstLetter(playerPokemon.name);
    playerBtn.className = "my-button";
    playerBtn.addEventListener('click', () => callback(playerPokemon));
    
    const enemyBtn = document.createElement('button');
    enemyBtn.textContent = capitalizeFirstLetter(enemyPokemon.name);
    enemyBtn.className = "my-button";
    enemyBtn.addEventListener('click', () => callback(enemyPokemon));
    
    buttonsContainer.appendChild(playerBtn);
    buttonsContainer.appendChild(enemyBtn);
}

export function showFightButton() {
    document.getElementById('fight-btn').classList.remove('hidden');
}

export function showResult(winner, selectedForBet) {
    document.getElementById('battle-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    
    const winnerDisplay = document.getElementById('winner-display');
    winnerDisplay.innerHTML = `
        <h3>${capitalizeFirstLetter(winner.name)}</h3>
        <img src="${winner.image}" alt="${winner.name}">
    `;
    
    if (winner.name === selectedForBet.name) {
        winnerDisplay.innerHTML += '<p>Ваша ставка сыграла!</p>';
    } else {
        winnerDisplay.innerHTML += '<p>Ваша ставка не сыграла</p>';
    }
}

export function enableSaveButton(winner) {
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = false;
    saveBtn.addEventListener('click', () => savePokemonImage(winner));
}

export function resetUI() {
    document.getElementById('pokemon-selection').classList.remove('hidden');
    document.getElementById('selected-pokemon').classList.add('hidden');
    document.getElementById('battle-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('pokemon-display').innerHTML = '';
    document.getElementById('battle-btn').classList.add('hidden');
    document.getElementById('fight-btn').classList.add('hidden');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function savePokemonImage(pokemon) {
    console.log('Saving image of', pokemon.name);
}
