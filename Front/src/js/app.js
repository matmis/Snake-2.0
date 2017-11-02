"use strict";

console.log("app loaded");


console.log("login loaded");

let btnSubmit, txtUser;
let userName;


const init = ()=>{

    btnSubmit = document.querySelector("#btnSubmit");
    txtUser = document.querySelector("#txtUser");

    btnSubmit.addEventListener("click", ()=>{
        console.log("clicked");
        checkNickname();
    });

    console.log(btnSubmit);
    console.log(txtUser);


}

const checkNickname = ()=>{
    let regex = new RegExp("^[a-zA-Z ]+$");

    if(!regex.test(txtUser.value))
    {
        console.log("Niet goed");
    }
    else{
        console.log("wel goed");
        userName = txtUser.value;
        startSpelletje()
    }
}

const startSpelletje = ()=>{
    console.log("start");
    document.querySelector(".login-screen").style.visibility = "hidden";
    document.querySelector(".chat").style.visibility = "visible";
    

}

init();