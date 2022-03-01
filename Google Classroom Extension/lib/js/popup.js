var MyServer = "https://extension.skoolbot.com/";
var b64c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"   // base64 dictionary
var b64u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"   // base64url dictionary
var b64pad = '='
chrome.runtime.sendMessage({ action: "resetIconText" });
var maxRequests = 8
var runningRequests = 0
var token = ""
var emailTable = new Vue({
    el: '#dataAfterLogin',
    data: {
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
                type: "Graded Assignments",
                emails: []
            },
            {
                type: "Private Messages",
                emails: []
            },
            {
                type: "Messages from SkoolBot",
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
        Teachers: [],
        assignments: []
    },
    methods: {
        onMouseIn: function (e) {
            while (e.getAttribute("data-field") == "" || e.getAttribute("data-field") == undefined) {
                if (e.tagName == "TR") {
                    return
                }
                e = e.parentElement
            }
            chrome.runtime.sendMessage({
                action: "resetWindowPreview",
            }, function () {
                chrome.runtime.sendMessage({
                    action: "openTableReviewer",
                    payload: {
                        element: e,
                        vuejs: emailTable._data,
                        type: e.getAttribute("data-field"),
                        categoryName: e.querySelector("td").innerText
                    }
                });
            });

        },
    },
    updated() {
        chrome.browserAction.getBadgeText({}, function (result) {
            if (result == '!') {
                if (emailTable.preview.filter(e => e.type == 'Urgent Items')[0].emails.length > 0) {
                    chrome.runtime.sendMessage({
                        action: "openTableReviewer",
                        payload: {
                            element: document.querySelector('.categoriesSkoolBot[data-field="Type4"]'),
                            vuejs: emailTable._data,
                            type: document.querySelector('.categoriesSkoolBot[data-field="Type4"]').getAttribute("data-field"),
                            categoryName: document.querySelector('.categoriesSkoolBot[data-field="Type4"]').querySelector("td").innerText
                        }
                    });
                } else if (emailTable.preview.filter(e => e.type == 'New Assignments')[0].emails.length > 0) {
                    chrome.runtime.sendMessage({
                        action: "openTableReviewer",
                        payload: {
                            element: document.querySelector('.categoriesSkoolBot[data-field="Type1"]'),
                            vuejs: emailTable._data,
                            type: document.querySelector('.categoriesSkoolBot[data-field="Type1"]').getAttribute("data-field"),
                            categoryName: document.querySelector('.categoriesSkoolBot[data-field="Type1"]').querySelector("td").innerText
                        }
                    });
                }

            }
            chrome.browserAction.setBadgeText({ text: "" }, function () {
                SetByKey('lastTimeBgRuns', { lastClicked: new Date().getTime() })
            })
        })
    },
    mounted() {

    },
})
document.querySelector("#loader").style.display = "block";
document.querySelector("#signInGoogle").style.display = "none";
chrome.storage.local.get(['lastData'], async function (result) {
    lastData = result.lastData || {
        emails: []
    }
    chrome.identity.getAuthToken({ interactive: false }, function (token1) {
        token = token1 || ""
        if (token == "") {
            document.querySelector("#signInGoogle").style.display = "block"
            document.querySelector("#loader").style.display = "none"
            document.querySelector("#dataAfterLogin").style.display = "none"
        } else {
            if (lastData == undefined || lastData.emails.length == 0) {
                getEmailsIds().then(async rsp => {
                    await setUpTheExtension("", rsp);
                })

            } else {
                if (Number(lastData.date.split('-')[1]) < new Date().getDate()) {
                    getEmailsIds().then(async rsp => {
                        await setUpTheExtension("", rsp);
                    })
                } else {
                    document.querySelector("#schoolStatusDate").querySelector("span").innerHTML = document.querySelector("#schoolStatusDate").querySelector("span").innerHTML + lastData.date
                    emailTable.emails = lastData.emails
                    emailTable.preview = lastData.preview
                    emailTable.Teachers = lastData.Teachers
                    emailTable.assignments = lastData.assignments
                    document.querySelector("#signInGoogle").style.display = "none"
                    document.querySelector("#loader").style.display = "none"
                    document.querySelector("#dataAfterLogin").style.display = "block"
                }


            }
        }
    });
    chrome.runtime.sendMessage({ action: "resetIconText" });
});

document.querySelector("#signoutbtn").addEventListener("click", async function () {
    chrome.runtime.sendMessage({ action: "clearLastEmails", });
    chrome.storage.local.set({ token: {}, lastData: undefined })
    window.location.reload()
})
var authorizeButton = document.querySelector("#signInGoogle");
var signoutButton = document.querySelector("#signoutbtn");

authorizeButton.onclick = () => {
    chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
        getEmailsIds().then(async rsp => {
            document.querySelector("#signInGoogle").style.display = "none"
            document.querySelector("#loader").style.display = "block"
            document.querySelector("#dataAfterLogin").style.display = "none"
            await setUpTheExtension("", rsp);
        })
    });
}
signoutButton.onclick = () => {
    chrome.identity.getAuthToken({ interactive: false }, function (access_token) {
        var url = 'https://accounts.google.com/o/oauth2/revoke?token=' + access_token;
        window.fetch(url);

        chrome.identity.removeCachedAuthToken({ token: access_token }, function () {
        });
    });
}

function setUpTheExtension(token, getemails1) {
    new Promise(async (resolve, reject) => {
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
        var getemails = []
        for (let i = 0; i < getemails1.length; i++) {
            while (runningRequests >= maxRequests) {
                await sleep(1000)
            }
            runningRequests++
            getEmailDetails(getemails1[i].id)
                .then((rsp) => {
                    runningRequests--
                    getemails.push(rsp)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        while (runningRequests > 0) {
            await sleep(1000)
        }
        getemails = getemails.filter(e => e.payload.parts.filter(e => e.mimeType == "text/html")[0].body.data != "")
        for (let i = 0; i < getemails.length; i++) {
            var obj = getemails[i];
            obj.payload.parts.filter(e => e.mimeType == "text/html")[0].body.data = base64_decode(obj.payload.parts.filter(e => e.mimeType == "text/html")[0].body.data)

        }
        for (let i = 0; i < getemails.length; i++) {
            var obj = getemails[i];
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
                            var objValue = {
                                Class: tr.querySelector("div").innerText.split(' ' + tr.querySelector("div").querySelector("span").innerText)[0],
                                DueDate: tr.querySelector("div").querySelector("span").innerText.split("due ")[1],
                                assignmentName: tr.querySelectorAll("div")[1].innerText
                            }
                            emailTable.preview.filter(e => e.type == "Overdue/Late Assignments")[0].emails.push(objValue)
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
        for (let i = 0; i < getemails.length; i++) {
            var obj = getemails[i];
            var parser = new DOMParser();
            var doc = parser.parseFromString(obj.payload.parts.filter(e => e.mimeType == "text/html")[0].body.data, "text/html");
            var teacher = ""
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
                            ClassURL: classURL
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
                        emailTable.preview.filter(e => e.type == "New Questions")[0].emails.push(objValue)

                    } else {
                        emailTable.preview.filter(e => e.type == "New Questions")[0].emails.push(objValue)
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
                }
            }

        }
        for (let i = 0; i < getemails.length; i++) {


            var obj = getemails[i];
            var parser = new DOMParser();
            var doc = parser.parseFromString(obj.payload.parts.filter(e => e.mimeType == "text/html")[0].body.data, "text/html");
            var teacher = ""
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
        emailTable.emails = emailTable.emails.filter(e => e.numberOfItems != 0)
        var date = new Date(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate())
        document.querySelector("#schoolStatusDate").querySelector("span").innerHTML = document.querySelector("#schoolStatusDate").querySelector("span").innerHTML + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear()
        chrome.storage.local.set({
            lastData: {
                date: (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear(),
                emails: emailTable.emails,
                preview: emailTable.preview,
                Teachers: emailTable.Teachers,
                assignments: emailTable.assignments
            },
            token
        }, function () {
            document.querySelector("#signInGoogle").style.display = "none"
            document.querySelector("#loader").style.display = "none"
            document.querySelector("#dataAfterLogin").style.display = "block"
            resolve()
        })

    })

}
function PullByKey(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, data => {
            resolve(data)
        })

    })
}
function SetByKey(key, data, callback) {
    var obj = {}
    if (typeof key == 'object') {
        for (let i = 0; i < key.length; i++) {
            obj[key[i]] = data[i]
        }
    } else {
        obj[key] = data
    }
    chrome.storage.local.set(obj, callback)
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
function BtnLogin() {
    chrome.runtime.sendMessage({
        action: "Login",
    }, async function (token) {
        document.querySelector("#loader").style.display = "block";
        document.querySelector("#signInGoogle").style.display = "none";
        var getemails = await getEmails(token)
        await setUpTheExtension(token, getemails);

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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
const objectsEqual = (o1, o2) => {
    return typeof o1 === 'object' && Object.keys(o1).length > 0
        ? Object.keys(o1).length === Object.keys(o2).length
        && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
        : o1 === o2;
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
            resolve(JSON.parse(c).messages)
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