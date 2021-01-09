import * as PIXI from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import '@csstools/normalize.css';
import './base.css';
import './assets/SYM1.png';
import './assets/SYM2.png';
import './assets/SYM3.png';
import './assets/SYM4.png';
import './assets/SYM5.png';
import './assets/SYM6.png';
import './assets/BG.png';
import './assets/BTN_Spin.png';
import './assets/BTN_Spin_d.png';
import './assets/assets.json';
import './assets/assets.png';
import soundPlay from './assets/sound/runPlay.mp3';
import soundsWin from './assets/sound/won.mp3';
import soundsClick from './assets/sound/click.mp3';
import soundFon from './assets/sound/Sound_fon.mp3';
import app from './app';
import { loadingSceneInit } from './js/scenes/LoadingScene';
import { winSceneInit } from './js/scenes/WinScene';
import { buttonNextPlayInit } from './js/scenes/WinScene';
import { gameSceneInit } from './js/scenes/GameScene';
import { buttonPlayInit } from './js/scenes/GameScene';
import { creditsPanelInit } from './js/scenes/GameScene';
import { AnimationsGameArea } from './js/scenes/GameScene';
import { gameOverSceneInit } from './js/scenes/GameOverScene';
import { checkPlayResult } from './js/logics/checkPlayResult';
import { createRandomGameArea } from './js/scenes/GameScene';
import { buttonNewGameInit } from './js/scenes/GameOverScene';
import { areaForAnimation } from './js/scenes/GameScene';

document.body.appendChild(app.view);

//alias
const loaders = new PIXI.Loader(),
    TextureCache = PIXI.utils.TextureCache;


//load all resources 
loaders
    .add("./assets/assets.json")
    .load(setup);

//sounds
let soundWin = new Audio(soundsWin);
let soundClick = new Audio(soundsClick);
let soundsPlay = new Audio(soundPlay);
let soundsFon = new Audio(soundFon);

//game settings 
const INITIAL_CREDITS = 1000;
const INITIAL_TIME_PLAY = 300;
const INITIAL_TIME_WIN = 300;
const WIN_PRIZE = 10;
const SPINS_PRICE = 5;
const filterGlow = new GlowFilter({ innerStrength: 3, outerStrength: 10, color: 0xffffff });

//scens
let state;
let gameScene;
let loadingScene;
let winScene;
let gameOverScene;
let AnimationReelsContainer;

let buttonPlay;
let buttonPlayTexture;
let creditsPanel;
let timePlay;
let timeWinView;
let gameAreaObj;
let credits;
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
    ];

    //button Play texture
    buttonPlayTexture = [
        TextureCache["BTN_Spin.png"],
        TextureCache["BTN_Spin_d.png"],
    ];

    //initialize timer
    timePlay = INITIAL_TIME_PLAY;
    timeWinView = INITIAL_TIME_WIN;

    //initialize start credits
    credits = INITIAL_CREDITS;

    //Loading Scene initialize
    loadingScene = loadingSceneInit();
    app.stage.addChild(loadingScene);

    //Game Scene initialize
    gameScene = gameSceneInit();
    buttonPlay = buttonPlayInit(buttonPlayTexture);
    buttonPlay.on('pointerdown', handlerClickPlay);
    gameScene.addChild(buttonPlay);
    creditsPanel = creditsPanelInit(credits, winSalary);
    const { creditsPanelContainer } = creditsPanel;
    creditsPanelContainer.x = app.screen.width - 135;
    creditsPanelContainer.y = app.screen.height - 200;
    gameScene.addChild(creditsPanelContainer);
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
    gameAreaObj = createRandomGameArea(gameItemsArr);
    const { gameAreaContainer } = gameAreaObj;
    gameAreaContainer.y = app.screen.height / 2;
    gameAreaContainer.x = app.screen.width / 2 - 100;
    gameAreaContainer.pivot.set(gameAreaContainer.width / 2, gameAreaContainer.height / 2);
    gameScene.addChild(gameAreaContainer);
    // create animation area
    const gameAreaForAnimation = areaForAnimation(gameItemsArr);
    let { gameAreaAnimationContainer, itemsAnimationRef } = gameAreaForAnimation;
    gameAreaAnimationItemRefs = itemsAnimationRef;
    AnimationReelsContainer = gameAreaAnimationContainer;
    AnimationReelsContainer.y = app.screen.height;
    AnimationReelsContainer.x = (app.screen.width / 2) - 100;
    AnimationReelsContainer.pivot.set(AnimationReelsContainer.width / 2, AnimationReelsContainer.height / 2);
    //create animation
    AnimationsGameArea(gameAreaAnimationItemRefs);
    gameScene.addChild(AnimationReelsContainer);

    //view game scene property
    gameAreaContainer.visible = true;
    AnimationReelsContainer.visible = false;
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
    credits = INITIAL_CREDITS;
    winSalary = 0;
    let { winSalaryText, creditsText } = creditsPanel;
    creditsText.text = `MONEY: ${credits}$`;
    winSalaryText.text = `WIN: ${winSalary}$`;
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

//button Play handler
const handlerClickPlay = () => {
    if (!targetClick) {
        if (!credits) {
            eventViewGameOver();
            return;
        }
        targetClick = true;
        timePlay = INITIAL_TIME_PLAY;
        buttonPlay.texture = buttonPlayTexture[1];
        credits -= SPINS_PRICE;

        let { creditsText } = creditsPanel;
        creditsText.text = `MONEY: ${credits}$`;

        if (credits < 1000) {
            creditsText.position.set(-26, -30);
        }

        gameScene.removeChild(gameAreaObj.gameAreaContainer);
        gameAreaObj = createRandomGameArea(gameItemsArr);
        const { gameAreaContainer } = gameAreaObj;
        gameAreaContainer.y = app.screen.height / 2;
        gameAreaContainer.x = (app.screen.width / 2) - 100;
        gameAreaContainer.pivot.set(gameAreaContainer.width / 2, gameAreaContainer.height / 2);
        gameScene.addChild(gameAreaContainer);

        gameAreaContainer.visible = false;
        AnimationReelsContainer.visible = true;

        soundClick.play();
        soundsPlay.play();
        soundsFon.play();
        soundsFon.loop = true;
    }
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
            AnimationReelsContainer.visible = false;
            const { gameAreaContainer, gameCombo } = gameAreaObj
            gameAreaContainer.visible = true;
            roundResult = checkPlayResult(gameCombo);
            soundsPlay.pause();
            soundsPlay.currentTime = 0;

            let { winSalaryText, creditsText } = creditsPanel;

            if (roundResult.win) {
                roundResult.resultLineItem.forEach(item => item.itemSymbol.children[0].filters = [filterGlow])
                eventViewGameWin();
                credits += WIN_PRIZE;
                winSalary += WIN_PRIZE;
                creditsText.text = `MONEY: ${credits}$`;
                winSalaryText.text = `WIN: ${winSalary}$`;
                winScene.children[2].text = `${WIN_PRIZE}$`;
                targetWin = true;
                soundWin.play();
                return;
            }
            if (roundResult.loss) {
                eventViewGameOver();
                roundResult.resultLineItem.forEach(item => item.itemSymbol.children[0].filters = [filterGlow]);
                credits = 0;
                creditsText.text = `MONEY: ${credits}$`;
                return;
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

