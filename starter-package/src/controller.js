/* Home Page Controller */
const onStartGameButtonClicked = () => {
    startGame()
}

/* Selection Page Controller */
const onSelectionPageLoad = () => {
    initSelection()
}

const onFilterHeroList = (filterBy) => {
    filterHeroList(filterBy)
}

const onHeroPreview = (heroId) => {
    setHeroPreview(heroId)
}

const onRandomHeroSelect = () => {
    pickRandomHero()
}

const onHeroSelect = (heroId) => {
    selectHero(heroId)
}

const onPcHeroSelection = (heroId) => {
    setSelectedEnemyHero(heroId)
}

/* Game Page Controller */
const onGamePageLoad = () => {
    initGame()
}

const onUserAttack = () => {
    userAttack()
}

const onUserDefence = () => {
    userDefence()
}

/* Results Page Controller */
const onResultsPageLoad = () => {
    initResults()
}

const onRestartGame = () => {
    restartGame()
}
