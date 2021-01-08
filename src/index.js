import * as PIXI from 'pixi.js'
import { GlowFilter } from 'pixi-filters';
import '@csstools/normalize.css'
import './base.css'
import './assets/SYM1.png'
import './assets/SYM2.png'
import './assets/SYM3.png'
import './assets/SYM4.png'
import './assets/SYM5.png'
import './assets/SYM6.png'
import './assets/BG.png'
import './assets/BTN_Spin.png'
import './assets/BTN_Spin_d.png'
import './assets/assets.json'
import './assets/assets.png'
import soundPlay from './assets/sound/runPlay.mp3'
import soundsWin from './assets/sound/won.mp3'
import soundsClick from './assets/sound/click.mp3'
import soundFon from './assets/sound/Sound_fon.mp3'
import app from './app'
import { loadingSceneInit } from './js/scens/LoadingScene'
import { winSceneInit } from './js/scens/WinScene'
import { buttonNextPlayInit } from './js/scens/WinScene'
import { gameSceneInit } from './js/scens/GameScene'
import { buttonPlayInit } from './js/scens/GameScene'
import { creditsPanel } from './js/scens/GameScene'
import { AnimationsGameArea } from './js/scens/GameScene'
import { gameOverSceneInit } from './js/scens/GameOverScene'
import { checkPlayResult } from './js/logics/checkPlayResult'
import { createRandomGameArea } from './js/scens/GameScene'
import { buttonNewGameInit } from './js/scens/GameOverScene'
import { areaForAnimation } from './js/scens/GameScene'

document.body.appendChild(app.view);

//alias
const loaders = new PIXI.Loader(),
    TextureCache = PIXI.utils.TextureCache,
    filterGlow = new GlowFilter({ innerStrength: 3, outerStrength: 10, color: 0xffffff });

//load all resources 
loaders
    .add("./assets/assets.json")
    .load(setup);

//sounds
let soundWin = new Audio(soundsWin);
let soundClick = new Audio(soundsClick)
let soundsPlay = new Audio(soundPlay)
let soundsFon = new Audio(soundFon)

//game settings 
const INITIAL_TIME_PLAY = 300;
const INITIAL_TIME_WIN = 300;
const WIN_PRIZE = 10
const SPINS_PRICE = 5;

//scens
let state;
let gameScene;
let loadingScene;
let winScene;
let gameOverScene;
let AnimationContainer;

let buttonPlay;
let buttonPlayTexture;
let creditsPanels;
let timePlay;
let timeWinView;
let gameAreaObj;
let credits = 1000;
let winSalary = 0;
let timeLoadingGame = 50;
let isLoadingGame = true;
let targetClick = false;
let targetWin = false;
let gameItemsArr = [];
let gameAreaAnimationItemRefs = [];
let roundResult = null;


function setup() {

    //all game item
    gameItemsArr = [
        { itemId: 0, itemSkin: TextureCache["SYM1.png"] },
        { itemId: 1, itemSkin: TextureCache["SYM2.png"] },
        { itemId: 2, itemSkin: TextureCache["SYM3.png"] },
        { itemId: 3, itemSkin: TextureCache["SYM4.png"] },
        { itemId: 4, itemSkin: TextureCache["SYM5.png"] },
        { itemId: 5, itemSkin: TextureCache["SYM6.png"] },
    ]

    //button Play texture
    buttonPlayTexture = [
        TextureCache["BTN_Spin.png"],
        TextureCache["BTN_Spin_d.png"],
    ];

    //initialize timer
    timePlay = INITIAL_TIME_PLAY;
    timeWinView = INITIAL_TIME_WIN;

    //Loading Scene initialize
    loadingScene = loadingSceneInit();
    app.stage.addChild(loadingScene);

    //Game Scene initialize
    gameScene = gameSceneInit();
    buttonPlay = buttonPlayInit(buttonPlayTexture);
    buttonPlay.on('pointerdown', handlerClickPlay);
    gameScene.addChild(buttonPlay);
    creditsPanels = creditsPanel(credits, winSalary)
    creditsPanels.x = app.screen.width - 135;
    creditsPanels.y = app.screen.height - 200;
    gameScene.addChild(creditsPanels);
    app.stage.addChild(gameScene);

    //Win Scene initialize
    winScene = winSceneInit();
    const buttonNextPlay = buttonNextPlayInit();
    buttonNextPlay.on('pointerdown', handlerClickNextPlay);
    winScene.addChild(buttonNextPlay);
    app.stage.addChild(winScene);

    //Game Over scene init
    gameOverScene = gameOverSceneInit();
    const buttonNewGame = buttonNewGameInit();
    buttonNewGame.on('pointerdown', handlerClickNewGame);
    gameOverScene.addChild(buttonNewGame);
    app.stage.addChild(gameOverScene);

    //init  game area
    //create random area
    gameAreaObj = createRandomGameArea(gameItemsArr)
    const { gameAreaContainer } = gameAreaObj
    gameAreaContainer.y = app.screen.height / 2;
    gameAreaContainer.x = app.screen.width / 2 - 100;
    gameAreaContainer.pivot.set(gameAreaContainer.width / 2, gameAreaContainer.height / 2);
    gameScene.addChild(gameAreaContainer);
    // create animation area
    const gameAreaForAnimation = areaForAnimation(gameItemsArr)
    let { gameAreaAnimationContainer, itemsAnimationRef } = gameAreaForAnimation
    gameAreaAnimationItemRefs = itemsAnimationRef
    AnimationContainer = gameAreaAnimationContainer;
    AnimationContainer.y = (app.screen.height / 2) + 200;
    AnimationContainer.x = app.screen.width / 2 - 100;
    AnimationContainer.pivot.set(gameAreaAnimationContainer.width / 2, gameAreaAnimationContainer.height / 2);
    //create animation
    AnimationsGameArea(gameAreaAnimationItemRefs)
    gameScene.addChild(AnimationContainer);

    //view game scene property
    gameAreaContainer.visible = true
    AnimationContainer.visible = false;
    loadingScene.visible = true;
    gameScene.visible = false;
    winScene.visible = false;
    gameOverScene.visible = false;

    state = play;
    app.ticker.add(delta => gameLoop(delta));
}


//NextPlay button Win Scene handler
const handlerClickNextPlay = () => {
    targetWin = false;
    winScene.visible = false;
    timeWinView = INITIAL_TIME_WIN;
}

//New Game button handler
const handlerClickNewGame = () => {
    gameOverScene.visible = false;
    credits = 1000;
    winSalary = 0;
    creditsPanels.children[1].text = `MONEY: ${credits}$`;
    creditsPanels.children[2].text = `WIN: ${winSalary}$`;
}

//button Play handler
const handlerClickPlay = () => {
    if (!targetClick) {
        targetClick = true;
        timePlay = INITIAL_TIME_PLAY;
        buttonPlay.texture = buttonPlayTexture[1];
        credits -= SPINS_PRICE;
        creditsPanels.children[1].text = `MONEY: ${credits}$`;

        gameScene.removeChild(gameAreaObj.gameAreaContainer);
        gameAreaObj = createRandomGameArea(gameItemsArr)
        const { gameAreaContainer } = gameAreaObj
        gameAreaContainer.y = app.screen.height / 2;
        gameAreaContainer.x = (app.screen.width / 2) - 100;
        gameAreaContainer.pivot.set(gameAreaContainer.width / 2, gameAreaContainer.height / 2);
        gameScene.addChild(gameAreaContainer);

        gameAreaContainer.visible = false;
        AnimationContainer.visible = true;

        soundClick.play();
        soundsPlay.play();
        soundsFon.play();
        soundsFon.loop = true;
    }
}

//game event preloading event
const eventPreloadingGame = () => {
    if (isLoadingGame) {
        timeLoadingGame -= 1;
    } else {
        return;
    }

    if (timeLoadingGame == 0) {
        isLoadingGame = false;
        loadingScene.visible = false;
        gameScene.visible = true;
        return;
    }
}

//Game Over event
const eventViewGameOver = () => {
    gameOverScene.visible = true;
}

//Game Win event
const eventViewGameWin = () => {
    winScene.visible = true;
}

function gameLoop(delta) {
    state(delta);
}

function play() {
    eventPreloadingGame();

    if (targetClick) {
        timePlay -= 1;

        if (timePlay == 0) {
            targetClick = false;
            buttonPlay.texture = buttonPlayTexture[0];
            AnimationContainer.visible = false;
            const { gameAreaContainer, gameCombo } = gameAreaObj
            gameAreaContainer.visible = true;
            roundResult = checkPlayResult(gameCombo);
            soundsPlay.pause();
            soundsPlay.currentTime = 0;

            if (roundResult.win) {
                roundResult.resultLineItem.forEach(item => item.itemSymbol.children[0].filters = [filterGlow])
                eventViewGameWin();
                credits += WIN_PRIZE;
                winSalary += WIN_PRIZE;
                creditsPanels.children[1].text = `MONEY: ${credits}$`;
                creditsPanels.children[2].text = `WIN: ${winSalary}$`;
                winScene.children[2].text = `${WIN_PRIZE}$`;
                targetWin = true;
                soundWin.play();
                return
            }
            if (roundResult.loss) {
                eventViewGameOver();
                roundResult.resultLineItem.forEach(item => item.itemSymbol.children[0].filters = [filterGlow])
                credits = 0
                creditsPanels.children[1].text = `MONEY: ${credits}$`;
                creditsPanels.children[2].text = `WIN: ${winSalary}$`;
                return
            }
        }
    }
//start event win timer
    if (targetWin) {
        timeWinView -= 1;
        if (timeWinView == 0) {
            targetWin = false;
            winScene.visible = false;
            timeWinView = INITIAL_TIME_WIN;
        }
    }
}

