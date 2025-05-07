function waitForImageToLoad(imgSelector, src, maxRetries = 10, intervalMs = 500) {
    let retries = 0;

    const img = document.querySelector(imgSelector);
    if (!img) return;

    const checkImage = () => {
        fetch(src)
            .then((res) => {
                if (res.ok) {
                    img.src = src; // Set it again to trigger load
                    clearInterval(timer);
                }
            })
            .catch(() => {
                retries++;
                if (retries >= maxRetries) clearInterval(timer);
            });
    };

    const timer = setInterval(checkImage, intervalMs);
}

export {waitForImageToLoad};