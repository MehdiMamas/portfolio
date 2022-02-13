
var MyServer = "https://extension.skoolbot.com/";
function PullByKey(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, data => {
            resolve(data[key])
        })

    })
}
function SetByKey(key, data) {
    chrome.storage.local.set({
        [key]: data
    })
}
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        window.open('https://www.skoolbotclassroomassistant.com/how-to-install')
    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});
var firstTimeOfTheDay = false
var emailTable = {
    emails: [
        {
            category: "Urgent Items",
            numberOfItems: 0,
            type: "Type4"
        },
        {
            category: "Overdue/Late Assignments",
            numberOfItems: 0,
            type: "Type8"
        },
        {
            category: "New Assignments",
            numberOfItems: 0,
            type: "Type1"
        },
        {
            category: "Graded Assignments",
            numberOfItems: 0,
            type: "Type2"
        },
        {
            category: "Private Messages",
            numberOfItems: 0,
            type: "Type3"
        },
        {
            category: "New Questions",
            numberOfItems: 0,
            type: "Type5"
        },
        {
            category: "New Announcements",
            numberOfItems: 0,
            type: "Type6"
        },
        {
            category: "New Materials",
            numberOfItems: 0,
            type: "Type7"
        },
        {
            category: "Messages from SkoolBot",
            numberOfItems: 0,
            type: "Type9"
        },
    ],
    preview: [
        {
            type: "New Assignments",
            emails: []
        },
        {
            type: "Overdue/Late Assignments",
            emails: []
        },
        {
            type: "Messages from SkoolBot",
            emails: []
        },
        {
            type: "Graded Assignments",
            emails: []
        },
        {
            type: "Private Messages",
            emails: []
        },
        {
            type: "Urgent Items",
            emails: []
        },
        {
            type: "New Questions",
            emails: []
        },
        {
            type: "New Announcements",
            emails: []
        },
        {
            type: "New Materials",
            emails: []
        },
    ],
    notificationsPreview: [

    ],
    Teachers: [],
    assignments: []
}
var SndRsp;
var runningRequests = 0
var maxRequests = 8
var windowPreview;
var lastEmails = []
var iconRed = false
var lastIconText = 0
var firstTime = true

var b64c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"   // base64 dictionary
var b64u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"   // base64url dictionary
var b64pad = '='

const objectsEqual = (o1, o2) => {
    return typeof o1 === 'object' && Object.keys(o1).length > 0
        ? Object.keys(o1).length === Object.keys(o2).length
        && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
        : o1 === o2;
}
const arraysEqual = (a1, a2) => {
    return a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
}
const arraysEqualWithoutIndex = (a1, a2) => {
    var equality = true
    if (a1.length != a2.length) {
        return false
    }
    for (let i = 0; i < a1.length; i++) {
        var obj = a1[i];
        if (a2.filter(e => objectsEqual(e, obj) == true).length == 0) {
            equality = false
        }
    }
    return equality
}
var reviewedEmailsIds = {}
PullByKey(['ReviewedEmailsIds']).then(rsp => {
    reviewedEmailsIds = rsp || {}
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.action === 'openUrl') {
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function (tabs) {

                    if (tabs[0].url.indexOf(request.url) == -1)
                        chrome.tabs.create({
                            url: request.url,
                            'selected': false
                        });

                });

            } else if (request.action === 'resetWindowId') {
                windowPreview = undefined
            } else if (request.action === 'Login') {
                SndRsp = sendResponse;
                windowThatWasOpened = window.open(url, "Please sign in with Google", "width=500px,height=700px,top=65px,resizable=0");
            } else if (request.action === 'clearLastEmails') {
                lastEmails = []
                lastIconText = 0
                chrome.browserAction.setBadgeText({ text: "" })
                SetByKey('reviewedEmailsIds', {})
            } else if (request.action === "resetIconText") {
                lastIconText = 0
                for (let i = 0; i < emailTable.preview.filter(e => e.type == "Urgent Items")[0].emails.length; i++) {
                    var obj = emailTable.preview.filter(e => e.type == "Urgent Items")[0].emails[i];
                    reviewedEmailsIds[obj.idOfMessage] = true
                }
                for (let i = 0; i < emailTable.notificationsPreview.length; i++) {
                    var obj = emailTable.notificationsPreview[i];
                    reviewedEmailsIds[obj.idOfMessage] = true
                }
                emailTable.notificationsPreview = []
                SetByKey('reviewedEmailsIds', reviewedEmailsIds)
            } else if (request.action === "getIconText") {
                sendResponse(lastIconText)
            } else if (request.action === "getPageImage") {
                chrome.tabs.captureVisibleTab(null, function (img) {
                    sendResponse(img)
                });
            } else if (request.action === "openTableReviewer") {
                chrome.tabs.query({}, function (tab) {
                    chrome.windows.create({
                        focused: true,
                        url: chrome.extension.getURL("/bg.html") + "?Type=" + request.payload.type + "&categoryName=" + encodeURIComponent(request.payload.categoryName) + "&vueJs=" + encodeURIComponent(JSON.stringify(request.payload.vuejs)),
                        width: 991,
                        height: 500,
                        top: 65,
                        type: 'popup'
                    }, function (window0) {
                        windowPreview = window0.id
                        sendResponse({
                            Status: "Done"
                        })
                    })
                })
            } else if (request.action === "resetWindowPreview") {
                if (windowPreview != undefined) {
                    chrome.windows.remove(windowPreview, function () {
                        windowPreview = undefined
                        sendResponse("")
                    })
                } else {
                    sendResponse("")

                }

            }
            return true;
        }
    );

    setInterval(() => {
        chrome.browserAction.getBadgeText({}, function (result) {
            if (result == '!') {
                notify('You have ' + emailTable.emails[0].numberOfItems + ' urgent items for school', 'Click on Google Classroom Assistant icon to view them.', "");
            }
        })
    }, Number(1000 * 60 * 60));
    setInterval(intervaleFunction, Number(1000 * 60 * 20));
})
function checkForUrgentItems() {
    return new Promise((resolve, reject) => {
        if (emailTable.preview.filter(e => e.type == "Urgent Items")[0].emails.length == 0) {
            return resolve(false)
        }
        PullByKey(['lastTimeBgRuns']).then((rsp) => {
            var date = new Date()
            date = new Date(date.getTime() - 1 * 24 * 60 * 60 * 1000)
            var lastTimeBgRuns = rsp || {
                lastClicked: date.getTime(),
            }
            SetByKey('lastTimeBgRuns', { lastClicked: lastTimeBgRuns.lastClicked })
            if (new Date(lastTimeBgRuns.lastClicked).getDate() == new Date().getDate()) {
                return resolve(false)
            }
            return resolve(true)
        })
    })

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function intervaleFunction() {
    var lastEmails1 = await getEmailsIds()
    var lastEmails2 = []
    for (let i = 0; i < lastEmails1.length; i++) {
        while (runningRequests >= maxRequests) {
            await sleep(1000)
        }
        runningRequests++
        getEmailDetails(lastEmails1[i].id)
            .then((rsp) => {
                runningRequests--
                lastEmails2.push(rsp)
            })
            .catch((err) => {
                console.log(err);
            })
    }
    while (runningRequests > 0) {
        await sleep(1000)
    }
    lastEmails1 = lastEmails2
    await setUpTheExtension("", lastEmails1, [])
    iconRed = await checkForUrgentItems()
    for (let i = 0; i < lastEmails1.length; i++) {
        lastEmails1[i] = lastEmails1[i]
    }
    var i = 0
    if (lastEmails1.length != 0 && firstTime == false) {
        var array = []
        var array1 = []
        if (lastEmails.length > 0 && lastEmails1.length > 0 && arraysEqualWithoutIndex(lastEmails, lastEmails1) == false) {
            for (i; i < lastEmails1.length; i++) {
                var obj = lastEmails1[i];
                if (lastEmails.filter(e => objectsEqual(e, obj) == true).length == 0) {
                    lastIconText = lastIconText + 1
                    if (reviewedEmailsIds[obj.id] != true) {
                        array1.push(obj.id)
                    }
                }
            }
        }

        await setUpTheExtension("", lastEmails1, array1)
        if (lastIconText > 0 && emailTable.notificationsPreview.length > 0) {
            for (let i = 0; i < emailTable.notificationsPreview.length; i++) {
                var obj = emailTable.notificationsPreview[i];
                array.push(obj.Class + ' : ' + obj.EventType.substring(0, 9))
            }
            notify(lastIconText + ' New School Email(s)', array.join('\n'), "https://classroom.google.com/");
        }

    } else if (lastEmails.length == 0 && firstTime == true) {
        lastIconText = 0
        firstTime = false
    }
    if (iconRed == true) {
        chrome.browserAction.setBadgeBackgroundColor({ color: 'red' })
        chrome.browserAction.setBadgeText({ text: "!" })
    } else {
        if (lastIconText != 0) {
            chrome.browserAction.setBadgeBackgroundColor({ color: 'blue' })
            chrome.browserAction.setBadgeText({ text: lastIconText + "+" })
        } else {
            chrome.browserAction.setBadgeText({ text: "" })
        }
    }
    lastEmails = lastEmails1

}
function setUpTheExtension(token, rsp1, idsofemails) {
    rsp = JSON.parse(JSON.stringify(rsp1))
    new Promise(async (resolve, reject) => {
        emailTable.notificationsPreview = []
        emailTable = {
            emails: [
                {
                    category: "Urgent Items",
                    numberOfItems: 0,
                    type: "Type4"
                },
                {
                    category: "Overdue/Late Assignments",
                    numberOfItems: 0,
                    type: "Type8"
                },
                {
                    category: "New Assignments",
                    numberOfItems: 0,
                    type: "Type1"
                },
                {
                    category: "Graded Assignments",
                    numberOfItems: 0,
                    type: "Type2"
                },
                {
                    category: "Private Messages",
                    numberOfItems: 0,
                    type: "Type3"
                },
                {
                    category: "New Questions",
                    numberOfItems: 0,
                    type: "Type5"
                },
                {
                    category: "New Announcements",
                    numberOfItems: 0,
                    type: "Type6"
                },
                {
                    category: "New Materials",
                    numberOfItems: 0,
                    type: "Type7"
                },
                {
                    category: "Messages from SkoolBot",
                    numberOfItems: 0,
                    type: "Type9"
                },
            ],
            preview: [
                {
                    type: "New Assignments",
                    emails: []
                },
                {
                    type: "Overdue/Late Assignments",
                    emails: []
                },
                {
                    type: "Messages from SkoolBot",
                    emails: []
                },
                {
                    type: "Graded Assignments",
                    emails: []
                },
                {
                    type: "Private Messages",
                    emails: []
                },
                {
                    type: "Urgent Items",
                    emails: []
                },
                {
                    type: "New Questions",
                    emails: []
                },
                {
                    type: "New Announcements",
                    emails: []
                },
                {
                    type: "New Materials",
                    emails: []
                },
            ],
            notificationsPreview: [

            ],
            Teachers: [],
            assignments: []
        }
        var mounths = [
            "Jan",
            "Febr",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ]
        rsp = rsp.filter(e => e.payload.parts.filter(e1 => e1.mimeType == "text/html")[0].body.data != "")
        for (let i = 0; i < rsp.length; i++) {
            var obj = rsp[i]
            obj.payload.parts.filter(e => e.mimeType == "text/html")[0].body.data = base64_decode(obj.payload.parts.filter(e => e.mimeType == "text/html")[0].body.data)
        }
        for (let i = 0; i < rsp.length; i++) {
            var obj = rsp[i];
            var parser = new DOMParser();
            var doc = parser.parseFromString(obj.payload.parts.filter(e => e.mimeType == "text/html")[0].body.data, "text/html");
            var teacher = ""
            var dueDate = "Received " + mounths[new Date(obj.payload.headers.filter(e => e.name == "Date")[0].value).getMonth()] + " " + new Date(obj.payload.headers.filter(e => e.name == "Date")[0].value).getDate()
            if (getElementByInnerText(doc, "Due:", 0, "td").innerText.split("Due:")[1] != "" && getElementByInnerText(doc, "Due:", 0, "td").innerText.split("Due:")[1] != undefined) {
                dueDate = getElementByInnerText(doc, "Due:", 0, "td").innerText.split("Due:")[1] || ""
            }
            if (obj.payload.headers.filter(e => e.name == "From")[0].value.indexOf(" (") == -1) {
                teacher = obj.payload.headers.filter(e => e.name == "From")[0].value.split(" <")[0] || ""
            } else {
                teacher = obj.payload.headers.filter(e => e.name == "From")[0].value.substring(1, obj.payload.headers.filter(e => e.name == "From")[0].value.indexOf(" (")) || ""
            }
            if (teacher == "Google Classroom") {
                if (emailTable.preview.filter(e => e.type == "Overdue/Late Assignments")[0].emails.length == 0) {
                    if (getElementByInnerText(doc, "Missing from last week", 0, "h3").parentElement != null) {
                        var table = getElementByInnerText(doc, "Missing from last week", 0, "h3").parentElement.querySelector('table')
                        for (let i = 0; i < table.querySelectorAll('tr').length; i++) {
                            var tr = table.querySelectorAll('tr')[i];
                            var obj1 = {
                                Class: tr.querySelector("div").innerText.split(' ' + tr.querySelector("div").querySelector("span").innerText)[0],
                                DueDate: tr.querySelector("div").querySelector("span").innerText.split("due ")[1],
                                assignmentName: tr.querySelectorAll("div")[1].innerText
                            }
                            emailTable.preview.filter(e => e.type == "Overdue/Late Assignments")[0].emails.push(obj1)
                            if (idsofemails.filter(e => { e == obj.id }).length != 0) {
                                obj1.EventType = "Late Assign"
                                emailTable.notificationsPreview.push(obj1)
                            }
                        }
                    }
                }
            } else if (obj.payload.headers.filter(e => e.name == "From")[0].value.split(" <")[1].indexOf('@skoolbot.com') != -1) {
                var objValue = {
                    Subject: obj.payload.headers.filter(e => e.name == "Subject")[0].value,
                    Message: doc.querySelector('body').innerText,
                    DueDate: dueDate
                }
                emailTable.preview.filter(e => e.type == "Messages from SkoolBot")[0].emails.push(objValue)
                var obj1 = {
                    Class: 'SkoolBot',
                }
                if (idsofemails.filter(e => e == obj.id).length != 0) {
                    obj1.EventType = "New Message"
                    emailTable.notificationsPreview.push(obj1)
                }
            } else {
                if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(':')[0].indexOf("Graded") == 0) {
                    var assignmentURL = (getElementByInnerText(doc, "just returned", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "just returned", null, "td").querySelector("a").href : "")
                    var assignmentName = (getElementByInnerText(doc, "just returned", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "just returned", null, "td").querySelector("a").innerText : "")
                    emailTable.assignments.push({ assignmentURL, assignmentName })
                } else if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(':')[0].indexOf("Due tomorrow") == 0) {
                    var assignmentURL = getElementByInnerText(doc, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].substring(0, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].split("…")[0].length - 1).trim(), 0, "a").href
                    var assignmentName = getElementByInnerText(doc, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].substring(0, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].split("…")[0].length - 1).trim(), 0, "a").innerText
                    emailTable.assignments.push({ assignmentURL, assignmentName })
                } else if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(':')[0].indexOf("added a private comment on") != -1) {
                    var assignmentURL = (getElementByInnerText(doc, "added a private comment on ", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "added a private comment on ", null, "td").querySelector("a").href : "")
                    var assignmentName = (getElementByInnerText(doc, "added a private comment on ", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "added a private comment on ", null, "td").querySelector("a").innerText : "")
                    emailTable.assignments.push({ assignmentURL, assignmentName })
                }
            }

        }
        for (let i = 0; i < rsp.length; i++) {
            var obj = rsp[i];
            var parser = new DOMParser();
            var doc = parser.parseFromString(obj.payload.parts.filter(e => e.mimeType == "text/html")[0].body.data, "text/html");
            var teacher = ""
            var mounths = [
                "Jan",
                "Febr",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ]
            if (obj.payload.headers.filter(e => e.name == "From")[0].value.indexOf(" (") == -1) {
                teacher = obj.payload.headers.filter(e => e.name == "From")[0].value.split(" <")[0] || ""
            } else {
                teacher = obj.payload.headers.filter(e => e.name == "From")[0].value.substring(1, obj.payload.headers.filter(e => e.name == "From")[0].value.indexOf(" (")) || ""
            }
            if (teacher != "Google Classroom") {
                var dueDate = "Received " + mounths[new Date(obj.payload.headers.filter(e => e.name == "Date")[0].value).getMonth()] + " " + new Date(obj.payload.headers.filter(e => e.name == "Date")[0].value).getDate()
                if (getElementByInnerText(doc, "Due:", 0, "td").innerText.split("Due:")[1] != "" && getElementByInnerText(doc, "Due:", 0, "td").innerText.split("Due:")[1] != undefined) {
                    dueDate = getElementByInnerText(doc, "Due:", 0, "td").innerText.split("Due:")[1] || ""
                }
                var objValue = {
                    Teacher: teacher,
                    DueDate: dueDate,
                    idOfMessage: obj.id,
                    reviewed: false,
                }
                if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(':')[0].indexOf("New assignment") == 0 && getFullDate(dueDate).getTime() >= new Date(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate()).getTime()) {
                    var description = ""
                    if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "').length > 1) {
                        description = getElementByInnerText(doc, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].substring(0, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].split("…")[0].length - 1).trim(), 0, "td").innerText
                    }
                    var className = (getElementByInnerText(doc, "posted a new assignment in ", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "posted a new assignment in ", null, "td").querySelector("a").innerText : "")
                    var classURL = (getElementByInnerText(doc, "posted a new assignment in ", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "posted a new assignment in ", null, "td").querySelector("a").href : "")
                    objValue.Class = className
                    objValue.Description = description
                    objValue.ClassURL = classURL
                    var assignmentURL = getElementByInnerText(doc, "OPEN", 0, "a").href || ""
                    var assignmentName = description
                    objValue.assignmentURL = assignmentURL
                    objValue.assignmentName = assignmentName
                    emailTable.assignments.push({ assignmentURL, assignmentName })
                    if (emailTable.Teachers.filter(e => e.Name == objValue.Teacher).length == 0) {
                        var TeacherObj = {
                            Name: objValue.Teacher,
                            ClassName: className,
                            ClassURL: classURL
                        }
                        emailTable.Teachers.push(TeacherObj)
                    }
                    if (dueDate.indexOf("Received") == -1) {
                        var dateUrgentItem = getFullDate(dueDate)
                        if (dateUrgentItem.getTime() - new Date(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate()).getTime() <= 2.5 * 24 * 60 * 60 * 1000 && dateUrgentItem.getTime() - new Date(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate()).getTime() >= 0) {
                            if (howManyDaysBetween(new Date(), new Date(obj.payload.headers.filter(e => e.name == "Date")[0].value)) > 7) {
                                break
                            }
                            objValue.TypeOfAssignment = "Assignment"
                            emailTable.preview.filter(e => e.type == "Urgent Items")[0].emails.push(objValue)
                        }
                    }
                    emailTable.preview.filter(e => e.type == "New Assignments")[0].emails.push(objValue)
                    if (idsofemails.filter(e => e == obj.id).length != 0) {
                        objValue.EventType = "New Asgmt"
                        emailTable.notificationsPreview.push(objValue)
                    }
                } else if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(':')[0].indexOf("New question") == 0) {
                    var description = ""
                    if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "').length > 1) {
                        description = getElementByInnerText(doc, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].substring(0, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].split("…")[0].length - 1).trim(), 0, "td").innerText
                    }
                    var className = getElementByInnerText(doc, "posted a new question in ", null, "td").querySelector("a").innerText || ""
                    var classURL = getElementByInnerText(doc, "posted a new question in ", null, "td").querySelector("a").href || ""
                    objValue.Class = className
                    objValue.Description = description
                    objValue.ClassURL = classURL
                    var assignmentURL = getElementByInnerText(doc, "OPEN", 0, "a").href || ""
                    var assignmentName = description
                    objValue.assignmentURL = assignmentURL
                    objValue.assignmentName = assignmentName
                    if (emailTable.Teachers.filter(e => e.Name == objValue.Teacher).length == 0) {
                        var TeacherObj = {
                            Name: objValue.Teacher,
                            ClassName: className,
                            ClassURL: classURL,
                        }
                        emailTable.Teachers.push(TeacherObj)
                    }
                    if (dueDate.indexOf("Received") == -1) {
                        var years = new Date().getFullYear()
                        var dateUrgentItem = getFullDate(dueDate)
                        if (dateUrgentItem.getTime() - new Date(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate()).getTime() <= 2.5 * 24 * 60 * 60 * 1000 && dateUrgentItem.getTime() - new Date(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate()).getTime() >= 0) {
                            if (howManyDaysBetween(new Date(), new Date(obj.payload.headers.filter(e => e.name == "Date")[0].value)) > 7) {
                                break
                            }
                            objValue.TypeOfAssignment = "Question"
                            emailTable.preview.filter(e => e.type == "Urgent Items")[0].emails.push(objValue)
                        }
                    }
                    emailTable.preview.filter(e => e.type == "New Questions")[0].emails.push(objValue)
                    if (idsofemails.filter(e => e == obj.id).length != 0) {
                        objValue.EventType = "New Quest"
                        emailTable.notificationsPreview.push(objValue)
                    }
                } else if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(':')[0].indexOf("New announcement") == 0) {
                    if (howManyDaysBetween(new Date(), new Date(obj.payload.headers.filter(e => e.name == "Date")[0].value)) > 7) {
                        break
                    }
                    var description = ""
                    if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "').length > 1) {
                        description = doc.querySelector("tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(3) > td").innerText
                    }
                    var className = (getElementByInnerText(doc, "posted a new announcement in ", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "posted a new announcement in ", null, "td").querySelector("a").innerText : "")
                    var classURL = (getElementByInnerText(doc, "posted a new announcement in ", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "posted a new announcement in ", null, "td").querySelector("a").href : "")
                    objValue.Class = className
                    objValue.Description = description
                    objValue.ClassURL = classURL
                    var assignmentURL = getElementByInnerText(doc, "OPEN", 0, "a").href || ""
                    var assignmentName = description
                    objValue.assignmentURL = assignmentURL
                    objValue.assignmentName = assignmentName
                    if (emailTable.Teachers.filter(e => e.Name == objValue.Teacher).length == 0) {
                        var TeacherObj = {
                            Name: objValue.Teacher,
                            ClassName: className,
                            ClassURL: classURL
                        }
                        emailTable.Teachers.push(TeacherObj)
                    }
                    emailTable.preview.filter(e => e.type == "New Announcements")[0].emails.push(objValue)
                    if (idsofemails.filter(e => e == obj.id).length != 0) {
                        objValue.EventType = "New Announ"
                        emailTable.notificationsPreview.push(objValue)
                    }
                } else if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(':')[0].indexOf("New material") == 0) {
                    if (howManyDaysBetween(new Date(), new Date(obj.payload.headers.filter(e => e.name == "Date")[0].value)) > 7) {
                        break
                    }
                    var description = ""
                    if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "').length > 1) {
                        description = getElementByInnerText(doc, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].substring(0, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].split("…")[0].length - 1).trim(), 0, "td").innerText
                    }
                    var assignmentURL = getElementByInnerText(doc, "OPEN", 0, "a").href || ""
                    var assignmentName = description
                    objValue.assignmentURL = assignmentURL
                    objValue.assignmentName = assignmentName
                    var className = (getElementByInnerText(doc, "posted a new material in ", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "posted a new material in ", null, "td").querySelector("a").innerText : "")
                    var classURL = (getElementByInnerText(doc, "posted a new material in ", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "posted a new material in ", null, "td").querySelector("a").href : "")
                    objValue.Class = className
                    objValue.Description = description
                    objValue.ClassURL = classURL
                    if (emailTable.Teachers.filter(e => e.Name == objValue.Teacher).length == 0) {
                        var TeacherObj = {
                            Name: objValue.Teacher,
                            ClassName: className,
                            ClassURL: classURL
                        }
                        emailTable.Teachers.push(TeacherObj)
                    }
                    emailTable.preview.filter(e => e.type == "New Materials")[0].emails.push(objValue)
                    if (idsofemails.filter(e => e == obj.id).length != 0) {
                        objValue.EventType = "New Materials"
                        emailTable.notificationsPreview.push(objValue)
                    }
                }
            }

        }
        for (let i = 0; i < rsp.length; i++) {


            var obj = rsp[i];
            var parser = new DOMParser();
            var doc = parser.parseFromString(obj.payload.parts.filter(e => e.mimeType == "text/html")[0].body.data, "text/html");
            var teacher = ""
            if (obj.payload.headers.filter(e => e.name == "From")[0].value.indexOf(" (") == -1) {
                teacher = obj.payload.headers.filter(e => e.name == "From")[0].value.split(" <")[0] || ""
            } else {
                teacher = obj.payload.headers.filter(e => e.name == "From")[0].value.substring(1, obj.payload.headers.filter(e => e.name == "From")[0].value.indexOf(" (")) || ""
            }
            if (teacher != "Google Classroom") {
                var mounths = [
                    "Jan",
                    "Febr",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ]
                var dueDate = "Received " + mounths[new Date(obj.payload.headers.filter(e => e.name == "Date")[0].value).getMonth()] + " " + new Date(obj.payload.headers.filter(e => e.name == "Date")[0].value).getDate()
                if (getElementByInnerText(doc, "Due:", 0, "td").innerText.split("Due:")[1] != "" && getElementByInnerText(doc, "Due:", 0, "td").innerText.split("Due:")[1] != undefined) {
                    dueDate = getElementByInnerText(doc, "Due:", 0, "td").innerText.split("Due:")[1] || ""
                }
                var objValue = {
                    Teacher: teacher,
                    DueDate: dueDate,
                }
                if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(':')[0].indexOf("Graded") == 0) {
                    if (howManyDaysBetween(new Date(), new Date(obj.payload.headers.filter(e => e.name == "Date")[0].value)) > 7) {
                        break
                    }
                    var description = ""
                    if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "').length > 1) {
                        description = getElementByInnerText(doc, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].substring(0, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].split("…")[0].length - 1).trim(), 0, "td").innerText
                    }
                    if (emailTable.Teachers.filter(e => e.Name == objValue.Teacher)[0] != undefined) {
                        objValue.Class = emailTable.Teachers.filter(e => e.Name == objValue.Teacher)[0].ClassName
                        objValue.ClassURL = emailTable.Teachers.filter(e => e.Name == objValue.Teacher)[0].ClassURL
                    } else {
                        objValue.Class = "Not Found"
                        objValue.ClassURL = "https://classroom.google.com/"
                    }
                    var assignmentURL = (getElementByInnerText(doc, "just returned", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "just returned", null, "td").querySelector("a").href : "")
                    var assignmentName = (getElementByInnerText(doc, "just returned", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "just returned", null, "td").querySelector("a").innerText : "")
                    objValue.assignmentURL = assignmentURL
                    objValue.assignmentName = assignmentName
                    emailTable.assignments.push({ assignmentURL, assignmentName })
                    objValue.Grade = doc.querySelector("table > tbody > tr:nth-child(2) > td:nth-child(1) > div > table > tbody > tr:nth-child(1) > td:nth-child(2)").innerText + " out of " + doc.querySelector("table > tbody > tr:nth-child(2) > td:nth-child(1) > div > table > tbody > tr:nth-child(2) > td").innerText
                    emailTable.preview.filter(e => e.type == "Graded Assignments")[0].emails.push(objValue)
                    if (idsofemails.filter(e => e == obj.id).length != 0) {
                        objValue.EventType = "Graded Assign"
                        emailTable.notificationsPreview.push(objValue)
                    }
                } else if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(':')[0].indexOf("added a private comment on") != -1) {
                    if (howManyDaysBetween(new Date(), new Date(obj.payload.headers.filter(e => e.name == "Date")[0].value)) > 7) {
                        break
                    }
                    var description = ""
                    if (obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "').length > 1) {
                        description = getElementByInnerText(doc, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].substring(0, obj.payload.headers.filter(e => e.name == "Subject")[0].value.split(': "')[1].split("…")[0].length - 1).trim(), 0, "td").innerText
                    }
                    if (emailTable.Teachers.filter(e => e.Name == objValue.Teacher)[0] != undefined) {
                        objValue.Class = emailTable.Teachers.filter(e => e.Name == objValue.Teacher)[0].ClassName
                        objValue.ClassURL = emailTable.Teachers.filter(e => e.Name == objValue.Teacher)[0].ClassURL
                    } else {
                        objValue.Class = "Not Found"
                        objValue.ClassURL = "https://classroom.google.com/"
                    }
                    var assignmentURL = (getElementByInnerText(doc, "added a private comment on ", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "added a private comment on ", null, "td").querySelector("a").href : "")
                    var assignmentName = (getElementByInnerText(doc, "added a private comment on ", null, "td").querySelector("a") != null ? getElementByInnerText(doc, "added a private comment on ", null, "td").querySelector("a").innerText : "")
                    emailTable.assignments.push({ assignmentURL, assignmentName })
                    objValue.assignmentName = assignmentName
                    objValue.assignmentURL = assignmentURL
                    objValue.Message = getElementByInnerText(doc, "\"", 0, "td").innerText.substring(1, getElementByInnerText(doc, "\"", 0, "td").innerText.length - 1)
                    emailTable.preview.filter(e => e.type == "Private Messages")[0].emails.push(objValue)
                    if (idsofemails.filter(e => e == obj.id).length != 0) {
                        objValue.EventType = "Private Messages"
                        emailTable.notificationsPreview.push(objValue)
                    }
                }
            }

        }
        for (let i = 0; i < emailTable.preview.length; i++) {
            emailTable.preview[i].emails = [...new Set(emailTable.preview[i].emails)]
            emailTable.preview[i].emails.sort(sort_by(
                {
                    name: 'Class',
                },
                {
                    name: 'DueDate',
                    primer: getFullDate
                }
            ));
        }
        for (let i = 0; i < emailTable.emails.length; i++) {
            var categoryName = emailTable.emails[i].category;
            emailTable.emails[i].numberOfItems = emailTable.preview.filter(e => e.type == categoryName)[0].emails.length
        }
        var date = new Date(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate())
        emailTable.emails = emailTable.emails.filter(e => e.numberOfItems != 0)
        chrome.storage.local.set({
            token,
            lastData: {
                date: (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear(),
                emails: emailTable.emails.filter(e => e.numberOfItems != 0),
                preview: emailTable.preview,
                Teachers: emailTable.Teachers,
                assignments: emailTable.assignments
            }
        })
    });
}
function testNotifications() {
    notify('Testing notifications', 'Testing notifications', "https://classroom.google.com/");
}
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
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
function base64_encode_data(data, len, b64x) {
    var dst = ""
    var i

    for (i = 0; i <= len - 3; i += 3) {
        dst += b64x.charAt(data.charCodeAt(i) >>> 2)
        dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4))
        dst += b64x.charAt(((data.charCodeAt(i + 1) & 15) << 2) | (data.charCodeAt(i + 2) >>> 6))
        dst += b64x.charAt(data.charCodeAt(i + 2) & 63)
    }

    if (len % 3 == 2) {
        dst += b64x.charAt(data.charCodeAt(i) >>> 2)
        dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4))
        dst += b64x.charAt(((data.charCodeAt(i + 1) & 15) << 2))
        dst += b64pad
    }
    else if (len % 3 == 1) {
        dst += b64x.charAt(data.charCodeAt(i) >>> 2)
        dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4))
        dst += b64pad
        dst += b64pad
    }

    return dst
}
function base64_encode(str) {
    var utf8str = unescape(encodeURIComponent(str))
    return base64_encode_data(utf8str, utf8str.length, b64c)
}
function base64url_encode(str) {
    var utf8str = unescape(encodeURIComponent(str))
    return base64_encode_data(utf8str, utf8str.length, b64u)
}
function base64_charIndex(c) {
    if (c == "+") return 62
    if (c == "/") return 63
    return b64u.indexOf(c)
}
function base64_decode(data) {
    var dst = ""
    var i, a, b, c, d, z

    for (i = 0; i < data.length - 3; i += 4) {
        a = base64_charIndex(data.charAt(i + 0))
        b = base64_charIndex(data.charAt(i + 1))
        c = base64_charIndex(data.charAt(i + 2))
        d = base64_charIndex(data.charAt(i + 3))

        dst += String.fromCharCode((a << 2) | (b >>> 4))
        if (data.charAt(i + 2) != b64pad)
            dst += String.fromCharCode(((b << 4) & 0xF0) | ((c >>> 2) & 0x0F))
        if (data.charAt(i + 3) != b64pad)
            dst += String.fromCharCode(((c << 6) & 0xC0) | d)
    }

    dst = decodeURIComponent(escape(dst))
    return dst
}
function base64url_sniff(base64) {
    if (base64.indexOf("-") >= 0) return true
    if (base64.indexOf("_") >= 0) return true
    return false
}
function getElementByInnerText(doc, searchText, index, elTag) {
    var array = []
    if (elTag == null || elTag == undefined) {
        for (let i = 0; i < doc.querySelectorAll("*").length; i++) {
            var element = doc.querySelectorAll("*")[i];
            if (element.innerText != undefined && element.tagName != "HTML" && element.tagName != "BODY" && element.tagName != "HEAD") {
                if (index != null && index != undefined) {
                    if (element.innerText.toLowerCase().indexOf(searchText.toLowerCase()) == index) {
                        array.push(element)
                    }
                } else {
                    if (element.innerText.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        array.push(element)
                    }
                }

            }
        }
    } else {
        for (let i = 0; i < doc.querySelectorAll(elTag).length; i++) {
            var element = doc.querySelectorAll(elTag)[i];
            if (element.innerText != undefined && element.tagName != "HTML" && element.tagName != "BODY" && element.tagName != "HEAD") {
                if (index != null && index != undefined) {
                    if (element.innerText.toLowerCase().indexOf(searchText.toLowerCase()) == index) {
                        array.push(element)
                    }
                } else {
                    if (element.innerText.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        array.push(element)
                    }
                }
            }
        }
    }
    var element = ""
    if (elTag == null || elTag == undefined) {
        element = document.createElement("div")
        element.innerText = searchText
    } else {
        element = document.createElement(elTag)
        element.innerText = searchText
    }
    if (array[array.length - 1] == undefined) {
        return element
    }
    return array[array.length - 1]
}
function getElementsByInnerText(doc, searchText, index, elTag) {
    var array = []
    if (elTag == null || elTag == undefined) {
        for (let i = 0; i < doc.querySelectorAll("*").length; i++) {
            var element = doc.querySelectorAll("*")[i];
            if (element.innerText != undefined && element.tagName != "HTML" && element.tagName != "BODY" && element.tagName != "HEAD") {
                if (index != null && index != undefined) {
                    if (element.innerText.toLowerCase().indexOf(searchText.toLowerCase()) == index) {
                        array.push(element)
                    }
                } else {
                    if (element.innerText.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        array.push(element)
                    }
                }

            }
        }
    } else {
        for (let i = 0; i < doc.querySelectorAll(elTag).length; i++) {
            var element = doc.querySelectorAll(elTag)[i];
            if (element.innerText != undefined && element.tagName != "HTML" && element.tagName != "BODY" && element.tagName != "HEAD") {
                if (index != null && index != undefined) {
                    if (element.innerText.toLowerCase().indexOf(searchText.toLowerCase()) == index) {
                        array.push(element)
                    }
                } else {
                    if (element.innerText.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        array.push(element)
                    }
                }
            }
        }
    }
    var element = ""
    if (elTag == null || elTag == undefined) {
        element = document.createElement("div")
        element.innerText = searchText
    } else {
        element = document.createElement(elTag)
        element.innerText = searchText
    }
    if (array.length == 0) {
        array.push(element)
    }
    return array
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
function uniqueArray(things) {
    return things.filter((thing, index) => {
        var _thing = JSON.stringify(thing);
        return index === things.findIndex(obj => {
            return JSON.stringify(obj) === _thing;
        });
    });
}
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
function howManyDaysBetween(a, b) {
    var date1 = new Date(a.getFullYear() + "/" + (a.getMonth() + 1) + "/" + a.getDate())
    var date2 = new Date(b.getFullYear() + "/" + (b.getMonth() + 1) + "/" + b.getDate())

    return parseInt(Number((date1 - date2) / 1000 / 60 / 60 / 24), 10)
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function notify(title, msg, link, callback) {
    if (Notification.permission === "granted") {
        var notifOptions = {
            type: 'basic',
            iconUrl: '/lib/icons/64.png',
            title: title,
            message: msg,
        };
        chrome.notifications.onClicked.addListener(function () {
            window.open(link)
        })
        chrome.notifications.create(makeid(15), notifOptions, callback);

    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === 'granted') {
                installNotification = createInstallNotification();
            }
        })

    }

}
function getEmailDetails(emailId) {
    return new Promise((resolve, reject) => {
        authenticatedXhr("GET", `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}`, function (a, b, c) {
            resolve(JSON.parse(c))
        })
    })
}
function getEmailsIds() {
    return new Promise((resolve, reject) => {
        var nowdate = new Date()
        nowdate = nowdate.getTime()
        nowdate = new Date(nowdate - 1000 * 60 * 60 * 24 * 14)
        nowdate1 = new Date()
        nowdate1 = nowdate1.getTime()
        nowdate1 = new Date(nowdate1 - 1000 * 60 * 60 * 24 * 7)
        authenticatedXhr("GET", "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=" + `(from:(skoolbot.com) after:${nowdate1.getFullYear() + "/" + (nowdate1.getMonth() + 1) + "/" + nowdate1.getDate()}) OR (from:(classroom.google.com) after:${nowdate.getFullYear() + "/" + (nowdate.getMonth() + 1) + "/" + nowdate.getDate()})`, function (a, b, c) {
            if (c == undefined) {
                resolve([])
            } else {
                resolve(JSON.parse(c).messages)

            }
        })
    })
}
function authenticatedXhr(method, url, callback) {
    var retry = true;
    function getTokenAndXhr() {
        chrome.identity.getAuthToken({/* details */ },
            function (access_token) {
                if (chrome.runtime.lastError) {
                    callback(chrome.runtime.lastError);
                    return;
                }

                var xhr = new XMLHttpRequest();
                xhr.open(method, url);
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + access_token);

                xhr.onload = function () {
                    if (this.status === 401 && retry) {
                        // This status may indicate that the cached
                        // access token was invalid. Retry once with
                        // a fresh token.
                        retry = false;
                        chrome.identity.removeCachedAuthToken(
                            { 'token': access_token },
                            getTokenAndXhr);
                        return;
                    }

                    callback(null, this.status, this.responseText);
                }
                xhr.send();

            });
    }
    getTokenAndXhr()
}