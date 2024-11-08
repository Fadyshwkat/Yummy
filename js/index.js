let row = document.querySelector("#row");
let searchRow = document.querySelector("#searchRow");
let openBtn = document.querySelector(".open");
let closeBtn = document.querySelector(".close");
let linksList = document.querySelector(".links-list");
let category = document.querySelector(".category");
let ingridents = document.querySelector(".ingridents");
let nameInput =document.querySelector("#nameInput");
let emailInput =document.querySelector("#emailInput");
let ageInput =document.querySelector("#ageInput");
let phoneInput =document.querySelector("#phoneInput");
let passwordInput=document.querySelector("#passwordInput");
let repasswordInput=document.querySelector("#repasswordInput");
let contactRow = document.querySelector(".contact-row");

let userNameRegex = /^[a-zA-Z]{3,100}$/;
let phoneRegex = /^01[0125][0-9]{8}$/;
let ageRegex = /^(?:[1-9][0-9]?|100)$/;
let emailRegex = /^\S+@\S+\.\S+$/;
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

let randomMeals = [];

function showLoadingScreen() {
    document.getElementById("loadingScreen").classList.replace("d-none","d-flex");
  }

  function hideLoadingScreen() {
    document.getElementById("loadingScreen").classList.replace("d-flex","d-none");
  }

openBtn.addEventListener("click",function(){
    document.querySelector(".side-nav-menu").style.left=0;
    openBtn.classList.replace("d-block","d-none");
    closeBtn.classList.replace("d-none","d-block");
    for(let i = 0 ; i<5;i++){
        linksList.children[i].style.top="0"
    }
})
closeBtn.addEventListener("click",function(){
    document.querySelector(".side-nav-menu").style.left="-257px";
    openBtn.classList.replace("d-none","d-block");
    closeBtn.classList.replace("d-block","d-none");
    for(let i = 0 ; i<5;i++){
        linksList.children[i].style.top="300px"
    }
})

async function getRandomMeals() {
    showLoadingScreen();
    try{
        
        let request = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        let data = await request.json();
        for(let i = 0 ; i<20 ; i++){
        randomMeals.push(data.meals[i]);
        
        }
        displayMeals(randomMeals)
    }
    catch(error){
        console.log("Error fetching meals:",error)
    }
    finally{
        hideLoadingScreen()
    }
}
getRandomMeals();

function displayMeals(arr){
    let container = ``
    for(let i =0; i<arr.length;i++){
        container+=` <div onclick="displayMealInfo(this)" data-id=${arr[i].idMeal} class="col-sm-4 col-md-3 px-5 px-sm-3 px-md-2 ">
                        <div class="position-relative card p-0 overflow-hidden border-0">
                            <img class="w-100" src="${arr[i].strMealThumb}" alt="">
                            <div class=" position-absolute img-layer d-flex align-items-center justify-content-center fs-3 fw-semibold text-capitalize">${arr[i].strMeal}</div>
                        </div>
                    </div>`
    }
    row.innerHTML = container;
    
}
async function displayMealInfo(element) {
    showLoadingScreen();
    searchRow.classList.replace("d-flex","d-none");
    try{
        let mealId= element.dataset.id;
        let request = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        let data = await request.json();
        const meal = data.meals[0];
        let ingredientsHTML = '';

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== '') {
                ingredientsHTML += `<div class="recipes">${measure ? measure.trim() : ''} ${ingredient.trim()}</div>`;
            }
                                    }
        row.innerHTML = `
            <div class="col-md-4 px-5 px-sm-3 px-md-2">
                <div>
                    <img class="w-100 rounded-2" src="${meal.strMealThumb}" alt="">
                    <h3 class="mt-3">${meal.strMeal}</h3>
                </div>
            </div>
            <div class="col-md-8 px-5 px-sm-3 px-md-2">
                <h3>Instructions</h3>
                <p>${meal.strInstructions}</p>
                <h3>Area : ${meal.strArea}</h3>
                <h3>Category : ${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <div class="row my-3">
                    <div class="d-flex flex-wrap justify-content-start align-items-center px-4 gap-3 ">
                        ${ingredientsHTML}
                    </div>
                </div>
                <h3>Tags:</h3>
                <div class="mt-3">
                    <a target="_blank" href="${meal.strSource}"><button class="me-2 btn btn-success">Source</button></a>
                    <a target="_blank" href="${meal.strYoutube}"><button class="btn btn-danger">Youtube</button></a>
                </div>
            </div>`;
    }
    catch(error){
        console.log("Error fetching meals:",error);
    }
    finally{
        hideLoadingScreen();
    }
    
}
category.previousElementSibling.addEventListener("click",function(){
    document.querySelector(".side-nav-menu").style.left="-257px";
    openBtn.classList.replace("d-none","d-block");
    closeBtn.classList.replace("d-block","d-none");
    contactRow.classList.replace("d-block","d-none");
    row.innerHTML="";
    searchRow.classList.replace("d-none","d-flex");
})

async function searchByName(term) {
    showLoadingScreen();
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await response.json();
        const searchArr = data.meals || []; 
        displayMeals(searchArr);
    } catch (error) {
        console.error("Error fetching meals:", error);
    } finally {
        hideLoadingScreen(); 
    }
}

async function searchByFirstLetter(term) {
    if (!term || term.length !== 1 || !/[a-zA-Z]/.test(term)) {
        console.error("Please enter a single letter (A-Z).");
        return;
    }

    showLoadingScreen();
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
        const data = await response.json();

        const searchArr = data.meals || [];
        displayMeals(searchArr);
    } catch (error) {
        console.error("Error fetching meals:", error);
    } finally {
        hideLoadingScreen();
    }
}

category.addEventListener("click",function(){
    document.querySelector(".side-nav-menu").style.left="-257px";
    openBtn.classList.replace("d-none","d-block");
    closeBtn.classList.replace("d-block","d-none");
    searchRow.classList.replace("d-flex","d-none");
    contactRow.classList.replace("d-block","d-none");
    displayCategory();
})

async function displayCategory() {
    showLoadingScreen();
    try {
        
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        const data = await response.json();

        let container = ``
        for(let i =0; i<data.categories.length;i++){
            const str = data.categories[i].strCategoryDescription;
            const wordsArray = str.split(" ");
            const firstTenWords = wordsArray.slice(0, 20).join(" ");
            container+=` <div onclick="getCategoryItems(this)"  class="col-sm-4 col-md-3 px-5 px-sm-3 px-md-2 " data-name="${data.categories[i].strCategory}">
                            <div class="position-relative card p-0 overflow-hidden border-0 rounded-0">
                                <div class="image-container">
                                    <img class="w-100 filtered-image" src="${data.categories[i].strCategoryThumb}" alt="">
                                </div>
                                <div class=" position-absolute img-layer  fw-semibold text-capitalize text-center pt-2">
                                    <h4>${data.categories[i].strCategory}</h4>
                                    <p class="category-desc">${firstTenWords}</p>
                                </div>
                            </div>
                        </div>`
        }
        row.innerHTML = container;

    } catch (error) {
        console.error("Error fetching meals:", error);
    } finally {
        hideLoadingScreen(); 
    }

}

async function getCategoryItems(element) {
    showLoadingScreen();

    try{
            let category = element.dataset.name;
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            const data = await response.json();
            displayMeals(data.meals);
        }
    
    catch (error) {
        console.error("Error fetching meals:", error);
                } 
    finally {
        hideLoadingScreen(); 
    }
  

}

category.nextElementSibling.addEventListener("click",function(){
    document.querySelector(".side-nav-menu").style.left="-257px";
    openBtn.classList.replace("d-none","d-block");
    closeBtn.classList.replace("d-block","d-none");
    searchRow.classList.replace("d-flex","d-none");
    contactRow.classList.replace("d-block","d-none");
    displayArea();
})

async function displayArea() {
    showLoadingScreen();
    try {
        
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        const data = await response.json();
        
        let container = ``
        for(let i =0; i<data.meals.length;i++){
            container+=` <div onclick="getAreaItems(this)"  class="col-sm-4 col-md-3 text-center area-card" data-name="${data.meals[i].strArea}">
                                
                                <i class="fa-solid fa-house-laptop fa-4x"></i>
                                <h3>${data.meals[i].strArea}</h3>
                        </div>`
        }
        row.innerHTML = container;

    } catch (error) {
        console.error("Error fetching meals:", error);
    } finally {
        hideLoadingScreen(); 
    }

}

async function getAreaItems(element) {
    showLoadingScreen();

    try{
            let area = element.dataset.name;
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
            const data = await response.json();
            displayMeals(data.meals);
        }
    
    catch (error) {
        console.error("Error fetching meals:", error);
                } 
    finally {
        hideLoadingScreen(); 
    }
  

}
ingridents.addEventListener("click",function(){
    document.querySelector(".side-nav-menu").style.left="-257px";
    openBtn.classList.replace("d-none","d-block");
    closeBtn.classList.replace("d-block","d-none");
    searchRow.classList.replace("d-flex","d-none");
    contactRow.classList.replace("d-block","d-none");
    displayIngridents();
})

async function displayIngridents() {
    showLoadingScreen();
    try {
       
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
        const data = await response.json();
        
        let container = ``
        for(let i =0; i<20;i++){
            const str = data.meals[i].strDescription;
            const wordsArray = str.split(" ");
            const firstTenWords = wordsArray.slice(0, 20).join(" ");
            container+=` <div onclick="getIngridentsItems(this)"  class="col-sm-4 col-md-3 text-center area-card px-5 px-sm-3 px-md-3 px-lg-3 px-xl-1" data-name="${data.meals[i].strIngredient}">
                                
                                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                                <h3>${data.meals[i].strIngredient}</h3>
                                <p>${firstTenWords}</p>
                        </div>`
        }
        row.innerHTML = container;

    } catch (error) {
        console.error("Error fetching meals:", error);
    } finally {
        hideLoadingScreen(); 
    }
    
}

async function getIngridentsItems(element) {
    showLoadingScreen();

    try{
            let ingredient = element.dataset.name;
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
            const data = await response.json();
            displayMeals(data.meals);
        }
    
    catch (error) {
        console.error("Error fetching meals:", error);
                } 
    finally {
        hideLoadingScreen(); 
    }
  

}

ingridents.nextElementSibling.addEventListener("click",function(){
    document.querySelector(".side-nav-menu").style.left="-257px";
    openBtn.classList.replace("d-none","d-block");
    closeBtn.classList.replace("d-block","d-none");
    searchRow.classList.replace("d-flex","d-none");
    displayContact();
})

function displayContact(){
    row.innerHTML = "";
    searchRow.classList.replace("d-flex","d-none");
    contactRow.classList.replace("d-none","d-block");
    
}

function inputsValidation(regex,element){
    if (!regex.test(element.value)) {
        element.nextElementSibling.classList.add("d-block")
        element.nextElementSibling.classList.remove("d-none")
       
        return false
    }
    else {
        element.nextElementSibling.classList.add("d-none")
        element.nextElementSibling.classList.remove("d-block")
        return true  
    }

}
function repasswordValidation(element) {
    const passwordValue = passwordInput.value.trim();
    const repasswordValue = element.value.trim();
    const errorMessage = element.nextElementSibling; 

    if (repasswordValue !== passwordValue) {
        errorMessage.classList.add("d-block");
        errorMessage.classList.remove("d-none");
        return false;
    } else {
        errorMessage.classList.add("d-none");
        errorMessage.classList.remove("d-block");
        return true;
    }
}

function checkAllValidations() {
    

    if (inputsValidation(userNameRegex, nameInput) && inputsValidation(emailRegex, emailInput)
        && inputsValidation(phoneRegex, phoneInput) && inputsValidation(ageRegex, ageInput)  
        && inputsValidation(passwordRegex, passwordInput) && repasswordValidation(repasswordInput)) {
        document.querySelector("#submitBtn").removeAttribute("disabled");
    } else {
        document.querySelector("#submitBtn").setAttribute("disabled", "true");
    }
}

[nameInput, phoneInput, ageInput, emailInput, passwordInput, repasswordInput].forEach((input) => {
    input.addEventListener("input", checkAllValidations);
});