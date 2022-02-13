function getURLSInGoogleSerach(q) {
    chrome.runtime.sendMessage({ msg: "setUpExtension", q }, function (response) {
        if (response.msg == "error") {
            alert("There is an error in the results")
        }
    });
}
function setUpExtension(exclude, include, num) {
    var urlParams = new URLSearchParams(window.location.search);
    var q = urlParams.get('q');
    chrome.runtime.sendMessage({ msg: "setUpExtension", q, exclude, include, number: num }, function (response) {
        if (response.msg == "error") {
            alert("There is an error in the results")
        }
    });
}
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg == "startScrapping") {
        setUpExtension(request.exclude, request.include, request.number)
    }
    return true
});