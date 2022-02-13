var arrayrsp = []
var objOfResults = {}
var linksArray1 = [
    "https://www.goodhousekeeping.com/appliances/washer-reviews/g105/washing-machine-reviews/",
    "https://www.bestproducts.com/appliances/a13938132/reviews-front-and-top-loading-washing-machines/",
    "https://www.tomsguide.com/us/best-washing-machines,review-6208.html",
    "https://www.consumerreports.org/cro/washing-machines/buying-guide/index.htm",
    "https://www.thespruce.com/best-washing-machines-4107080",
    "https://www.usnews.com/360-reviews/washing-machines",
    "https://www.nytimes.com/wirecutter/reviews/the-best-washer-and-dryer/",
    "https://upgradedhome.com/washing-machine-brands-to-avoid/",
    "https://www.trendrr.net/6232/best-washing-machine-brands-of-the-world-10-top-seller-famous/",
    "https://www.webbspy.com/best-washing-machine-brands-in-the-world/",
    "https://www.marketing91.com/top-washing-machine-brands/",
    "https://www.designerappliances.com/blog/best-washing-machine/",
    "https://www.designerappliances.com/blog/best-washer-dryer-deals/",
    "https://www.bestwashingmachine.co.in/",
    "https://www.bobvila.com/articles/best-washing-machine/",
    "https://www.reviewed.com/laundry/best-right-now/the-best-top-load-washers",
    "https://www.reviewed.com/laundry/best-right-now/best-washers",
    "https://www.greengablesmotel.com.au/sell/5178-germany-washing-machine-brands.html",
    "https://www.grabon.in/indulge/shopping-tips/best-washing-machine-brands-in-india/",
    "https://www.realhomes.com/us/buying-guides/the-best-washing-machines",
    "https://www.t3.com/us/features/best-washing-machine",
    "https://www.pinterest.com/pin/419538521516136432/",
    "https://demo.joe-pl.com/sezjc7f/e9af3c-top-10-washing-machine-brands-in-world",
    "https://www.digitaltrends.com/home/best-washing-machines/",
    "https://www.quora.com/Which-is-the-best-washing-machine-to-buy-in-2020",
    "https://bestvalued.com/best-top-load-washing-machines",
    "https://www.bestbuy.com/site/shop/top-rated-washing-machines",
    "https://www.trustedreviews.com/best/best-washing-machine-3431783",
    "https://www.toptenreviews.com/best-front-load-washers",
    "http://thebestwashingmachines.com/",
    "https://bestwashingmachines.co.in/",
    "https://www.telegraph.co.uk/interiors/home/8-best-washing-machines/",
    "https://sites.google.com/a/rr.afsv.info/a934/HomeAppliances/compact-washer-washing-machine",
    "https://www.ranker.com/list/best-washing-machine-brands/werner-brandes",
    "https://www.bajajfinserv.in/insights/best-washing-machine-in-india",
    "https://www.canstarblue.com.au/appliances/front-loader-washing-machines/",
    "https://www.which.co.uk/reviews/washing-machines/article/which-washing-machine-brand/best-washing-machine-brands-a2Z6T7H782pB",
    "https://indiancompanies.in/top-7-best-washing-machine-brands-in-india/",
    "https://smarthomeguide.in/best-washing-machine-india/",
    "https://blog.yaleappliance.com/most-reliable-top-load-washers",
    "https://www.professionalcleanersuk.co.uk/best-buys/washing-machines",
    "https://hotdealszone.com/best-washing-machine-brands-in-india/",
    "https://indianhomeappliances.in/best-washing-machine-in-india/",
    "http://www.walkthroughindia.com/industry/10-most-popular-washing-machine-brands-in-india/",
    "https://www.appliancerepairmedic.com/washing-machine-brands",
    "https://www.digit.in/top-products/best-washing-machines-to-buy-on-amazon-india-538.html",
    "https://www.marketingmind.in/top-10-washing-machine-brands-in-india-2021-updated/",
    "https://www.cnet.com/topics/washing-machines/products/",
    "https://guide.alibaba.com/shopping-guides/top-10-washing-machine-brands.html",
    "https://www.visitbest.in/best-washing-machine-brands-in-india/",
    "https://applianceassistant.com/New-Appliances/Most-Reliable-Washing-Machines.php",
    "https://www.91mobiles.com/top-10-washing-machines-india",
    "https://www.reference.com/world-view/10-washing-machine-brands-bbb6d8ff694d6582",
    "https://www.homedepot.com/b/Appliances-Washers-Dryers-Washing-Machines-Top-Load-Washers/N-5yc1vZc3oc",
    "https://www.amazon.com/Best-Sellers-Appliances-Clothes-Washing-Machines/zgbs/appliances/13397491",
    "https://home-tech.com/39678/best-top-load-washers-for-2021/",
    "https://medium.com/@sumitmaurya920/top-10-washing-machine-cd941dd7dc69",
    "https://www.expertreviews.co.uk/washing-machines/8039/best-washing-machines",
    "https://k2appliances.com/top-10-best-front-load-washing-machine/",
    "https://ftpregistration.com/tag/washing-machine-brands-to-avoid-3d05fc",
    "https://ecodivegrenada.com/os4dv0ux/top-10-washing-machine-brands-in-world-0fbe04",
    "https://www.bijlibachao.com/appliances/best-washing-machine-india-brand-front-top-semi-automatic.html",
    "https://www.sears.com/appliances-washers-top-load-washers/b-1101278",
    "https://www.choice.com.au/home-and-living/laundry-and-cleaning/washing-machines/buying-guides/washing-machines",
    "https://www.mtoclean.com/best-washing-machine-cleaners/",
    "https://mytechietalk.com/best-washing-machine-in-india/",
    "https://en.wikipedia.org/wiki/Washing_machine",
    "https://www.techwishlist.com/2021/01/best-washing-machine-brands-india.html",
    "https://premierappliancestore.com/index.php?route=blog%2Farticle&article_id=148",
    "https://www.thetoptensite.com/Top_Ten_Washing-Machines.html",
    "https://10rate.com/best-budget-washing-machine-reviews/",
    "https://www.topten.eu/private/products/washing_machines",
    "https://www.shubz.in/top-10-fully-automatic-top-loading-washing-machines/",
    "https://topproducts.com/reviews/best-washing-machine.htm",
    "https://www.kitchenarena.in/best-washing-machine/",
    "https://www.reviews.in/best-front-loading-washing-machine.html",
    "https://sergio-pizza.pl/chinese/Aug_798/",
    "https://homeliness.in/best-front-load-washing-machines-in-india/",
    "https://www.greatbuyz.com/blog/best-fully-automatic-washing-machine-brands-india/",
    "https://news.yahoo.com/least-most-reliable-washing-machines-192503629.html",
    "https://inthewash.co.uk/washing-machines/best-washing-machine/",
    "https://www.ariel.in/en-in/washing-machine-101/choosing-a-washer/10-things-you-should-know",
    "https://recommendit.in/washing-machine-brands/",
    "https://thetoprated.in/top-10-washing-machine-brands-in-india.html",
    "https://reviewnxt.com/best-semi-automatic-washing-machine/",
    "https://techlifeware.com/best-washing-machines/",
    "https://mykitchenzone.in/top-10-best-washing-machines-under-15000-in-india-2020-complete-buyers-guide/",
    "https://www.caryatides.fr/pulverized/23402_top-washing-machine-brands-in-india/",
    "https://nymag.com/strategist/article/best-portable-washing-machines-compact-washers.html",
    "https://www.washingmachineportal.in/list-of-popular-washing-machine-brands-in-india/",
    "https://atkitchen.org/best-washing-machine-brands-india/",
    "https://www.homeplace.in/best-washing-machine-in-india/",
    "https://washingsolution.com/washing-machine-brands-to-avoid/",
    "https://gadgetsvila.com/best-washing-machine-under-40000/",
    "http://www.washing-machine-wizard.com/washing-machine-brands.html",
    "https://www.washingmachinebuy.com/",
    "https://www.gadgetsnow.com/compare-washingmachine",
    "https://bharatstories.com/top-10-best-washing-machine-brands-in-india/",
    "https://www.zestmoney.in/shop-smartly/best-semi-automatic-washing-machine"
]
var title11 = "top 10 washing machine brands"
var articlesDone = []
const ApiKey = "4f9cb2f0-8cca-11eb-8b49-ad00fbc9feff"
var maxRequests = 8
var runningRequests = 0
var articles = []
var articlesLength = 0
var maxRequestsReached = false
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg == "fetchURL") {
        fetch(request.url, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en-MA;q=0.9,en;q=0.8",
                "Access-Control-Allow-Origin": "*",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        })
            .then(response => {
                if (request.response_type == "json") {
                    return response.json()
                } else {
                    return response.text()
                }
            })
            .then(rsp => {
                sendResponse({ msg: "good", data: rsp })
            }).catch(err => {
                sendResponse({ msg: "error", data: err })
            })
    } else if (request.msg == "setUpExtension") {
        if (request.q == "") {
            sendResponse({ msg: "error" })
        } else {
            getURLSInGoogleSerach(request.q, request.exclude, request.include, request.number).then(rsp => {
                sendResponse({ msg: "good", dataId: rsp.dataId })
                window.open(chrome.extension.getURL("/lib/index.html") + `?dataId=${encodeURIComponent(rsp.dataId)}`)
            })
        }

    } else if (request.msg == "getArticlesDone") {
        if (JSON.stringify(objOfResults) != "{}") {
            chrome.storage.local.get(['storedData'], function (result) {
                result.storedData = result.storedData || {}
                chrome.storage.local.set({
                    storedData: {
                        ...result.storedData,
                        [objOfResults.dataId]: objOfResults
                    }
                }, function () {
                    sendResponse({
                        msg: "ArticlesAllDone",
                        dataId: objOfResults.dataId
                    })
                });
            });

        } else {
            if (articlesLength == 0) {
                sendResponse({
                    msg: "noArticles"
                })
            } else {
                sendResponse({
                    msg: "sendArticlesDone",
                    articlesDone,
                    articlesLength,
                    articles
                })
            }

        }

    }
    return true
})
function includeAll(text, array, ignorecap) {
    if (text == undefined || text == null) {
        return false
    }
    var result = true
    if (ignorecap == true) {
        for (let i = 0; i < array.length; i++) {
            var element = array[i].toLowerCase();
            if (text.trim().toLowerCase().indexOf(element.trim().toLowerCase()) == -1 && element.trim() != "") {
                result = false
            }
        }
    } else {
        for (let i = 0; i < array.length; i++) {
            var element = array[i].toLowerCase();
            if (text.trim().toLowerCase().indexOf(element.trim()) == -1 && element.trim() != "") {
                result = false
            }
        }
    }

    return result
}
function excludeAll(text, array, ignorecap) {
    if (text == undefined || text == null) {
        return false
    }
    var result = true
    if (ignorecap == true) {
        for (let i = 0; i < array.length; i++) {
            var element = array[i].toLowerCase();
            if (text.trim().toLowerCase().indexOf(element.trim().toLowerCase()) != -1 && element != "") {
                result = false
            }
        }
    } else {
        for (let i = 0; i < array.length; i++) {
            var element = array[i].toLowerCase();
            if (text.trim().toLowerCase().indexOf(element.trim()) != -1 && element.trim() != "") {
                result = false
            }
        }
    }

    return result
}
function getURLSInGoogleSerach(q, exc, inc, num1) {
    return new Promise((resolve, reject) => {
        var num = Number(num1 != "" && num1 != 0 ? num1 : 200)
        articlesDone = []
        objOfResults = {}
        articles = []
        articlesLength = 200
        chrome.runtime.sendMessage({
            msg: "sendArticlesDone",
            articlesDone,
            articlesLength,
            articles
        });
        var promises = []
        var numberLeft = num + 10
        var numberStart = 0
        while (numberLeft >= 100) {
            promises.push(zenserpApi(ApiKey, q, 100, numberStart))
            numberStart += 10
            numberLeft -= 100
        }
        if (numberLeft != 0) {
            promises.push(zenserpApi(ApiKey, q, numberLeft, numberStart))
        }
        if (promises.length > 0) {
            Promise.all(promises)
                .then(async (values) => {
                    var rsp = values[0]
                    for (let i = 1; i < values.length; i++) {
                        var element = values[i];
                        rsp.organic.push(...element.organic)
                    }
                    var linksArray = []
                    arrayrsp = []
                    rsp.organic.filter(e => e.url != undefined && includeAll(e.title, inc, true) == true && excludeAll(e.title, exc, true) == true).forEach(e => {
                        if (linksArray.filter(j => j.split("/")[2] == e.url.split("/")[2]).length == 0) {
                            linksArray.push(e.url)
                        }
                    });

                    articles = linksArray.slice(0, num)
                    articlesLength = articles.length
                    chrome.runtime.sendMessage({
                        msg: "sendArticlesDone",
                        articlesDone,
                        articlesLength,
                        articles
                    });
                    for (let i = 0; i < articlesLength; i++) {
                        var link = linksArray[i];
                        while (runningRequests >= maxRequests) {
                            await sleep(100)
                        }
                        if (link == undefined) {
                            break
                        }
                        runningRequests++
                        scrapLink(link)
                            .then((rsp3) => {
                                runningRequests--
                                articlesDone.push({ text: link, votedOn: rsp3 })
                                chrome.runtime.sendMessage({
                                    msg: "sendArticlesDone",
                                    articlesDone,
                                    articlesLength,
                                    articles
                                });
                            })
                            .catch((err) => {
                                runningRequests--
                                articles = removeItemOnce(articles, articles[i])
                                articlesLength--
                                i--
                                chrome.runtime.sendMessage({
                                    msg: "sendArticlesDone",
                                    articlesDone,
                                    articlesLength,
                                    articles
                                });
                            })
                    }
                    while (runningRequests > 0) {
                        await sleep(1000)
                    }

                    // arrayrsp = arrayrsp.filter(e => e.times != 1)
                    var arrayyy = []
                    for (let iiii = 0; iiii < arrayrsp.length; iiii++) {
                        var element = arrayrsp[iiii];
                        for (let iiiii = 0; iiiii < element.link.length; iiiii++) {
                            var element1 = element.link[iiiii];
                            if (arrayyy.filter(e => e.text == element1).length > 0) {
                                arrayyy.filter(e => e.text == element1)[0].votedOn = removeDups([...arrayyy.filter(e => e.text == element1)[0].votedOn, element.text])
                            } else {
                                arrayyy.push({
                                    text: element1,
                                    votedOn: [element.text]
                                })
                            }
                        }
                    }
                    articlesDone = arrayyy.sort(function (a, b) { return b.votedOn.length - a.votedOn.length })
                    var arrayFinal = []
                    for (let iiii = 0; iiii < articlesDone.length; iiii++) {
                        arrayFinal.push(articlesDone[iiii].text)
                    }
                    articles = arrayFinal
                    articlesLength = articles.length
                    chrome.runtime.sendMessage({
                        msg: "sendArticlesDone",
                        articlesDone,
                        articlesLength,
                        articles: articlesDone
                    });
                    objOfResults = {
                        data: arrayrsp.sort(function (a, b) { return b.times - a.times }),
                        articlesLength,
                        articles: articlesDone,
                        title: decodeURIComponent(q).trim(),
                        dataId: makeid(20)
                    }
                    chrome.storage.local.get(['storedData'], function (result) {
                        result = result || { storedData: {} }
                        chrome.storage.local.set({
                            storedData: {
                                ...result.storedData,
                                [objOfResults.dataId]: objOfResults
                            }
                        }, function () {
                            chrome.runtime.sendMessage({
                                msg: "ArticlesAllDone",
                                data: arrayrsp.sort(function (a, b) { return b.times - a.times }),
                                articlesLength,
                                articles: articlesDone,
                                title: decodeURIComponent(q).trim(),
                                dataId: objOfResults.dataId
                            });
                            resolve({
                                data: arrayrsp.sort(function (a, b) { return b.times - a.times }),
                                articlesLength,
                                articles: articlesDone,
                                title: decodeURIComponent(q).trim(),
                                dataId: objOfResults.dataId
                            })
                        });
                    });

                }).catch(err => {
                    chrome.runtime.sendMessage({
                        msg: "ApiDone",
                    });
                })
        } else {
            chrome.runtime.sendMessage({
                msg: "ApiDone",
            });
        }

    })

}
// 170
// zenserpApi(ApiKey, q, 100, 0)
// zenserpApi(ApiKey, q, 70, 10)
function zenserpApi(ApiKey, q, num, num1) {
    return new Promise((resolve, reject) => {
        fetch(`https://app.zenserp.com/api/v2/search?apikey=${ApiKey}&q=${encodeURIComponent(q)}&num=${num}&start=${num1}`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en-MA;q=0.9,en;q=0.8",
                "Access-Control-Allow-Origin": "*",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        })
            .then(response => {
                return response.json()
            })
            .then(rsp => {
                resolve(rsp)
            }).catch(err => {
                reject(err)
            })
    })

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function scrapLink(link) {
    return new Promise((reslove, reject) => {
        fetch(link, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en-MA;q=0.9,en;q=0.8",
                "Access-Control-Allow-Origin": "*",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        })
            .then(response => {
                return response.text()
            })
            .then(rsp => {
                chrome.storage.local.get(['storedKeyWords'], function (result) {
                    result = result || { storedKeyWords: [] }
                    if (scrapTexts(rsp, link, result.storedKeyWords).length == 0) {
                        reject([])
                    } else {
                        reslove(scrapTexts(rsp, link, result.storedKeyWords))
                    }

                })
            }).catch(err => {

                reject(err)
            })

    })
}
var results = /^(( \d+(\.|-|:|_)|\d+(\.|-|:|_)))/g
function scrapTexts(rsp3, link, keywords = []) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(rsp3.replace(/<script/g, "<div").replace(/<\/script/g, "</div").replace(/<link/g, "<div"), "text/html");
    var array = arrayrsp
    var elements = getElementsByText("", function (el, searchText) {
        var text = (el.innerText == undefined ? "" : el.innerText.trim())
        if (results.test(text) == true || el.tagName.toLowerCase() == "h1" || el.tagName.toLowerCase() == "h2" || el.tagName.toLowerCase() == "h3") {
            return true
        }
        return false
    }, doc)
    var array122 = []
    for (let i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.querySelector("a") != null) {
            continue
        }
        var text = element.innerText.split(",")[0]
        var arrayOfExcludeForEver = [
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
            "Site",
            ...keywords
        ]

        if (excludeAll(text, arrayOfExcludeForEver, true) == true) {
            var textValue = text.replace(results, "").split('\n')[0].trim()
            if (textValue != " " && textValue != "" && array122.filter(e => e.text == textValue).length == 0) {
                if (array.filter(e => e.text == textValue).length > 0) {
                    array.filter(e => e.text == textValue)[0].link = removeDups([...array.filter(e => e.text == textValue)[0].link, link])
                    array.filter(e => e.text == textValue)[0].times = array.filter(e => e.text == textValue)[0].link.length
                    array122.push({ text: textValue, link: link })
                } else {
                    array.push({
                        text: textValue,
                        times: [link].length,
                        link: [link]
                    })
                    array122.push({ text: textValue, link: link })
                }
            }
        }

    }
    return array122
}
function removeDups(names) {
    let unique = {};
    names.forEach(function (i) {
        if (!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
}
function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}
function removeItemOnce(arr1, value) {
    var arr = JSON.parse(JSON.stringify(arr1))
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function removeItemAll(arr1, value) {
    var arr = JSON.parse(JSON.stringify(arr1))
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}
function getElementsByText(searchText, check, doc = document) {
    var aTags = doc.querySelectorAll("*");
    var found = [];

    for (var i = 0; i < aTags.length; i++) {
        if (check(aTags[i], searchText)) {
            found.push(aTags[i])
        }
    }
    return found
}
function getElementByText(searchText, check, doc = document) {
    var aTags = doc.querySelectorAll("*");
    var found;

    for (var i = 0; i < aTags.length; i++) {
        if (check(aTags[i], searchText)) {
            found.push(aTags[i])
        }
    }
    return (found[0] != undefined ? found[0] : null)
}