export const showDebugOverlay = (data) => {
    // Remove any existing debug overlay
    const existingOverlay = document.getElementById('debug-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // Create new debug overlay
    const overlay = document.createElement('div');
    overlay.id = 'debug-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '10px';
    overlay.style.right = '10px';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    overlay.style.color = 'white';
    overlay.style.padding = '10px';
    overlay.style.borderRadius = '5px';
    overlay.style.zIndex = '9999';
    overlay.style.maxWidth = '400px';
    overlay.style.wordBreak = 'break-all';

    // Format data
    const formattedData = Object.entries(data)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');

    overlay.innerText = formattedData;
    document.body.appendChild(overlay);

    // Remove after 10 seconds
    setTimeout(() => overlay.remove(), 10000);
};