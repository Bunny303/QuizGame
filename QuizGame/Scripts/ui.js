/// <reference path="jquery-2.0.3.js" />
/// <reference path="controller.js" />

var ui = (function () {
    var buildGameUI = function (question) {
        return "<div id='question-container'>Question: " + question + "</div>" +
            "<form>" +
                "<label for='answer-input'>Answer:</label>" +
                "<input type='text' id='answer-input' />" +
                "<button id='answer-btn'>OK</button>" +
            "</form>";
    };

    var buildPositiveAnswerUI = function () {
        return "<div>CORRECT!</div>";
    };

    return {
        gameUI: buildGameUI,
        answerPositiveUI: buildPositiveAnswerUI
    };
})();

