var app = new Vue({
    el: '#app',
    data: {
        excludeList: [],
        permanentExclude: [
            "Categorie",
            "Primary Sidebar",
            "Sidebar",
            "Header",
            "Comment",
            "Share",
            "Search",
            "Partners",
            "You are here",
            "Trending",
            "Article",
            "Main Navigation",
            "Latest Post",
            "Tag",
            "Recent Post",
            "Search Form",
            "Description",
            "Popular Post",
            "Plan Your Trip",
            "Post Navigation",
            "Reader Interaction",
            "Conclusion",
            "Signup",
            "Newsletter",
            "You have Successfully Subscribed",
            "Subscribe",
            "Share",
            "Share this story",
            "Other Resources",
            "Leave a Reply",
            "Advertiser Disclosure",
            "Disclosure",
            "Facebook",
            "Pinterest",
            "Contact",
            "Account",
            "Profile",
            "Menu",
            "Follow",
            "Related",
            "About",
            "Explore",
            "Like",
            "Best",
            "More",
            "Most",
            "Top",
            "Connect",
            "Give us a call",
            "Footer",
            "Login",
            "Site"
        ]
    },
    methods: {
        deleteKeyWord: (e) => {
            var element = e.target
            while (element.tagName != "TR") {
                element = element.parentElement
            }
            var keyWord = element.querySelector("td").innerText
            chrome.storage.local.set({ storedKeyWords: app.excludeList.filter(e => e != keyWord) })
            app.excludeList = app.excludeList.filter(e => e != keyWord)
        }
    },
})
chrome.storage.local.get(['storedKeyWords'], function (result) {
    storedKeyWords = result.storedKeyWords || []
    app.excludeList = storedKeyWords
})
document.querySelector("#addBtn").addEventListener("click", function (e) {
    var keyWord = document.querySelector("#excludeKeyWord").value
    chrome.storage.local.set({ storedKeyWords: [...app.excludeList.filter(e => e != keyWord), keyWord] })
    app.excludeList = [...app.excludeList.filter(e => e != keyWord), keyWord]
})