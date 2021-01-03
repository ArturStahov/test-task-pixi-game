import * as PIXI from 'pixi.js'
const app = new PIXI.Application({
    transparent: false,
    resolution: window.devicePixelRatio
});
app.renderer.backgroundColor = 0x061639;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.resize(window.innerWidth, window.innerHeight);
app.view.style.width = window.innerWidth + "px";
app.view.style.height = window.innerHeight + "px";

export default app