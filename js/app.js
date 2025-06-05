// Импорт функций из других модулей
// data.js - функции для работы с API покемонов
// view.js - функции для работы с интерфейсом
// utils.js - вспомогательные функции
import { fetchRandomPokemon, fetchPokemonDetails } from './data.js';
import { 
    showMainScreen,
    displayPokemon,
    showBattleScreen,
    displayBattlePokemons,
    showBetButtons,
    showFightButton,
    showResult,
    enableSaveButton,
    resetUI
} from './view.js';
import { getRandomPokemonId, simulateBattle } from './utils.js';

// Глобальные переменные состояния приложения
let userName = '';          // Имя пользователя
let playerPokemon = null;   // Покемон игрока
let enemyPokemon = null;    // Покемон противника
let selectedForBet = null;  // На кого поставил пользователь
let winner = null;          // Победитель битвы
let battleHistory = [];     // История всех битв

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Получаем кнопки и назначаем обработчики событий
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', handleStart);

    const chooseFighterBtn = document.getElementById('choose-fighter');
    chooseFighterBtn.addEventListener('click', handleChooseFighter);

    const changeFighterBtn = document.getElementById('change-fighter');
    changeFighterBtn.addEventListener('click', handleChooseFighter);

    const battleBtn = document.getElementById('battle-btn');
    battleBtn.addEventListener('click', handleBattle);

    const fightBtn = document.getElementById('fight-btn');
    fightBtn.addEventListener('click', handleFight);

    const saveBtn = document.getElementById('save-btn');
    saveBtn.addEventListener('click', handleSave);

    const newBattleBtn = document.getElementById('new-battle');
    newBattleBtn.addEventListener('click', handleNewBattle);

    // Обработчики для статистики
    const statsBtn = document.getElementById('stats-btn');
    const closeStatsBtn = document.getElementById('close-stats');
    
    if (statsBtn) {
        statsBtn.addEventListener('click', showStats);
    } else {
        console.error('Элемент stats-btn не найден');
    }
    
    if (closeStatsBtn) {
        closeStatsBtn.addEventListener('click', () => {
            document.getElementById('stats-container').classList.add('hidden');
        });
    }
});

// Вспомогательная функция для форматирования строк (первая буква заглавная)
function capitalizeFirstLetter(string) {
    if (!string) return '';  // Проверка на пустую строку
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

// Обработчик начала игры
async function handleStart() {
    userName = document.getElementById('username').value.trim(); // Получаем имя пользователя
    if (!userName) {
        alert('Пожалуйста, введите ваше имя');
        return;
    }
    showMainScreen(userName); // Показываем основной экран
}

// Обработчик выбора покемона-бойца
async function handleChooseFighter() {
    const pokemonId = getRandomPokemonId(); // Получаем случайный ID покемона
    playerPokemon = await fetchPokemonDetails(pokemonId); // Загружаем детали покемона
    displayPokemon(playerPokemon, 'pokemon-display'); // Отображаем покемона
    document.getElementById('battle-btn').classList.remove('hidden'); // Показываем кнопку битвы
}

// Обработчик начала битвы
async function handleBattle() {
    const pokemonId = getRandomPokemonId(); // Получаем случайный ID для противника
    enemyPokemon = await fetchPokemonDetails(pokemonId); // Загружаем детали покемона противника
    showBattleScreen(); // Показываем экран битвы
    displayBattlePokemons(playerPokemon, enemyPokemon); // Отображаем обоих покемонов
    showBetButtons(playerPokemon, enemyPokemon, handleBetSelection); // Показываем кнопки для ставок
}

// Обработчик выбора ставки
function handleBetSelection(selectedPokemon) {
    selectedForBet = selectedPokemon; // Сохраняем выбранного покемона
    showFightButton(); // Показываем кнопку "Драться"
}

// Обработчик битвы покемонов
async function handleFight() {
    // Определяем победителя с помощью симуляции
    winner = simulateBattle(playerPokemon, enemyPokemon);
    // Определяем проигравшего
    const loser = winner.name === playerPokemon.name ? enemyPokemon : playerPokemon;
    
    // Добавляем запись в историю битв
    battleHistory.push({
        winner: winner,
        loser: loser,
        date: new Date().toLocaleString(), // Текущая дата и время
        userBet: selectedForBet.name // На кого ставил пользователь
    });
    
    // Показываем результат битвы
    showResult(winner, selectedForBet);
}

// Обработчик сохранения изображения покемона
async function handleSave() {
    if (!winner || !winner.image) return; // Проверяем наличие победителя и его изображения
    
    try {
        // Создаем временный элемент изображения
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Разрешаем кросс-доменные запросы
        img.src = winner.image;
        
        // Ждем загрузки изображения
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        
        // Создаем canvas для обработки изображения
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth; // Ширина оригинального изображения
        canvas.height = img.naturalHeight; // Высота оригинального изображения
        const ctx = canvas.getContext('2d');
        
        // Рисуем изображение на canvas
        ctx.drawImage(img, 0, 0);
        
        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.download = `pokemon_${winner.name}.png`; // Имя файла
        link.href = canvas.toDataURL('image/png'); // Данные изображения в формате PNG
        link.click(); // Программный клик для скачивания
        
    } catch (error) {
        console.error('Error saving pokemon image:', error);
        alert('Не удалось сохранить изображение покемона');
    }
}

// Обработчик новой битвы (сброс состояния)
function handleNewBattle() {
    resetUI(); // Сбрасываем интерфейс
    playerPokemon = null; // Очищаем покемона игрока
    enemyPokemon = null; // Очищаем покемона противника
    selectedForBet = null; // Очищаем ставку
    winner = null; // Очищаем победителя
}

// Функция показа статистики
function showStats() {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) {
        console.error('Контейнер статистики не найден');
        return;
    }
    
    const statsTable = document.getElementById('stats-table');
    if (!statsTable) {
        console.error('Таблица статистики не найдена');
        return;
    }

    statsTable.innerHTML = ''; // Очищаем таблицу
    
    if (battleHistory.length === 0) {
        statsTable.innerHTML = '<p>Нет данных о боях</p>'; // Сообщение если нет истории
    } else {
        // Для каждой битвы в истории создаем карточки
        battleHistory.forEach((battle, index) => {
            // Контейнер для одной записи боя
            const battleRecord = document.createElement('div');
            battleRecord.className = 'battle-record';
            
            // Карточка победителя
            const winnerCard = document.createElement('div');
            winnerCard.className = 'stat-item winner';
            winnerCard.innerHTML = `
                <img src="${battle.winner.image}" alt="${battle.winner.name}">
                <p>${capitalizeFirstLetter(battle.winner.name)}</p>
                <small>Победитель</small>
                <small>${battle.date}</small>
            `;
            
            // Карточка проигравшего
            const loserCard = document.createElement('div');
            loserCard.className = 'stat-item loser';
            loserCard.innerHTML = `
                <img src="${battle.loser.image}" alt="${battle.loser.name}">
                <p>${capitalizeFirstLetter(battle.loser.name)}</p>
                <small>Проигравший</small>
                <small>${battle.date}</small>
            `;
            
            // Добавляем карточки в запись боя
            battleRecord.appendChild(winnerCard);
            battleRecord.appendChild(loserCard);
            
            // Добавляем запись в таблицу
            statsTable.appendChild(battleRecord);
        });
    }
    
    statsContainer.classList.remove('hidden'); // Показываем контейнер статистики
}