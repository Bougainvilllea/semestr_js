
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

// Глобальные переменные состояния
let userName = '';
let playerPokemon = null;
let enemyPokemon = null;
let selectedForBet = null;
let winner = null;
let battleHistory = [];

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
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


function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Обработчики событий
async function handleStart() {
    userName = document.getElementById('username').value.trim();
    if (!userName) {
        alert('Пожалуйста, введите ваше имя');
        return;
    }
    showMainScreen(userName);
}

async function handleChooseFighter() {
    const pokemonId = getRandomPokemonId();
    playerPokemon = await fetchPokemonDetails(pokemonId);
    displayPokemon(playerPokemon, 'pokemon-display');
    document.getElementById('battle-btn').classList.remove('hidden');
}

async function handleBattle() {
    const pokemonId = getRandomPokemonId();
    enemyPokemon = await fetchPokemonDetails(pokemonId);
    showBattleScreen();
    displayBattlePokemons(playerPokemon, enemyPokemon);
    showBetButtons(playerPokemon, enemyPokemon, handleBetSelection);
}

function handleBetSelection(selectedPokemon) {
    selectedForBet = selectedPokemon;
    showFightButton();
}

async function handleFight() {
    winner = simulateBattle(playerPokemon, enemyPokemon);
    const loser = winner.name === playerPokemon.name ? enemyPokemon : playerPokemon;
    
    // Добавляем запись в историю
    battleHistory.push({
        winner: winner,
        loser: loser,
        date: new Date().toLocaleString(),
        userBet: selectedForBet.name
    });
    
    showResult(winner, selectedForBet);
}

async function handleSave() {
    if (!winner || !winner.image) return;
    
    try {
        // Создаем временный элемент изображения
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = winner.image;
        
        // Ждем загрузки изображения
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        
        // Создаем canvas такого же размера как изображение
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        // Рисуем только изображение покемона
        ctx.drawImage(img, 0, 0);
        
        // Сохраняем как PNG
        const link = document.createElement('a');
        link.download = `pokemon_${winner.name}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
    } catch (error) {
        console.error('Error saving pokemon image:', error);
        alert('Не удалось сохранить изображение покемона');
    }
}

function handleNewBattle() {
    resetUI();
    playerPokemon = null;
    enemyPokemon = null;
    selectedForBet = null;
    winner = null;
}

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

    statsTable.innerHTML = '';
    
    if (battleHistory.length === 0) {
        statsTable.innerHTML = '<p>Нет данных о боях</p>';
    } else {
        battleHistory.forEach((battle, index) => {
            // Создаем контейнер для одной записи боя
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
    
    statsContainer.classList.remove('hidden');
}