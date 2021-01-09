import * as PIXI from 'pixi.js'
import app from '../../../app'

//interactive display button fullscreen
export const buttonNextPlayInit = () => {
    const buttonFigure = new PIXI.Graphics();
    buttonFigure.beginFill(0x061639, 0.1);
    buttonFigure.drawRect(app.screen.width / 2, app.screen.height / 2, app.screen.width, app.screen.height);
    buttonFigure.pivot.set(buttonFigure.width / 2, buttonFigure.height / 2);
    buttonFigure.endFill();
    buttonFigure.interactive = true;
    buttonFigure.buttonMode = true;
    return buttonFigure;
}

