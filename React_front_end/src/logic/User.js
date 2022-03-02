import React, { useState } from 'react';

export default class User{
    constructor() {
        this.isLoggedIn = false;
    }

    async login(email, password){
        console.log("test");
    }

    async logout(){

    }

    async register(email, password, username){

    }

    isLoggedIn(){
        return this.isLoggedIn;
    }
}
