import React, { useState } from 'react';
import { ServerRequest } from './ServerCommunication';

export class User{
    /***
     * Creates a new user
     */
    constructor() {
        this.isLoggedInV = false;
        this.userToken = null;
        if(window.localStorage.getItem("authToken") !== null){
            this.isLoggedInV = true;
            this.userToken = window.localStorage.getItem("authToken");
        }
    }

    /***
     * User login
     * @param formdata (formdata of the loginForm ("email" and "password" as keys))
     * @returns if user is succesfully loggedin {Promise<boolean>}
     */
    async login(formdata, skipLogin = false){
        //this.isLoggedInV = true;
        //window.localStorage.setItem("loggedIn", "true");
        try{
            let request = new ServerRequest();
            if(skipLogin){
                this.userToken = "";
                window.localStorage.setItem("authToken", this.userToken);
                this.isLoggedInV = true;
                return true;
            }
            let response = await request.sendPost("login",formdata, false);
            this.userToken = response.token;
            window.localStorage.setItem("authToken", this.userToken);
            this.isLoggedInV = true;
            return true;
        }
        catch(err) {
            throw err;
        }
        return false;
    }

    /***
     * user logout
     * @returns {Promise<void>}
     */
    async logout(){
        this.isLoggedInV = false;
        window.localStorage.removeItem("authToken");
    }

    /***
     * Returns if user is loggedin
     * @returns {boolean|*}
     */
    isLoggedIn(){
        return this.isLoggedInV;
    }

    /***
     *Function that gives the userToken
     * @returns userToken {null|string|*|?string}
     */
    getUserToken(){
        return this.userToken;
    }
}
