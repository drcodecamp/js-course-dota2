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
const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const pickRandomHero = () => {
  if (userHeroes.length === 5 && pcHeroes.length === 5) {
    return;
  }
  const randomIdx = getRandomIntInclusive(0, heroPool.length);
  const randomHero = heroPool[randomIdx];
  const isHeroAlreadySelectedPc = pcHeroes.find(
    (hero) => hero.id === randomHero.id
  );
  const isHeroAlreadySelectedUser = userHeroes.find(
    (hero) => hero.id === randomHero.id
  );
  if (isHeroAlreadySelectedPc || isHeroAlreadySelectedUser) {
    return pickRandomHero();
  }
  if (userHeroes.length < 5) {
    userHeroes.push(heroPool[randomIdx]);
    saveToLocalStorage("userHeroes", userHeroes);
  } else {
    pcHeroes.push(heroPool[randomIdx]);
    saveToLocalStorage("pcHeroes", pcHeroes);
  }
  heroPool[randomIdx].isSelected = true;
  renderSelectedHeroes(userHeroes, pcHeroes, randomIdx);
};

const setSelectedEnemyHero = (heroId) => {
  if (isUserTurn) {
    const heroModel = pcHeroes.find((hero) => hero.id === heroId);
    if (!heroModel.isEliminated) {
      setAttackTarget(heroId);
      renderHighlightedHero("pc-heroid", heroId);
    }
  }
};

const setAttackTarget = (targetId) => {
  const pcHeroIdx = pcHeroes.findIndex((hero) => hero.id === targetId);
  if (pcHeroes[pcHeroIdx].isEliminated) {
    selectedEnemyHero = null;
    return;
  }
  selectedEnemyHero = pcHeroes.findIndex((hero) => hero.id === targetId);
};

const filterHeroList = (filterBy) => {
  const heroesByType = getHeroesByType();
  renderSelectionHeroList(heroesByType, filterBy);
};

const setHeroPreview = (heroId) => {
  const idx = parseInt(heroId);
  const selectedHero = heroPool.find((hero) => hero.id === idx);
  if (selectedHero) {
    previewHero = selectedHero;
  }
  renderHeroPreviewBox(selectedHero);
};

const selectHero = (heroId) => {
  const idx = parseInt(heroId);
  const isHeroAlreadySelectedUser = userHeroes.find((hero) => hero.id === idx);
  const isHeroAlreadySelectedPc = pcHeroes.find((hero) => hero.id === idx);
  if (isHeroAlreadySelectedUser || isHeroAlreadySelectedPc) return;
  if (userHeroes.length === 5 && pcHeroes.length === 5) return;
  const selectedHero = heroPool.find((hero) => hero.id === idx);
  if (userHeroes.length < 5) {
    userHeroes.push(selectedHero);
    saveToLocalStorage("userHeroes", userHeroes);
  } else {
    pcHeroes.push(selectedHero);
    saveToLocalStorage("pcHeroes", pcHeroes);
  }
  const selectedIdx = heroPool.findIndex((hero) => hero.id === idx);
  heroPool[selectedIdx].isSelected = true;
  renderSelectedHeroes(userHeroes, pcHeroes, heroId);
};

const getHeroesByType = () => {
  const str = heroPool
    .filter((hero) => hero.primary_attr === "str")
    .sort((a, b) => (a.localized_name > b.localized_name ? 1 : -1));
  const agi = heroPool
    .filter((hero) => hero.primary_attr === "agi")
    .sort((a, b) => (a.localized_name > b.localized_name ? 1 : -1));
  const int = heroPool
    .filter((hero) => hero.primary_attr === "int")
    .sort((a, b) => (a.localized_name > b.localized_name ? 1 : -1));
  return [str, agi, int];
};

const startSelectionPageTimer = () => {
  let time = 19;
  const interval = setInterval(() => {
    const timer = document.querySelector(".selection-timer");
    timer.innerHTML = `${time}`;
    if (time <= 0) {
      window.location.assign("game.html");
      clearInterval(interval);
    }
    time--;
  }, 1000);
};

/* Game Functions */

const userDefence = () => {
  if (!isUserTurn) {
    return;
  }
  heroDefence();
  finishUserTurn();
  renderGameInformation(isUserTurn, pcHeroes[selectedPcHero]);
  renderGameLogs(gameBattleLog);
  toggleOffAllSelections();
  updateHeroesState(
    isUserTurn,
    userHeroes,
    selectedUserHero,
    pcHeroes,
    selectedPcHero
  );
  updateUserHeroesHpText(userHeroes);
  setupNextPcAttack();
};

const heroDefence = () => {
  const hero = userHeroes[selectedUserHero];
  const armor = hero.base_armor;
  const hpRegen = hero.base_health_regen;
  const healAmount = armor * hpRegen;
  let randomHealAmount = getRandomNumber(healAmount + 25, healAmount + 50);
  if (hero.currentHp + randomHealAmount >= hero.base_health) {
    hero.currentHp = hero.base_health;
  }
  if (hero.currentHp >= hero.base_health) {
    hero.currentHp = hero.base_health;
  } else {
    hero.currentHp += randomHealAmount;
  }
  addDefLog(hero, randomHealAmount);
};

const addDefLog = (hero, healAmount) => {
  const log = `${new Date().getMinutes()}:${new Date().getSeconds()} => ${
    hero.localized_name
  } defence and heal ${healAmount} hp.`;
  gameBattleLog.push(log);
};

const userAttack = () => {
  if (selectedEnemyHero === null || !isUserTurn) {
    return;
  }
  const attacker = userHeroes[selectedUserHero];
  const heroMinDamage = attacker.base_attack_min;
  const heroMaxDamage = attacker.base_attack_max;
  let attackDamage = getRandomNumber(heroMinDamage, heroMaxDamage);
  const criticalDmg = Math.random() > 0.8;
  if (criticalDmg) {
    attackDamage = attackDamage * 2;
  }
  const defenderHero = pcHeroes[selectedEnemyHero];
  defenderHero.currentHp -= attackDamage;
  if (defenderHero.currentHp <= 0) {
    defenderHero.isEliminated = true;
    defenderHero.currentHp = 0;
  }
  selectedEnemyHero = null;
  addAttackLog(attacker, defenderHero, attackDamage, criticalDmg);
  renderGameLogs(gameBattleLog);
  finishUserTurn();
  renderGameInformation(isUserTurn, pcHeroes[selectedPcHero]);
  toggleOffAllSelections();
  updateHeroesState(
    isUserTurn,
    userHeroes,
    selectedUserHero,
    pcHeroes,
    selectedPcHero
  );
  setupNextPcAttack();
};

const setupNextPcAttack = () => {
  pcAttack();
  setTimeout(() => {
    finishPcTurn();
    renderGameLogs(gameBattleLog);
    const nextUserHero = userHeroes[selectedUserHero];
    renderGameInformation(isUserTurn, nextUserHero);
    toggleOffAllSelections();
    updateHeroesState(
      isUserTurn,
      userHeroes,
      selectedUserHero,
      pcHeroes,
      selectedPcHero
    );
  }, pcDelayTimeInMS);
};

const pcAttack = () => {
  setTimeout(() => {
    const attacker = pcHeroes[selectedPcHero];
    const heroMinDamage = attacker.base_attack_min;
    const heroMaxDamage = attacker.base_attack_max;
    let attackDamage = getRandomNumber(heroMinDamage, heroMaxDamage);
    const criticalDmg = Math.random() > 0.5;
    if (criticalDmg) {
      attackDamage = attackDamage * 1.75;
    }
    const defenderHero = getRandomHeroForAttack();
    defenderHero.currentHp -= attackDamage;
    if (defenderHero.currentHp <= 0) {
      defenderHero.isEliminated = true;
      defenderHero.currentHp = 0;
    }
    addAttackLog(attacker, defenderHero, attackDamage, criticalDmg);
  }, pcDelayTimeInMS);
};

const getRandomHeroForAttack = () => {
  const randomHeroIdx = getRandomNumber(0, userHeroes.length - 1);
  if (userHeroes[randomHeroIdx].isEliminated) {
    return getRandomHeroForAttack();
  }
  return userHeroes[randomHeroIdx];
};

const finishPcTurn = () => {
  checkGameStatus();
  if (selectedUserHero >= userHeroes.length - 1) {
    selectedUserHero = 0;
  } else {
    selectedUserHero++;
  }
  selectedUserHero = findNextAliveHero(userHeroes, selectedUserHero);
  isUserTurn = !isUserTurn;
};

const finishUserTurn = () => {
  checkGameStatus();
  if (selectedPcHero >= pcHeroes.length - 1) {
    selectedPcHero = 0;
  } else {
    selectedPcHero++;
  }
  selectedPcHero = findNextAliveHero(pcHeroes, selectedPcHero);
  isUserTurn = !isUserTurn;
};

const findNextAliveHero = (heroes, heroIdx = 0) => {
  const isAnyHeroAlive = heroes.some((hero) => !hero.isEliminated);
  if (!isAnyHeroAlive) return;
  if (heroes[heroIdx].isEliminated) {
    if (heroIdx >= heroes.length - 1) {
      return findNextAliveHero(heroes, 0);
    }
    return findNextAliveHero(heroes, heroIdx + 1);
  } else {
    return heroIdx;
  }
};

const checkGameStatus = () => {
  const isUserHeroesEliminated = userHeroes.every((hero) => hero.isEliminated);
  const isPcHeroesEliminated = pcHeroes.every((hero) => hero.isEliminated);
  if (isUserHeroesEliminated) {
    setTimeout(() => {
      endGameWithResults("pc");
    }, 1500);
  }
  if (isPcHeroesEliminated) {
    setTimeout(() => {
      endGameWithResults("user");
    }, 1500);
  }
};

const endGameWithResults = (winner) => {
  localStorage.setItem("winner", winner);
  window.location.assign(`results.html`);
};

const addAttackLog = (attacker, defender, attackDamage, criticalDmg) => {
  const log = `${new Date().getHours()}:${
    new Date().getMinutes() < 10
      ? `0${new Date().getMinutes()}`
      : `${new Date().getMinutes()}`
  } => ${attacker.localized_name} attacked ${
    defender.localized_name
  } with ${attackDamage} damage ${criticalDmg ? "2.0x Critical" : ""}.`;
  gameBattleLog.push(log);
};

const getCurrentAttackingHero = () => {
  const userHero = userHeroes[selectedUserHero];
  const pcHero = pcHeroes[selectedPcHero];
  if (!userHero && !pcHero) return;
  return isUserTurn ? userHero : pcHero;
};

const loadHeroes = () => {
  const user = localStorage.getItem("userHeroes");
  const pc = localStorage.getItem("pcHeroes");
  if (!user || !pc) {
    window.location.assign("index.html");
  }
  pcHeroes = JSON.parse(pc);
  userHeroes = JSON.parse(user);
  userHeroes.forEach((hero) => {
    hero.currentHp = hero.base_health;
    hero.isEliminated = false;
  });
  pcHeroes.forEach((hero) => {
    hero.currentHp = hero.base_health;
    hero.isEliminated = false;
  });
  return {
    pcHeroes,
    userHeroes,
  };
};

/* Init Functions */
const startGame = () => {
  window.location.assign("./selection.html");
};

const initSelection = () => {
  if (!heroPool) {
    localStorage.setItem("heroPool", JSON.stringify(heroData));
    heroPool = heroData;
  }
  localStorage.removeItem("pcHeroes");
  localStorage.removeItem("userHeroes");
  startSelectionPageTimer();
  const heroesByType = getHeroesByType();
  renderSelectionHeroList(heroesByType, "");
};

const initGame = () => {
  const heroes = loadHeroes();
  const selectedHero = getCurrentAttackingHero();
  renderGame({
    heroes,
    selectedEnemyHero,
    isUserTurn,
    selectedUserHero,
    selectedHero,
  });
};

const initResults = () => {
  const winner = loadResults();
  renderResults(winner);
};

const loadResults = () => {
  let winner = localStorage.getItem("winner");
  if (winner) {
    return winner;
  }
};

const restartGame = () => {
  localStorage.clear();
  window.location.assign("./index.html");
};

/* Utils */
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};
