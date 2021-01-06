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
import { createRandomGameArea } from './js/logics/createRandomGameArea'
import { buttonNewGameInit } from './js/scens/GameOverScene'

document.body.appendChild(app.view);

// const load = PIXI.Loader.shared
// let id
// let bg                                                   don't works ?
// id = load.resources['./assets/assets.json'].textures;
// bg = new Sprite(id["BG.png"]);


const loaders = new PIXI.Loader();
loaders
    .add('SYM1', './assets/SYM1.png')
    .add('SYM2', './assets/SYM2.png')
    .add('SYM3', './assets/SYM3.png')
    .add('SYM4', './assets/SYM4.png')
    .add('SYM5', './assets/SYM5.png')
    .add('SYM6', './assets/SYM6.png')
    .add('background', './assets/BG.png')
    .add('button', './assets/BTN_Spin.png')
    .add('button-disable', './assets/BTN_Spin_d.png')
    .load(setup);

let soundWin = new Audio(soundsWin);
let soundClick = new Audio(soundsClick)
let soundsPlay = new Audio(soundPlay)
let soundsFon = new Audio(soundFon)

const INITIAL_TIME_PLAY = 300;
const INITIAL_TIME_WIN = 300;
const WIN_PRIZE = 10
const SPINS_PRICE = 5;
const filterGlow = new GlowFilter({ innerStrength: 3, outerStrength: 10, color: 0xffffff });


let state;
let gameScene;
let buttonPlay;
let buttonPlayTexture;
let loadingScene;
let winScene;
let gameOverScene;
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
let gameAreaResults = [];
let roundResult;


function setup() {

    const slotTextures = [
        PIXI.Texture.from('SYM1'),
        PIXI.Texture.from('SYM2'),
        PIXI.Texture.from('SYM3'),
        PIXI.Texture.from('SYM4'),
        PIXI.Texture.from('SYM5'),
        PIXI.Texture.from('SYM6'),
    ];

    //all game item
    gameItemsArr = [
        { itemId: 0, itemSkin: slotTextures[0] },
        { itemId: 1, itemSkin: slotTextures[1] },
        { itemId: 2, itemSkin: slotTextures[2] },
        { itemId: 3, itemSkin: slotTextures[3] },
        { itemId: 4, itemSkin: slotTextures[4] },
        { itemId: 5, itemSkin: slotTextures[5] },
    ]

    buttonPlayTexture = [
        PIXI.Texture.from('button'),
        PIXI.Texture.from('button-disable'),
    ];

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
    creditsPanels.x = app.screen.width - 200;
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
    gameAreaObj = createRandomGameArea(gameItemsArr)
    gameAreaResults = gameAreaObj.gameAreaResults
    let { gameAreaContainer } = gameAreaObj
    gameAreaContainer.width = app.screen.width / 2;
    gameAreaContainer.y = app.screen.height / 2 + 50;
    gameAreaContainer.x = app.screen.width / 2 + 50;
    gameAreaContainer.pivot.set(gameAreaContainer.width / 2, gameAreaContainer.height / 2);
    gameScene.addChild(gameAreaContainer);

    //start view game scene property
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

//New Game button   handler
const handlerClickNewGame = () => {
    gameOverScene.visible = false;
    credits = 1000;
    winSalary = 0;
    creditsPanels.children[1].text = `MONEY: ${credits}$`;
    creditsPanels.children[2].text = `WIN: ${winSalary}$`;
}

//Game Scene button Play handler
const handlerClickPlay = () => {
    if (!targetClick) {
        targetClick = true;
        timePlay = INITIAL_TIME_PLAY;
        buttonPlay.texture = buttonPlayTexture[1];
        credits -= SPINS_PRICE;
        creditsPanels.children[1].text = `MONEY: ${credits}$`;

        if (roundResult && roundResult.resultLineItem.length > 0) {
            roundResult.resultLineItem.forEach(item => item.itemSymbol.children[0].filters = null)
        }

        AnimationsGameArea(gameAreaResults)

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
            gameScene.removeChild(gameAreaObj.gameAreaContainer);

            gameAreaObj = createRandomGameArea(gameItemsArr)
            gameAreaResults = gameAreaObj.gameAreaResults
            let { gameAreaContainer, gameCombo } = gameAreaObj
            gameAreaContainer.width = app.screen.width / 2;
            gameAreaContainer.y = app.screen.height / 2 + 50;
            gameAreaContainer.x = app.screen.width / 2 + 50;
            gameAreaContainer.pivot.set(gameAreaContainer.width / 2, gameAreaContainer.height / 2);
            gameScene.addChild(gameAreaContainer);
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

    if (targetWin) {
        timeWinView -= 1;
        if (timeWinView == 0) {
            targetWin = false;
            winScene.visible = false;
            timeWinView = INITIAL_TIME_WIN;
        }
    }
}

function end() {
    //All the code that should run at the end of the game
}