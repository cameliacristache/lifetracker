import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {Tools} from 'tools';
import {Router} from 'aurelia-router';

@inject(HttpClient, Tools, Router)
export class Register {
    constructor(http, tools, router) {

        this.nume = '';
        this.username = '';
        this.password = '';
        this.cfpassword = '';
        this.registerButton = 'Register';
        this.registerEnable = false;
        this.gender = '';

        this.http = http;
        this.tools = tools;
        this.theRouter = router;

    }

    register() {
        this.registerButton = 'Registering...';
        this.registerEnable = true;

        if((!this.nume) || (!this.username) || (!this.password) || (!this.cfpassword) || (!this.gender)){
            this.error = "All fields are mandatory!";
            this.registerButton = 'Register';
            this.registerEnable = false;
        } else {
            if (this.password != this.cfpassword) {
                this.error = "Please retype your password!";
                this.registerButton = 'Register';
                this.registerEnable = false;
            } else {
                //console.log(this.gender);
                this.http.post('/backend/register.php', {'email': this.username, 'password': this.password, 'nume': this.nume, 'gender': this.gender}).then(
                    response => {
                            this.tools.setCookie('lifetrackerid', response.content, 2);
                            this.theRouter.navigateToRoute('home');

                            this.loginButton = 'Login';
                            this.loginEnable = false;
                    }).catch(error => {
                        this.error = 'Ooops! Something went wrong. Please try again later.';

                        this.nume = '';
                        this.username = '';
                        this.password = '';
                        this.cfpassword = '';
                        this.loginButton = 'Login';
                        this.loginEnable = false;
                    });
            }
        }
    }
}
