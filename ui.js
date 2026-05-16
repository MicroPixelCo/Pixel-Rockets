// ============================================
// UI Functions - Menu and Interaction
// ============================================

function showSettings() {
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('settingsMenu').classList.add('active');
}

function backToMenu() {
    // Hide all screens
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('flightScreen').classList.remove('active');
    document.getElementById('settingsMenu').classList.remove('active');
    
    // Reset game state
    if (game) {
        game.gameState = 'menu';
        game.rocket.clear();
        if (game.animationId) {
            cancelAnimationFrame(game.animationId);
        }
    }
    
    // Show main menu
    document.getElementById('mainMenu').classList.add('active');
}

function quitGame() {
    if (confirm('Exit game?')) {
        window.close();
    }
}

function pauseGame() {
    alert('Pause functionality coming soon!');
}

// ============================================
// Drag and Drop Functions
// ============================================

let draggedPartType = null;

function dragPart(event, partType) {
    draggedPartType = partType;
    event.dataTransfer.effectAllowed = 'copy';
}

function allowDrop(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}

function dropPart(event) {
    event.preventDefault();
    if (draggedPartType) {
        game.addPart(draggedPartType);
        draggedPartType = null;
    }
}

function selectPart(partType) {
    game.selectedPart = partType;
    game.addPart(partType);
}
