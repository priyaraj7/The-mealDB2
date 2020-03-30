import $ from "jquery";
import "bootstrap"; // imports javascript
import "bootstrap/dist/css/bootstrap.min.css"; // imports styles
import Navigo from "navigo"; // //https://github.com/krasimir/navigo

import "./styles.css";

import { MealDB } from "./../src/meal-db.js";

$(document).ready(async function() {
  const router = new Navigo("/home", true, "#!");
  const routes = {
    "/home": () => {
      // callback function
      $(".output")
        .empty()
        .append("<h3>Search for receipe</h3>");
    },
    "/search/:q": async params => {
      const searchTerm = params.q;
      if (!searchTerm) {
        route.navigate("/home");
        return;
      }
      let mealRecipe = new MealDB();
      const response = await mealRecipe.searchRecipe(searchTerm); // This will call API
      renderSearchResults(response); // Update result
    },
    "/details/:id/:receipeName": {
      as: "receipe.details", // give name
      uses: async params => {
        // callback function
        if (params.id) {
          let mealRecipe = new MealDB();
          const response = await mealRecipe.getReceipeDetails(params.id);
          renderDetails(response);
        }
      }
    }
  };
  router.on(routes).resolve(); // https://github.com/krasimir/navigo for details

  $("#search-form").on("submit", ev => {
    ev.preventDefault();
    const searchTerm = $("#name").val();
    if (searchTerm) {
      router.navigate(`/search/${searchTerm}`);
    }
  });

  function renderSearchResults(response) {
    if (response) {
      const results = [];
      if (response && response.meals && response.meals.length) {
        let row;
        for (let i = 0; i < response.meals.length; i++) {
          const output = $("<div>").addClass("search-result-item");
          const meal = response.meals[i];

          if (i % 4 === 0) {
            row = $("<div>")
              .addClass("row")
              .appendTo(output);
          }
          const imgCol = $("<div>")
            .addClass("col-md-3 img p-2")
            .appendTo(row);

          $("<div>")
            .addClass("card")
            // .css({ width: "18rem" })
            .append(
              $("<img>")
                .addClass("card-img-top")
                .attr({
                  src: `${meal.strMealThumb}/preview`,
                  alt: `Image of ${meal.strMeal}`
                })
            )
            .append(
              $("<div>")
                .addClass("card-body")
                .append(
                  $("<h5>")
                    .addClass("card-title")
                    .append(
                      $("<a>")
                        .text(meal.strMeal)
                        .attr(
                          "href",
                          router.generate("receipe.details", {
                            id: meal.idMeal,
                            receipeName: meal.strMeal.replace(/\s/g, "-") // replace space with -
                          })
                        )
                        .text(meal.strMeal)
                    )
                )
            )

            .appendTo(imgCol);

          // $("<div>")
          //   .addClass("mealName")
          //   .append(
          //     $("<a>")
          //       .text(meal.strMeal)
          //       .attr(
          //         "href",
          //         router.generate("receipe.details", {
          //           id: meal.idMeal,
          //           receipeName: meal.strMeal.replace(/\s/g, "-") // replace space with -
          //         })
          //       )
          //   )
          //   .appendTo(imgCol);
          // $("<a>")
          //   .attr(
          //     "href",
          //     router.generate("receipe.details", {
          //       id: meal.idMeal,
          //       receipeName: meal.strMeal.replace(/\s/g, "-")
          //     })
          //   )
          //   .append(
          //     $("<img>")
          //       .addClass("mealImg")
          //       .attr("src", meal.strMealThumb)
          //   )
          //   .appendTo(imgCol);

          results.push(output);
        }
      } else {
        results.push(
          $("<div>").text("Sorry no results. Use a different search term")
        );
      }
      $(".output")
        .empty()
        .append(results);
    } else {
      $(".output").text(`There was an error handling your request. `);
      $(".outout").text(`Please check your inputs and try again!`);
    }
  }

  function renderDetails(details) {
    const results = [];
    for (let i = 0; i < details.meals.length; i++) {
      console.log(i);
      const meal = details.meals[i];
      const output = $("<div>").addClass("output");
      if (meal.strYoutube) {
        const videoUrl = new URL(meal.strYoutube);
        const videoId = videoUrl.searchParams.get("v");
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        const video = $("<iframe />").attr({
          src: embedUrl,
          frameborder: "0",
          allow: "autoplay; encrypted-media",
          allowfullscreen: true
        });

        video.appendTo($(output));
      }
      const row = $("<div>")
        .addClass("row")
        .appendTo(output);
      const imgCol = $("<div>")
        .addClass("col-md-6 img")
        .appendTo(row);

      $("<div>")
        .addClass("mealName")
        .data("idMeal", meal.idMeal)
        .text(meal.strMeal)
        .appendTo(imgCol);
      $("<img>")
        .addClass("mealImg")
        .attr("src", meal.strMealThumb)
        .appendTo(imgCol);

      const IngCol = $("<div>")
        .addClass("col-md-6 Ingredients")
        .appendTo(row);
      const ingredients = $("<div>")
        .addClass("Ingredients")
        .text("Ingredients")
        .appendTo(IngCol);

      for (let i = 1; i <= 20; i++) {
        const strIngredient = meal[`strIngredient${i}`];
        const strMeasure = meal[`strMeasure${i}`];
        if (strIngredient && strMeasure) {
          $("<li>")
            .text(`${strMeasure} ${strIngredient}`)
            .appendTo(ingredients);
        }
      }

      const instructions = $("<div>")
        .addClass("instruction")
        .text("Instructions")
        .appendTo(output);

      $("<div>")
        .addClass("instr")
        .text(meal.strInstructions)
        .appendTo(instructions);
      results.push(output);
    }
    $(".output")
      .empty()
      .append(results);
  }
});
