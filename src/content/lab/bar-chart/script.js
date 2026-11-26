$(function () {
    $(".barChartOuterBox").each(function () {
        //變數設定
        let chartBox = $(this).find(".barChartBox");
        let chartList = $(this).find(".chartList");
        let minRangeValue = 0; //最小值
        let maxRangeValue = 0; //最大值
        let rangeDifference = 0; //範圍
        let currentPercentage = 0; //文字，用來計算位置使用
        let currentLineHeight = 0; //線，用來計算線要跑多高使用

        //取得chartBox底下chartRangeBox的第一個和最後一個number值
        chartBox.find(".chartRangeBox .number").each(function () {
            //取得number最大範圍的值，並只取數字
            maxRangeValue = parseFloat(chartBox.find(".chartRangeBox .number").first().text().replace(/[^0-9.]/g, ""));

            //取得number最小範圍的值，並只取數字
            minRangeValue = parseFloat(chartBox.find(".chartRangeBox .number").last().text().replace(/[^0-9.]/g, ""));
        });

        rangeDifference = maxRangeValue - minRangeValue;
        //把range除以100，取得每個百分比的值
        rangeDifference = rangeDifference / 100;


        chartList.children().each(function () {
            //存一下chartList底下的shapeLine的line
            let shapeLineElement = $(this).find(".shapeLine .line");

            //只取currentText的數字
            currentPercentage = parseFloat($(this).find(".shapeLine .currentText").text().replace(/[^0-9.]/g, ""));

            //計算每個項目線的高度，值-最小值/範圍
            currentLineHeight = Math.floor((currentPercentage - minRangeValue) / rangeDifference);

            //CSS調整線高，文字位置順便修改
            shapeLineElement.css({ "max-height": currentLineHeight + "%" });
            $(this).find(".shapeLine .currentText").css({ bottom: "calc(" + currentLineHeight + "%" + " + 10px)" });
        });
    });
});
