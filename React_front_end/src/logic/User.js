import React, { useState } from 'react';

export default class User{
    constructor() {
        this.isLoggedInV = false;
        if(window.localStorage.getItem("loggedIn") !== null){
            this.isLoggedInV = true;
        }
    }

    async login(email, password){
        this.isLoggedInV = true;
        window.localStorage.setItem("loggedIn", "true");
        console.log("test");
        return "ok"
    }

    async logout(){
        this.isLoggedInV = false;
        window.localStorage.removeItem("loggedIn");
    }

    async register(email, password, username){

    }

    isLoggedIn(){
        return this.isLoggedInV;
    }
}
