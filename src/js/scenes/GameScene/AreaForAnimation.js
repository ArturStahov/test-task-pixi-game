import * as PIXI from 'pixi.js';

import { generateRandomInt } from '../../logics/generateRandomInt';

//width row
const ROW_WIDTH = 250;
//symbol size
const SYMBOL_SIZE = 200;

/**
 * function create game area for animation
 * @param {Array} gameItemsArr it's array all game items
 * @returns object with gameAreaAnimationContainer: pixi container, arrayItemsForAnim: array with results create game area(row with symbols)
 */

export const areaForAnimation = (gameItemsArr) => {
    const gameAreaAnimationContainer = new PIXI.Container();
    let arrayItemsForAnim = [];

    for (let i = 0; i < 3; i += 1) {
        const rowContainer = new PIXI.Container();
        rowContainer.x = i * ROW_WIDTH * 1.5;
        gameAreaAnimationContainer.addChild(rowContainer);
        const row = {
            symbols: [],
        };

        for (let j = 0; j < 6; j += 1) {
            let randomItemId = generateRandomInt(0, gameItemsArr.length - 1);
            const symbolContainer = new PIXI.Container();
            const symbol = new PIXI.Sprite.from(gameItemsArr[randomItemId].itemSkin);
            symbol.y = 0;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = 0;
            symbol.anchor.set(0.5);
            symbolContainer.addChild(symbol);
            symbolContainer.y = j * SYMBOL_SIZE;
            symbolContainer.x = Math.round(SYMBOL_SIZE / 2);
            row.symbols.push(symbolContainer);
            rowContainer.addChild(symbolContainer);

        }
        arrayItemsForAnim.push(row);
    }
    return { gameAreaAnimationContainer, arrayItemsForAnim };
}

