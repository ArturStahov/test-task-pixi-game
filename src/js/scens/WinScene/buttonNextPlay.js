import * as PIXI from 'pixi.js'
import app from '../../../app'

//interactive display button fullscreen
export const buttonNextPlayInit = () => {
    const buttonNextPlay = new PIXI.Graphics();
    buttonNextPlay.beginFill(0x061639, 0.1);
    buttonNextPlay.drawRect(app.screen.width / 2, app.screen.height / 2, app.screen.width, app.screen.height);
    buttonNextPlay.pivot.set(buttonNextPlay.width / 2, buttonNextPlay.height / 2)
    buttonNextPlay.endFill();
    buttonNextPlay.interactive = true;
    buttonNextPlay.buttonMode = true;
    return buttonNextPlay
}

