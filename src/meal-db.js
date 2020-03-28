export class MealDB {
  async searchRecipe(name) {
    try {
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;

      let response = await fetch(url, {});

      let jsonifiedResponse;
      if (response.ok && response.status == 200) {
        jsonifiedResponse = await response.json();

        console.log(jsonifiedResponse);
      } else {
        jsonifiedResponse = false;
      }
      return jsonifiedResponse;
    } catch (e) {
      return false;
    }
  }
  async getReceipeDetails(id) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    let response = await fetch(url, {});

    let jsonifiedResponse;
    if (response.ok && response.status == 200) {
      jsonifiedResponse = await response.json();

      console.log(jsonifiedResponse);
    } else {
      jsonifiedResponse = false;
    }
    return jsonifiedResponse;
  }
  catch(e) {
    return false;
  }
}
