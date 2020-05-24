
let clans = [];
let searchingName = null;

var getPage = function(pageNumber, pageSize, searchName=null) {
    searchingName = searchName;
    sortingCriteria = $("#sort-criteria").val();
    if (!sortingCriteria.includes("createTime")){
        sortingCriteria += ",-createTime";
    }
    
    if (pageNumber === 1) {
      $(".first").addClass("disabled");
      $(".previous").addClass("disabled");
      $(".next").removeClass("disabled");
      $(".last").removeClass("disabled");
    } else {
      $(".first").removeClass("disabled");
      $(".previous").removeClass("disabled");
      $(".next").removeClass("disabled");
      $(".last").removeClass("disabled");
    }

    if (pageNumber === lastPage) {
      $(".first").removeClass("disabled");
      $(".previous").removeClass("disabled");
      $(".next").addClass("disabled");
      $(".last").addClass("disabled");
    }
    
    
    let filter = "";
    
    // Searchname will usually be [TAG] Name
    // But it could also very well be just the name and nothing else
    // So by checking the number of space separated elements it has we can know that
    if (searchName){
        const components = searchName.replace(/\[/gi, "").replace(/\]/gi, "").split(' ');
        const splitClan = [components.shift(), components.join(' ')];
        
        if (splitClan.length > 1){
            const tag = splitClan[0];
            const name = splitClan[1];
            filter = "&filter=tag=='"+tag+"';name=='"+name+"'";
        }
        else{
            const clue = splitClan[0];
            filter = "&filter=tag=='"+clue+"',name=='"+clue+"'";
        }
    }
  
    const route = apiURL + "/data/clan?"+
                   "sort="+sortingCriteria+"&"+
                   "include=leader&"+
                   "fields[clan]=name,tag,description,leader,memberships,createTime&"+
                   "fields[player]=login&"+
                   "page[number]="+pageNumber+"&"+
                   "page[size]="+pageSize+
                   filter;
    $.ajax({
        url: route,
        success: function (result) {
            makeClans(result);
            renderPage(document.getElementById("clans"), searchName);
        }
    });
};

const makeClans = function(entries){
    
    clans = [];
    let players = {};
    
    // Getting all leader names
    for (k in entries.included){
        const record = entries.included[k];
        
        if (record.type !== "player") continue;
        
        const playerId = record.id;
        players[playerId] = {
            name: record.attributes.login                
        }
        
    }
    
    // Populating clans
    for (k in entries.data){
        const record = entries.data[k];
        
        if (!searchingName && record.relationships.memberships.data.length <= 1) continue; // Still not interested in hermitages
        
        clans.push({
            name: record.attributes.name,
            tag: record.attributes.tag,
            createTime: record.attributes.createTime,
            leader: players[record.relationships.leader.data.id].name,
            population: record.relationships.memberships.data.length,
            id: record.id
        });
    }
}

var renderPage = function (element, searchName) {
    
    removeAllChildElements(element);    

    for(k in clans) {
        const clan = clans[k];
        const clanName = makeClanName(clan.name, clan.tag);

        // Only show player with matching id when player_id is given.
        if (searchName && !clanName.includes(searchName)) {
            continue;
        }
        
        const tr = document.createElement("tr");
        
        const id = clan.id;
        
        tr.addEventListener('click', function () { 
            window.location.href = "/clans/see?id="+id;
        });
        
        tr.style="cursor:pointer;";
        
        element.appendChild(tr);
        
        const name = document.createElement("td");
        const link = document.createElement("a");
        link.href = "/clans/see?id="+id;
        link.innerText = clanName;
        link.style = "font-weight:bold; color:inherit;"
        name.appendChild(link);
        tr.appendChild(name);
        
        const createTime = document.createElement("td");
        tr.appendChild(createTime);
        createTime.innerText = clan.createTime;
        
        const leader = document.createElement("td");
        tr.appendChild(leader);
        leader.innerText = clan.leader;
        
        const population = document.createElement("td");
        tr.appendChild(population);
        population.innerText = clan.population;
    }
};


/* Utilities */

var removeAllChildElements = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

/* Page Onclick */

$(".previous").click( function() {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  getPage(currentPage, pageSize);
});

$(".next").click( function() {
  if (currentPage === lastPage) {
    return;
  }
  currentPage++;
  getPage(currentPage, pageSize);
});

$(".first").click( function() {
  currentPage = 1;
  getPage(currentPage, pageSize);
});

$(".last").click( function() {
  currentPage = lastPage;
  getPage(currentPage, pageSize);
});

$(".last").click( function() {
  currentPage = lastPage;
  getPage(currentPage, pageSize);
});

$("#sort-criteria").change( function() {
  getPage(currentPage, pageSize);
});

// Sorting
const directions = {
    leader: 1,
    name: 1,
    create: -1,
    population: -1    
};
$("#sort-leader").click( function() {
    clans.sort(function(a, b){
        const nameA = a.leader.toLowerCase(), nameB=b.leader.toLowerCase()
        
        if (nameA < nameB) //sort string ascending
            return -1 * directions["leader"]
        if (nameA > nameB)
            return 1 * directions["leader"]
        
        return 0 
    })
    $(".sort-column").find("#direction").text("");
    $("#sort-leader").find("#direction").text( directions["leader"] > 0 ? "▲" : "▼" );
    directions["leader"] *= -1;
    renderPage(document.getElementById("clans"), searchingName);
});

$("#sort-name").click( function() {
    clans.sort(function(a, b){
        const nameA = a.name.toLowerCase(), nameB=b.name.toLowerCase()
        
        if (nameA < nameB) //sort string ascending
            return -1 * directions["name"]
        if (nameA > nameB)
            return 1 * directions["name"]
        
        return 0 
    })
    $(".sort-column").find("#direction").text("");
    $("#sort-name").find("#direction").text( directions["name"] > 0 ?  "▲" : "▼" );
    directions["name"] *= -1;
    renderPage(document.getElementById("clans"), searchingName);
});

$("#sort-create").click( function() {
    clans.sort(function(a, b){
        const dateA = new Date(a.createTime);
        const dateB = new Date(b.createTime);
        
        return (dateA - dateB)*directions["create"];
    })
    $(".sort-column").find("#direction").text("");
    $("#sort-create").find("#direction").text( directions["create"] > 0 ?  "▲" : "▼" );
    directions["create"] *= -1;
    renderPage(document.getElementById("clans"), searchingName);
});



$("#sort-population").click( function() {
    clans.sort(function(a, b){
        return (a.population - b.population)*directions["population"];
    })
    $(".sort-column").find("#direction").text("");
    $("#sort-population").find("#direction").text( directions["population"] > 0 ?  "▲" : "▼" );
    directions["population"] *= -1;
    renderPage(document.getElementById("clans"), searchingName);
});

var searchbar = document.getElementById("searchbar");

// Show label but insert value into the input:
new Awesomplete(searchbar, {
    list: clanList,
    minChars: 0,
    maxItems: 5
});

searchbar.addEventListener('awesomplete-select', function(e){
  var text = e.text;
  getPage(1, 100, text.value);
});

searchbar.addEventListener('awesomplete-selectcomplete', function(e){
  var text = e.text;
  $("#searchbar").val(text.label);
});

/* Init */
var pageSize = 100;
var currentPage = 1;
var init = function() {
  getPage(1, 100);
};

init();

function makeClanName(name, tag){
    return "["+tag+"] "+name;
}
