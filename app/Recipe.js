/**
 * Created by franziskah on 31.05.17.
 *
 * The recipe. Containig the ingredients, steps and a timer
 */
class Recipe {
    constructor(name, ingredients, steps, timer) {
        this.name = name;
        this.ingredients = ingredients;
        this.steps = steps;
        this.timer = timer; //in minutes
    }
}
