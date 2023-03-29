
const planDisplay1 = document.querySelector('#plan-1__display');
const planDisplay2 = document.querySelector('#plan-2__display');
const planDisplay3 = document.querySelector('#plan-3__display');
const inputPlan1 = document.querySelector('#plan-1__tab');
const inputPlan2 = document.querySelector('#plan-2__tab');
const inputPlan3 = document.querySelector('#plan-3__tab');
let radioTabs = document.querySelectorAll('.tab__input')



function displaySelectedPlan(tabInput) {
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


radioTabs.forEach(tab => {
  tab.addEventListener('click', event => {
    let tabInput = tab
    tabInput.checked = true 
    console.log('all radioTabs --', radioTabs)
    displaySelectedPlan(tabInput)
  })
})



function directToOnboarding(selling_plan, selectedProductId, selectedVariantId, planString, variantString) {
  console.log('productId--', selectedProductId);
  console.log('variantId--', selectedVariantId);
  console.log('selling_plan--', selling_plan);
  console.log('product Title --', planString);
  console.log('variant Title --', variantString);
  location.href = `./onboarding/?&plan=${planString}&variant=${variantString}&selling_plan=${selling_plan}&id=${selectedVariantId}`;
}

