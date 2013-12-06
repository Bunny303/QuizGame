/// <reference path="jquery-2.0.3.js" />
/// <reference path="controller.js" />
/// <reference path="jquery-ui-1.10.3.js" />

var ui = (function () {
    var startUI = function () {
        return "<button id='start-btn'>Start</button>";
    };

    var buildGameUI = function (question) {
        return "<div id='question-container'><img id='flag' src='" + question + "'/ ></div>" +
            "<form>" +
                "<label for='answer-input' id='question-label'>Which country is this flag?</label><br/>" +
                "<input type='text' id='answer-input' /><br/>" +
                "<button id='answer-btn'>OK</button>" +
            "</form>";
    };

    var buildPositiveAnswerUI = function () {
        return "<div><img src='../Images/correct.png' id='correct-answer'/></div>" +
                "<button id='next-btn'>NEXT</button>";
    };

    var buildNegativeAnswerUI = function () {
        return "<div><img src='../Images/incorrect.png' id='incorrect-answer'/></div>" +
                "<button id='next-btn'>NEXT</button>";
    };

    return {
        gameUI: buildGameUI,
        answerPositiveUI: buildPositiveAnswerUI,
        startUI: startUI,
        answerNegativeUI: buildNegativeAnswerUI
    };
})();

