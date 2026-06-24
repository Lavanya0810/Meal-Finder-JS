// API URLs
const categoryURL = "https://www.themealdb.com/api/json/v1/1/categories.php";
const searchURL = "http://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}";

const categoryContainer = document.getElementById("categoryContainer");
const mealContainer = document.getElementById("mealContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const popup = document.getElementById("popup");
const mealDetails = document.getElementById("mealDetails");
const closeBtn = document.getElementById("close");

// Load Categories
async function loadCategories() {

    const response = await fetch(categoryURL);
    const data = await response.json();

    displayCategories(data.categories);
}

loadCategories();


// Display Categories

function displayCategories(categories) {

    categoryContainer.innerHTML = "";

    categories.forEach(category => {

        categoryContainer.innerHTML += `
        <div class="card">

            <img src="${category.strCategoryThumb}">

            <h3>${category.strCategory}</h3>

            <p>${category.strCategoryDescription.substring(0,70)}...</p>

        </div>
        `;
    });

}


// Search Meals

searchBtn.addEventListener("click", searchMeal);

async function searchMeal(){

    const meal = searchInput.value.trim();

    if(meal === ""){
        alert("Please enter meal name");
        return;
    }

    const response = await fetch(searchURL + meal);
    const data = await response.json();

    displayMeals(data.meals);

}


// Display Meals

function displayMeals(meals){

    mealContainer.innerHTML="";

    if(meals == null){

        mealContainer.innerHTML="<h2>No Meal Found</h2>";

        return;
    }

    meals.forEach(item=>{

        mealContainer.innerHTML += `

        <div class="card" onclick="showMeal('${item.idMeal}')">

            <img src="${item.strMealThumb}">

            <h3>${item.strMeal}</h3>

        </div>

        `;

    });

}



// Show Meal Details

async function showMeal(id){

const response = await fetch(
`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
);

const data = await response.json();

const meal = data.meals[0];

mealDetails.innerHTML = `

<h2>${meal.strMeal}</h2>

<img src="${meal.strMealThumb}">

<p><strong>Category :</strong> ${meal.strCategory}</p>

<p><strong>Area :</strong> ${meal.strArea}</p>

<p>${meal.strInstructions}</p>

`;

popup.style.display="flex";

}


// Close Popup

closeBtn.onclick=function(){

popup.style.display="none";

}

window.onclick=function(e){

if(e.target==popup){

popup.style.display="none";

}

}