import * as PIXI from 'pixi.js'
import app from '../../../app'

//interactive display button fullscreen
export const buttonNewGameInit = () => {
    const buttonNewGame = new PIXI.Graphics();
    buttonNewGame.beginFill(0x061639, 0.1);
    buttonNewGame.drawRect(app.screen.width / 2, app.screen.height / 2, app.screen.width, app.screen.height);
    buttonNewGame.pivot.set(buttonNewGame.width / 2, buttonNewGame.height / 2)
    buttonNewGame.endFill();
    buttonNewGame.interactive = true;
    buttonNewGame.buttonMode = true;
    return buttonNewGame
}
