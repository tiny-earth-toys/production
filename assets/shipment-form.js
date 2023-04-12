
console.log("JavaScript is Connected")

let orderNumInput = document.querySelector('#order-num-input');
let itemIdField = document.querySelector('#item-ids');
let orderNumButton = document.querySelector('#orderNumButton');
let formBox = document.querySelector('#form-box')
let clearBtns = document.querySelectorAll('.clr-btn');
let leftColumn = document.querySelector('#leftColumn')
let tbody = document.querySelector('#tbody');
let currentToysDiv = document.querySelector('#current-toys');
const key = 'patHLydcAFiYHoM73.d73ba76c658316ca63a1d8280d5e83e02ebe5a06782f1933ea637469b4bc29ff'
let bearer = 'Bearer ' + key 

//listens for new order number
orderNumInput.addEventListener('keypress', function (e){
    if (e.key === 'Enter') {
        e.preventDefault();
        let userInput = orderNumInput.value
        //clears table if new order number is input
        if(document.querySelectorAll(".tablerow").length > 0){
            document.querySelectorAll(".tablerow").forEach(e => e.remove());
        }
        document.getElementById("item-ids").focus()

        if(userInput){
            //once an rma number is scanned in, the cursor will automatically move to the Scan Item Id's section
            
            let url = 'https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tblnzuTSAlSf3AAKM/listRecords'
            //uses order number to search All orders Table for the specific order
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': "application/json"
                },
                body:JSON.stringify(
                    {
                        filterByFormula:`{Order Num} = ${userInput}`
                    })
            })
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                if(data){
                    console.log(data)
                    toysForValidation(data.records)
                } else {
                    console.log("Error No Order Num")
                }
            })
        }
    }
})

//Retrieves List of toys for validation
function toysForValidation(dataInput){
    console.log(dataInput[0].fields.Source)
    let source = dataInput[0].fields.Source
    let parsedToylist = source.split(":").reverse()[0]
    let toyList = parsedToylist.split(",")
    console.log(parsedToylist)
    console.log(toyList)
    
    

    for(let toy of toyList){
        toy = toy.trim()
        console.log(toy)
        
        let location;
        findToyLocation(toy)
        .then(function(data){
        location = data;

        let currentToyBox = document.createElement("tr");
        currentToyBox.id = toy
        currentToyBox.classList.add("tablerow")
        
        let toyCheckboxtd = document.createElement("td");
        let toyIdInput = document.createElement("input");
        toyIdInput.type = "checkbox"
        toyIdInput.id = toy
        toyIdInput.classList.add("checkbox")
        toyIdInput.name = toy
        toyCheckboxtd.appendChild(toyIdInput);
        currentToyBox.appendChild(toyCheckboxtd);
        
        
        let toyIdLabel = document.createElement("td")
        // toyIdLabel.classList.add("toy-label")
        currentToyBox.appendChild(toyIdLabel);
        
        toyIdName = document.createElement("td")
        toyIdName.innerText = `${toy}`;
        toyIdName.for = toy;
        toyIdName.classList.add("toy")
        currentToyBox.appendChild(toyIdName);

        let toyLocation = document.createElement("td")
        toyLocation.innerText = `${location}`;
        currentToyBox.appendChild(toyLocation);
    

        let buttoncleartd =  document.createElement("td");
        let clearButton = document.createElement("button")
        clearButton.innerText = "Clear";
        clearButton.classList.add("clr-btn")
        clearButton.classList.add("btn")
        clearButton.classList.add("btn-danger")
        buttoncleartd.appendChild(clearButton);
        currentToyBox.appendChild(buttoncleartd);
        
        tbody.appendChild(currentToyBox)
        clearBtns = document.querySelectorAll('.clr-btn')
        addEventListenerFunction();
        checkboxes = document.querySelectorAll('.checkbox')
        checkBoxesEventListenerFunction();
        });
    }
}

//retrieves Toy locations
async function findToyLocation(toy){
    let url = 'https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tbl4ZGinmS3xjtTPO/listRecords'
    
    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': "application/json"
        },
        body:JSON.stringify(
            {
                filterByFormula:`{Toy Name} = "${toy}"`
            })
    })
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        if(data.records.length > 0){
        
            if(data['records'][0]['fields']['FulfillmentStorageLocation (from All SKUs)']){
                // console.log(data['records'][0]['fields']['FulfillmentStorageLocation (from All SKUs)'])
                return data['records'][0]['fields']['FulfillmentStorageLocation (from All SKUs)']
            } else {
                console.log("Error No Toy Found")
                return '#######'
            }
        } else {
            return 'Not Found'
        }
    }) 
}

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

        let url = 'https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tblvzBSUJmmSXLq7x/listRecords'
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(
                {
                    filterByFormula:`{Item_Id} = "${itemIdText}"`
                })
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            matchToyScan(data)
        }) 

        function matchToyScan(data){
            let parentSkuName = ""
            if(data.records.length > 0){
                parentSkuName = data['records'][0]['fields']['Toy Name (from (Parent SKUs)']
                console.log(document.getElementById(`${parentSkuName}`))
            }
            //If item is found in all items Table
            if(document.getElementById(`${parentSkuName}`)){
                console.log('foundyou')
                document.getElementById(`${parentSkuName}`).classList.add("table-primary")
                document.getElementById(`${parentSkuName}`).children[0].children[0].checked=true
                document.getElementById(`${parentSkuName}`).children[1].innerText = `${itemIdText}`

                clearBtns = document.querySelectorAll('.clr-btn')
                addEventListenerFunction();
                checkboxes = document.querySelectorAll('.checkbox')
                checkBoxesEventListenerFunction();
            } else {
                let currentToyBox = document.createElement("tr");
                currentToyBox.id = itemIdText
                currentToyBox.classList.add("tablerow")
                currentToyBox.classList.add("table-danger")
                
                let toyCheckboxtd = document.createElement("td");
                let toyIdInput = document.createElement("input");
                toyIdInput.type = "checkbox"
                toyIdInput.checked = true
                toyIdInput.id = itemIdText
                toyIdInput.classList.add("checkbox")
                toyIdInput.name = itemIdText
                toyCheckboxtd.appendChild(toyIdInput);
                currentToyBox.appendChild(toyCheckboxtd);
                
                
                let toyIdLabel = document.createElement("td")
                toyIdLabel.innerText = `${itemIdText}`;
                toyIdLabel.for = itemIdText;
                toyIdLabel.classList.add("toy")
                currentToyBox.appendChild(toyIdLabel);
                
                toyIdName = document.createElement("td")
                currentToyBox.appendChild(toyIdName);

                let toyLocation = document.createElement("td")
                currentToyBox.appendChild(toyLocation);
            

                let buttoncleartd =  document.createElement("td");
                let clearButton = document.createElement("button")
                clearButton.innerText = "Clear";
                clearButton.classList.add("clr-btn")
                clearButton.classList.add("btn")
                clearButton.classList.add("btn-danger")
                buttoncleartd.appendChild(clearButton);
                currentToyBox.appendChild(buttoncleartd);
                
                tbody.appendChild(currentToyBox)

                clearBtns = document.querySelectorAll('.clr-btn')
                addEventListenerFunction();
                checkboxes = document.querySelectorAll('.checkbox')
                checkBoxesEventListenerFunction();
            }
        }
       
        //clear id field after each scan
        itemIdField.value = ""
    }, 300);

})

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
    numberOfChecks = document.querySelectorAll('input[type="checkbox"]:checked').length
    orderNumButton.innerHTML = `Submit ${numberOfChecks} Toys`
    for(let box of checkboxes){
        box.addEventListener('click', function(e){
            // console.log(this.checked)
            numberOfChecks = document.querySelectorAll('input[type="checkbox"]:checked').length
            orderNumButton.innerHTML = `Submit ${numberOfChecks} Toys`
            if(this.checked){
                //prevents users from checking the box if no Item ID
                if(this.parentElement.parentElement.children[1].innerText){
                    this.parentElement.parentElement.classList.add("table-primary")
                } else {
                    this.checked=false
                }
            }else{
                this.parentElement.parentElement.classList.remove("table-primary")
            }
            // this.parentElement.parentElement.remove()
        })
    }
}

orderNumButton.addEventListener('click', function(e){
    //console.log(document.getElementsByClassName("checkbox"))
    let shippingToyList = []
    for(let item of document.getElementsByClassName("checkbox")){
            if(item.checked){
                console.log(item.parentElement.parentElement.children[1].innerText)
                shippingToyList.push(item.parentElement.parentElement.children[1].innerText.trim())
            }
    }
    let shippingToyListLength = document.querySelectorAll('input[type="checkbox"]:checked').length

    let object = {
        fldYuOBxApM9ekJJp: parseInt(orderNumInput.value),
        fld6TFhVeQwTGvbqm: `${shippingToyListLength} Toys`,
        Location:['Shipping']
    }

    if(shippingToyList[0]){
        object['fldRZH6XRJBZvvBEA'] = {
                        text:`${shippingToyList[0]}`
                    }
    }
    if(shippingToyList[1]){
        object['fldr1gWIfGDPFWjeG'] = {
                        text:`${shippingToyList[1]}`
                    }
    }
    if(shippingToyList[2]){
        object['fldsMKB1j4PuseEXW'] = {
                        text:`${shippingToyList[2]}`
                    }
    }
    if(shippingToyList[3]){
        object['fldSxNAvRGcGrscOl'] = {
                        text:`${shippingToyList[3]}`
                    }
    }
    if(shippingToyList[4]){
        object['fldTveQs0zz83YpFW'] = {
                        text:`${shippingToyList[4]}`
                    }
    }
    if(shippingToyList[5]){
        object['fldfKeX21hPBR56mO'] = {
                        text:`${shippingToyList[5]}`
                    }
    }
    if(shippingToyList[6]){
        object['fldFexIGbAT9GkmZU'] = {
                        text:`${shippingToyList[6]}`
                    }
    }
    if(shippingToyList[7]){
        object['fld5jWZHchHnmqgYC'] = {
                        text:`${shippingToyList[7]}`
                    }
    }
    if(shippingToyList[8]){
        object['fldjgPDMFKn4Fucr0'] = {
                        text:`${shippingToyList[8]}`
                    }
    }
    if(shippingToyList[9]){
        object['fldpOzaWwK7LHuTN8'] = {
                        text:`${shippingToyList[9]}`
                    }
    }
    if(shippingToyList[10]){
        object['fldWupRSliLlM1Bwo'] = {
                        text:`${shippingToyList[10]}`
                    }
    }
    if(shippingToyList[11]){
        object['fldcbiYS3d96fGYh6'] = {
                        text:`${shippingToyList[11]}`
                    }
    }
    
    console.log(shippingToyList)

    let url = 'https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tblX6bG0sc9MRBMl1'

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': "application/json"
        },
        body:JSON.stringify(
            {
                fields: object
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
