const nameEl = document.getElementById("nameInput");
const urlEL = document.getElementById("urlInput");
const saveEl = document.getElementById("save-el");
const saveNameEl = document.getElementById("saveName");
const saveUrlEL = document.getElementById("saveUrl");
const saveButton = document.getElementById("save-btn");
const listEl = document.getElementById("entries");
const captureName = document.getElementById("captureNameBtn");
let captureUrl = document.getElementById("captureUrlBtn");
const removeEl = document.getElementById("remove-el");
let delEl = document.getElementsByClassName('fa-trash-can');
const displayEl = document.getElementById("display-el");
const displayHead = document.getElementById("display-head");
let totalleads = JSON.parse(localStorage.getItem("totalLeads"));
let myleads = JSON.parse(localStorage.getItem("myLeads"));
let delLeads = JSON.parse(localStorage.getItem("deletedleads"));
let delAllLeads = JSON.parse(localStorage.getItem("deletedallleads"));
let allLeads = [];
let leads = [];
let deletedLeads = [];
let deletedAllLeads = [];
if (delLeads) {
    deletedAllLeads = delAllLeads;
    deletedLeads = delLeads;
} else {
    deletedLeads = [];
    deletedAllLeads = [];
}
if (myleads) {
    allLeads = totalleads;
    leads = myleads;
    render(allLeads, myleads)
} else {
    allLeads = [];
    leads = [];
}

captureName.addEventListener("click", function() {
    const constUrl = new URL(urlEL.value);
    const domain = constUrl.hostname;
    const arr = (urlEL.value).split("/");
    let active = "";
    if (arr.lastIndexOf("") === arr.length - 1) {
        let tab = arr[arr.length - 2]
        active = arr[2] + " : " + tab;
    } else {
        let tab = arr[arr.length - 1]
        if (tab.includes("#")) {
            let tab = arr[arr.length - 2]
            active = arr[2] + " : " + tab;
        } else {
            let tab = arr[arr.length - 1]
            active = arr[2] + " : " + tab;
        }
    }
    nameEl.value = active;

})
captureUrl.addEventListener("click", function() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        urlEL.value = tabs[0].url
    })
})

function save() {
    let item = {
        url: urlEL.value,
        name: nameEl.value
    };
    allLeads.push(item);
    localStorage.setItem("myLeads", JSON.stringify(leads));
    localStorage.setItem("totalLeads", JSON.stringify(allLeads));
    render(allLeads, leads); // Corrected this line
    nameEl.value = "";
    urlEL.value = "";
    saveEl.value = "";
}

saveEl.addEventListener("click",function() {
    let savetype = saveEl.value;
    if (savetype === saveEl[1].value) {
        SaveNameInput();
    }
    if (savetype === saveEl[2].value) {
        SaveUrlInput();
    }
});
removeEl.addEventListener("click",function() {
    let removetype = removeEl.value;
    if (removetype === removeEl[1].value) {
        deleteItems();
    }
    if (removetype === removeEl[2].value) {
        clearAll();
    }
});

displayEl.addEventListener("click",function() {
  let displaytype = displayEl.value;
  if (displaytype === displayEl[1].value) {
      if (allLeads.length && leads.length) {
          displayHead.textContent = "Saved Entries";
          listEl.style.textAlign = "left";
          render(allLeads, leads);
          displayEl.value = "";
      } else {
          displayHead.textContent = "";
          listEl.textContent = "No Saved Entries";
          listEl.style.textAlign = "center";
          displayEl.value = "";
      }
  }
  if (displaytype === displayEl[2].value) {
      if ((deletedAllLeads.length > 0) && (deletedLeads.length > 0)) {
          displayHead.textContent = "Deleted Entries";
          listEl.style.textAlign = "left";
          render(deletedAllLeads, deletedLeads);
      }
      else {
          displayHead.textContent = "";
          listEl.textContent = "No Deleted Entries";
          listEl.style.textAlign = "center";
          displayEl.value = "";
      }
  }
}
);

function deleteItems() {
    let delEl = document.getElementsByClassName('fa-trash-can');
    for (let i = 0; i < delEl.length; i++) {
        delEl[i].style.display = "inline";
        delEl[i].id = "i-" + i;
        delEl[i].addEventListener("click", function() {
            deleteElement();
        })
    }
}

function deleteElement() {
    let el = event.target.parentNode.id;
    let item = document.getElementById(el);
    let itemValue = item.textContent;
    let leadsIndex = leads.findIndex(function(each) {
        if (each === itemValue) {
            return true;
        }

    });
    let allLeadsIndex = allLeads.findIndex(function(each) {
        if (Object.values(each).includes(itemValue)) {
            return true;
        }

    });
    let l = leads.splice(leadsIndex, 1);
    let al = allLeads.splice(allLeadsIndex, 1);
    deletedLeads.push(l);
    deletedAllLeads.push(al);
    listEl.removeChild(item);
    localStorage.setItem("myLeads", JSON.stringify(leads));
    localStorage.setItem("totalLeads", JSON.stringify(allLeads));
    localStorage.setItem("deletedleads", JSON.stringify(deletedLeads));
    localStorage.setItem("deletedallleads", JSON.stringify(deletedAllLeads));
    removeEl.value = "";

}

function clearAll() {
    if (displayEl.value === "deleted-entries") {
        deletedAllLeads = [];
        deletedLeads = [];
        localStorage.removeItem("deletedleads");
        localStorage.removeItem("deletedallleads");
        render(deletedAllLeads, deletedLeads)
        removeEl.value = ""
    } else {
        leads = [];
        allLeads = [];
        localStorage.removeItem("myLeads");
        localStorage.removeItem("totalLeads");
        render(allLeads, leads)
        removeEl.value = ""
    }
}

function SaveNameInput(myLeads) {
    const nameEl = document.getElementById("nameInput");
    leads.push(nameEl.value);
    save();

}

function SaveUrlInput(myLeads) {
    const urlEL = document.getElementById("urlInput");
    leads.push(urlEL.value);
    save();

}

function render(totalleads, myleads) {
    let item = "";
    if (((totalleads !== null) && (myleads !== null))) {
        for (let i = 0; i < myleads.length; i++) {
            item += `
            <li id="li-${i}"><i class="fa-solid fa-trash-can mr-3" style="display: none;"></i><a href="${totalleads[i].url}" target="_blank">${myleads[i]}</a></li>
            `;
        }
        listEl.innerHTML = item;
    }
}
