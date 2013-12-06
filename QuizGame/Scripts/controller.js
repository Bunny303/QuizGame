/// <reference path="class.js" />
/// <reference path="persister.js" />
/// <reference path="jquery-2.0.3.js" />
/// <reference path="jquery-ui-1.10.3.custom.js" />
/// <reference path="ui.js" />


var controller = (function () {
    var baseUrl = "Scripts/questions-data.js";
    
    var Controller = Class.create({
        init: function () {
            this.persister = new persister.getPersister(baseUrl);
        },
        loadUI: function (selector){
            this.loadStartUI(selector);
            this.attachUIEventHandlers(selector);
        },
        loadStartUI: function (selector) {
            var startUIHtml = ui.startUI();
            $(selector).html(startUIHtml);
            $("#start-btn").button();
        },
        loadGameUI: function (selector) {
            var gameUIHtml = ui.gameUI(localStorage.getItem("question"));
            $(selector).html(gameUIHtml);
            $("#answer-btn").button();
        },
        loadPositiveAnswerUI: function(selector){
            var gameUIHtml = ui.answerPositiveUI();
            $(selector).html(gameUIHtml);
            localStorage.clear();
        },
        loadNegativeAnswerUI: function (selector) {
            var gameUIHtml = ui.answerNegativeUI();
            $(selector).html(gameUIHtml);
        },
        attachUIEventHandlers: function (selector) {
            var container = $(selector);
            var self = this;

            container.on("click", "#start-btn", function () {
                self.loadGameUI(selector);
                return false;
            });

            container.on("click", "#answer-btn", function () {
                var answer = localStorage.getItem("answer");
                var inputAnswer = $("#answer-input").val();
                if (answer == inputAnswer) {
                    self.loadPositiveAnswerUI(selector);
                }
                else {
                    self.loadNegativeAnswerUI(selector);
                }
                return false;
            });

        }
        
    });

    return {
        getController: function () {
            return new Controller();
        }

    };

}());
