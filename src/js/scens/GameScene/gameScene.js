import * as PIXI from 'pixi.js'
import app from '../../../app'



export const gameSceneInit = () => {
    const gameScene = new PIXI.Container()


    const bg = new PIXI.Sprite.from(PIXI.utils.TextureCache["BG.png"]);
    bg.position.set(app.screen.width / 2, app.screen.height / 2);
    bg.anchor.set(0.5);
    bg.scale.x = Math.min(app.screen.width / bg.width);
    bg.scale.y = Math.min(app.screen.height / bg.height);
    // bg.scale = new PIXI.Point(1, 2);
    gameScene.addChild(bg)

    gameScene.width = app.screen.width;
    gameScene.height = app.screen.height
    gameScene.x = app.screen.width / 2;
    gameScene.y = app.screen.height / 2;
    gameScene.pivot.set(app.screen.width / 2, app.screen.height / 2);
    return gameScene
}