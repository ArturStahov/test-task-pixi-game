
export const checkPlayResult = (gameCombo) => {
    let win = false
    let loss = false
    let resultLineItem;
    const wildSymbolId = 0;

    const checkALine = () => {
        if (win) {
            return
        }
        let resultCheckWild = gameCombo.a.some(item => item.itemId === wildSymbolId)
        for (let i = 0; i < 3; i += 1) {
            let checkSymbol = gameCombo.a[i];

            let resultCheckArbitrary = gameCombo.a.filter(item => item.itemId === checkSymbol.itemId)


            if (resultCheckArbitrary.length === 3 && checkSymbol.itemId === wildSymbolId) {
                console.log('You Loss')
                loss = true;
                resultLineItem = gameCombo.a
                return
            }
            if (resultCheckArbitrary.length > 1 && resultCheckWild) {
                win = true;
                resultLineItem = gameCombo.a
                return
            }
            if (resultCheckArbitrary.length === 3) {
                win = true;
                resultLineItem = gameCombo.a
                return
            }
        }
    }

    const checkBLine = () => {
        if (win) {
            return
        }
        let resultCheckWild = gameCombo.b.some(item => item.itemId === wildSymbolId)
        for (let i = 0; i < 3; i += 1) {
            let checkSymbol = gameCombo.b[i];
            let resultCheckArbitrary = gameCombo.b.filter(item => item.itemId === checkSymbol.itemId)
            if (resultCheckArbitrary.length === 3 && checkSymbol.itemId === wildSymbolId) {
                console.log('You Loss')
                loss = true;
                resultLineItem = gameCombo.b
                return
            }
            if (resultCheckArbitrary.length > 1 && resultCheckWild) {
                win = true;
                resultLineItem = gameCombo.b
                return
            }
            if (resultCheckArbitrary.length === 3) {
                win = true;
                resultLineItem = gameCombo.b
                return
            }
        }
    }

    const checkCLine = () => {
        if (win) {
            return
        }
        let resultCheckWild = gameCombo.c.some(item => item.itemId === wildSymbolId)
        for (let i = 0; i < 3; i += 1) {
            let checkSymbol = gameCombo.c[i];
            let resultCheckArbitrary = gameCombo.c.filter(item => item.itemId === checkSymbol.itemId)
            if (resultCheckArbitrary.length === 3 && checkSymbol.itemId === wildSymbolId) {
                console.log('You Loss')
                loss = true;
                resultLineItem = gameCombo.c
                return
            }
            if (resultCheckArbitrary.length > 1 && resultCheckWild) {
                win = true;
                resultLineItem = gameCombo.c
                return
            }
            if (resultCheckArbitrary.length === 3) {
                win = true;
                resultLineItem = gameCombo.c
                return
            }
        }

    }

    checkALine()
    checkBLine()
    checkCLine()

    return {
        win,
        loss,
        resultLineItem,
    }

}