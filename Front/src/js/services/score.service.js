export function show(players, bool){
    let bobTheHtmlBuilder = "";
    if(bool){
    (players).forEach((player)=> {
        bobTheHtmlBuilder += `<div><div ><div style="background-color: ${player.color}"></div><p>${player.name}</p></div><p>${player.score}</p></div>`;
    }, this);
    }
    else{
        bobTheHtmlBuilder += `<div><div ><div style="background-color: ${players.color}"></div><p>${players.name}</p></div><p>${players.score}</p></div>`;
    }
    document.querySelector(".players").innerHTML = (bobTheHtmlBuilder);
    console.log("Weggeschreven");
}