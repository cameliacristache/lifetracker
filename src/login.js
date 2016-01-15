import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {Tools} from 'tools';
import {Router} from 'aurelia-router';

@inject(HttpClient, Tools, Router)
export class Login {
    constructor(http, tools, router) {
        this.username = '';
        this.password = '';
        this.loginButton = 'Login';
        this.loginEnable = false;

        this.http = http;
        this.tools = tools;
        this.theRouter = router;
    }

    login() {
        this.loginButton = 'Logging in...';
        this.loginEnable = true;

        this.http.post('/backend/login.php', {'email': this.username, 'password': this.password}).then(
            response => {
                    this.tools.setCookie('lifetrackerid', response.content, 2);
                    this.theRouter.navigateToRoute('home');

                    this.loginButton = 'Login';
                    this.loginEnable = false;
            }).catch(error => {
                this.error = error.content;

                this.username = '';
                this.password = '';
                this.loginButton = 'Login';
                this.loginEnable = false;
            });

    }
}
