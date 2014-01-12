/// <reference path="jquery-2.0.3.js" />
/// <reference path="controller.js" />
/// <reference path="../libs/class.js" />
/// <reference path="../libs/q.min.js" />
/// <reference path="../libs/http-requester.js" />
/// <reference path="jquery-ui-1.10.3.js" />

var QuizGame = QuizGame || {};

QuizGame.UI = (function () {
    var buildControlPromise = function (controlHtmlUrl, rootElement) {
        var buildDeferred = Q.defer();
        
        HttpRequester.getJson(controlHtmlUrl).then(function (partialHtml) {
            
            var container = $("<div class='control-container'>" + partialHtml + "</div>");
            
            $(rootElement).append(container);
            rootElement = container;

            buildDeferred.resolve(rootElement);
        }, function (error) {
            buildDeferred.reject(error);
        });

        return buildDeferred.promise;
    };

    var LoginControl = Class.create({
        build: function (selector) {
            var self = this;
            self.rootElement = $(selector);

            return buildControlPromise("../login-control.html", this.rootElement).then(function (newRootElement) {
                self.rootElement = newRootElement;
            });
        },

        getUsernameText: function () {
            return $("#login-username-input").val();
        },

        getPasswordText: function () {
            return $("#login-password-input").val();
        },

        attachLoginClickHandler: function (handler, removePreviousHandlers) {

            var self = this;

            if (removePreviousHandlers) {
                $(this.rootElement).off("click");
            }

            this.rootElement.on("click", "#login-button", function () {
                var loginData = {
                    username: self.getUsernameText(),
                    password: self.getPasswordText()
                };

                handler(loginData);
            });
        },

        reportError: function (errorMessage) {
            this.rootElement.append("<p class='error-message'>" + errorMessage + "</p>");

            var errorMessage = $("p.error-message");
            errorMessage.fadeOut(3000, function () {
                errorMessage.remove();
            });
        }
    });

    var RegisterControl = Class.create({
        build: function (selector) {
            var self = this;
            self.rootElement = $(selector);

            return buildControlPromise("../register-control.html", this.rootElement).then(function (newRootElement) {
                self.rootElement = newRootElement;
            });
        },

        getUsernameText: function () {
            return $("#register-username-input").val();
        },

        getPasswordText: function () {
            return $("#register-password-input").val();
        },

        getNicknameText: function () {
            return $("#register-nickname-input").val();
        },

        attachRegisterClickHandler: function (handler, removePreviousHandlers) {
            var self = this;

            if (removePreviousHandlers) {
                $(this.rootElement).off("click");
            }

            $(this.rootElement).on("click", "#register-button", function () {
                var registerData = {
                    username: self.getUsernameText(),
                    nickname: self.getNicknameText(),
                    password: self.getPasswordText()
                };

                handler(registerData);
            });
        },

        reportError: function (errorMessage) {
            this.rootElement.append("<p class='error-message'>" + errorMessage + "</p>");

            var errorMessage = $("p.error-message");
            errorMessage.fadeOut(3000, function () {
                errorMessage.remove();
            });
        }
    });

    var MenuControl = Class.create({
        build: function (selector) {
            var self = this;
            self.rootElement = $(selector);
            $(selector).html('');
                        
            return buildControlPromise("../menu-control.html", this.rootElement).then(function (newRootElement) {
                self.rootElement = newRootElement;

            });
        },

        attachStartGameClickHandler: function (handler, removePreviousHandlers) {
            var self = this;

            if (removePreviousHandlers) {
                $(this.rootElement).off("click");
            }

            $(this.rootElement).on("click", "#start-button", function () {
                handler();
            });
        },

        attachScoreboardClickHandler: function (handler, removePreviousHandlers) {
            var self = this;

            if (removePreviousHandlers) {
                $(this.rootElement).off("click");
            }

            $(this.rootElement).on("click", "#scoreboard-button", function () {
                handler();
            });
        },

        attachLogoutClickHandler: function (handler, removePreviousHandlers) {
            var self = this;

            if (removePreviousHandlers) {
                $(this.rootElement).off("click");
            }

            $(this.rootElement).on("click", "#logout-button", function () {
                self.rootElement.html('<div class="game-window"><p>Thank you!</p></div>');
                $('.game-window').css('text-align', 'center');
                $('.game-window').append('<div id="fb-root"></div>');
                $('.game-window').append('<div class="fb-like" data-href="https://QuizGame.com" data-layout="box_count" data-action="like" data-show-faces="true" data-share="false"></div>');
                handler();
            });
        }
    });

    var CreateGameControl = Class.create({
        build: function (selector) {
            var self = this;
            self.rootElement = $(selector);
            $(selector).html('');

            return buildControlPromise("../game-control.html", this.rootElement).then(function (newRootElement) {
                self.rootElement = newRootElement;
            });
        },

        getAnswer: function () {
            return $("#answer").val().toLowerCase();
        },

        attachStartClickHandler: function (handler, removePreviousHandlers) {
            var self = this;

            if (removePreviousHandlers) {
                $(this.rootElement).off("click");
            }

            $(this.rootElement).on("click", "#next-question", function () {
                var userAnswer = {
                    answer: self.getAnswer()
                };
                
                handler(userAnswer);
            });
        },

        attachStopClickHandler: function (handler, removePreviousHandlers) {
            $(this.rootElement).on("click", "#stop-button", function () {
                handler();
            });
        },

        _clearAnswerInput: function () {
            $("#answer").val('');
        },

        reportSuccess: function () {
            var self = this;
            
            var successMessage = $("<img class='message' src='../Images/correct.png'/ >");
            $("#question").after(successMessage);
            successMessage.attr("src", '../Images/correct.png');
            successMessage.fadeOut(1500, function () {
                successMessage.remove();
                self._clearAnswerInput();
            });
        },

        reportError: function () {
            var self = this;

            var errorMessage = $("<img class='message' src='../Images/incorrect.png'/ >");
            $("#question").after(errorMessage);
            errorMessage.fadeOut(1500, function () {
                errorMessage.remove();
                self._clearAnswerInput();
            });
        }
    });

    var ListControl = Class.create({
        build: function (selector, header, data) {

            var self = this;
            self.rootElement = $(selector);
            self.listElements = new Array();
            $(selector).html('');

            return buildControlPromise("../scoreboard.html", this.rootElement).then(function (newRootElement) {
                self.rootElement = newRootElement;
                
                self.header = self.rootElement.find("h2.control-header"),
                self.listContainer = self.rootElement.find("ul.control-data-container");

                self.header.text(header);

                self.changeData(data);
            });
        },

        changeData: function (newData) {
            this.listContainer.html("");

            if (newData) {
                for (var i = 0; i < newData.length; i+=1 ) {
                    var listElement = $("<li>" + (i+1) + ". " + newData[i]["nickname"] + "   " + newData[i]["score"] + "</li>");

                    this.listContainer.append(listElement);

                    this.listElements.push(listElement);
                }
            }
        },

        attachBackClickHandler: function (handler, removePreviousHandlers) {
            var self = this;

            if (removePreviousHandlers) {
                $(this.rootElement).off("click");
            }

            $(this.rootElement).on("click", "#back-button", function () {
                handler();
            });
        }
    });

    return {
        LoginControl: LoginControl,
        RegisterControl: RegisterControl,
        MenuControl: MenuControl,
        ListControl: ListControl,
        CreateGameControl: CreateGameControl
    };
}());

