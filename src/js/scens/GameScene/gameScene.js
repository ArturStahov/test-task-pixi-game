import * as PIXI from 'pixi.js'
import app from '../../../app'



export const gameSceneInit = () => {
    const gameScene = new PIXI.Container()
    const bg = new PIXI.Sprite.from("background");
    bg.position.set(app.screen.width / 2, app.screen.height / 2);
    bg.anchor.set(0.5);
    gameScene.addChild(bg)
    return gameScene
}