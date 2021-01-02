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




console.log(PIXI)

const app = new PIXI.Application({
    transparent: false,
    resolution: window.devicePixelRatio
});
app.renderer.backgroundColor = 0x061639;
app.renderer.autoResize = true;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);

const loaders = new PIXI.Loader();

loaders
    .add('SYM1', './assets/SYM1.png')
    .add('SYM3', './assets/SYM2.png')
    .add('SYM4', './assets/SYM3.png')
    .add('SYM5', './assets/SYM4.png')
    .add('SYM6', './assets/SYM5.png')
    .add('SYM7', './assets/SYM6.png')
    .add('background', './assets/BG.png')
    .add('button', './assets/BTN_Spin.png')
    .add('button-disable', './assets/BTN_Spin_d.png')
    .load(setup);

const INITIAL_TIME_PLAY = 300;
let state, gameScene, buttonPlay, buttonPlayTexture, loadingScene, winScene;
let timeLoadingGame = 200;
let isLoadingGame = true;
let timePlay = 300;
let targetClick = false;



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


    loadingSceneInit()
    gameSceneInit()
    winSceneInit()

    //start view game scene property
    loadingScene.visible = true;
    gameScene.visible = false;
    winScene.visible = false;

    state = play;
    app.ticker.add(delta => gameLoop(delta));
}

//loading Scene initialize
const loadingSceneInit = () => {
    loadingScene = new PIXI.Container()
    let SpinnerLoading = new PIXI.Text("...Loading!", {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "white",
        stroke: '#ff3300',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
    });
    SpinnerLoading.anchor.set(0.5);
    SpinnerLoading.position.set(app.screen.width / 2, app.screen.height / 2);
    loadingScene.addChild(SpinnerLoading)

    app.stage.addChild(loadingScene)

}

//Win Scene initialize
const winSceneInit = () => {
    winScene = new PIXI.Container()

    const Box = new PIXI.Graphics();
    Box.lineStyle(2, 0xFF00FF, 1);
    Box.beginFill(0x650A5A, 0.45);
    Box.drawRoundedRect(app.screen.width / 2, app.screen.height / 2, app.screen.width - app.screen.width / 3, app.screen.height - app.screen.height / 3, 16);
    Box.pivot.set(Box.width / 2, Box.height / 2)
    Box.endFill();

    winScene.addChild(Box)

    const winText = new PIXI.Text("YOU WIN!", {
        fontFamily: "Arial",
        fontSize: 36,
        fill: "yellow",
        stroke: 'black',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: "#ffffff",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
    });
    winText.anchor.set(0.5);
    winText.position.set(app.screen.width / 2, app.screen.height / 2);
    winScene.addChild(winText)

    const buttonNextPlay = new PIXI.Graphics();
    buttonNextPlay.beginFill(0x061639, 0.1);
    buttonNextPlay.drawRect(app.screen.width / 2, app.screen.height / 2, app.screen.width, app.screen.height);
    buttonNextPlay.pivot.set(buttonNextPlay.width / 2, buttonNextPlay.height / 2)
    buttonNextPlay.endFill();
    buttonNextPlay.interactive = true;
    buttonNextPlay.buttonMode = true;
    buttonNextPlay.on('pointerdown', handlerClickNextPlay)
    winScene.addChild(buttonNextPlay)

    app.stage.addChild(winScene)
}

const handlerClickNextPlay = () => {
    winScene.visible = false;
}

//Game Scene initialize
const gameSceneInit = () => {
    //Game Scene
    gameScene = new PIXI.Container()
    app.stage.addChild(gameScene)
    // фон
    let bg = new PIXI.Sprite.from("background");
    bg.position.set(app.screen.width / 2, app.screen.height / 2);
    bg.anchor.set(0.5);
    gameScene.addChild(bg)
    initControl()
}

//Game Scene Control initialize
const initControl = () => {
    buttonPlayTexture = [
        PIXI.Texture.from('button'),
        PIXI.Texture.from('button-disable'),
    ]
    buttonPlay = new PIXI.Sprite(buttonPlayTexture[0]);
    buttonPlay.position.set(app.screen.width - 250, app.screen.height / 2);
    buttonPlay.anchor.set(0.5);
    buttonPlay.interactive = true;
    buttonPlay.buttonMode = true;
    buttonPlay.on('pointerdown', handlerClickPlay)
    gameScene.addChild(buttonPlay)
}

//game event click control
const handlerClickPlay = () => {
    if (!targetClick) {
        targetClick = true;
        timePlay = INITIAL_TIME_PLAY;
        buttonPlay.texture = buttonPlayTexture[1]
    }
}

//game event preloading
const eventPreloadingGame = () => {
    if (isLoadingGame) {
        timeLoadingGame -= 1;
    } else {
        return
    }

    if (timeLoadingGame == 0) {
        isLoadingGame = false
        loadingScene.visible = false;
        gameScene.visible = true;
        return
    }

}

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
        console.log(timePlay)
        if (timePlay == 0) {
            targetClick = false;
            buttonPlay.texture = buttonPlayTexture[0]
            eventViewGameWin()
        }
    }
}


function end() {
    //All the code that should run at the end of the game
}