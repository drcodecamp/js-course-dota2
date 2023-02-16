const renderSelectionHeroList = (heroesByType, filterBy = "") => {
  heroesByType.forEach((typeList) => {
    let strHTML = ``;

    typeList.forEach((hero) => {
      let filters = ``;
      if (hero.isSelected || !hero.attack_type.includes(filterBy)) {
        filters = "filter:saturate(10%);opacity:0.35;";
      } else {
        filters = "";
      }
      strHTML += `<div onclick="onHeroPreview(${hero.id})" data-heroid="${hero.id}" class="hero-item" style="${filters}">
            <img loading="lazy" src="${hero.img}" alt="${hero.name}"/></div>`;
      document.querySelector(
        `#${hero.primary_attr}-heroes`
      ).innerHTML = strHTML;
    });
  });
};

const renderHeroPreviewBox = (hero) => {
  document.querySelector("#preview-container").innerHTML = `
                <div class="preview-title">${hero.localized_name}</div>
                <div class="hero-preview">
                    <img src="${hero.img}" alt="">
                </div>
                <div class="hero-attribute-item">
                    <div class="attribute-name">Base Health</div>
                    <div class="attribute-value">${hero.base_health}</div>
                </div>
                <div class="hero-attribute-item">
                    <div class="attribute-name">Base Mana</div>
                    <div class="attribute-value">${hero.base_mana}</div>
                </div>
                <div class="hero-attribute-item">
                    <div class="attribute-name">Base Regen</div>
                    <div class="attribute-value">${
                      hero.base_health_regen + ""
                    }</div>
                </div>
                <div class="hero-attribute-item">
                    <div class="attribute-name">Base Armor</div>
                    <div class="attribute-value">${hero.base_armor}</div>
                </div>
                <div class="hero-attribute-item">
                    <div class="attribute-name">Min Damage</div>
                    <div class="attribute-value">${hero.base_attack_min}</div>
                </div>
                <div class="hero-attribute-item">
                    <div class="attribute-name">Max Damage</div>
                    <div class="attribute-value">${hero.base_attack_max}</div>
                </div>
                <div class="preview-actions">
                    <div class="pick-button" onclick="onHeroSelect(${
                      hero.id
                    })">PICK HERO</div>
                    <div class="random-button" onclick="onRandomHeroSelect()">
                        <img width="20" src="./src/assets/dice.png" alt="random"/>
                        <div>RANDOM</div>
                    </div>
                </div>`;
};

const renderSelectedHeroes = (userHero, pcHeroes, heroId) => {
  userHero.forEach((hero, i) => {
    document.querySelector(`#hero-${i + 1}`).innerHTML = `
            <img src='${hero.img}' alt='hero'/>
        `;
  });
  pcHeroes.forEach((hero, i) => {
    document.querySelector(`#hero-${i + 6}`).innerHTML = `
            <img src='${hero.img}' alt='hero'/>
        `;
  });
  document.querySelector(`[data-heroid="${heroId}"]`).style =
    "filter:saturate(10%);opacity:0.15;";
};

const renderResults = (winner) => {
  document.querySelector(".win-title").innerHTML = `${
    winner === "user" ? "YOU WON!" : "YOU LOST!"
  }`;
  document.querySelector(".win-subtitle").innerHTML = `${
    winner === "user" ? "You are pro gamer :)" : "Better luck next time..."
  }`;
};

const renderGame = (options) => {
  renderHeroes(options);
  renderGameInformation(options.isUserTurn, options.selectedHero);
};

const renderHeroes = (options) => {
  renderUserHeroes(options);
  renderPcHeroes(options);
};

const toggleOffAllSelections = () => {
  const a = document.querySelectorAll("[pc-heroid]");
  a.forEach((heroContainer) => {
    heroContainer.style.border = "4px solid rgb(24, 31, 37)";
    heroContainer.style.opacity = "0.25";
  });
  const b = document.querySelectorAll("[user-heroid]");
  b.forEach((heroContainer) => {
    heroContainer.style.border = "4px solid rgb(24, 31, 37)";
    heroContainer.style.opacity = "0.25";
    heroContainer.style.opacity = "0.25";
  });
};

const renderPcHeroes = (options) => {
  const pcHeroContainer = document.querySelector(".pc-heroes");
  const { heroes, isTargetHero, selectedHeroIdx, isUserTurn } = options;
  let pcHeroesElement = ``;
  heroes.pcHeroes.forEach((pcHero, index) => {
    const hpBarPercentages = (100 * pcHero.currentHp) / pcHero.base_health;
    let opacityIndicator = false;
    if (!isUserTurn) {
      opacityIndicator = selectedHeroIdx === index;
    } else {
      opacityIndicator = isUserTurn && isTargetHero === index;
    }
    if (pcHero.isEliminated) {
      opacityIndicator = false;
    }
    // language-lit-html
    pcHeroesElement += `
                <div class='hero'>
                    <img
                        onclick="onPcHeroSelection(${pcHero.id})"
                        style='opacity:${
                          opacityIndicator ? 1 : 0.25
                        }; border:4px solid ${
      opacityIndicator
        ? isUserTurn && isTargetHero === index
          ? "white"
          : "#181F25"
        : "none"
    }'
                        pc-heroid='${pcHero.id}'
                        class='hero-img'
                        src='${pcHero.img}'
                        alt='game'
                    />
                    <div class='hp-bar'>
                        <div class='pc-color' data-hp="${
                          pcHero.id
                        }" style="width:${hpBarPercentages}%"></div>
                    </div>
                    <div class='hero-attributes'>
                        <div class='attack-attribute'>
                            <img
                                height='32'
                                src='./src/assets/icon_damage.png'
                                alt='icon_damage'
                            />
                            <p>${pcHero.base_attack_min}-${
      pcHero.base_attack_max
    }</p>
                        </div>
                        <div class='armor-attribute'>
                            <p>${pcHero.base_armor}</p>
                            <img
                                height='32'
                                src='./src/assets/icon_armor.png'
                                alt='icon_armor'
                            />
                        </div>
                    </div>
                    <div class='hp' hero-hp-text="${pcHero.id}">${
      pcHero.currentHp
    }<span>/${pcHero.base_health}</span></div>
                </div>
            `;
  });
  pcHeroContainer.innerHTML = pcHeroesElement;
};

const renderUserHeroes = (options) => {
  const { heroes, selectedUserHero, isUserTurn } = options;
  const userHeroContainer = document.querySelector(".user-heroes");
  let userHeroesElement = ``;
  heroes.userHeroes.forEach((userHero, index) => {
    const hpBarPercentages = (100 * userHero.currentHp) / userHero.base_health;
    userHeroesElement += ` <div class='hero' >
                        <img style='opacity: ${
                          isUserTurn && selectedUserHero === index ? 1 : 0.25
                        }'
                            user-heroid='${userHero.id}'
                            class='hero-img'
                            src='${userHero.img}'
                            alt='game'
                        />
                        <div class='hp-bar'>
                            <div class='user-color' data-hp="${
                              userHero.id
                            }" style="width:${hpBarPercentages}%"></div>
                        </div>
                        <div class='hero-attributes'>
                            <div class='attack-attribute'>
                                <img
                                    height='32'
                                    src='./src/assets/icon_damage.png'
                                    alt='icon_damage'
                                />
                                <p>${userHero.base_attack_min}-${
      userHero.base_attack_max
    }</p>
                            </div>
                            <div class='armor-attribute'>
                                <p>${userHero.base_armor}</p>
                                <img
                                    height='32'
                                    src='./src/assets/icon_armor.png'
                                    alt='icon_armor'
                                />
                            </div>
                        </div>
                        <div hero-hp-text="${userHero.id}" class='hp'>${
      userHero.currentHp
    }<span>/${userHero.base_health}</span></div></div>
            `;
  });
  userHeroContainer.innerHTML = userHeroesElement;
};

const renderGameInformation = (isUserTurn, hero) => {
  if (hero) {
    document.querySelector(".title").innerHTML = `${hero.localized_name} Turn!`;
    document.querySelector(".game-status").innerHTML = isUserTurn
      ? "What is your next move?"
      : "Opponent is thinking...";
  }
};

const renderGameLogs = (logs = []) => {
  let logsStr = ``;
  logs.forEach((log) => {
    logsStr += `<div class="log-item">${log}</div>`;
  });
  const gameLogElement = document.querySelector(".game-logs");
  gameLogElement.innerHTML = logsStr;
  gameLogElement.scrollTop = gameLogElement.scrollHeight;
};

const renderHighlightedHero = (selectorName, heroId) => {
  const selector = `[${selectorName}]`;
  document.querySelectorAll(`${selector}`).forEach((a) => {
    a.style.opacity = "0.25";
    a.style.border = "4px solid rgb(24, 31, 37)";
  });
  const selectedHero = document.querySelector(`[${selectorName}="${heroId}"]`);
  selectedHero.style.opacity = "1";
  selectedHero.style.border = "4px solid white";
};

const updateHeroesState = (
  isUserTurn,
  userHeroes,
  nextHeroIdx,
  pcHeroes,
  selectedPcHero
) => {
  /* Update user heroes Hp bars */
  const userHeroesHpContainers = document.querySelectorAll("[data-hp]");
  userHeroes.forEach((hero) => {
    userHeroesHpContainers.forEach((hpContainer) => {
      const heroAttribute = +hpContainer.getAttribute("data-hp");
      if (hero.id === heroAttribute) {
        const hpBarPercentages = (100 * hero.currentHp) / hero.base_health;
        hpContainer.style.width = `${hpBarPercentages}%`;
      }
    });
  });
  const pcHeroesHpContainers = document.querySelectorAll("[data-hp]");
  pcHeroes.forEach((hero) => {
    pcHeroesHpContainers.forEach((hpContainer) => {
      const heroAttribute = +hpContainer.getAttribute("data-hp");
      if (hero.id === heroAttribute) {
        const hpBarPercentages = (100 * hero.currentHp) / hero.base_health;
        hpContainer.style.width = `${hpBarPercentages}%`;
      }
    });
  });
  if (isUserTurn) {
    const nextHero = userHeroes[nextHeroIdx];
    if (!nextHero) return;
    renderHighlightedHero("user-heroid", nextHero.id);
  } else {
    const nextHero = pcHeroes[selectedPcHero];
    if (!nextHero) return;
    renderHighlightedHero("pc-heroid", nextHero.id);
  }
  updateUserHeroesHpText(userHeroes);
  updatePcHeroesHpText(pcHeroes);
};

const updateUserHeroesHpText = (userHeroes) => {
  const heroesHpTexts = document.querySelectorAll("[hero-hp-text]");
  heroesHpTexts.forEach((heroHpText) => {
    const heroId = heroHpText.getAttribute("hero-hp-text");
    const hero = userHeroes.find((hero) => hero.id === +heroId);
    if (hero) {
      heroHpText.innerHTML = `<div class='hp' hero-hp-text="${hero.id}">${hero.currentHp}<span>/${hero.base_health}</span></div></div>`;
    }
  });
};

const updatePcHeroesHpText = (pcHeroes) => {
  const heroesHpTexts = document.querySelectorAll("[hero-hp-text]");
  heroesHpTexts.forEach((heroHpText) => {
    const heroId = heroHpText.getAttribute("hero-hp-text");
    const hero = pcHeroes.find((hero) => hero.id === +heroId);
    if (hero) {
      heroHpText.innerHTML = `<div class='hp' hero-hp-text="${hero.id}">${hero.currentHp}<span>/${hero.base_health}</span></div></div>`;
    }
  });
};
