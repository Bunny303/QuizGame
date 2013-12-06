/// <reference path="http-request.js" />
/// <reference path="class.js" />
 
var persister = (function () {
        
    function saveData(inputData) {
        dataObject = $.parseJSON(inputData);
        for (var i = 0; i < dataObject.length; i += 1) {
            localStorage.setItem("question" + i, dataObject[i].question);
            localStorage.setItem("answer"+ i, dataObject[i].answer);
        }
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

 