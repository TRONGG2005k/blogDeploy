// debugging.js
export const debugLog = (section, data) => {
    console.log(`[DEBUG: ${section}]`, data);
    // Also log to document body for visibility in case console is not showing
    const debugDiv = document.createElement('div');
    debugDiv.style.position = 'fixed';
    debugDiv.style.top = '0';
    debugDiv.style.right = '0';
    debugDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
    debugDiv.style.color = 'white';
    debugDiv.style.padding = '10px';
    debugDiv.style.zIndex = '9999';
    debugDiv.textContent = `${section}: ${JSON.stringify(data)}`;
    document.body.appendChild(debugDiv);
    // Remove after 5 seconds
    setTimeout(() => debugDiv.remove(), 5000);
};