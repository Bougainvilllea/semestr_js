// Показывает главный экран после ввода имени пользователя
export function showMainScreen(username) {
    // Скрываем экран приветствия
    document.getElementById('welcome-screen').classList.remove('active');
    
    // Показываем главный экран с анимацией
    const mainScreen = document.getElementById('main-screen');
    mainScreen.classList.add('active', 'animate__animated', 'animate__fadeIn');
    
    // Устанавливаем имя пользователя в интерфейс
    document.getElementById('user-name').textContent = username;
}

// Отображает информацию о покемоне в указанном контейнере
export function displayPokemon(pokemon, containerId) {
    const container = document.getElementById(containerId);
    
    // Создаем HTML-разметку с анимациями для покемона
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
    
    // Показываем контейнер с выбранным покемоном
    document.getElementById('selected-pokemon').classList.remove('hidden');
}

// Переключает на экран битвы
export function showBattleScreen() {
    document.getElementById('pokemon-selection').classList.add('hidden');
    document.getElementById('battle-screen').classList.remove('hidden');
}

// Отображает обоих покемонов для битвы
export function displayBattlePokemons(playerPokemon, enemyPokemon) {
    // Используем функцию displayPokemon для каждого участника
    displayPokemon(playerPokemon, 'player-pokemon');
    displayPokemon(enemyPokemon, 'enemy-pokemon');
}

// Показывает кнопки для ставок на покемонов
export function showBetButtons(playerPokemon, enemyPokemon, callback) {
    const buttonsContainer = document.getElementById('bet-buttons');
    buttonsContainer.innerHTML = ''; // Очищаем контейнер
    
    // Создаем кнопку для ставки на покемона игрока
    const playerBtn = document.createElement('button');
    playerBtn.textContent = capitalizeFirstLetter(playerPokemon.name);
    playerBtn.className = "my-button";
    playerBtn.addEventListener('click', () => callback(playerPokemon));
    
    // Создаем кнопку для ставки на покемона противника
    const enemyBtn = document.createElement('button');
    enemyBtn.textContent = capitalizeFirstLetter(enemyPokemon.name);
    enemyBtn.className = "my-button";
    enemyBtn.addEventListener('click', () => callback(enemyPokemon));
    
    // Добавляем кнопки в контейнер
    buttonsContainer.appendChild(playerBtn);
    buttonsContainer.appendChild(enemyBtn);
}

// Показывает кнопку "Драться" после выбора ставки
export function showFightButton() {
    document.getElementById('fight-btn').classList.remove('hidden');
}

// Показывает результат битвы
export function showResult(winner, selectedForBet) {
    // Переключаем экраны
    document.getElementById('battle-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    
    // Заполняем информацию о победителе
    const winnerDisplay = document.getElementById('winner-display');
    winnerDisplay.innerHTML = `
        <h3>${capitalizeFirstLetter(winner.name)}</h3>
        <img src="${winner.image}" alt="${winner.name}">
    `;
    
    // Добавляем сообщение о результате ставки
    if (winner.name === selectedForBet.name) {
        winnerDisplay.innerHTML += '<p>Ваша ставка сыграла!</p>';
    } else {
        winnerDisplay.innerHTML += '<p>Ваша ставка не сыграла</p>';
    }
}

// Активирует кнопку сохранения изображения
export function enableSaveButton(winner) {
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = false;
    saveBtn.addEventListener('click', () => savePokemonImage(winner));
}

// Сбрасывает интерфейс к начальному состоянию
export function resetUI() {
    // Показываем экран выбора покемона
    document.getElementById('pokemon-selection').classList.remove('hidden');
    
    // Скрываем другие элементы
    document.getElementById('selected-pokemon').classList.add('hidden');
    document.getElementById('battle-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    
    // Очищаем контейнеры
    document.getElementById('pokemon-display').innerHTML = '';
    
    // Скрываем кнопки
    document.getElementById('battle-btn').classList.add('hidden');
    document.getElementById('fight-btn').classList.add('hidden');
}

// Вспомогательная функция для форматирования строки (первая буква заглавная)
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Функция для сохранения изображения покемона (заглушка)
function savePokemonImage(pokemon) {
    console.log('Saving image of', pokemon.name);
}