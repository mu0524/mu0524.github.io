$(function() {
    var $list = $('.dataList');
    if (!$list.length) return;

    var $activeBox = null;
    var $originParent = null;

    // 點擊卡牌
    $list.on('click', '.dataItem > .item', function() {
        var $item = $(this).closest('.dataItem');
        var isSameItem = $originParent && $originParent[0] === $item[0];

        // 已展開 → 先收合
        if ($activeBox) {
            closeExpand(function() {
                if (!isSameItem) openExpand($item);
            });
            return;
        }

        openExpand($item);
    });

    // 關閉按鈕
    $list.on('click', '> .expandBox .closeBtn', function() {
        closeExpand();
    });

    function openExpand($item) {
        var $expandBox = $item.children('.expandBox');
        if (!$expandBox.length) return;

        // 找同一列最後一個項目
        var itemTop = $item.position().top;
        var $lastInRow = $list.children('.dataItem').filter(function() {
            return Math.abs($(this).position().top - itemTop) < 5;
        }).last();

        $originParent = $item;
        $activeBox = $expandBox;
        $expandBox.detach();
        $lastInRow.after($expandBox);
        $expandBox.hide().slideDown(500, function() {
            $('html, body').animate({
                scrollTop: $expandBox.offset().top - 120
            }, 300);
        });
        $item.addClass('active');
    }

    function closeExpand(callback) {
        if (!$activeBox) return;
        var $box = $activeBox;
        var $parent = $originParent;
        $activeBox = null;
        $originParent = null;
        $list.children('.dataItem').removeClass('active');

        $box.stop(true).slideUp(400, function() {
            $parent.append($box.css('display', ''));
            if (callback) callback();
        });
    }
});
