import * as PIXI from 'pixi.js'
import app from '../../../app'
//loading Scene initialize
export const loadingSceneInit = () => {
    const loadingScene = new PIXI.Container()
    const SpinnerLoading = new PIXI.Text("...Loading!", {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "white",
        stroke: '#ff3300',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
    });
    SpinnerLoading.anchor.set(0.5);
    SpinnerLoading.position.set(app.screen.width / 2, app.screen.height / 2);
    loadingScene.addChild(SpinnerLoading)

    return loadingScene;
}

