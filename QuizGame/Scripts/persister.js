/// <reference path="http-request.js" />
/// <reference path="class.js" />
/// 
var persister = (function () {
        
    function saveData(inputData) {
        dataObject = $.parseJSON(inputData);
        localStorage.setItem("question", dataObject[0].question);
        localStorage.setItem("answer", dataObject[0].answer);
    }

    var MainPersister = Class.create({
        init: function (baseUrl) {
            this.baseUrl = baseUrl;
            this.question = new QuestionPersister(baseUrl);
        }
    });

    var QuestionPersister = Class.create({
        init: function (baseUrl) {
            this.baseUrl = baseUrl;
        },
        getQuestion: function (succsess, error) {
            httpRequester.getJSON(this.baseUrl, 
                function (data) {
                    saveData(data);
                    //success(data);
                }, error);
            }
        });

    return {
        getPersister: function (baseUrl) {
            return new MainPersister(baseUrl);
        }
    };
}()); 

 