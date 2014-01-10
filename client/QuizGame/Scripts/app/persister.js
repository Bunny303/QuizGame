/// <reference path="../libs/http-requester.js" />
/// <reference path="../libs/q.min.js" />
/// <reference path="../libs/sha1.js" />
/// <reference path="class.js" />

var QuizGame = QuizGame || {};

QuizGame.Data = (function () {
    
    var DataPersister = Class.create({
        init: function (serviceRootUrl) {
            this.serviceRootUrl = serviceRootUrl;
            this.user = new UserPersister(serviceRootUrl + "users/");
            this.questions = new GamePersister(serviceRootUrl + "flags/", this.user);
        },

        isUserLoggedIn: function () {
            return this.user.isUserLoggedIn();
        }
    });

    var UserPersister = Class.create({
        init: function (serviceRootUrl) {
            this.serviceRootUrl = serviceRootUrl;
        },

        _getSessionKey: function () {
            return localStorage.getItem("sessionKey");
        },

        _getNickname: function () {
            return localStorage.getItem("nickname");
        },

        _getUsername: function(){
            return localStorage.getItem("username");
        },

        _setSessionKey: function (value) {
            localStorage.setItem("sessionKey", value);
        },

        _setNickname: function (value) {
            this.nickname = value;
            localStorage.setItem("nickname", value);
        },

        _setUsername: function(value){
            this.username = value;
            localStorage.setItem("username", value);
        },

        _clearSessionKey: function () {
            localStorage.removeItem("sessionKey");
        },

        _clearNickname: function () {
            localStorage.removeItem("nickname");
        },

        _clearUsername: function(){
            localStorage.removeItem("username");
        },

        _clearCurrAnswer: function () {
            localStorage.removeItem("currentAnswer");
        },

        _clearScore: function () {
            localStorage.removeItem("score");
        },

        register: function (username, nickname, password) {
            var self = this;

            return HttpRequester.postJson(this.serviceRootUrl + "register", {
                username: username,
                nickname: nickname,
                authCode: CryptoJS.SHA1(password).toString(),
            }).then(function (result) {
                self._setSessionKey(result);
                self._setNickname(nickname);
                self._setUsername(username);
                self.setCurrentUserScore(0);
            });
        },

        login: function (username, password) {
            var self = this;

            return HttpRequester.postJson(this.serviceRootUrl + "login", {
                username: username,
                authCode: CryptoJS.SHA1(password).toString(),
            }).then(function (result) {
                self._setSessionKey(result.id);
                self._setNickname(result.nickname);
                self._setUsername(username);
                self.setCurrentUserScore(0);
            });
        },

        updateScore: function (score) {
            return HttpRequester.putJson(this.serviceRootUrl + "score/" + this._getSessionKey(), {
                score: score
            });
        },

        logout: function () {
            var self = this;
            self._clearSessionKey();
            self._clearNickname();
            self._clearUsername();
            self._clearCurrAnswer();
            self._clearScore();
        },

        isUserLoggedIn: function () {
            return (this._getNickname() !== null);
        },

        getCurrentUserData: function () {
            return {
                username: this._getUsername(),
                nickname: this._getNickname(),
                sessionKey: this._getSessionKey()
            };
        },

        setCurrentUserScore: function (value) {
            this.score = value;
            return localStorage.setItem("score", value);
        },

        getCurrentUserScore: function(){
            return localStorage.getItem("score");
        },

        getAllUserScores: function () {
            return HttpRequester.getJson(this.serviceRootUrl + "score");
        }
    });

    var GamePersister = Class.create({
        init: function (serviceRootUrl, userPersister) {
            this.serviceRootUrl = serviceRootUrl;
            this.userPersister = userPersister;
        },

        getQuestion: function (index) {
            var self = this;

            return HttpRequester.getJson(this.serviceRootUrl + index);
        }
    });

    return {
        getDataPersister: function (serviceRootUrl) {
            return new DataPersister(serviceRootUrl);
        }
    };
}());
 