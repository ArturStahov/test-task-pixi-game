import * as PIXI from 'pixi.js';


//init panel user credits coins
export const creditsPanelInit = (credits, winSalary) => {
    const creditsPanelContainer = new PIXI.Container();
    const Box = new PIXI.Graphics();
    Box.lineStyle(2, 0xBF6730, 1);
    Box.beginFill(0x061639, 1);
    Box.drawRoundedRect(0, 0, 200, 150);
    Box.pivot.set(Box.width / 2, Box.height / 2);
    Box.endFill();
    creditsPanelContainer.addChild(Box);

    let creditsText = new PIXI.Text(`MONEY: ${credits}$`, {
        fontFamily: "Arial",
        fontSize: 16,
        fill: "yellow",
        dropShadow: true,
        dropShadowColor: "#ffffff",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 3,
        dropShadowDistance: 3,
    });
    creditsText.anchor.set(0.5);
    creditsText.position.set(-20, -30);
    creditsPanelContainer.addChild(creditsText);

    let winSalaryText = new PIXI.Text(`WIN: ${winSalary}$`, {
        fontFamily: "Arial",
        fontSize: 16,
        fill: "yellow",
        dropShadow: true,
        dropShadowColor: "#ffffff",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 3,
        dropShadowDistance: 3,
    });
    winSalaryText.anchor.set(0.5);
    winSalaryText.position.set(-47, -5);
    creditsPanelContainer.addChild(winSalaryText);

    return { creditsPanelContainer, winSalaryText, creditsText };
}