let muteVideo = false;

function getMostVisibleVideo() {
    let mostVisible = null, maxVisibility = 0;
    document.querySelectorAll('video').forEach(v => {
        const r = v.getBoundingClientRect();
        const area = r.width * r.height;
        if (area === 0) return;

        const w = Math.min(r.right, innerWidth) - Math.max(r.left, 0);
        const h = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
        const visible = Math.max(0, w) * Math.max(0, h) / area;

        if (visible > maxVisibility) {
            maxVisibility = visible;
            mostVisible = v;
        }
    });
    return mostVisible;
}

setInterval(() => {
    document.querySelectorAll('video').forEach(v => v.muted = muteVideo);
}, 100);

document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

    if (e.key.toLowerCase() === 'u') {
        muteVideo = !muteVideo;
        document.querySelectorAll('video').forEach(v => v.muted = muteVideo);
        showIndicator(muteVideo ? 'Muted' : 'Unmuted');
    }

    if (e.key.toLowerCase() === 'y') {
        const target = getMostVisibleVideo();
        if (!target) return showIndicator('No video visible');

        document.querySelectorAll('video').forEach(v => {
            if (v !== target) {
                v.pause();
                v.muted = true;
            }
        });

        if (target.paused) {
            target.muted = false;
            target.play();
            showIndicator('Playing (Unmuted)');
        } else {
            target.pause();
            target.muted = false;
            showIndicator('Paused (Unmuted)');
        }

        muteVideo = false;
    }
});

function showIndicator(msg) {
    const old = document.getElementById('video-indicator');
    if (old) old.remove();

    const box = document.createElement('div');
    box.id = 'video-indicator';
    box.textContent = msg;
    box.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,.8);
        color: white;
        padding: 12px 20px;
        font-size: 16px;
        border-radius: 8px;
        z-index: 10000;
        animation: fadeInOut 1s ease;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;
    document.body.appendChild(box);

    if (!document.getElementById('video-indicator-style')) {
        const style = document.createElement('style');
        style.id = 'video-indicator-style';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-10px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => box.remove(), 1000);
}