window.onload = () => {
    loadCategories();
};

// Search meals
async function searchMeals() {

    let search = document.getElementById("searchInput").value;

    if (search === "") {
        alert("Enter meal name");
        return;
    }

    let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
    );

    let data = await res.json();

    displayMeals(data.meals);
}

// Display meals
function displayMeals(meals) {

    let container = document.getElementById("mealContainer");

    container.innerHTML = "";

    if (!meals) {
        container.innerHTML = "<h2>No Meals Found</h2>";
        return;
    }

    meals.forEach(meal => {

        container.innerHTML += `
        <div class="card"
        onclick="showMeal('${meal.idMeal}')">

            <img src="${meal.strMealThumb}">

            <div class="card-content">
                <h3>${meal.strMeal}</h3>
                <p>${meal.strCategory || ""}</p>
            </div>

        </div>
        `;
    });
}

// Show meal details
async function showMeal(id){

let res = await fetch(
`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
);

let data = await res.json();

let meal = data.meals[0];


// Ingredients create cheyadam
let ingredients = "";

for(let i=1;i<=20;i++){

let item = meal[`strIngredient${i}`];
let measure = meal[`strMeasure${i}`];

if(item && item.trim()!=""){

ingredients += `
<li>${measure} ${item}</li>
`;

}

}


// Instructions step by step
let steps = meal.strInstructions.split(". ");

let instructionHTML="";

steps.forEach((step,index)=>{

if(step.trim()!=""){

instructionHTML += `
<div class="step">
<span>${index+1}</span>
<p>${step}</p>
</div>
`;

}

});



document.getElementById("mealDetails").innerHTML = `


<div class="recipe-box">


<div class="top-details">


<div class="recipe-image">

<img src="${meal.strMealThumb}">

<h2>${meal.strMeal}</h2>

<p>
<b>Category:</b> ${meal.strCategory}
</p>

<p>
<b>Area:</b> ${meal.strArea}
</p>

</div>



<div class="ingredients">

<h2>🍴 Ingredients</h2>

<ul>

${ingredients}

</ul>

</div>


</div>



<div class="instructions">

<h2>📝 Instructions</h2>

${instructionHTML}

</div>


</div>

`;

window.scrollTo({
top:document.body.scrollHeight,
behavior:"smooth"
});


}


// Load categories
async function loadCategories() {

    let res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
    );

    let data = await res.json();

    let container = document.getElementById("mealContainer");

    container.innerHTML = "";

    data.categories.forEach(category => {

        container.innerHTML += `
        
        <div class="card"
        onclick="searchMealsByCategory('${category.strCategory}')">

            <div class="category-name">
                ${category.strCategory}
            </div>

            <img src="${category.strCategoryThumb}">

        </div>

        `;
    });
}

// Category click
async function searchMealsByCategory(category) {

    let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );

    let data = await res.json();

    let container = document.getElementById("mealContainer");

    container.innerHTML = "";

    data.meals.forEach(meal => {

        container.innerHTML += `
        
        <div class="card"
        onclick="showMeal('${meal.idMeal}')">

            <img src="${meal.strMealThumb}">

            <div class="card-content">
                <h3>${meal.strMeal}</h3>
            </div>

        </div>

        `;
    });

    closeMenu();
}

// Menu
function openMenu(){
    document.getElementById("sideMenu").style.width = "250px";
}

function closeMenu(){
    document.getElementById("sideMenu").style.width = "0";
}