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
            times: "",
            link: []
        },
        articlesLength: 200,
        title: "Data is loading"
    },
})
chrome.storage.local.get(['storedData'], function (result) {
    var storedData = result.storedData || {}
    storedData[dataId].data.slice(0, Number((storedData[dataId].title.match(regex) != null ? storedData[dataId].title.match(regex)[0] : "top 1000").replace(/top/gi, "").trim())).map((item, i) => {
        placeIDs.push(item);
    })
    app.data.times = placeIDs.filter(e => e.text == dataName)[0].link.length
    app.data.link = placeIDs.filter(e => e.text == dataName)[0].link
    app.articlesLength = storedData[dataId].articlesLength
    app.title = storedData[dataId].title
})