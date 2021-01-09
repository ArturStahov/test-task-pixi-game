import * as PIXI from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import './base.css';
import './assets/assets.json';
import './assets/assets.png';
import soundPlay from './assets/sound/runPlay.mp3';
import soundsWin from './assets/sound/won.mp3';
import soundsClick from './assets/sound/click.mp3';
import soundBg from './assets/sound/Sound_fon.mp3';
import app from './app';
import { loadingSceneInit } from './js/scenes/LoadingScene';
import { winSceneInit } from './js/scenes/WinScene';
import { buttonNextPlayInit } from './js/scenes/WinScene';
import { gameSceneInit } from './js/scenes/GameScene';
import { buttonPlayInit } from './js/scenes/GameScene';
import { creditsPanelInit } from './js/scenes/GameScene';
import { animationsReels } from './js/scenes/GameScene';
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
let soundsBg = new Audio(soundBg);

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
let animationReelsContainer;

let buttonPlay;
let buttonPlayTexture;
let creditsPanel;
let timePlay;
let timeWinView;
let gameAreaObj;
let credits;
let winSalary = 0;
let timeLoadingGame = 100;
let isLoadingGame = true;
let targetClick = false;
let targetWin = false;
let gameItemsArr = null;



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
    const { gameAreaAnimationContainer, arrayItemsForAnim } = gameAreaForAnimation;
    animationReelsContainer = gameAreaAnimationContainer;
    animationReelsContainer.y = app.screen.height - 100;
    animationReelsContainer.x = (app.screen.width / 2) - 100;
    animationReelsContainer.pivot.set(animationReelsContainer.width / 2, animationReelsContainer.height / 2);

    //create animation
    animationsReels(arrayItemsForAnim);
    gameScene.addChild(animationReelsContainer);

    //view game scene property
    gameAreaContainer.visible = true;
    animationReelsContainer.visible = false;
    loadingScene.visible = true;
    gameScene.visible = false;
    winScene.visible = false;
    gameOverScene.visible = false;

    state = play;
    app.ticker.add(delta => gameLoop(delta));
}


//NextPlay button Win Scene handler
function handlerClickNextPlay() {
    targetWin = false;
    winScene.visible = false;
    timeWinView = INITIAL_TIME_WIN;
}

//New Game button handler
function handlerClickNewGame() {
    gameOverScene.visible = false;
    credits = INITIAL_CREDITS;
    winSalary = 0;
    let { winSalaryText, creditsText } = creditsPanel;
    creditsText.text = `MONEY: ${credits}$`;
    winSalaryText.text = `WIN: ${winSalary}$`;
}

//game event preloading event
function eventPreloadingGame() {
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
function eventViewGameOver() {
    gameOverScene.visible = true;
}

//Game Win event
function eventViewGameWin() {
    winScene.visible = true;
}

//button Play handler
function handlerClickPlay() {
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
        animationReelsContainer.visible = true;

        soundClick.play();
        soundsPlay.play();
        soundsBg.play();
        soundsBg.loop = true;
    }
}


function gameLoop(delta) {
    state(delta);
}

function play() {
    eventPreloadingGame();

    groupSpinEvents();

    winAutoHidden();
}

//start spin timer and run game events
function groupSpinEvents() {
    if (targetClick) {
        timePlay -= 1;

        if (timePlay == 0) {
            targetClick = false;
            buttonPlay.texture = buttonPlayTexture[0];
            animationReelsContainer.visible = false;
            const { gameAreaContainer, gameCombo } = gameAreaObj
            gameAreaContainer.visible = true;
            const spinResult = checkPlayResult(gameCombo);
            const { win, loss, resultLineItem } = spinResult;
            soundsPlay.pause();
            soundsPlay.currentTime = 0;

            let { winSalaryText, creditsText } = creditsPanel;

            if (win) {
                resultLineItem.forEach(item => item.itemSymbol.children[0].filters = [filterGlow]);
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
            if (loss) {
                eventViewGameOver();
                resultLineItem.forEach(item => item.itemSymbol.children[0].filters = [filterGlow]);
                credits = 0;
                creditsText.text = `MONEY: ${credits}$`;
                return;
            }
        }
    }
}

//start  win timer and auto hidden win scenes 
function winAutoHidden() {
    if (targetWin) {
        timeWinView -= 1;
        if (timeWinView == 0) {
            targetWin = false;
            winScene.visible = false;
            timeWinView = INITIAL_TIME_WIN;
        }
    }
}