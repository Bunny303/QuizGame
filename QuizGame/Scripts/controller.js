/// <reference path="class.js" />
/// <reference path="persister.js" />
/// <reference path="jquery-2.0.3.js" />
/// <reference path="ui.js" />


var controller = (function () {
    var baseUrl = "Scripts/questions-data1.js";
    
    var Controller = Class.create({
        init: function () {
            this.persister = new persister.getPersister(baseUrl);
        },
        loadUI: function (selector){
            this.loadGameUI(selector);
            this.attachUIEventHandlers(selector);
        },
        loadGameUI: function (selector) {
            var gameUIHtml = ui.gameUI(localStorage.getItem("question"));
            $(selector).html(gameUIHtml);
        },
        attachUIEventHandlers: function (selector) {
            $(selector).on("click", "#answer-btn", function () {
                var answer = localStorage.getItem("answer");
                var inputAnswer = $("#answer-input").val();
                if (answer == inputAnswer) {
                    var gameUIHtml = ui.answerPositiveUI();
                    $(selector).html(gameUIHtml);
                    localStorage.clear();
                }
            });
        }
        
    });

    return {
        getController: function () {
            return new Controller();
        }

    };

}());
