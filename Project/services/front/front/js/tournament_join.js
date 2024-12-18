import { urlLocationHandler } from "./url-router.js";

let ws = null;
let isPlayerReady = false;
let tournamentData = null;

async function fetchTournamentData() {
    const state = history.state;
    const tournamentName = state ? state.roomName : null;
    try {
        const response = await fetch(`https://${window.location.host}/api/tournament/${tournamentName}/`);
        tournamentData = await response.json();
        
        updatePlayerList(tournamentData.tournament_members);
        updateTournamentStatus(tournamentData);
        
        return tournamentData.tournament_members;
    } catch (error) {
        console.error('Error fetching tournament data:', error);
        document.getElementById('trn-status-display').textContent = 'Connection Lost. Retrying...';
        return [];
    }
}

function updatePlayerList(players) {
    const playerRoster = document.getElementById('trn-player-roster');
    playerRoster.innerHTML = ''; 
    
    if (players.length === 0) {
        const li = document.createElement('li');
        li.classList.add('trn-player-item');
        li.textContent = 'Waiting for warriors to join...';
        playerRoster.appendChild(li);
    } else {
        players.forEach(player => {
            const li = document.createElement('li');
            li.classList.add('trn-player-item');
            const badge = document.createElement('div');
            badge.classList.add('trn-player-badge');
            badge.textContent = player.username;
            li.appendChild(badge);
            playerRoster.appendChild(li);
        });
    }

    return players;
}

function updateTournamentStatus(tournamentData) {
    const statusElement = document.getElementById('trn-status-display');
    const launchButton = document.getElementById('trn-match-launch');
    const exitButton = document.getElementById('trn-exit-arena');

    if (exitButton) {
        exitButton.addEventListener('click', () => {
            history.pushState(null, "", "/tournament");
            urlLocationHandler();
        });
    }

    if (tournamentData.is_tournament_full) {
        statusElement.textContent = 'Arena is Full. Battle Begins Soon!';
        launchButton.disabled = false;

        launchButton.addEventListener('click', function() {
            if (!isPlayerReady) {
                isPlayerReady = true;
                this.disabled = true;
                this.querySelector('.trn-button-text').textContent = 'Preparing Battlefield...';
                if (ws) {
                    ws.send(JSON.stringify({ action: 'player_ready' }));
                }
            }
        });
    } else {
        const remainingSpots = 4 - tournamentData.tournament_members.length;
        statusElement.textContent = `Gathering Warriors: ${remainingSpots} Spot${remainingSpots !== 1 ? 's' : ''} Left`;
        launchButton.disabled = true;
    }
}


export function connectWebSocket() {
    const state = history.state;
    const tournamentName = state ? state.roomName : null;
    ws = new WebSocket(`wss://${window.location.host}/ws/game/tournament/${tournamentName}/`);

    ws.onopen = function(event) {
        console.log('Connected to Tournament Arena');
        ws.send(JSON.stringify({ action: 'join' }));
        fetchTournamentData();
    };

    ws.onmessage = function(event) {
        const message = JSON.parse(event.data);
        
        if (message.type === 'tournament_members_handler') {
            fetchTournamentData(); 
        }
        
        if (message.type === 'player_ready_update') {
            updateReadyStatus(message.ready_players);
        }

        if (message.type === 'redirect_to_game') {
            history.pushState({ roomName: message.game_room }, "", "/friends_mode");
            urlLocationHandler();
        }
    };

    ws.onerror = function(error) {
        console.error('Arena Connection Error:', error);
        document.getElementById('trn-status-display').textContent = 'Connection Disrupted. Reconnecting...';
    };

    ws.onclose = function() {
        console.log('Tournament Arena Connection Closed');
        setTimeout(connectWebSocket, 3000); 
    }

    return ws;
}

export function getCurrentTournamentPlayers() {
    return tournamentData ? tournamentData.tournament_members : [];
}

document.addEventListener('DOMContentLoaded', () => {
    const launchButton = document.getElementById('trn-match-launch');
    const exitButton = document.getElementById('trn-exit-arena');
    
    if (launchButton) {
        launchButton.addEventListener('click', function() {
            if (!isPlayerReady && !this.disabled) {
                isPlayerReady = true;
                this.disabled = true;
                this.querySelector('.trn-button-text').textContent = 'Preparing Battlefield...';
                if (ws) {
                    ws.send(JSON.stringify({ action: 'player_ready' }));
                }
            }
        });
    }

    if (exitButton) {
        exitButton.addEventListener('click', () => {
            window.close(); 
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const exitButton = document.getElementById('trn-exit-arena');

    if (exitButton) {
        exitButton.addEventListener('click', () => {
            // Check if the window can be closed
            if (window.opener) {
                window.close();
            } else {
                alert('This window cannot be closed by the script.');
            }
        });
    }
});

function updateReadyStatus(readyPlayers) {
    const playerItems = document.querySelectorAll('.trn-player-item');
    playerItems.forEach(playerItem => {
        const playerName = playerItem.querySelector('.trn-player-badge').textContent;
        if (readyPlayers.includes(playerName)) {
            playerItem.classList.add('trn-player-ready');
        }
    });
}
