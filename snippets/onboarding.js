console.log('Javascript Connected');

let previewForm = document.querySelector('.rec-form__wrapper')
let displayHeader = document.querySelector('#rec-display__header')
let toyDisplay = document.querySelector('.rec-display__wrapper')
let displayButtons = document.querySelector('#rec-display__buttons')
let customerEmailField = document.querySelector('#email');
let dateField = document.querySelector('#birthdate-1');
let subVariant = document.querySelector('#subscription-variant');
let previewButton = document.querySelector('#preview-button');
let swapButton = document.querySelector('#swap-button');
let swapDisplay = document.querySelector('#available__container')

const key = 'patHLydcAFiYHoM73.d73ba76c658316ca63a1d8280d5e83e02ebe5a06782f1933ea637469b4bc29ff';
let bearer = 'Bearer ' + key;

let childDOB = dateField.value
console.log(`childDOB is ${childDOB}`)
let monthsAge = 56
console.log(`age in months is ${monthsAge}`)
let subscriptionNumber = subVariant.value
console.log(`number of toys is ${subscriptionNumber}`)
let emailInput = 'logan.atkinson@gmail.com'
console.log(`email input is ${emailInput}`)
// let toyNameList = []
// let toyRecordIdList = [] 
let recommendedSkus = []
let inStockSkus = []
let selectedSkus = []
let feedback = "This is Example Feedback"


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


// matches childs age range to the correct age range record in 2month collections
function findCorrectAgeRecordInTwoMonthCollections(data){

  let match = data.records.find(rec => rec['fields']['Name'] == twoMonthAgeRange)

  if(match){
      toyRecommendations(match)
  }else{
      console.log('No Match Found')
  }
}

function displayMySelections (selectedSkus) {
  console.log('display my selections triggered')
}

function displayAvailableToys (inStockSkus){
  console.log('display Available Toys triggered')
  inStockSkus.forEach((sku)=>{
    let skuCard = document.querySelector(`#${sku}`)
  })
  swapDisplay.classList.remove('visibility--hidden--js-only')
}

function availableToSwap(data) {
  console.log('available to swap triggered')
  let allParentSkuData = data['records']
  allParentSkuData.forEach(element => {
    if(element['fields']['Available Inventory'] > 0){
      inStockSkus.push(element['fields']['Parent SKU'])
    }
  })
  console.log('this are the instock skus array', inStockSkus)
  displayAvailableToys(inStockSkus)
}

function swapToy(event, skuToSwap) {
  event.preventDefault();
  console.log('swap triggered');
  console.log('sku to swap is---', skuToSwap)
  console.log('SELECTED SKUS ARRAY----', selectedSkus)
  console.log('RECOMMENDED SKUS ARRAY ----', recommendedSkus)

  let parentSkuTableUrl = "https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tbl4ZGinmS3xjtTPO/listRecords"
  fetch(parentSkuTableUrl, {
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
  // let allParentSkuData = data['records']
  // console.log('all parent sku data', allParentSkuData)
  console.log('all parent sku data', data)
  availableToSwap(data);
  displayMySelections(selectedSkus);
})
}

function toyRecommendations(record) {
  let ageRangeRecord = record['fields']
  let toyRecNum = 1
  while(toyRecNum <= subscriptionNumber){

      let recToySku = ageRangeRecord[`Parent SKU (from Toy rec ${toyRecNum})`]
        console.log(`recommended toy SKU is ${recToySku}`)

        recommendedSkus.push(recToySku)
        selectedSkus.push(recToySku)
      
      let recToyName = ageRangeRecord[`Toy Name (from Toy rec ${toyRecNum})`]
      let recToyImageUrl = ageRangeRecord[`Image (from Child SKUs) (from Toy rec ${toyRecNum})`][0]['url']
      let recToyAmountInStock = ageRangeRecord[`Available Inventory (from Toy rec ${toyRecNum})`]
      let toyCard = document.createElement('div')

      //hide preview form
      previewForm.className = "hide"
      displayHeader.classList.remove("hide")
      displayButtons.classList.remove("hide")
      
      toyCard.className = "rec-toy-card-container"
      toyCard.innerHTML = `
      <div id=${recToySku} class="toy-card">

        <div class="toy-card__content-wrapper">
          <h4>${recToyName}</h4>
          <p>Available: ${recToyAmountInStock}</p>
          <p>${recToySku}</p>
        </div>

        <div class="toy-card__img-wrapper">
        <img src=${recToyImageUrl}>
      </div>
      <div>
      <button id="swap-${recToySku}" value="${recToySku}" onclick="swapToy(event, value)">Swap this toy</button>
      </div>
      </div>
      `
      toyDisplay.appendChild(toyCard)
      toyRecNum++
  }
}


// addEventListener to preview button that triggers onPreview function
  previewButton.addEventListener('click', function(event){ 
    event.preventDefault();
    console.log('preview triggered');

    let lowerMonthChildAge = lowerMonth(monthsAge)
    twoMonthAgeRange = getAgeRange(lowerMonthChildAge)

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
    console.log('all of the data that is returned in json')
    console.log(data)
    
    findCorrectAgeRecordInTwoMonthCollections(data)
})
  });

//   // addEventListener to swap button that triggers onSwap function
//   swapButton.addEventListener('click', function(event){ 
//     event.preventDefault();
//     console.log('swap triggered');
//     console.log('SELECTED SKUS ARRAY----', selectedSkus)
//     console.log('RECOMMENDED SKUS ARRAY ----', recommendedSkus)

//     let parentSkuTableUrl = "https://api.airtable.com/v0/appBC1S2kJ5vrwSGL/tbl4ZGinmS3xjtTPO/listRecords"
//     fetch(parentSkuTableUrl, {
//       method: 'POST',
//       headers: {
//           'Authorization': bearer,
//           'Content-Type': "application/json"
//       },
//       body:JSON.stringify()
//   })
//   .then(function (response) {
//     return response.json()
//   })
//   .then(function (data) {
//     // let allParentSkuData = data['records']
//     // console.log('all parent sku data', allParentSkuData)
//     console.log('all parent sku data', data)
//     availableToSwap(data);
//     displayMySelections(selectedSkus);
//   })
// });

