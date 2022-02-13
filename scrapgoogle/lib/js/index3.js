var urlParams = new URLSearchParams(window.location.search);
var dataId = urlParams.get('dataId');
var dataName = urlParams.get('dataName');
var placeIDs = []
var regex = /top (\d+)/gi
var app = new Vue({
    el: '#app',
    data: {
        data: {
            text: dataName,
            times: 0,
            link: []
        },
        articlesLength: 200,
        title: "Data is loading"
    },
})
chrome.storage.local.get(['storedData'], function (result) {
    var storedData = result.storedData || {}
    var storedData = storedData[dataId]
    var votedOn = storedData.articles.filter(e => e.text == dataName)[0].votedOn.filter(e => storedData.data.filter(j => j.text == e.text).length > 0)
    app.data.times = votedOn.length
    app.data.link = votedOn
    app.articlesLength = storedData.articlesLength
    app.title = storedData.title
})
