/**
 * 
 * @param {object} gameCombo it result for create game area with line (array) items
 * @return {object} object with params result checking gameCombo.  
 *      win:bool,
        loss:bool,
        resultLineItem:array with win items,
 */
export const checkPlayResult = (gameCombo) => {
    let win = false;
    let loss = false;
    let resultLineItem = [];
    const wildSymbolId = 0;

    checkALine();
    checkBLine();
    checkCLine();

    //checking first game line(column)
    function checkALine() {
        if (win) {
            return;
        }
        let resultCheckWild = gameCombo.a.some(item => item.itemId === wildSymbolId);
        for (let i = 0; i < 3; i += 1) {
            let checkSymbol = gameCombo.a[i];
            let resultCheckArbitrary = gameCombo.a.filter(item => item.itemId === checkSymbol.itemId);

            if (resultCheckArbitrary.length === 3 && checkSymbol.itemId === wildSymbolId) {
                loss = true;
                resultLineItem = [...gameCombo.a];
                return;
            }
            if (resultCheckArbitrary.length > 1 && resultCheckWild) {
                win = true;
                resultLineItem = [...gameCombo.a];
                return;
            }
            if (resultCheckArbitrary.length === 3) {
                win = true;
                resultLineItem = [...gameCombo.a];
                return;
            }
        }
    }
    //checking second game line(column)
    function checkBLine() {
        if (win) {
            return;
        }
        let resultCheckWild = gameCombo.b.some(item => item.itemId === wildSymbolId)
        for (let i = 0; i < 3; i += 1) {
            let checkSymbol = gameCombo.b[i];
            let resultCheckArbitrary = gameCombo.b.filter(item => item.itemId === checkSymbol.itemId);
            if (resultCheckArbitrary.length === 3 && checkSymbol.itemId === wildSymbolId) {
                loss = true;
                resultLineItem = [...gameCombo.b];
                return;
            }
            if (resultCheckArbitrary.length > 1 && resultCheckWild) {
                win = true;
                resultLineItem = [...gameCombo.b];
                return;
            }
            if (resultCheckArbitrary.length === 3) {
                win = true;
                resultLineItem = [...gameCombo.b];
                return;
            }
        }
    }
    //checking third game line(column)
    function checkCLine() {
        if (win) {
            return;
        }
        let resultCheckWild = gameCombo.c.some(item => item.itemId === wildSymbolId);
        for (let i = 0; i < 3; i += 1) {
            let checkSymbol = gameCombo.c[i];
            let resultCheckArbitrary = gameCombo.c.filter(item => item.itemId === checkSymbol.itemId);
            if (resultCheckArbitrary.length === 3 && checkSymbol.itemId === wildSymbolId) {
                loss = true;
                resultLineItem = [...gameCombo.c];
                return;
            }
            if (resultCheckArbitrary.length > 1 && resultCheckWild) {
                win = true;
                resultLineItem = [...gameCombo.c];
                return;
            }
            if (resultCheckArbitrary.length === 3) {
                win = true;
                resultLineItem = [...gameCombo.c];
                return;
            }
        }

    }

    return {
        win,
        loss,
        resultLineItem,
    }

}