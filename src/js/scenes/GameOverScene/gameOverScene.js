import * as PIXI from 'pixi.js'
import app from '../../../app'

export const gameOverSceneInit = () => {
    const gameOverSceneContainer = new PIXI.Container()

    //background panel
    const Box = new PIXI.Graphics();
    Box.lineStyle(2, 0xFF00FF, 1);
    Box.beginFill(0x650A5A, 0.45);
    Box.drawRoundedRect(app.screen.width / 2, app.screen.height / 2, app.screen.width - app.screen.width / 3, app.screen.height - app.screen.height / 3, 16);
    Box.pivot.set(Box.width / 2, Box.height / 2)
    Box.endFill();
    gameOverSceneContainer.addChild(Box)

    //text info You Lost
    const losText = new PIXI.Text("YOU LOST!", {
        fontFamily: "Arial",
        fontSize: 36,
        fill: "red",
        stroke: 'black',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: "#ffffff",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
    });
    losText.anchor.set(0.5);
    losText.position.set(app.screen.width / 2, app.screen.height / 2);
    gameOverSceneContainer.addChild(losText)

    return gameOverSceneContainer
}