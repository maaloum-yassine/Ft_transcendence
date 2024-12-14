import { urlLocationHandler } from "./url-router.js";

export const CTRN_ = () => {
    const createTournamentForm = document.getElementById("createtournamentform");
    const joinTournamentForm = document.getElementById("jointournamentform");

    createTournamentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const createtournamentName = document.getElementById('createtournamentinputid').value;

        if (createtournamentName.trim() !== '') {
            alert("This is the create tournament name: " + createtournamentName);
            createTournamentRoom(createtournamentName);
        } else {
            alert('Please enter a tournament name To Create it.');
        }
    });

    joinTournamentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const jointournamentName = document.getElementById('jointournamentinputid').value;

        if (jointournamentName.trim() !== '') {
            alert("This is the join tournament name: " + jointournamentName);
            joinTournamentRoom(jointournamentName);
        } else {
            alert('Please enter a tournament name To Join it.');
        }
    });
};

function createTournamentRoom(createtournamentName) {
    const formData = new FormData();
    formData.append("createtournamentName", createtournamentName);

    fetch(`https://${window.location.host}/api/tournament/create_or_join/`, {
        method: "POST",
        credentials: 'include',
        body: formData
    })
    .then(res => res.json())
    .then(res => {
        alert("aloooooo")
        alert(res.message);
        if (res.message === "Tournament created successfully!") {
            alert("You created successfully!");
            history.pushState({ roomName: res.room_name }, "", "/tournament_join");
        }
        urlLocationHandler();
    })
    .catch(err => {
        console.error("Error parsing response:", err);
    });
}

function joinTournamentRoom(jointournamentName) {
    const formData = new FormData();
    formData.append("jointournamentName", jointournamentName);

    fetch(`https://${window.location.host}/api/tournament/create_or_join/`, {
        method: "POST",
        credentials: 'include',
        body: formData
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        alert("aloooooo")
        if (res.message === "You have joined the tournament successfully!") {
            alert("You have joined the tournament successfully!");
            history.pushState({ roomName: res.room_name }, "", "/tournament_join");
        }
        urlLocationHandler();
    })
    .catch(err => {
        console.error("Error parsing response:", err);
    });
}
