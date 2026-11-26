$(function () {
    gsap.registerPlugin(ScrollTrigger);

    // ── cardPeel 修改DOM就可以使用───────────────────
    const cardPeelConfig = {
        list: '.linkList',
        slide: '.linkItem',
        pin: '.item',
        content: '.innerBlock',
    };
    // ─────────────────────────────────────────────

    const slides = gsap.utils.toArray(`${cardPeelConfig.list} ${cardPeelConfig.slide}`);

    // slides.length - 1 是因為最後一個不需要做動畫（最後一個不會被下一個覆蓋到，所以不需要做動畫）
    slides.slice(0, -1).forEach((slideEl, index) => {

        const contentWrapper = slideEl.querySelector(cardPeelConfig.pin);
        const contentEl = slideEl.querySelector(cardPeelConfig.content);

        // 動畫效果：往左或往右移動（交錯效果），旋轉，縮小，並且有透視感
        gsap.to(contentEl, {
            x: index % 2 === 0 ? -200 : 200, // 奇數筆往右移動，偶數筆往左移動
            rotationZ: gsap.utils.random(-5, 5), // 隨機旋轉角度，增加自然感
            scale: 0.7,
            rotationX: 40,
            ease: 'power1.in',
            scrollTrigger: {
                pin: contentWrapper,
                trigger: slideEl,
                start: 'top 0%',
                end: '+=100%',
                scrub: true,
            }
        });

        // 淡出效果，避免卡牌數量多，卡牌疊在一起
        gsap.to(contentEl, {
            autoAlpha: 0,
            ease: 'power1.in',
            scrollTrigger: {
                trigger: contentEl,
                start: 'top -80%',
                end: '+=50%',
                scrub: true,
            }
        });

    });

});
