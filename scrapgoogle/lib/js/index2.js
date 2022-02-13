var urlParams = new URLSearchParams(window.location.search);
var dataId = urlParams.get('dataId');
var placeIDs = []
var regex = /top (\d+)/gi

var app = new Vue({
    el: '#app',
    data: {
        data: [],
        articlesLength: 200,
        title: "Data is loading"
    },
    methods: {
        linksWhoVoted: (e) => {
            var element = e.target
            while (element.tagName != "TR") {
                element = element.parentElement
            }
            var name = element.querySelector("td").innerText
            window.open(chrome.extension.getURL("/lib/index3.html") + `?dataId=${dataId}&dataName=${name}`)
        }
    },
})
chrome.storage.local.get(['storedData'], function (result) {
    var storedData = result.storedData || {}
    storedData[dataId].data.slice(0, Number((storedData[dataId].title.match(regex) != null ? storedData[dataId].title.match(regex)[0] : "top 1000").replace(/top/gi, "").trim())).map((item, i) => {
        placeIDs.push(item);
    })
    app.data = storedData[dataId].articles
    app.articlesLength = storedData[dataId].articlesLength
    app.title = storedData[dataId].title
})
