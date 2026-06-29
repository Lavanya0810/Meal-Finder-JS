let categoriesData = [];

window.onload = () => {
  loadCategories();

  document
    .getElementById("searchInput")
    .addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        searchMeals();
      }
    });
};

// Search meals
 async function searchMeals() {
  document.getElementById("detailsSection").style.display = "none";

  let search = document.getElementById("searchInput").value.trim();

  if (search === "") {
    alert("Enter meal name");
    return;
  }

  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`,
  );

  let data = await res.json();
  displayMeals(data.meals);
}


// Display meals
function displayMeals(meals) {
  let mealSection = document.getElementById("mealSection");

  document.getElementById("mealDetails").innerHTML = "";

  if (!meals) {
    mealSection.innerHTML = "<h2>No Meals Found</h2>";
    return;
  }

  let html = `
    <h2 class="meals-title">MEALS</h2>
    <div class="meals-grid">
  `;

  meals.forEach((meal) => {
    html += `
      <div class="card" onclick="showMeal('${meal.idMeal}')">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="card-content">

          <h3>${meal.strMeal}</h3>
          <p>${meal.strCategory || ""}</p>
        </div>
      </div>
    `;
  });

  html += `</div>`;

  mealSection.innerHTML = html;
  document.getElementById("categorySection").style.display = "block";
}


// Show meal details
async function showMeal(id) {
  document.getElementById("detailsSection").style.display = "block";

  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
  );

  let data = await res.json();
  let meal = data.meals[0];

  // Ingredients
  let ingredients = "";

  let measures = "";

  for (let i = 1; i <= 20; i++) {
    let item = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];

    if (item && item.trim() !== "") {
      ingredients += `
   <li>
   <span class="ingredient-number">${i}</span>
   ${item}
   </li>
   `;

    measures += `<li>${measure}</li>`;
    }
  }

  
  // Instructions
  let steps = meal.strInstructions.split(". ");
  let instructionHTML = "";

   steps.forEach((step, index) => {
    if (step.trim() !== "") {
      instructionHTML += `
     <div class="step">
     <i class="fa-regular fa-square-check"></i>
     <p>${step}</p>
     </div>
     `;
    }
  });

  document.getElementById("mealSection").innerHTML = "";

  document.getElementById("mealDetails").style.display = "block";
  document.getElementById("categorySection").style.display = "block";

  document.getElementById("mealDetails").innerHTML = `

   <div class="details-header">
   <i class="fa fa-home"></i>
   <span>${meal.strMeal.toUpperCase()}</span>
   </div>

   <h2>MEAL DETAILS</h2>

    <div class="recipe-box">

    <div class="top-details">

    <div class="recipe-image">

   <img src="${meal.strMealThumb}" alt="${meal.strMeal}">

   </div>

   <div class="recipe-info">

   <h2>${meal.strMeal}</h2>

   <p><b>Category:</b> ${meal.strCategory}</p>

   <p><b>Area:</b> ${meal.strArea}</p>

   <p>
   <b>Source:</b>
   <a href="${meal.strSource}" target="_blank">
   ${meal.strSource || "N/A"}
   </a>
   </p>

   <p>
   <b>Tags:</b> ${meal.strTags || "N/A"}
   </p>

   <div class="ingredients">

   <h3>Ingredients</h3>

   <ul>
   ${ingredients}
   </ul>

   </div>

   </div>

   </div>
   <div class="measure-box">

   <h3>Measures</h3>

   <ul>
   ${measures}
   </ul>

   </div>
      <div class="instructions">
        <h2>Instructions</h2>
        ${instructionHTML}
      </div>

    </div>
   `;

   window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
   });
   }


// Load categories
async function loadCategories() {
  document.getElementById("detailsSection").style.display = "none";

  let res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php",
   );

   let data = await res.json();
   categoriesData = data.categories;

   let container = document.getElementById("categoryContainer");
   container.innerHTML = "";

  data.categories.forEach((category) => {
    container.innerHTML += `
      <div class="card" onclick="searchMealsByCategory('${category.strCategory}')">
        
      <div class="category-name">
          ${category.strCategory}
        </div>

        <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
      </div>
    `;
  });
}


// Search meals by category
async function searchMealsByCategory(category) {
  document.getElementById("detailsSection").style.display = "none";

  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
  );

  let data = await res.json();

  let mealSection = document.getElementById("mealSection");
  let mealDetails = document.getElementById("mealDetails");

  mealDetails.innerHTML = "";

  let categoryInfo = categoriesData.find(
    (item) => item.strCategory === category,
  );

  mealSection.innerHTML = `
    <div class="category-description">
      <h2 class="category-title">${category}</h2>
      <p>${categoryInfo.strCategoryDescription}</p>
    </div>

    <h2 class="meals-title">MEALS</h2>

    <div class="meals-grid" id="categoryMeals"></div>
  `;

  let mealGrid = document.getElementById("categoryMeals");

  for (let meal of data.meals) {
    let res2 = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`,
    );

    let mealData = await res2.json();

    let fullMeal = mealData.meals[0];

    mealGrid.innerHTML += `
    <div class="card" onclick="showMeal('${meal.idMeal}')">

      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">

      <div class="card-content">

        <p>${fullMeal.strArea}</p>

        <h3>${meal.strMeal}</h3>

      </div>

    </div>
  `;
  }

  closeMenu();
}

// Open side menu
function openMenu() {
  document.getElementById("sideMenu").style.width = "250px";
}

// Close side menu
function closeMenu() {
  document.getElementById("sideMenu").style.width = "0";
}

function goHome() {
  document.getElementById("mealSection").innerHTML = "";
  document.getElementById("mealDetails").innerHTML = "";
  document.getElementById("detailsSection").style.display = "none";
  document.getElementById("categorySection").style.display = "block";
  document.getElementById("searchInput").value = "";

  loadCategories();
}
