chrome.storage.local.get(["dataStored"], function (result) {
  chrome.extension.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.msg == "sendArticlesDone") {
      document.querySelector("#searchingDone").style.display = "none";
      document.querySelector("#noSearchingDone").style.display = "none";
      document.querySelector("#progressH1").innerHTML =
        request.articlesDone.length + " articles of " + request.articlesLength;
      document.querySelector("#searching").style.display = "block";
    }
    return true;
  });


  chrome.runtime.sendMessage({ msg: "getArticlesDone" }, function (response) {
    document.querySelector("#loadingExtension").style.display = "none";
    if (response.msg == "ArticlesAllDone") {
      document.querySelector("#ApiDone").style.display = "none";
      document.querySelector("#noSearchingDone").style.display = "none";
      document.querySelector("#searchingDone").style.display = "none";
      document.querySelector("#openResultsButton>a").href = chrome.extension.getURL("/lib/index.html") + `?dataId=${encodeURIComponent(response.dataId)}`;
      document.querySelector("#searchingDone").style.display = "block";
    } else if (response.msg == "noArticles") {
      document.querySelector("#ApiDone").style.display = "none";
      document.querySelector("#searchingDone").style.display = "none";
      document.querySelector("#noSearchingDone").style.display = "block";
    } else if (response.msg == "sendArticlesDone") {
      document.querySelector("#progressH1").innerHTML =
        response.articlesDone.length + " articles of " + response.articlesLength;
      document.querySelector("#ApiDone").style.display = "none";
      document.querySelector("#noSearchingDone").style.display = "none";
      document.querySelector("#searchingDone").style.display = "none";
      document.querySelector("#searching").style.display = "block";
    } else if (response.msg == "ApiDone") {
      document.querySelector("#noSearchingDone").style.display = "none";
      document.querySelector("#searchingDone").style.display = "none";
      document.querySelector("#ApiDone").style.display = "block";
    }
  });
  for (let i = 0; i < document.querySelectorAll("#scrapBtn").length; i++) {
    var element = document.querySelectorAll("#scrapBtn")[i];
    element.addEventListener("click", ScrapeBtn);
  }
  for (let i = 0; i < document.querySelectorAll("#excludeBtn").length; i++) {
    var element = document.querySelectorAll("#excludeBtn")[i];
    element.addEventListener("click", ExcludeBtn);
  }
});
function ScrapeBtn(e) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { msg: "startScrapping", exclude: e.target.parentElement.querySelector("#exclude").value.split(","), include: e.target.parentElement.querySelector("#include").value.split(","), number: e.target.parentElement.querySelector("#Articles").value });
  });
}
function ExcludeBtn() {
  window.open(chrome.extension.getURL("/lib/exclude.html"))
}