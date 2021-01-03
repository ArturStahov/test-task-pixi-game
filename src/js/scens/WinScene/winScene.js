import * as PIXI from 'pixi.js'
import app from '../../../app'

//Win Scene initialize
export const winSceneInit = () => {
    const winScene = new PIXI.Container()

    //background panel
    const Box = new PIXI.Graphics();
    Box.lineStyle(2, 0x061639, 1);
    Box.beginFill(0x061639, 0.45);
    Box.drawRoundedRect(app.screen.width / 2, app.screen.height / 2, app.screen.width - app.screen.width / 3, app.screen.height - app.screen.height / 3, 16);
    Box.pivot.set(Box.width / 2, Box.height / 2)
    Box.endFill();
    winScene.addChild(Box)

    //text info You Won
    const winText = new PIXI.Text("YOU WON!", {
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

    let winSalaryText = new PIXI.Text(`WIN`, {
        fontFamily: "Arial",
        fontSize: 36,
        fill: "yellow",
        dropShadow: true,
        dropShadowColor: "#ffffff",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 3,
        dropShadowDistance: 3,
    });
    winSalaryText.anchor.set(0.5);
    winSalaryText.position.set(app.screen.width / 2, app.screen.height / 2 + 50);
    winScene.addChild(winSalaryText)

    return winScene
}

