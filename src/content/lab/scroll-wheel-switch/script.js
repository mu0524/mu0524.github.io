/* 
    備註紀錄一下
    - 文字使用show class 切換樣式也可以寫成GSAP
      但如果簡述有固定高度較不建議使用GSAP，怕RWD不好調整

    - 圖片使用clip-path 切換，可自行調整
 */

$(function(){
    gsap.registerPlugin(ScrollTrigger,Observer);
    gsap.config({
        nullTargetWarn: false
    });
	const mm = gsap.matchMedia();
        
	let solution = {
		textItem: '.solutionBox .solutionTxtList .solutionTxtItem',
		imgItem : '.solutionBox .solutionImgList .solutionImgItem',
	}

	// * ======== 變數設定 ========= *//
	let currentIndex = -1,
		isAnimating = false,
		inSolution = false,
		solutionTl = null;
	
	const totalItems = $(solution.imgItem).length;

	//* ========= 基本淡入淡出動畫 ========= *//
	const solutionTlConfig = {
		defaults: {
			opacity: 0,
			duration: 0.6,
			ease: 'power2.out',
		},
		scrollTrigger: {
			trigger: '.solutionArea',
			start: 'top 80%',
			end: 'bottom top',
		}
	}

	// 如果有aboutTl，則先清除並重新建立
	if(solutionTl) {
		solutionTl.kill();
		solutionTl = null;
	}

	solutionTl = gsap.timeline(solutionTlConfig);

	solutionTl.from('.solutionArea .titleBox .title', {
		x: -20,
	}).from('.solutionArea .titleBox .text', {
		x: -20,
	},"<=.2").from('.solutionArea .solutionBox', {
		y: 20,
	},"<=.2");

	
	//* ========= 綁滾軸動畫處理 ========= *//
	function handleAnimation(index, direction) {
		if(index < 0 || index >= totalItems) {
			inSolution = false; // 離開解決方案區域
			return;
		}

		isAnimating = true; // 開始動畫

		let tl = gsap.timeline({
			defaults: {
				duration: 0.8,
				ease: 'power2.out',
			},
			onStart: function() {
                // 切換show class 文字樣式
				$(solution.textItem).eq(index).addClass('show').siblings().removeClass('show');
			},
			onComplete: function() {
				isAnimating = false; // 動畫結束
			}
		});

		if(direction === -1) {
			// 向下滾動，切換圖片狀態
			tl.to({}, {}).to($(solution.imgItem).eq(index).find('.item'), {
				clipPath: 'inset(0% 0% 0% 0%)',
			},"<=.3");
		} else if (direction === 1 && index + 1 < totalItems) {
			// 向上滾動，切換圖片狀態
			tl.to({}, {}).to($(solution.imgItem).eq(index + 1).find('.item'), {
				clipPath: 'inset(100% 0% 0% 0%)',
			}, '<=.3');
		}

		currentIndex = index;
	}

	ScrollTrigger.create({
		trigger: ".solutionArea",
		start: 'top top',
		end: `+=300% top`,
		pin: true,
		markers: false,
		onEnter : () => {
			inSolution = true;

			gsap.utils.toArray(".solutionBox .solutionImgList .solutionImgItem").forEach((item, i) => {
				if(i !== 0) {
					gsap.set(item.querySelector('.item'), { clipPath: 'inset(0% 0% 100% 0%)' });
				}
			});

			// 顯示第一個項目
			if(currentIndex === -1) {
				currentIndex = 0;
				$(solution.textItem).eq(0).addClass('show').siblings().removeClass('show');
			}
		},
		onEnterBack: () => {
			inSolution = true;
		},
		onLeave: () => {
			inSolution = false;

			// 離開時設定為最後一個項目並顯示所有圖片
			currentIndex = totalItems - 1;
			$(solution.textItem).eq(currentIndex).addClass('show').siblings().removeClass('show');
			gsap.set($(solution.imgItem).find('.item'), {
				clipPath: 'inset(0% 0% 0% 0%)',
			});
		},
		onLeaveBack: () => {
			inSolution = false;
		},
	})

	// 滾動事件監聽：使用 window 作為目標來解決 padding 問題
	Observer.create({
		target: window, // 改用 window 作為目標來解決 padding 問題
		type: 'wheel,scroll',
		tolerance: 100,
		onDown: ()=> {
			if (inSolution == true) {
				!isAnimating && handleAnimation(currentIndex + 1, -1)
			}
		},
		onUp: ()=> {
			if (inSolution == true) {
				!isAnimating && handleAnimation(currentIndex - 1, 1)
			}
		},
	})
})
