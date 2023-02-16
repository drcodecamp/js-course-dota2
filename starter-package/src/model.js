let persistHeroPool = localStorage.getItem("heroPool");
let heroPool = persistHeroPool && JSON.parse(persistHeroPool);
let userHeroes = [];
let pcHeroes = [];
let previewHero = {};
let isUserTurn = true;
let selectedEnemyHero = null;
let selectedUserHero = 0;
let selectedPcHero = -1;
let pcDelayTimeInMS = 1000;
let gameBattleLog = [];

/* Selection Page Functions */
const pickRandomHero = () => {};

const setSelectedEnemyHero = (heroId) => {};

const setAttackTarget = (targetId) => {};

const filterHeroList = (filterBy) => {};

const setHeroPreview = (heroId) => {};

const selectHero = (heroId) => {};

const getHeroesByType = () => {};

const startSelectionPageTimer = () => {};

/* Game Functions */

const userDefence = () => {};

const heroDefence = () => {};

const addDefLog = (hero, healAmount) => {};

const userAttack = () => {};

const setupNextPcAttack = () => {};

const pcAttack = () => {};

const getRandomHeroForAttack = () => {};

const finishPcTurn = () => {};

const finishUserTurn = () => {};

const findNextAliveHero = (heroes, heroIdx = 0) => {};

const checkGameStatus = () => {};

const endGameWithResults = (winner) => {};

const addAttackLog = (attacker, defender, attackDamage, criticalDmg) => {};

const getCurrentAttackingHero = () => {};

const loadHeroes = () => {};

/* Init Functions */
const startGame = () => {};

const initSelection = () => {};

const initGame = () => {};

const initResults = () => {};

const loadResults = () => {};

const restartGame = () => {};

/* Utils */
const saveToLocalStorage = (key, data) => {};
const getRandomNumber = (min, max) => {};
