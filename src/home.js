import {inject} from 'aurelia-framework';
import {Tools} from 'tools';
import {Router} from 'aurelia-router';
import {HttpClient} from 'aurelia-http-client';

@inject(Tools, Router, HttpClient)
export class Home {
    constructor(tools, router, http) {
        this.tools = tools;
        this.theRouter = router;
        this.http = http;

        this.user = '';
        this.profile_pic = '';
        this.lifenow = '';
        this.lifetotal = 20;
        this.lifeprogress = '';

        this.xpnow = '';
        this.xptotal = '';
        this.xpprogress = '';

        this.gold = '';
        this.silver = '';

        this.habits = '';
        this.dailies = '';
        this.tasks = '';
        this.rewards = '';

        this.habitDescription = '';
        this.habitDifficulty = '';
        this.habitAspect = '';

        this.dailyDescription = '';

        this.taskDescription = '';
        this.taskDeadline = ''

        this.rewardDescription = '';
        this.goldCoins = '';
        this.silverCoins = '';
    }

    loosePoints(xp, user_id) {
        var data = {
            "id": user_id,
            "xp": xp
        }
        this.http.put('/backend/loosePoints.php', data).then(
            response => {
                this.user = response.content;
                this.lifenow = this.user.life;
                //this.lifetotal = 20 + 20*(this.user.level - 1);
                this.lifeprogress = 100*this.lifenow/this.lifetotal;
                if (this.lifenow == 0) {
                    $('#resetModal').modal('show');
                }
            }).catch(
                error => {
                    this.error = "Ooops! Something went wrong. Please try again later!";
                })
    }

    resetUser() {
        console.log('sunt in reset');
        var cookie = this.tools.getCookie('lifetrackerid');
        var data = {
            "id": cookie
        };
        this.http.put('/backend/resetUser.php', data).then(
            response => {
                this.user = response.content;
                this.profile_pic = this.tools.getPicture(this.user.gender, this.user.xp)
                this.lifenow = this.user.life;
                //this.lifetotal = 20 + 20*(this.user.level - 1);
                this.lifeprogress = 100*this.lifenow/this.lifetotal;

                this.xpnow = this.user.xp;
                this.xptotal = this.tools.getXPtotal(this.user.level);
                this.xpprogress = 100*this.xpnow/this.xptotal;

                this.gold = Math.floor(this.user.coins/100);
                this.silver = this.user.coins%100;
                $('#resetModal').modal('hide');
            }).catch(
            error => {
                this.error = "Ooops! Something went wrong. Please try again later!";
            })
    };

    addCoinsAndXP(coins, xp, user_id) {
        var cookie = this.tools.getCookie('lifetrackerid');
        var data = {
            "id": cookie,
            "coins": coins,
            "xp": xp
        };

        this.http.put('/backend/addCoinsAndXP.php', data).then(
            response => {
                this.user = response.content;
                this.profile_pic = this.tools.getPicture(this.user.gender, this.user.xp)
                this.lifenow = this.user.life;
                //this.lifetotal = 20 + 20*(this.user.level - 1);
                this.lifeprogress = 100*this.lifenow/this.lifetotal;

                this.xpnow = this.user.xp;
                this.xptotal = this.tools.getXPtotal(this.user.level);
                this.xpprogress = 100*this.xpnow/this.xptotal;

                this.gold = Math.floor(this.user.coins/100);
                this.silver = this.user.coins%100;
            }).catch(
            error => {
                this.error = "Ooops! Something went wrong. Please try again later!";
            })
    };

    addHabit() {
        var cookie = this.tools.getCookie('lifetrackerid');
        var data = {
            "id": cookie,
            "text": this.habitDescription,
            "difficulty": $('#habitDifficulty').val(),
            "aspect": $('#habitAspect').val()
        };

        this.http.post('/backend/addHabit.php', data).then(
            response => {
                this.habits = response.content.habits;
                for (let i=0; i<this.habits.length; i++) {
                    if (this.habits[i].aspect == 1) { this.habits[i].isPositive = true; }
                    if (this.habits[i].aspect == 2) { this.habits[i].isNegative = true; }
                    if (this.habits[i].aspect == 3) { this.habits[i].isBoth = true; }
                }
                $('#habbitModal').modal('hide');
            }).catch(
            error => {
                this.error = "Ooops! Something went wrong. Please try again later!";
            })
    };

    addDaily() {
        var cookie = this.tools.getCookie('lifetrackerid');
        var complete = new Date();
        var data = {
            "id": cookie,
            "text": this.dailyDescription,
            "tcomplete": complete
        };

        this.http.post('/backend/addDaily.php', data).then(
            response => {
                this.dailies = response.content.dailies;
                for (let i=0; i<this.dailies.length; i++) {
                    if (this.dailies[i].done == 0) { this.dailies[i].isDone = false; }
                    if (this.dailies[i].done == 1) { this.dailies[i].isDone = true; }
                }
                $('#dailyModal').modal('hide');
            }).catch(
            error => {
                this.error = "Ooops! Something went wrong. Please try again later!";
            });
    };

    checkDaily(id) {
        var cookie = this.tools.getCookie('lifetrackerid');
        var complete = new Date();
        var data = {
            "id": id,
            "user_id": cookie,
            "tcomplete": complete
        };
        this.http.put('/backend/checkDaily.php', data).then(
            response => {
                this.dailies = response.content.dailies;
                for (let i=0; i<this.dailies.length; i++) {
                    if (this.dailies[i].done == 0) { this.dailies[i].isDone = false; }
                    if (this.dailies[i].done == 1) { this.dailies[i].isDone = true; }
                }

                this.http.get('/backend/userStats.php?id='+cookie).then(
                    response => {
                            this.user = response.content.user;

                            this.profile_pic = this.tools.getPicture(this.user.gender, this.user.xp)
                            this.lifenow = this.user.life;
                            //this.lifetotal = 20 + 20*(this.user.level - 1);
                            this.lifeprogress = 100*this.lifenow/this.lifetotal;

                            this.xpnow = this.user.xp;
                            this.xptotal = this.tools.getXPtotal(this.user.level);
                            this.xpprogress = 100*this.xpnow/this.xptotal;

                            this.gold = Math.floor(this.user.coins/100);
                            this.silver = this.user.coins%100;


                    }).catch(error => {
                        this.error = "Ooops! Something went wrong. Please try again later!";
                    });

            }).catch(
            error => {
                this.error = "Ooops! Something went wrong. Please try again later!";
            });
    }

    checkTask(id) {
        var cookie = this.tools.getCookie('lifetrackerid');
        var data = {
            "id": id,
            "user_id": cookie
        };
        this.http.put('/backend/checkTask.php', data).then(
            response => {
                this.tasks = response.content.tasks;
                for (let i=0; i<this.tasks.length; i++) {
                    if (this.tasks[i].done == 0) { this.tasks[i].isDone = false; }
                    if (this.tasks[i].done == 1) { this.tasks[i].isDone = true; }
                    this.tasks[i].deadline = this.tasks[i].deadline.split('T')[0];
                }

                this.http.get('/backend/userStats.php?id='+cookie).then(
                    response => {
                            this.user = response.content.user;

                            this.profile_pic = this.tools.getPicture(this.user.gender, this.user.xp)
                            this.lifenow = this.user.life;
                            //this.lifetotal = 20 + 20*(this.user.level - 1);
                            this.lifeprogress = 100*this.lifenow/this.lifetotal;

                            this.xpnow = this.user.xp;
                            this.xptotal = this.tools.getXPtotal(this.user.level);
                            this.xpprogress = 100*this.xpnow/this.xptotal;

                            this.gold = Math.floor(this.user.coins/100);
                            this.silver = this.user.coins%100;


                    }).catch(error => {
                        this.error = "Ooops! Something went wrong. Please try again later!";
                    });

            }).catch(
            error => {
                this.error = "Ooops! Something went wrong. Please try again later!";
            });
    }

    addTask() {
        var cookie = this.tools.getCookie('lifetrackerid');
        var data = {
            "id": cookie,
            "text": this.taskDescription,
            "deadline": $('#datepicker').datepicker('getDate')
        };

        this.http.post('/backend/addTask.php', data).then(
            response => {
                this.tasks = response.content.tasks;
                for (let i=0; i<this.tasks.length; i++) {
                    if (this.tasks[i].done == 0) { this.tasks[i].isDone = false; }
                    if (this.tasks[i].done == 1) { this.tasks[i].isDone = true; }
                    this.tasks[i].deadline = this.tasks[i].deadline.split('T')[0];
                }
                $('#taskModal').modal('hide');
            }).catch(
            error => {
                this.error = "Ooops! Something went wrong. Please try again later!";
            });
    }

    addReward() {
        var cookie = this.tools.getCookie('lifetrackerid');
        var coins = this.silverCoins + 100*this.goldCoins;
        var data = {
            "id": cookie,
            "text": this.rewardDescription,
            "coins": coins
        };

        this.http.post('/backend/addReward.php', data).then(
            response => {
                this.rewards = response.content.rewards;
                for (let i=0; i<this.rewards.length; i++) {
                    this.rewards[i].gold = Math.floor(this.rewards[i].coins/100);
                    this.rewards[i].silver = this.rewards[i].coins%100;
                }
                $('#rewardModal').modal('hide');
            }).catch(
            error => {
                this.error = "Ooops! Something went wrong. Please try again later!";
            });
    };

    checkReward(coins) {
        var cookie = this.tools.getCookie('lifetrackerid');
        var data = {
            "id": cookie,
            "coins": coins
        };

        if(this.user.coins >= coins) {
            this.http.put('/backend/checkReward.php', data).then(
                response =>{
                    this.user = response.content;

                    this.profile_pic = this.tools.getPicture(this.user.gender, this.user.xp)
                    this.lifenow = this.user.life;
                    //this.lifetotal = 20 + 20*(this.user.level - 1);
                    this.lifeprogress = 100*this.lifenow/this.lifetotal;

                    this.xpnow = this.user.xp;
                    this.xptotal = this.tools.getXPtotal(this.user.level);
                    this.xpprogress = 100*this.xpnow/this.xptotal;

                    this.gold = Math.floor(this.user.coins/100);
                    this.silver = this.user.coins%100;

                }).catch(error => {
                    this.error = "Ooops! Something went wrong. Please try again later!";
                });
        }
    }

    canActivate(params, routeConfig) {
        var cookie = this.tools.getCookie('lifetrackerid');

        if (!cookie) {
            this.theRouter.navigateToRoute('login');
        }

    }

    attached() {
        $("select").select2({dropdownCssClass: 'dropdown-inverse'});
        $("#datepicker").datepicker();
    }

    activate() {
        var cookie = this.tools.getCookie('lifetrackerid');

        this.http.get('/backend/userStats.php?id='+cookie).then(
            response => {
                    this.user = response.content.user;

                    this.profile_pic = this.tools.getPicture(this.user.gender, this.user.xp)
                    this.lifenow = this.user.life;
                    //this.lifetotal = 20 + 20*(this.user.level - 1);
                    this.lifeprogress = 100*this.lifenow/this.lifetotal;

                    this.xpnow = this.user.xp;
                    this.xptotal = this.tools.getXPtotal(this.user.level);
                    this.xpprogress = 100*this.xpnow/this.xptotal;

                    this.gold = Math.floor(this.user.coins/100);
                    this.silver = this.user.coins%100;


            }).catch(error => {
                this.error = "Ooops! Something went wrong. Please try again later!";
            });

        this.http.get('/backend/getHabits.php?id='+cookie).then(
            response => {
                this.habits = response.content.habits;
                console.log(this.habits);
                for (let i=0; i<this.habits.length; i++) {
                    if (this.habits[i].aspect == 1) { this.habits[i].isPositive = true; }
                    if (this.habits[i].aspect == 2) { this.habits[i].isNegative = true; }
                    if (this.habits[i].aspect == 3) { this.habits[i].isBoth = true; }
                }
        }).catch(error => {
            this.error = "Ooops! Something went wrong. Please try again later!";
        });

        this.http.get('/backend/getDaily.php?id='+cookie).then(
            response => {
                this.dailies = response.content.dailies;
                console.log(this.dailies);
                for (let i=0; i<this.dailies.length; i++) {
                    if (this.dailies[i].done == 0) { this.dailies[i].isDone = false; }
                    if (this.dailies[i].done == 1) { this.dailies[i].isDone = true; }
                }
        }).catch(error => {
            this.error = "Ooops! Something went wrong. Please try again later!";
        });

        this.http.get('/backend/getTasks.php?id='+cookie).then(
            response => {
                this.tasks = response.content.tasks;
                for (let i=0; i<this.tasks.length; i++) {
                    if (this.tasks[i].done == 0) { this.tasks[i].isDone = false; }
                    if (this.tasks[i].done == 1) { this.tasks[i].isDone = true; }
                    this.tasks[i].deadline = this.tasks[i].deadline.split('T')[0];
                }
        }).catch(error => {
            this.error = "Ooops! Something went wrong. Please try again later!";
        });

        this.http.get('/backend/getReward.php?id='+cookie).then(
            response => {
                this.rewards = response.content.rewards;
                for (let i=0; i<this.rewards.length; i++) {
                    this.rewards[i].gold = Math.floor(this.rewards[i].coins/100);
                    this.rewards[i].silver = this.rewards[i].coins%100;
                }
                console.log(this.rewards);
        }).catch(error => {
            this.error = "Ooops! Something went wrong. Please try again later!";
        });

    }
}
