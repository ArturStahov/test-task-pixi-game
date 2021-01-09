import * as PIXI from 'pixi.js';
import app from '../../../app';


//init game scene
export const gameSceneInit = () => {
    const gameSceneContainer = new PIXI.Container();
    const bg = new PIXI.Sprite.from(PIXI.utils.TextureCache["BG.png"]);
    bg.position.set(app.screen.width / 2, app.screen.height / 2);
    bg.anchor.set(0.5);
    bg.scale.x = Math.min(app.screen.width / bg.width);
    bg.scale.y = Math.min(app.screen.height / bg.height);
    gameSceneContainer.addChild(bg);

    gameSceneContainer.width = app.screen.width;
    gameSceneContainer.height = app.screen.height;
    gameSceneContainer.x = app.screen.width / 2;
    gameSceneContainer.y = app.screen.height / 2;
    gameSceneContainer.pivot.set(app.screen.width / 2, app.screen.height / 2);
    return gameSceneContainer;
}