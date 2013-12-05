/// <reference path="jquery-2.0.3.js" />

var httpRequester = (function () {
    function getJSON(url, success, error) {
        $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json",
            success: success,
            error: error
        });
    }
    function postJSON(url, data, success, error) {
        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: success,
            error: error
        });
    }

    return {
        postJSON: postJSON,
        getJSON: getJSON
    };
}());
