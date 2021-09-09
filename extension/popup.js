let saveResultsButton = document.getElementById("save");
saveResultsButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: sendSearchResults,
  });
});

const resultLabel = document.getElementById('result');
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    resultLabel.innerText = request.result
    resultLabel.className = ''
    resultLabel.classList.add(request.className)
  }
);

function sendSearchResults() {
  // TODO: Validate domain name of the current address
  const serverUrl = 'http://localhost:3000';
  const logServicePath = '/logs';

  let resultTitles = document.querySelectorAll('div#search div.g h3');
  let results = []

  for (const title of resultTitles) {
    if (title.innerText !== '') {
      results.push({title: title.innerText})
    }
  }

  if (results.length === 0) {
    chrome.runtime.sendMessage({
      result: "Could not get results, are you sure you're in a search page?",
      className: 'error'
    });

    return
  }

  fetch(serverUrl + logServicePath, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({results}),
  }).then(function (response) {
    chrome.runtime.sendMessage({result: 'Successfully logged results!', className: 'success'});
  }).catch(function (err) {
    chrome.runtime.sendMessage({result: `Something went wrong! ${err}`, className: 'error'});
  });
}
