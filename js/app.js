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
});

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
    showResult(winner, selectedForBet);
}

function handleSave() {
    enableSaveButton(winner);
    // Здесь добавить логику для сохранения изображения!!!!!!!!!!!!!
    alert('Победитель сохранен!');
}

function handleNewBattle() {
    resetUI();
    playerPokemon = null;
    enemyPokemon = null;
    selectedForBet = null;
    winner = null;
}