import * as PIXI from 'pixi.js'
import app from '../../../app'

//Game Scene Control initialize
export const buttonPlayInit = (buttonPlayTexture) => {
    const buttonPlay = new PIXI.Sprite(buttonPlayTexture[0]);
    buttonPlay.position.set(app.screen.width - 250, app.screen.height / 2);
    buttonPlay.anchor.set(0.5);
    buttonPlay.interactive = true;
    buttonPlay.buttonMode = true;
    return buttonPlay
}
