import * as PIXI from 'pixi.js'
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
import app from './app'
import { loadingSceneInit } from './js/scens/LoadingScene'
import { winSceneInit } from './js/scens/WinScene'
import { buttonNextPlayInit } from './js/scens/WinScene'
import { gameSceneInit } from './js/scens/GameScene'
import { buttonPlayInit } from './js/scens/GameScene'
import { creditsPanel } from './js/scens/GameScene'
import { gameOverSceneInit } from './js/scens/GameOverScene'
import { generateRandomInt } from './js/logics/generateRandomInt'
import { checkPlayResult } from './js/logics/checkPlayResult'
import { buttonNewGameInit } from './js/scens/GameOverScene'

console.log(PIXI);
document.body.appendChild(app.view);

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

const ROW_WIDTH = 170;
const SYMBOL_SIZE = 150;
const INITIAL_TIME_PLAY = 50;
const INITIAL_TIME_WIN = 50;
const WIN_PRIZE = 10
const SPINS_PRICE = 5;

let credits = 1000;
let winSalary = 0;

let state, gameScene, buttonPlay, buttonPlayTexture, loadingScene, winScene, gameOverScene, creditsPanels;
let timeLoadingGame = 50;
let isLoadingGame = true;
let timePlay;
let targetClick = false;
let targetWin = false;
let timeWinView;
let gameItemsArr = [];
let gameAreaResults = [];
let gameAreaContainer;
let gameCombo = {
    a: [],
    b: [],
    c: [],
};

function setup() {
    // id = loaders.resources['./assets/atlas.json'].textures;    ?dont worck
    // const resources = new Promise((resolve, reject) => loader.load((loader, resources) => resolve(resources)))

    const slotTextures = [
        PIXI.Texture.from('SYM1'),
        PIXI.Texture.from('SYM2'),
        PIXI.Texture.from('SYM3'),
        PIXI.Texture.from('SYM4'),
        PIXI.Texture.from('SYM5'),
        PIXI.Texture.from('SYM6'),
    ];
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



    //all game item
    gameItemsArr = [
        { itemId: 0, itemSkin: slotTextures[0], itemSymbol: null },
        { itemId: 1, itemSkin: slotTextures[1], itemSymbol: null },
        { itemId: 2, itemSkin: slotTextures[2], itemSymbol: null },
        { itemId: 3, itemSkin: slotTextures[3], itemSymbol: null },
        { itemId: 4, itemSkin: slotTextures[4], itemSymbol: null },
        { itemId: 5, itemSkin: slotTextures[5], itemSymbol: null },
    ]

    //init  game area
    gameAreaContainer = createRandomGameArea()
    gameScene.addChild(gameAreaContainer);

    //start view game scene property
    loadingScene.visible = true;
    gameScene.visible = false;
    winScene.visible = false;
    gameOverScene.visible = false;

    state = play;
    app.ticker.add(delta => gameLoop(delta));
}


const createRandomGameArea = () => {
    const gameAreaContainer = new PIXI.Container(); // общый контейнер поля
    gameCombo = { // очищаем
        a: [],
        b: [],
        c: [],
    }
    gameAreaResults = [];// очищаем

    for (let i = 0; i < 3; i += 1) {
        const rowContainer = new PIXI.Container();   // контейнер столбца
        rowContainer.x = i * ROW_WIDTH;
        gameAreaContainer.addChild(rowContainer);

        const row = {
            symbols: [],    //масив всех символов в столбце         
        };

        // Build the symbols
        for (let j = 0; j < 3; j += 1) {
            let randomItemId = generateRandomInt(0, 5);
            const symbol = new PIXI.Sprite.from(gameItemsArr[randomItemId].itemSkin);
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            gameItemsArr[randomItemId].itemSymbol = symbol;
            row.symbols.push(gameItemsArr[randomItemId]); // заносим в масив столбца
            rowContainer.addChild(symbol);
            //разносим итемы в обект полей для проверки комбинаций
            switch (j) {
                case 0:
                    gameCombo.a.push(gameItemsArr[randomItemId]);
                    break;
                case 1:
                    gameCombo.b.push(gameItemsArr[randomItemId]);
                    break;
                case 2:
                    gameCombo.c.push(gameItemsArr[randomItemId]);
                    break;
                default: console.log("error value");

            }
        }
        gameAreaResults.push(row);
    }



    gameAreaContainer.width = app.screen.width / 2;
    gameAreaContainer.y = app.screen.height / 2;
    gameAreaContainer.x = app.screen.width / 2;
    gameAreaContainer.pivot.set(gameAreaContainer.width / 2, gameAreaContainer.height / 2);
    return gameAreaContainer;
}



//NextPlay button Win Scene handler
const handlerClickNextPlay = () => {
    winScene.visible = false;
}
//New Game button   handler
const handlerClickNewGame = () => {
    gameOverScene.visible = false;
    credits = 1000;
    winSalary = 0;
}

//Game Scene button Play handler
const handlerClickPlay = () => {
    if (!targetClick) {
        targetClick = true;
        timePlay = INITIAL_TIME_PLAY;
        buttonPlay.texture = buttonPlayTexture[1];
        credits -= SPINS_PRICE;
        creditsPanels.children[1].text = `MONEY: ${credits}$`;
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

        // Play Animation
        console.log(timePlay)
        if (timePlay == 0) {
            targetClick = false;
            buttonPlay.texture = buttonPlayTexture[0];
            //render new game area result
            gameAreaResults = [];
            gameScene.removeChild(gameAreaContainer);
            gameAreaContainer = createRandomGameArea();
            gameScene.addChild(gameAreaContainer);

            const roundResult = checkPlayResult(gameCombo);

            // roundResult.resultLineItem[1]
            console.log(roundResult)
            // подсветить линию  <===================this
            if (roundResult.win) {
                eventViewGameWin();
                credits += WIN_PRIZE;
                winSalary += WIN_PRIZE
                creditsPanels.children[1].text = `MONEY: ${credits}$`;
                creditsPanels.children[2].text = `WIN: ${winSalary}$`;
                winScene.children[2].text = `${WIN_PRIZE}$`;
                targetWin = true;
                return
            }
            if (roundResult.loss) {
                eventViewGameOver();
                credits = 0
                creditsPanels.children[1].text = `MONEY: ${credits}$`;
                creditsPanels.children[2].text = `WIN: ${winSalary}$`;
                return
            }

        }
    }

    if (targetWin) {
        timeWinView -= 1;
        console.log(timeWinView)
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