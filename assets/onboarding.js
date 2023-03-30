
const key = 'patHLydcAFiYHoM73.d73ba76c658316ca63a1d8280d5e83e02ebe5a06782f1933ea637469b4bc29ff';
let bearer = 'Bearer ' + key;
let previewForm = document.querySelector('.rec-form__container')
let displayHeader = document.querySelector('#rec-display__header')
let toyDisplay = document.querySelector('.rec-display__wrapper')
let displayButtons = document.querySelector('#rec-display__buttons')
let customerEmailField = document.querySelector('#email');
let dateField = document.querySelector('#birthdate-1');
let childNameField = document.querySelector('#child1-name')
let subVariant = document.querySelector('#subscription-variant');
let previewButton = document.querySelector('#preview-button');
let swapButton = document.querySelector('#swap-button');
let submitBtn = document.querySelector('#selected-toys__submit')
let swapWrapper = document.querySelector('#swap-wrapper')
let swapTitleWrapper = document.querySelector('#rec-swap__title-wrapper')
let swapDisplay = document.querySelector('#available__container')
let selectFilter = document.querySelector('#swap-age__select')
let yourSelectionsDisplay = document.querySelector('#your-selections__display')

let toyNameList = []
let toyRecordIdList = []
let recommendedToys = []
let selectedToys = []
let selectedSkuList = []
let feedback = "This is Example Feedback"

// console.log('Javascript Connected');
const urlParams = new URLSearchParams(window.location.href)
const selectedPlan = urlParams.get("plan")
const selectedVariant = urlParams.get("variant")
const sellingPlan = urlParams.get('selling_plan')
const variantId = urlParams.get('id')
subVariant.value = selectedVariant
// console.log('selectedPlan is --', selectedPlan)
// console.log('selectedVariant is --', selectedVariant)
// console.log('subvariant.value is --', subVariant.value)
let yourPlanWrapper = document.createElement('div')
yourPlanWrapper.innerHTML = `
  <div id="your-plan__container">
  <div class="your-plan__card">
    <div class="your-plan__title">
      <h4 class="m0">Your selected plan</h4>
    </div>
    <div class="your-plan__info">
      <h5 class="m0">${selectedPlan}</h5>
      <h5 class="m0">${selectedVariant} toy kit</h5>
    </div>
    </div>
  </div>
  ` 
    yourSelectionsDisplay.appendChild(yourPlanWrapper)



function getAgeInMonths(childDOB) {
  console.log('getMonthAge triggered')
  //get current date
  const currentDate = new Date()
  // Calculate the difference in months between the dates
  const monthsAge = (currentDate.getFullYear() - childDOB.getFullYear()) * 12 + (currentDate.getMonth() - childDOB.getMonth());
  // Return the number of months
  return monthsAge;
}

// determines the lower month of the age range the child falls into
function lowerMonth(ageInMonths){
  if(ageInMonths%2 == 0){
      return ageInMonths
  } else {
      return ageInMonths - 1
  }
}

// finds the age range category the child falls into
function getAgeRange(lowerMonthAge){
  if(lowerMonthAge >= 56){
      return "56+ Months"
  } else {
      return `${lowerMonthAge}-${lowerMonthAge + 2} Months`
  }
}

function swapLowerMonth(ageInMonths){
  if(ageInMonths%4 == 0){
      return ageInMonths
  } else if(ageInMonths%4 == 1){
      return ageInMonths - 1
  } else if(ageInMonths%4 == 2){
      return ageInMonths - 2
  } else {
      return ageInMonths - 3
  }
}

function getSwapRange(swapLowerMonthAge) {
    console.log('getSwapRange triggered')
    if(swapLowerMonthAge >= 56){
      return "48 - 60"
  } else {
      return `${swapLowerMonthAge} - ${swapLowerMonthAge + 4}`
  }
 }

// matches childs age range to the correct age range record in 2month collections
function findCorrectAgeRecordInTwoMonthCollections(data, subscriptionNumber){
  let matchingRecord = data.records.find(rec => rec['fields']['Name'] == twoMonthAgeRange)
  if(matchingRecord){
      toyRecommendations(matchingRecord, subscriptionNumber)
  }else{
      console.log('No Match Found')
  }
}
// calls toyRecommendations(matchingRecord)

function pageRedirect(url) {
    window.location.href = url;
}

// removes a sku from the selected skus array
function removeFromSelectedSkus (skuToSwap) {
	for( let i =0; i < selectedToys.length; i++){
		if(selectedToys[i]['toySku'] === skuToSwap){
			selectedToys.splice(i,1);
			i--;
		}
    
	}
	// console.log(`item ${skuToSwap} was removed from selected skus array`, selectedToys)
}

function verifyNumOfToys () {
  if( selectedToys.length >= subscriptionNumber) {
    alert(`You already have ${subscriptionNumber} toys selected`)
    return;
  }
}

function addToSelectedToys (event, value) {
  const selectedToy = JSON.parse(value)
  console.log('selectedToy --- ', selectedToy.toySku)
  let selectedToyButton = document.getElementById(`${selectedToy.toySku}-button`)

  for(let i = 0; i < selectedToys.length; i++){
    if(selectedToy['toySku'] === selectedToys[i]['toySku']){
      selectedToyButton.disabled = true
      return alert('You already have this toy selected')
    }
  }

  if( selectedToys.length >=subVariant.value ){
    return alert(`You already have ${subVariant.value} toys selected`)
  } else {

	selectedToys.push(selectedToy)
	// console.log(`New toyObject added to selectedToys --`, selectedToys)

    //remove placeholder
  let placeholders = document.getElementsByClassName('replace')
  if(placeholders.length > 0){
    let firstPlaceholder = placeholders[0]
    firstPlaceholder.remove(firstPlaceholder)
  }

  //adds new toy card to display
  let toyCard = document.createElement('div')
      toyCard.setAttribute('id', `${selectedToy['toySku']}--rec-card`)
      toyCard.className = "toy-card-container"
      toyCard.innerHTML = `
      <div id=${selectedToy['toySku']} class="toy-card">
        <button class='button--swap' value=${selectedToy['toySku']} onclick='swapRecToy(event, value)'><strong>X</strong></button>
        <div class="toy-card__content-wrapper">
          <div class="toy-card__img-wrapper">
            <img src=${selectedToy['toyImgSrc']}>
          </div>
          <h5 class="center">${selectedToy['toyName']}</h5>
        </div>
      </div>
      `
      toyDisplay.appendChild(toyCard)
  }
}

function swapRecToy(event, recToySku) {
  event.preventDefault();
  // console.log('swap triggered');
  // removes sku from selectedToys array
  removeFromSelectedSkus(recToySku);
	// stop showing selected rec-card ${recToySku}--rec-card
  // console.log('recToySku looks like this ---', recToySku)
  cardToSwap = document.getElementById(`${recToySku}--rec-card`)
  cardToSwap.classList.add('replace')
  cardToSwap.innerHTML = `<div class="placeholder">
     <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-plus" viewBox="0 0 64 64"><path fill-rule="evenodd" d="M30 30V15h2v15h15v2H32v15h-2V32H15v-2h15z"/></svg>
     </div>`
  getAvailableToys()

}
//when clicked on available card this runs
function getAvailableToys(){
//api call to filter by age range
let childDOB = new Date(dateField.value)
let monthsAge = getAgeInMonths(childDOB)
let swapLowerMonthAge = swapLowerMonth(monthsAge)
let swapRange = getSwapRange(swapLowerMonthAge)

//if swapTitle exists remove it
if(document.getElementById('rec-swap__title')){
  let titleToRemove = document.getElementById('rec-swap__title')
  titleToRemove.remove(titleToRemove)
}

let filterSelectInput = document.getElementById('swap-age__select')
filterSelectInput.selectedIndex = 0

let swapTitle = document.createElement('div')
swapTitle.setAttribute('id', 'rec-swap__title')
swapTitle.innerHTML = `
<h3>Available toys</h3>
<h4>${swapRange} months</h4>
`
swapTitleWrapper.appendChild(swapTitle)

let jsonObject = {
  "fields": [
    "Parent SKU",
    "Toy Name",
    "Age Group For Shopify", 
    "Image (from Child SKUs)", 
    "Vendor for Shopify", 
    "Retail Price",
    "Available Inventory"
  ],
  "sort":[
    {
      "field":"Age Group For Shopify",
      "direction":"asc"
    }
  ],
  "filterByFormula":`AND({Available Inventory} > 1, FIND('${swapRange} months', ARRAYJOIN({Age Group For Shopify}, ', ')))`
}

let parentSkuTableUrl = "https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tbl4ZGinmS3xjtTPO/listRecords"
fetch(parentSkuTableUrl, {
  method: 'POST',
  headers: {
      'Authorization': bearer,
      'Content-Type': "application/json"
  },
  body:JSON.stringify(jsonObject)
})
.then(function (response) {
return response.json()
})
.then(function (data) {
// call function to display all of the available toys
displayAvailableToys(data);
})
}

function displayAvailableToys(data) {
  while(swapDisplay.firstElementChild){
    swapDisplay.removeChild(swapDisplay.firstElementChild)
  }
  
  let allAvailableToys = data.records
  console.log('allAvailableToys---', allAvailableToys)
  swapWrapper.classList.remove('hidden')
  for( let i = 0; i < allAvailableToys.length; i++){
    let inStockSku = allAvailableToys[i]['fields']['Parent SKU']
    let inStockImgSrc = allAvailableToys[i]['fields']['Image (from Child SKUs)'][0]['url']
    let inStockToyName = allAvailableToys[i]['fields']['Toy Name'] 
    let inStockToyRecordId = allAvailableToys[i]['id']
    let inStockCard = document.createElement('div')

    let selectToy = {
      toySku: `${inStockSku}`,
      toyName: `${inStockToyName}`,
      toyRecordId: `${inStockToyRecordId}`,
      toyImgSrc: `${inStockImgSrc}`
  }


    inStockCard.setAttribute('id', `${inStockSku}-card`)
    inStockCard.classList.add('instock-card-wrapper')
    inStockCard.innerHTML = `
      <button id="${inStockSku}-button" class="available-card" value='${JSON.stringify(selectToy)}' onclick='addToSelectedToys(event, value)'>
      <div class="instock-sku">
      <div class="toy-card__img-wrapper">
          <img src="${inStockImgSrc}">
        </div>
        <h5 class="center">${inStockToyName}</h5>
      </div>
      </button
    `
    swapDisplay.appendChild(inStockCard)
  }
}

function childNameCheck(value) {
  console.log('childNameCheck() triggered')
  if( !value ){
    return 'your child'
  } else { 
    return value
  }
}

function toyRecommendations(record, subscriptionNumber) {

  //renders next button & display header
  submitBtn.classList.remove('hidden')
  displayHeader.classList.remove('hidden')
  let displayHeaderContent = document.createElement('div')
  let childName = childNameCheck(childNameField.value)
  // console.log('childName value ---', childName)
  
  displayHeaderContent.innerHTML = `
  <h3>Our recommendations<br>for ${childName}</h3>
  <p>To change your toy selection, remove the toy you'd like to swap and pick a new one from below.  When satisfied with your selection click Next.</p>
  `
  displayHeader.appendChild(displayHeaderContent)
  let ageRangeRecord = record['fields']
  console.log('ageRangeRecord --', ageRangeRecord)
  let recToyNum = 1
  while(recToyNum <= subscriptionNumber){
    let recToyRecordId = ageRangeRecord[`Toy rec ${recToyNum}`]
    if(!recToyRecordId){
      let emptyCard = document.createElement('div')
      emptyCard.setAttribute('class', 'toy-card-container replace')
      emptyCard.setAttribute('id', `empty-card--${recToyNum}`)
      emptyCard.innerHTML = `
      <button class="placeholder-button" onclick='getAvailableToys()'>
      <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-plus" viewBox="0 0 64 64"><path fill-rule="evenodd" d="M30 30V15h2v15h15v2H32v15h-2V32H15v-2h15z"/></svg>
      </button>
      `
      toyDisplay.appendChild(emptyCard)
      recToyNum++
    }else{
      let recToySku = ageRangeRecord[`Parent SKU (from Toy rec ${recToyNum})`]
      let recToyRecordId = ageRangeRecord[`Toy rec ${recToyNum}`]
      let recToyName = ageRangeRecord[`Toy Name (from Toy rec ${recToyNum})`]
      let recToyImageUrl = ageRangeRecord[`Image (from Child SKUs) (from Toy rec ${recToyNum})`][0]['url']
      let toyObject = {
            toySku: `${recToySku[0]}`,
            toyName: `${recToyName}`,
            toyRecordId: `${recToyRecordId}`,
            toyImgSrc: `${recToyImageUrl}`
        }
      // push sku to recommendedToys 
      recommendedToys.push(toyObject)
      selectedToys.push(toyObject)
      
      // renders the cards
      let toyCard = document.createElement('div')
      toyCard.setAttribute('id', `${recToySku}--rec-card`)
      toyCard.className = "toy-card-container"
      toyCard.innerHTML = `
      <div id=${recToySku} class="swap-card">
        <button class='button--swap' value=${recToySku} onclick='swapRecToy(event, value)'><strong>X</strong></button>
        <div class="toy-card__content-wrapper">
          <div class="toy-card__img-wrapper">
            <img src=${recToyImageUrl}>
          </div>
          <div class="toy-card__text-container">
            <h5 class="center">${recToyName}</h5>
          </div>
        </div>
      </div>
      `
      toyDisplay.appendChild(toyCard)
      recToyNum++
  }
  console.log('recommendedToys array after Recommendations --', recommendedToys)
  console.log('selectedToys array after Recommendations --', selectedToys)
}
}

selectFilter.addEventListener("change", function() {
  let selectedAgeGroup = this.value
  console.log('selectedAgeGroup is ---', selectedAgeGroup)

  swapTitleWrapper.removeChild(swapTitleWrapper.firstChild)
  let swapTitle = document.createElement('div')
  swapTitle.setAttribute('id', 'rec-swap__title')
  swapTitle.innerHTML = `
  <h3>Available toys</h3>
  <h4>${selectedAgeGroup} months</h4>
  `
  swapTitleWrapper.appendChild(swapTitle)

  let jsonObject = {
    "fields": [
      "Parent SKU",
      "Toy Name",
      "Age Group For Shopify", 
      "Image (from Child SKUs)", 
      "Vendor for Shopify", 
      "Retail Price",
      "Available Inventory"
    ],
    "sort":[
      {
        "field":"Age Group For Shopify",
        "direction":"asc"
      }
    ],
    "filterByFormula":`AND({Available Inventory} > 1, FIND('${selectedAgeGroup} months', ARRAYJOIN({Age Group For Shopify}, ', ')))`
  }
  
  let parentSkuTableUrl = "https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tbl4ZGinmS3xjtTPO/listRecords"
  fetch(parentSkuTableUrl, {
    method: 'POST',
    headers: {
        'Authorization': bearer,
        'Content-Type': "application/json"
    },
    body:JSON.stringify(jsonObject)
})
  .then(function (response) {
    return response.json()
  })
  .then(function (data) {
  // call function to display all of the available toys
    console.log('returned data --',data)
    displayAvailableToys(data);
  })
})

// addEventListener to preview button that triggers onPreview function
function onSubmitPreview(){ 
    event.preventDefault();
    console.log('preview triggered');
    previewForm.style.display = "none"
    let childDOB = new Date(dateField.value)
    let subscriptionNumber = subVariant.value
    let emailInput = customerEmailField.value
    let monthsAge = getAgeInMonths(childDOB)
    // console.log('Age in Months --', monthsAge)
    let lowerMonthChildAge = lowerMonth(monthsAge)
    twoMonthAgeRange = getAgeRange(lowerMonthChildAge)
    // console.log(`childDOB is ${childDOB}`)
    // console.log(`age in months is ${monthsAge}`)
    // console.log(`number of toys is ${subscriptionNumber}`)
    // console.log(`email input is ${emailInput}`)
    

    let twoMonthCollectionTableUrl = "https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tblDKHSvnHKPghwf6/listRecords"
    fetch(twoMonthCollectionTableUrl, {
      method: 'POST',
      headers: {
          'Authorization': bearer,
          'Content-Type': "application/json"
      },
      body:JSON.stringify()
  })
  .then(function (response) {
    return response.json()
})
.then(function (data) {
    console.log('Two Month Collection Data---', data)
    
    findCorrectAgeRecordInTwoMonthCollections(data, subscriptionNumber)
})
}
// this goes to -->findCorrectAgeRecordInTwoMonthCollections(data)

function addProductToCart(selling_plan, selectedVariantId) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `/cart/add?selling_plan=${selling_plan}&id=${selectedVariantId}&quantity=1`);
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('add to cart successful');
    }
  };
  xhr.send();
}

function submitSelectedToys () {
  submitBtn.disabled = true
  console.log('submit triggered')
//Final Post to Airtable
  let recEnginerUrl = 'https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tbl5KzL6fw3l9gfyB'
  let subscriptionNumber = subVariant.value
  let emailInput = customerEmailField.value
  let childNameInput = childNameField.value
  let childDobInput = dateField.value
  
  if(selectedToys.length < subscriptionNumber){
    submitBtn.disabled = false
    return alert(`Oops.  It looks like you don't have enough toys. Please select ${subscriptionNumber-selectedToys.length} more.`)
  }
  //adds product to cart using the selling plan and variant id from the url
  addProductToCart(sellingPlan, variantId)
  //function loops over selectedToys[] and pushes toy names to toyNameList[] and toy record ids to toyRecordIdList
  console.log('selectedToys', selectedToys)
  console.log('selectedToys[0][toyName]', selectedToys[0]['toyName'])

  for( let i = 0; i < selectedToys.length; i++) {
    let name = selectedToys[i]['toyName']
    let recordId = selectedToys[i]['toyRecordId']
    let finalSku = selectedToys[i]['toySku']
    console.log(recordId)
    toyNameList.push(name)
    toyRecordIdList.push(recordId)
    selectedSkuList.push(finalSku)
  }

      console.log('final push check:')
      console.log('emailInput --', emailInput)
      console.log('childNameInput --', childNameInput)
      console.log('childDOBInput --', childDobInput)
      console.log('toyNameList --', toyNameList)
      console.log('toyRecordIdList--', toyRecordIdList)
      console.log('subscriptionNumber', subscriptionNumber)
      console.log('selectedSkuList --', selectedSkuList)

      fetch(recEnginerUrl, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': "application/json"
        },
        body:JSON.stringify(
            {
                fields:{
                    fldLYUEpjulx0VGEe:`${emailInput}`,
                    fld5l64MVTgep8HUu: `${childNameInput}`,
                    fldi4Pa0sAOVhxY8l: `${childDobInput}`,
                    fldcyJlAQP2SUoYvt: `${subscriptionNumber} Toys`,
                    fldTGRWlSbxl0iJCE: `${toyNameList.join(",")}`,
                    fldIjzUegA7HnjMdS: `${toyRecordIdList.join(",")}`,
                }
            })
        })
        .then(function (response) {
          console.log('final response ----')
          console.log(response.json()) 
          pageRedirect(`/cart?name=${childNameField.value}&dob=${dateField.value}&email=${customerEmailField.value}`)
      })
}