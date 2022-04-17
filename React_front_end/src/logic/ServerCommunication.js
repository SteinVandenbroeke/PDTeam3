export class ServerRequest{
	authToken = null;

	/***
	 * Creates a new ServerRequest, and loads the authToken
	 */
	constructor(){
		if(window.localStorage.getItem("authToken") !== null){
            this.authToken = window.localStorage.getItem("authToken");
        }
		else{
			this.authToken = null;
		}
    }

	/***
	 * Function to send a post request
	 * @param page (the page to send the request /api/ is default added) (string)
	 * @param data (the data to send) (any)
	 * @param loginRequired	(is login required for this request) (bool)
	 * @returns {Promise<*>} (the response of the request or when request.status != 201 || request.status !=200 => Error() )
	 */
  	async sendPost(page, data, loginRequired = true){
		if(loginRequired && this.authToken === null){
			throw(new Error("User login is required, set loginRequired parameter to false or login"));
			return;
		}

		let myHeaders = new Headers();
		if(loginRequired){
			myHeaders.append("x-access-token", this.authToken);
		}

		let response = await fetch("/api/" + page, {
			method: "POST",
			body: data
		});

		if(response.status === 201 ||response.status === 200){
			return await response.json();
		}
		else{
			throw Error((await response.text()) + " " + response.status)
		}
	}

	/**
	Function to send an get request (with optional userToken)
	 **/
	async sendGet(page, data = {}, loginRequired = true){
		if(loginRequired && this.authToken === null){
			throw(new Error("User login is required, set loginRequired parameter to false or login"));
			return;
		}

		let myHeaders = new Headers();
		if(loginRequired){
			myHeaders.append("x-access-token", this.authToken);
		}

		let getString = "?"
		Object.keys(data).map(function(key, index) {
		  getString = getString + "&" + key + "=" + data[key];
		});

		let response = await fetch("/api/" + page + getString, {
			method: "GET",
		});

		if(response.status === 201 ||response.status === 200){
			return await response.json();
		}
		else{
			throw Error((await response.text()) + " " + response.status)
		}
	}
}