// 每頁都載入的互動功能
// 換頁時 swup 不會執行新頁面的模組 script，各頁功能集中在這裡載入，再由 onPageLoad 判斷頁面有沒有對應元素
import "./toc";
import "./lightbox";
import "./github-card";
import "./archive";
import "./codepen";
