import Socket from '../models/Socket.class';

export function addMessage(author, message, color, dt){
    content.innerHTML = content.innerHTML + ('<p><span style="color:' + color + '">' + author + '</span> @ ' +
         + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
         + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
         + ': ' + message + '</p>');
         content.scrollTop = content.scrollHeight;
}

export function checkNickname(userName, socket){

    return new Promise((ok,nok)=>{
            let regex = new RegExp("^[a-zA-Z0-9_]{1,12}$");
        
            if(!regex.test(userName))
            {
                nok("Only alphanumeric characters allowed!");
            }
            else{
                socket.send("username", userName);
                ok(userName);
            }

    });


    
}