import * as PIXI from 'pixi.js'
import app from '../../app'
import { generateRandomInt } from './generateRandomInt'


const ROW_WIDTH = 200;
const SYMBOL_SIZE = 150;


export const createRandomGameArea = (gameItemsArr) => {
    const gameAreaContainer = new PIXI.Container();
    let gameAreaResults = [];
    let gameCombo = {
        a: [],
        b: [],
        c: [],
    };

    for (let i = 0; i < 3; i += 1) {
        const rowContainer = new PIXI.Container();
        rowContainer.x = i * ROW_WIDTH * 1.9;
        gameAreaContainer.addChild(rowContainer);
        const row = {
            symbols: [],
        };

        for (let j = 0; j < 3; j += 1) {
            let randomItemId = generateRandomInt(0, gameItemsArr.length - 1);
            const symbolContainer = new PIXI.Container()
            const symbol = new PIXI.Sprite.from(gameItemsArr[randomItemId].itemSkin);
            symbol.y = 0;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = 0;
            symbol.anchor.set(0.5);
            symbolContainer.addChild(symbol)
            symbolContainer.y = j * SYMBOL_SIZE;
            symbolContainer.x = Math.round(SYMBOL_SIZE / 2);

            const ItemObj = {
                itemId: randomItemId,
                itemSymbol: symbolContainer
            }
            row.symbols.push(symbolContainer);
            rowContainer.addChild(symbolContainer);
            switch (j) {
                case 0:
                    gameCombo.a.push(ItemObj);
                    break;
                case 1:
                    gameCombo.b.push(ItemObj);
                    break;
                case 2:
                    gameCombo.c.push(ItemObj);
                    break;
                default: console.log("error value");

            }

        }
        gameAreaResults.push(row);
    }
    return { gameAreaContainer, gameAreaResults, gameCombo };
}

