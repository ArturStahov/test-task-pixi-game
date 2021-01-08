import * as PIXI from 'pixi.js'
import { generateRandomInt } from '../../logics/generateRandomInt'


//width row
const ROW_WIDTH = 200;
//symbol size
const SYMBOL_SIZE = 150;

/**
 * function create game area  
 * @param {Array} gameItemsArr it's array all game items
 * @returns object with gameAreaContainer: pixi container with game row reels for view, 
 * gameCombo: object with results create game area conversion in column(array with symbols) for check results
 */
export const createRandomGameArea = (gameItemsArr) => {
    const gameAreaContainer = new PIXI.Container();

    let gameCombo = {
        a: [],
        b: [],
        c: [],
    };

    for (let i = 0; i < 3; i += 1) {
        const rowContainer = new PIXI.Container();
        rowContainer.x = i * ROW_WIDTH * 1.9;
        gameAreaContainer.addChild(rowContainer);

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

    }
    return { gameAreaContainer, gameCombo };
}

