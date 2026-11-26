// ── Leader Line 連接設定 ──
const lineOptions = {
    path: 'fluid',
    startPlug: 'disc',
    endPlug: 'disc',
    color: '#c9b5b5',
    size: 2,
    startPlugColor: '#b9a5a5',
    endPlugColor: '#b9a5a5',
    startPlugSize: 1.5,
    endPlugSize: 1.5,
    startPlugOutline: true,
    endPlugOutline: true,
    startPlugOutlineColor: 'rgba(255,255,255,0.8)',
    endPlugOutlineColor: 'rgba(255,255,255,0.8)',
    startPlugOutlineSize: 2,
    endPlugOutlineSize: 2,
};

// ── 建立連接線 ──
const lines = [];

// 讀文件 → 寫範例
lines.push(new LeaderLine(
    document.querySelector('#card-source .lineAnchor.start'),
    document.querySelector('#card-model .lineAnchor.end'),
    lineOptions
));

// 寫範例 → 整理成文章
lines.push(new LeaderLine(
    document.querySelector('#card-model .lineAnchor.start'),
    document.querySelector('#card-output .lineAnchor.end'),
    lineOptions
));

// 除錯測試 → 整理成文章
lines.push(new LeaderLine(
    document.querySelector('#card-style .lineAnchor.start'),
    document.querySelector('#card-output .lineAnchor.end.n2'),
    lineOptions
));

// 整理成文章 → 發布上線
lines.push(new LeaderLine(
    document.querySelector('#card-output .lineAnchor.start'),
    document.querySelector('#card-video .lineAnchor.end'),
    lineOptions
));

// 錨點位置由 CSS 決定，需在版面穩定後重新計算連線
function refreshLines() {
    lines.forEach(line => line.position());
}

window.addEventListener('load', refreshLines);
window.addEventListener('resize', refreshLines);

document.querySelectorAll('.Img img').forEach(img => {
    if (!img.complete) {
    img.addEventListener('load', refreshLines);
    }
});

requestAnimationFrame(() => requestAnimationFrame(refreshLines));

// ── 拖曳功能 ──
document.querySelectorAll('.nodeConnect').forEach(card => {
    let isDragging = false;
    let offsetX, offsetY;

    card.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - card.offsetLeft;
    offsetY = e.clientY - card.offsetTop;
    card.classList.add('isDragging');
    });

    document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    card.style.setProperty('--left', `${e.clientX - offsetX}px`);
    card.style.setProperty('--top', `${e.clientY - offsetY}px`);
    lines.forEach(line => line.position());
    });

    document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        card.classList.remove('isDragging');
    }
    });
});
