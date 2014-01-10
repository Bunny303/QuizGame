/// <reference path="class.js" />
/// <reference path="persister.js" />
/// <reference path="jquery-2.0.3.js" />
/// <reference path="jquery-ui-1.10.3.custom.js" />
/// <reference path="ui.js" />
/// <reference path="persister.js" />
/// <reference path="../libs/q.min.js" />

var QuizGame = QuizGame || {};

QuizGame.Controllers = (function () {

    var AccessController = Class.create({
        init: function (dataPersister, mainContainerSelector) {
            this.dataPersister = dataPersister;
            this.mainContainerSelector = mainContainerSelector;
            this.loginControl = null;
            this.registerControl = null;
        },

        isUserLoggedIn: function () {
            return this.dataPersister.isUserLoggedIn();
        },

        getUserData: function () {
            return dataPersister.getUserData();
        },

        loginUser: function () {
            var loginDeferred = Q.defer();

            this.handleLoginProcedure(loginDeferred);

            return loginDeferred.promise;
        },

        logoutUser: function () {
            this.dataPersister.user.logout();
        },

        handleLoginProcedure: function (deferred) {
            var self = this;

            self.loginControl = new QuizGame.UI.LoginControl();

            var mainContainer = $(this.mainContainerSelector);
            mainContainer.html('');

            self.loginControl.build(this.mainContainerSelector).then(function () {
                self.loginControl.attachLoginClickHandler(function (loginData) {
                    self.dataPersister.user.login(loginData.username, loginData.password).then(function () {
                        deferred.resolve();
                    },
                    function (error) {
                        self.loginControl.reportError(error.responseText);
                    });
                }, true);

                mainContainer.append("<a href='#' id='go-to-register'>New user? Register</a>");
                $("#go-to-register").on("click", function () {
                    self.handleRegisterProcedure(deferred);
                    return false;
                });
            }).done();

        },

        handleRegisterProcedure: function (deferred) {
            var self = this;

            self.registerControl = new QuizGame.UI.RegisterControl();

            var mainContainer = $(this.mainContainerSelector);
            mainContainer.html('');

            self.registerControl.build(this.mainContainerSelector).then(function () {
                self.registerControl.attachRegisterClickHandler(function (registerData) {
                    self.dataPersister.user.register(registerData.username, registerData.nickname, registerData.password).then(function () {
                        deferred.resolve();
                    }, function (error) {
                        self.registerControl.reportError(error.responseText);
                    });
                }, true);

                mainContainer.append("<a href='#' id='go-to-login'>Back to login</a>");
                $("#go-to-login").on("click", function () {
                    self.handleLoginProcedure(deferred);
                    return false;
                });
            }).done();
        }

    });

    var GameController = Class.create({
        init: function (dataPersister, mainContainerSelector) {
            this.dataPersister = dataPersister;
            this.mainContainerSelector = mainContainerSelector;
            
            this.createGameControl = new QuizGame.UI.CreateGameControl();
            this.createScoreboardControl = new QuizGame.UI.ListControl();
            this.createMenuControl = new QuizGame.UI.MenuControl();
            this._maxQuestionNumber = 10;
            this._startUserPoints = this.dataPersister.user.getCurrentUserScore();
        },

        loadMenu: function () {
            var self = this;
            
            this.createMenuControl.build(self.mainContainerSelector);
            self.attachMenuHandlers();
        },

        startGame: function () {
            var self = this;
            var index = 1;

            this.createGameControl.build(self.mainContainerSelector);
            self.getQuestion(index);
            self.attachGameHandlers(index + 1);
        },

        getQuestion: function (index) {
            var self = this;

            if (index > self._maxQuestionNumber) {
                self.savePoints();
                self.loadMenu();
            }
            else {
                var question = this.dataPersister.questions.getQuestion(index);
                question.done(function (data) {
                    $("#question").attr("src", data.url);
                    localStorage.setItem("currentAnswer", data.answer);
                }, function (err) {
                    console.log(err);
                });
            }
        },

        addPoint: function () {
            var score = parseInt(this.dataPersister.user.getCurrentUserScore(),10) + 1;
            this.dataPersister.user.setCurrentUserScore(score);
        },

        savePoints: function () {
            var self = this;
            var score = this.dataPersister.user.getCurrentUserScore();
            if(this._startUserPoints < score){
                this.dataPersister.user.updateScore(score)
                    .then(self.dataPersister.user.setCurrentUserScore(0));
            }
        },

        showScoreboard: function () {
            var self = this;
            
            this.dataPersister.user.getAllUserScores()
                .then(function (data) {
                    self.createScoreboardControl.build(self.mainContainerSelector, "Scoreboard", data);
                    self.attachScoreboardHandlers();
                });
        },

        attachMenuHandlers: function (currIndex) {
            var self = this;

            this.createMenuControl.attachStartGameClickHandler(function () {
                self.startGame();
            }, true);

            this.createMenuControl.attachScoreboardClickHandler(function () {
                self.showScoreboard();
            });

            this.createMenuControl.attachLogoutClickHandler(function () {
                self.dataPersister.user.logout();
                //How to redirect to login page?
            });
        },

        attachGameHandlers: function (currIndex) {
            var self = this;
            
            this.createGameControl.attachStartClickHandler(function (userAnswer) {
                var currAnswer = localStorage.getItem("currentAnswer").toLowerCase();
                if (userAnswer.answer == currAnswer) {
                    self.createGameControl.reportSuccess();
                    self.addPoint();
                }
                else {
                    self.createGameControl.reportError();
                }
                
                self.getQuestion(currIndex);
                currIndex += 1;
            });

            this.createGameControl.attachStopClickHandler(function () {
                self.savePoints();
                self.loadMenu();
            }, true);
        },

        attachScoreboardHandlers: function () {
            var self = this;

            this.createScoreboardControl.attachBackClickHandler(function () {
                self.loadMenu();
            }, true);
        }

    });

    return {
        getAccessController: function (dataPersister, mainContainerSelector) { return new AccessController(dataPersister, mainContainerSelector); },
        getGameController: function (dataPersister, mainContainerSelector) { return new GameController(dataPersister, mainContainerSelector); }
    };
}());
