$(function(){
    if($(".circleList").length) {
        // 定義DOM元素
        const Config = {
            circleList: $('.circleList'),
            circleItem: $('.circleItem'),
            startAngle: -90, // 起始角度，-90表示12點鐘方向，0表示3點鐘方向，90 代表 6 點鐘方向，180 代表 9 點鐘方向...以此類推
        }

        const circleList = Config.circleList;
        const circleItem = Config.circleItem;
        const count = circleItem.length; // 總共幾個圓圈
        const angleOffset = 360 / count; // 角度偏移量

        // 防抖計時器
        let resizeTimer = null;

        /**
         * 防抖函數
         * @param {Function} func 要執行的函數
         * @param {number} delay 延遲時間（毫秒）
         */
        function debounce(func, delay) {
            return function() {
                // 清除之前的計時器
                clearTimeout(resizeTimer);
                // 設置新的計時器
                resizeTimer = setTimeout(func, delay);
            };
        }
        
        /**
         * 計算圓圈位置
         * 使用三角函數計算每個圓圈的 x 和 y 座標
         * 並使用 CSS 的 transform 屬性來移動圓圈
        */
        function circlePosition() {
            const rect = circleList[0].getBoundingClientRect(); // 取得元素的邊界矩形
            const circleRadius = rect.width / 2 - circleItem[0].offsetWidth / 2; // 大圓半徑 - 小圓半徑，取得圓心位置

            circleItem.each(function(index){
                const angleDeg = angleOffset * index + Config.startAngle ; // 計算每個圓圈的角度
                const angleRad = angleDeg * Math.PI / 180; // 轉換為弧度

                const x = circleRadius * Math.cos(angleRad); // 計算 x 座標
                const y = circleRadius * Math.sin(angleRad); // 計算 y 座標
                $(this).css({
                    'transform': `translate(${x}px, ${y}px)`
                });
            });
        }

        // 初始執行
        circlePosition();

        // 綁定 resize 事件，加上防抖處理（250ms 延遲）
        $(window).on('resize', debounce(circlePosition, 250));
    }
})
