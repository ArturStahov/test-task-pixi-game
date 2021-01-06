import * as PIXI from 'pixi.js'
import gsap from 'gsap'
const filterBlur = new PIXI.filters.BlurFilter(0.8, 0.9, 0.6)


export const AnimationsGameArea = (gameAreaResults) => {
    for (let i = 0; i < 3; i += 1) {
        gameAreaResults[i].symbols[0].filters = [filterBlur]
        gameAreaResults[i].symbols[1].filters = [filterBlur]
        gameAreaResults[i].symbols[2].filters = [filterBlur]

        gsap.to(gameAreaResults[i].symbols[0], {
            duration: 0.2,
            ease: "none",
            y: 200,
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % 250) //force x value to be between 0 and 500 using modulus
            },
            repeat: -1
        });
        gsap.to(gameAreaResults[i].symbols[1], {
            duration: 0.2,
            ease: "none",
            y: -75,
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % 200) //force x value to be between 0 and 500 using modulus
            },
            repeat: -1
        });
        gsap.to(gameAreaResults[i].symbols[2], {
            duration: 0.2,
            ease: "none",
            y: -100,
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % 300) //force x value to be between 0 and 500 using modulus
            },
            repeat: -1
        });
    }
}