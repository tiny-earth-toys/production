
const planDisplay1 = document.querySelector('#plan-1__display');
const planDisplay2 = document.querySelector('#plan-2__display');
const planDisplay3 = document.querySelector('#plan-3__display');
const inputPlan1 = document.querySelector('#plan-1__tab');
const inputPlan2 = document.querySelector('#plan-2__tab');
const inputPlan3 = document.querySelector('#plan-3__tab');
let radioTabs = document.querySelectorAll('.plans-pricing__tab')




function displaySelectedPlan() {
  for (let i = 0; i < radioTabs.length; i++ ){
    let tabInput = radioTabs[i].firstElementChild
    if (tabInput.checked && tabInput.value === 'plan-1'){
      planDisplay1.classList.remove('hidden')
      planDisplay2.classList.add('hidden')
      planDisplay3.classList.add('hidden')
    } else if (tabInput.checked && tabInput.value === 'plan-2'){
      planDisplay1.classList.add('hidden')
      planDisplay2.classList.remove('hidden')
      planDisplay3.classList.add('hidden')
    } else if (tabInput.checked && tabInput.value === 'plan-3'){
      planDisplay1.classList.add('hidden')
      planDisplay2.classList.add('hidden')
      planDisplay3.classList.remove('hidden')
    }
  }
}

radioTabs.forEach(item => {
  item.addEventListener('click', event => {
    let tabInput = item.firstElementChild
    tabInput.checked = true 
    console.log('all radioTabs --', radioTabs)
  })
})


// radioTabs.forEach(function(tab){
//   console.log('event listener fired for radioTabs')
//   tab.addEventListener('click', function() {
//     let tabInput = tab.firstElementChild
//     if (prevCheckedTab !== null){
//       prevCheckedTab.checked = false
//     } else if (tabInput.checked){
//     prevCheckedTab = tabInput
//     console.log('prevCheckedTab --', prevCheckedTab)
//     }
//   })
//   displaySelectedPlan()
// })