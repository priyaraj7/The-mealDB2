import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import { MealDB } from "./../src/meal-db.js";

$(document).ready(function() {
  $("#recipe").click(function() {
    const name = $("#name").val();
    $("#name").val("");

    (async () => {
      let mealRecipe = new MealDB();
      const response = await mealRecipe.searchRecipe(name);
      getElements(response);
    })();

    function getElements(response) {
      if (response) {
        const results = [];
        for (let i = 0; i < response.meals.length; i++) {
          console.log(i);
          const meal = response.meals[i];
          const output = $("<div>").addClass("output");
          // const video = $("<video>")
          //   .addClass("video")
          //   .appendTo(output);
          // $("<source>")
          //   .addClass("youtube")
          //   .attr("src", meal.strYoutube)
          //   .appendTo(output);
          // const video = $("<iframe />", {
          //   id: "video",
          //   src: meal.strYoutube,
          //   type: "video/mp4",
          //   controls: true
          // });
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
        $(".output").append(results);
      } else {
        $(".output").text(`There was an error handling your request.`);
        $(".outout").text(`Please check your inputs and try again!`);
      }
    }
  });
});
