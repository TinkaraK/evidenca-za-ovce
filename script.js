"use strict";
let seznamOvac = [];
let id = 0;

/* brisanje ovce */
function domRemoveOvca(event) {
    const table_body = document.querySelector("#table_body");
    let target = event.target.closest('tr');
    if (confirm("Ali ste prepričani, da želite izbrisati ovco?")) 
        table_body.removeChild(target)
    let seznamOvacStorage = JSON.parse(localStorage.getItem("seznamOvac"));

    let newSeznamOvac = seznamOvacStorage.filter(element => element.ovcaID != target.firstChild.innerText)
    console.log(newSeznamOvac);
    localStorage.setItem("seznamOvac", JSON.stringify(newSeznamOvac));
}

/* vpis ovce v vnosno polje, brisi/shrani */
function domEditOrRemoveOvca(event) {
    let div = document.getElementById("urediovco");
    let modal = document.getElementById("modal-content");
    var span = document.getElementsByClassName("close")[0];
    span.onclick = () => {
            div.style.display = "none";
            console.log("zapri")
    }

    if (div.style.display === "none") {
        div.style.display = "block";
    }
    else {
        div.style.display = "none"
    }

    window.onclick = function(event) {
        console.log("klikam")
        console.log("target", event.target, "div", div)
        if (event.target != div || event.target != modal)
            //div.style.display = "none";
            console.log("zapiram")
    }


    let target = event.target.closest('tr');
    console.log(target.firstChild.innerText)
    let targetID = target.firstChild.innerText;
    let seznamOvacStorage = JSON.parse(localStorage.getItem("seznamOvac"));
    
    // nastavljanje pravih vrednosti
    seznamOvacStorage.forEach(ovca => {
        if (ovca.ovcaID == targetID) {
            document.querySelector("#ovcaIDUredi").value = ovca.ovcaID;
            document.querySelector("#ovcaIDUredi").readOnly = true;
            document.querySelector("#datumRojstvaUredi").value = ovca.datumRojstva
            document.querySelector("#pasmaUredi").value = ovca.pasma;
            document.querySelector("#mamaIDUredi").value = ovca.mamaID;
            document.querySelector("#oceIDUredi").value = ovca.oceID;
            document.querySelector("#steviloSorojencevUredi").value = ovca.steviloSorojencev;
            document.querySelector("#opombeUredi").value = ovca.opombe;
        }
    });

    // brisanje ovce
    let izbrisiButton = document.getElementById("izbrisi");
    izbrisiButton.onclick = () => {
       domRemoveOvca(event)
       div.style.display = "none";
    }

    // shranjevanje ovce
    let shraniButton = document.getElementById("shrani");
    shraniButton.onclick = function() {
        let updatedSeznamOvac = [];
        const table_body = document.querySelector("#table_body");
        table_body.innerHTML = "";
        console.log("shranjujem")
        seznamOvacStorage.forEach(ovca => {
            if (ovca.ovcaID == targetID) {
                ovca.ovcaID = document.querySelector("#ovcaIDUredi").value;
                ovca.datumRojstva = document.querySelector("#datumRojstvaUredi").value;
                ovca.pasma = document.querySelector("#pasmaUredi").value;
                ovca.mamaID = document.querySelector("#mamaIDUredi").value;
                ovca.oceID = document.querySelector("#oceIDUredi").value;
                ovca.steviloSorojencev = document.querySelector("#steviloSorojencevUredi").value;
                ovca.opombe = document.querySelector("#opombeUredi").value;
            }
            updatedSeznamOvac.push(ovca);
            domAddOvca(ovca);
        });
        localStorage.setItem("seznamOvac", JSON.stringify(updatedSeznamOvac));
        div.style.display = "none"

    }
}
let dataLabels = {"ovcaID": "ID ovce", "datumRojstva": "Datum rojstva","id": "id", "pasma": "Pasma", 
                    "mamaID": "ID mame", "oceID": "ID očeta", "opombe": "Opombe", "steviloSorojencev": "Število sorojencev"}
/* dodajanje ovce v tabelo */
function domAddOvca(ovca) {
    const table = document.querySelector("#ovceTable");
    const table_body = document.querySelector("#table_body");
    const tr = document.createElement("tr");
    const th = document.getElementById("id");
    table_body.appendChild(tr);

    for (const key in ovca) {
            const td = document.createElement("td");
            td.dataset.label = dataLabels[key]
            td.innerText = ovca[key];
            tr.appendChild(td);
    }

    tr.addEventListener('dblclick', function(e) {
        domEditOrRemoveOvca(e);
    });
}
 

/* dodajanje ovce */
function addOvca(event) {
    console.log("dodajam ovco")
    const ovcaID = document.querySelector("#ovcaID").value;
    const datumRojstva = document.querySelector("#datumRojstva").value;
    const pasma = document.querySelector("#pasma").value;
    const mamaID = document.querySelector("#mamaID").value;
    const oceID = document.querySelector("#oceID").value;
    const steviloSorojencev = document.querySelector("#steviloSorojencev").value;
    const opombe = document.querySelector("#opombe").value;

    document.querySelector("#ovcaID").value = "";
    document.querySelector("#datumRojstva").value = "";
    document.querySelector("#pasma").value = "";
    document.querySelector("#mamaID").value = "";
    document.querySelector("#oceID").value = "";
    document.querySelector("#steviloSorojencev").value = "";
    document.querySelector("#opombe").value = "";
    let exists = false;
    let seznamOvacStorage = JSON.parse(localStorage.getItem("seznamOvac"));
    seznamOvacStorage.forEach(ovca => {
        if (ovca.ovcaID == ovcaID) {
            window.alert("Ovca s to ID številko že obstaja.")
            exists = true;
        }
    });
    if (ovcaID == "") {
        window.alert("Vpišite ID številko ovce.")
        exists = true; // da se ne shrani, nima veze s tem da obstaja
    }
    if (!exists) {
        // Create ovca object
        const ovca = {
            ovcaID: ovcaID,
            datumRojstva: datumRojstva,
            pasma: pasma,
            mamaID: mamaID, 
            oceID: oceID,
            steviloSorojencev: steviloSorojencev,
            opombe: opombe,
        };
        seznamOvacStorage.push(ovca)
        localStorage.setItem("seznamOvac", JSON.stringify(seznamOvacStorage));
        
        domAddOvca(ovca);

    }

    document.getElementById("ovcaID").focus();
}

/* iskanje prave ovce po ID */
let search_input = document.querySelector("#find_input");
search_input.addEventListener("keyup", event => {
    let value = search_input.value;
    searchTable(value);
})

function searchTable(value) {
    const table_body = document.querySelector("#table_body");
    table_body.innerHTML = "";
    let seznamOvacStorage = JSON.parse(localStorage.getItem("seznamOvac"));
    seznamOvacStorage.forEach(ovca => {
        let ovcaID = ovca.ovcaID;
        if (ovcaID.includes(value)) {
            domAddOvca(ovca);
        }
    });
}



document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("dodajOvco").onclick = addOvca;
    document.getElementById("urediovco").style.display = "none";
    if (localStorage.getItem("seznamOvac")) {
        let seznamOvacStorage = JSON.parse(localStorage.getItem("seznamOvac"));
        seznamOvacStorage.forEach(ovca => {
            domAddOvca(ovca);
        });
    }
    else 
        localStorage.setItem("seznamOvac", "[]")
    
})
