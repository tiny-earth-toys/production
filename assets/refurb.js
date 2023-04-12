console.log("JavaScript is Connected")

let rmaInput = document.querySelector('#rma-input');
let itemIdField = document.querySelector('#item-ids');
let button = document.querySelector('#rmabutton');
let formBox = document.querySelector('#form-box')
let clearBtns = document.querySelectorAll('.clr-btn')
let tbody = document.querySelector('#tbody')
let table = document.querySelector('.table')
const key = 'patHLydcAFiYHoM73.d73ba76c658316ca63a1d8280d5e83e02ebe5a06782f1933ea637469b4bc29ff'
let bearer = 'Bearer ' + key 

rmaInput.addEventListener('keypress', function (e){
    if (e.key === 'Enter') {
        // code for enter
      
        e.preventDefault();
        let userInput = rmaInput.value
        if(document.querySelectorAll(".tablerow").length > 0){
            document.querySelectorAll(".tablerow").forEach(e => e.remove());
            console.log('found it')
        }

        //once an rma number is scanned in, the cursor will automatically move to the Scan Item Id's section
        document.getElementById("item-ids").focus()
        
        let url = 'https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tblnzuTSAlSf3AAKM/listRecords'
        //uses RMA number to search All orders Table for the specific order
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(
                {
                    filterByFormula:`{ShipStation RMA Num} = ${userInput}`
                })
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            if(data.records.length > 0){
                findCustomerIdRecord(data.records)
            } else {
                console.log("Error No Order found With this RMA")
                let errorNoToys = document.createElement("p")
                errorNoToys.innerText = `Error: No Order found With this RMA`;
                formBox.appendChild(errorNoToys);
            }
        })
        
    }
})

button.addEventListener('click', function(e){
    //console.log(document.getElementsByClassName("checkbox"))
    let refurbToyList = []
    for(let item of document.getElementsByClassName("checkbox")){
            if(item.checked){
                console.log(item)
                refurbToyList.push(item.id.trim())
            }
    }
    console.log(refurbToyList)

    let url = 'https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tblTq2NAfw9WMlWgu'

    // field id's used from refub table, Because field has space I have to use field ID
    // fldDzcbBGEDKz0qa5: RMA Num
    // fldeiQhavkgj7nPuG: Num Toys
    // ToysScannedIn: ToysScannedIn

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': "application/json"
        },
        body:JSON.stringify(
            {
                fields:{
                    fldDzcbBGEDKz0qa5: {
                        text:`${rmaInput.value}`
                    },
                    ToysScannedIn: `${refurbToyList}`,
                    fldeiQhavkgj7nPuG: `${refurbToyList.length} Toys`
                }
            })
    })
    .then(function (response)
        {
            //Must Wait for response before reloding to ensure date is uploaded into airtable
            window.location.reload() 
            return response.json()
        }     
    )

})
let str = '';
let timer = null;
itemIdField.addEventListener('keypress', function (e){

    str += e.key;
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        console.log('scanned:', str);
        str = '';   

        e.preventDefault()
        let itemIdText = itemIdField.value
        console.log(itemIdText)


        if(document.getElementById(`${itemIdText}`)){
            document.getElementById(`${itemIdText}`).classList.add("table-primary")
            document.getElementById(`${itemIdText}`).children[0].children[0].checked=true
        } else {
            
            
            let itemIdBox = document.createElement("tr");
            itemIdBox.id = itemIdText;
            itemIdBox.classList.add(itemIdText)
            itemIdBox.classList.add("table-primary")
            itemIdBox.classList.add("tablerow")
            tbody.appendChild(itemIdBox);

            let toyCheckboxtd = document.createElement("td");
            let toyIdInput = document.createElement("input");
            toyIdInput.type = "checkbox"
            toyIdInput.id = itemIdText
            toyIdInput.checked = true
            toyIdInput.classList.add("checkbox")
            toyIdInput.name = itemIdText
            toyCheckboxtd.appendChild(toyIdInput);
            itemIdBox.appendChild(toyCheckboxtd);

            let itemId = document.createElement("td");
            itemId.innerText = itemIdText;
            itemId.classList.add(itemIdText)
            itemId.classList.add("scanned-item")
            itemIdBox.appendChild(itemId);

            let toyName = document.createElement("td");
            itemIdBox.appendChild(toyName);

            let toyImage = document.createElement("td");
            itemIdBox.appendChild(toyImage);

            let buttontd =  document.createElement("td");
            let copyButton = document.createElement("button")
            copyButton.innerText = "Copy Id";
            copyButton.classList.add("copy-btn")
            copyButton.classList.add("btn")
            copyButton.classList.add("btn-secondary")
            buttontd.appendChild(copyButton);
            itemIdBox.appendChild(buttontd);

            let buttoncleartd =  document.createElement("td");
            let clearButton = document.createElement("button")
            clearButton.innerText = "Clear";
            clearButton.classList.add("clr-btn")
            clearButton.classList.add("btn")
            clearButton.classList.add("btn-danger")
            buttoncleartd.appendChild(clearButton);
            itemIdBox.appendChild(buttoncleartd);
        }
        clearBtns = document.querySelectorAll('.clr-btn')
        addEventListenerFunction();
        copyBtns = document.querySelectorAll('.copy-btn')
        copyButtonEventListenerFunction();
        checkboxes = document.querySelectorAll('.checkbox')
        checkBoxesEventListenerFunction();
        //clear id field after each scan
        itemIdField.value = ""
    }, 300);

})

//uses order number to find customer id record
function findCustomerIdRecord(datainput){
    console.log('Data input is here')
    console.log(datainput);
    if(datainput){
        let customerId = datainput[0]['fields']['Customer Id'][0]

        let url = `https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tblg3UDBboIf1S6oO/${customerId}`
       
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': bearer,
            },
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // console.log(data)
            if(data){
                console.log(data)
                listCurrentToys(data)
            } else{
                console.log('Error: No Data Found')
            }
        })

    }
}

//List current toys
function listCurrentToys(record){
    console.log('this is the record')
    console.log(record)
    let formData = record['fields']['Refurb Form Data']
    // let currentToysId = record['fields']['CurrentToys_Ids']
    // let currentToysName = record['fields']['CurrentToys_Names']
    // let currentToysImages = record['fields']['CurrentToys_Images']

    // console.log(currentToysImages)

    if(formData){

        for(let toy in formData){
            let re = /\(([^)]+)\)/
            let currentToysId = formData[toy].split('*?$')[2]
            let currentToysName = formData[toy].split('*?$')[0]
            let currentToysAgeGroup = formData[toy].split('*?$')[3]
            let rLocation = formData[toy].split('*?$')[4]
            let currentToysImages = re.exec(formData[toy].split('*?$')[1])[1]
            
            let currentToyBox = document.createElement("tr");
            currentToyBox.id = currentToysId
            currentToyBox.classList.add("tablerow")
            
            let toyCheckboxtd = document.createElement("td");
            let toyIdInput = document.createElement("input");
            toyIdInput.type = "checkbox"
            toyIdInput.id = currentToysId
            toyIdInput.classList.add("checkbox")
            toyIdInput.name = currentToysId
            toyCheckboxtd.appendChild(toyIdInput);
            currentToyBox.appendChild(toyCheckboxtd);
            
            
            
            let toyIdLabel = document.createElement("td")
            toyIdLabel.innerText = `${currentToysId}`;
            toyIdLabel.for = currentToysId;
            // toyIdLabel.classList.add("toy-label")
            currentToyBox.appendChild(toyIdLabel);
            
            let toyIdName = document.createElement("td")
            toyIdName.innerText = `${currentToysName}`;
            toyIdName.for = currentToysId;
            toyIdName.classList.add("toyIdName")
            currentToyBox.appendChild(toyIdName);

            let toyAgeGroup = document.createElement("td")
            toyAgeGroup.innerText = `${currentToysAgeGroup}`;
            toyAgeGroup.for = currentToysId;
            toyAgeGroup.classList.add("toyAgeGroup")
            currentToyBox.appendChild(toyAgeGroup);

            let rToyLocation = document.createElement("td")
            rToyLocation.innerText = `${rLocation}`;
            rToyLocation.classList.add("rLocation")
            currentToyBox.appendChild(rToyLocation);
            
            let toyImagetd = document.createElement("td");
            let toyImage = document.createElement("img");
            toyImage.src = `${currentToysImages}`;
            toyImage.width = "125"
            toyImage.height = "125"
            toyImagetd.appendChild(toyImage);
            currentToyBox.appendChild(toyImagetd);
            
            let buttontd =  document.createElement("td");
            let copyButton = document.createElement("button")
            copyButton.innerText = "Copy Id";
            copyButton.classList.add("copy-btn")
            copyButton.classList.add("btn")
            copyButton.classList.add("btn-secondary")
            buttontd.appendChild(copyButton);
            currentToyBox.appendChild(buttontd);

            let buttoncleartd =  document.createElement("td");
            let clearButton = document.createElement("button")
            clearButton.innerText = "Clear";
            clearButton.classList.add("clr-btn")
            clearButton.classList.add("btn")
            clearButton.classList.add("btn-danger")
            buttoncleartd.appendChild(clearButton);
            currentToyBox.appendChild(buttoncleartd);
            
            tbody.appendChild(currentToyBox)

        }

        clearBtns = document.querySelectorAll('.clr-btn')
        console.log(clearBtns)
        addEventListenerFunction();
        copyBtns = document.querySelectorAll('.copy-btn')
        copyButtonEventListenerFunction();
        checkboxes = document.querySelectorAll('.checkbox')
        checkBoxesEventListenerFunction();
    } else {
        let errorNoToys = document.createElement("p")
        errorNoToys.innerText = `Error: Could Not find toys for this Customer. Please Scan toys manually`;
        currentToysListDiv.appendChild(errorNoToys);
    }
}

function copyButtonEventListenerFunction(){
    for(let copyButton of copyBtns){
        copyButton.addEventListener('click', function(e){
            e.preventDefault()
            console.log(this.parentElement.parentElement)
            navigator.clipboard.writeText(this.parentElement.parentElement.id)
        })
    }
}

//this is called when new item id is scanned in and adds event listener to it
function addEventListenerFunction(){
    for(let clearButton of clearBtns){
        clearButton.addEventListener('click', function(e){
            e.preventDefault()
            this.parentElement.parentElement.remove()
        })
    }
}

//this is called when new item id is scanned in and adds event listener to it
function checkBoxesEventListenerFunction(){
    for(let box of checkboxes){
        box.addEventListener('click', function(e){
            // console.log(this.checked)
            if(this.checked){
                this.parentElement.parentElement.classList.add("table-primary")
            }else{
                this.parentElement.parentElement.classList.remove("table-primary")
            }
            // this.parentElement.parentElement.remove()
        })
    }
}