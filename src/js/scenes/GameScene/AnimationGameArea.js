import * as PIXI from 'pixi.js';
import gsap from 'gsap';


const filterBlur = new PIXI.filters.BlurFilter(0.8, 0.9, 0.6);


/**
 * function create animation and play her
 * @param {Array} gameAreaAnimationItemRefs it's array with objects game rows with symbols for animation
 */

export const AnimationsGameArea = (gameAreaAnimationItemRefs) => {
    for (let i = 0; i < 3; i += 1) {
        gameAreaAnimationItemRefs[i].symbols[0].filters = [filterBlur];
        gameAreaAnimationItemRefs[i].symbols[2].filters = [filterBlur];
        gameAreaAnimationItemRefs[i].symbols[5].filters = [filterBlur];

        gsap.to(gameAreaAnimationItemRefs[i].symbols[0], {
            duration: 0.3,
            ease: "none",
            y: 270,
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % 250), //force x value to be between 0 and 500 using modulus
            },
            repeat: -1,
        });
        gsap.to(gameAreaAnimationItemRefs[i].symbols[1], {
            duration: 0.3,
            ease: "none",
            y: -125,
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % 200), //force x value to be between 0 and 500 using modulus
            },
            repeat: -1,
        });
        gsap.to(gameAreaAnimationItemRefs[i].symbols[2], {
            duration: 0.3,
            ease: "none",
            y: -125,
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % 300), //force x value to be between 0 and 500 using modulus
            },
            repeat: -1,
        });
        gsap.to(gameAreaAnimationItemRefs[i].symbols[3], {
            duration: 0.3,
            ease: "none",
            y: -125,
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % 300), //force x value to be between 0 and 500 using modulus
            },
            repeat: -1,
        });
        gsap.to(gameAreaAnimationItemRefs[i].symbols[4], {
            duration: 0.3,
            ease: "none",
            y: -125,
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % 300), //force x value to be between 0 and 500 using modulus
            },
            repeat: -1,
        });
        gsap.to(gameAreaAnimationItemRefs[i].symbols[5], {
            duration: 0.3,
            ease: "none",
            y: 125,
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % 300), //force x value to be between 0 and 500 using modulus
            },
            repeat: -1,
        });

    }
}