var urlParams = new URLSearchParams(window.location.search);
document.querySelector("title").innerHTML = decodeURIComponent(urlParams.get("categoryName"))
window.onunload = function () {
    chrome.runtime.sendMessage({
        action: "resetWindowId",
    });
}
var sort_by = function () {
    var fields = [].slice.call(arguments),
        n_fields = fields.length;

    return function (A, B) {
        var a, b, field, key, primer, reverse, result;
        for (var i = 0, l = n_fields; i < l; i++) {
            result = 0;
            field = fields[i];

            key = typeof field === 'string' ? field : field.name;

            a = A[key];
            b = B[key];

            if (typeof field.primer !== 'undefined') {
                a = field.primer(a);
                b = field.primer(b);
            }

            reverse = (field.reverse) ? -1 : 1;

            if (a < b) result = reverse * -1;
            if (a > b) result = reverse * 1;
            if (result !== 0) break;
        }
        return result;
    }
}
document.querySelector("#previewsAllTable").style.height = window.innerHeight + "px"
var emailTable = new Vue({
    el: '#previewsAllTable',
    data: JSON.parse(urlParams.get("vueJs")),
    mounted() {
        for (let i = 0; i < this.preview.length; i++) {
            this.preview[i].emails = [...new Set(this.preview[i].emails)]
            this.preview[i].emails.sort(sort_by(
                {
                    name: 'Class',
                },
                {
                    name: 'DueDate',
                    primer: getFullDate
                }
            ));
        }
    },
    methods: {
        goToAssLink: function (e) {
            if (e.tagName != "A") {
                while (e.tagName != "TR" && e.tagName != "A") {
                    if (e.tagName == "TR" || e.tagName == "A") {
                        return
                    }
                    e = e.parentElement
                }
                if (e.tagName != "A" && e.getAttribute("AssLink") != null) {
                    window.open(e.getAttribute("AssLink"))
                }
            }
        },
    },
})
window.onresize = function () {
    document.querySelector("#previewsAllTable").style.height = window.innerHeight + "px"
};
function getFullDate(date) {
    var notcompleteddate = date
    if (notcompleteddate.indexOf("Received") != -1) {
        notcompleteddate = notcompleteddate.split("Received ")[1]
    }
    var years = new Date().getFullYear()
    var dateUrgentItem = notcompleteddate
    if (new Date(notcompleteddate).getMonth() < 5 && new Date(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate()).getMonth() > 5) {
        dateUrgentItem = new Date((1 + years) + notcompleteddate)
    } else {
        dateUrgentItem = new Date(years + notcompleteddate)
    }
    return dateUrgentItem
}

var type = urlParams.get("Type")
for (let i = 0; i < document.querySelectorAll("[id*='previewsTable']").length; i++) {
    document.querySelectorAll("[id*='previewsTable']")[i].style.display = "none"
    if (document.querySelectorAll("[id*='previewsTable']")[i].id == "previewsTable" + type) {
        document.querySelectorAll("[id*='previewsTable']")[i].style.display = "flex"
    }
}
document.querySelector("#previewsAllTable").scrollTop = 0
var MyServer = "https://extension.skoolbot.com/";
var b64c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"   // base64 dictionary
var b64u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"   // base64url dictionary
var b64pad = '='
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === 'changeTable') {
            var type = request.payload.type
            for (let i = 0; i < document.querySelectorAll("[id*='previewsTable']").length; i++) {
                document.querySelectorAll("[id*='previewsTable']")[i].style.display = "none"
                if (document.querySelectorAll("[id*='previewsTable']")[i].id == "previewsTable" + type) {
                    document.querySelectorAll("[id*='previewsTable']")[i].style.display = "flex"
                }
            }
            document.querySelector("#previewsAllTable").scrollTop = 0
            sendResponse("done")
        }
        return true;
    }
);
var scrollVal = 0;
function beforeScroll(e) {
    if (e.deltaY < 0) {
        scrollUp(e.target);
    } else {
        scrollDown(e.target);
    }
    e.preventDefault();
    return;
}
function scrollUp(e) {
    while (e.id != "previewsAllTable" && e.id != "emailsTable") {
        if (e.id != "previewsAllTable" && e.id != "emailsTable") {
            e = e.parentElement
        } else if (e.tagName == "HTML") {
            break
        }
    };
    if (scrollVal > 0)
        scrollVal -= 38;

    e.scroll(0, scrollVal);
}
function scrollDown(e) {
    while (e.id != "previewsAllTable" && e.id != "emailsTable") {
        if (e.id != "previewsAllTable" && e.id != "emailsTable") {
            e = e.parentElement
        } else if (e.tagName == "HTML") {
            break
        }
    };
    if (scrollVal < document.body.scrollHeight)
        scrollVal += 38;
    //should detect for maximum scroll
    e.scroll(0, scrollVal);
}
