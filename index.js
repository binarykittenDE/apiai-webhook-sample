'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

/**
 * Example Recipe ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */
let oil = new Ingredient('oil', '5 tablespoons');
let chocolate = new Ingredient('dark chocolate (vegan)', '200 gram');
let flour = new Ingredient('flour', '170 gram');
let cocoaPowder = new Ingredient('cocoa powder', '3 teaspoons');
let sugar = new Ingredient('sugar', '180 gram');
let seaSalt = new Ingredient('sea salt', 'a pinch');
let vanillaPod = new Ingredient('vanilla pod', '1');
let veganMilk = new Ingredient('vegan milk', '230 milliliter');
let walnuts = new Ingredient('walnuts', '200 gram');
let ingredients = [oil, chocolate, flour, cocoaPowder, sugar, seaSalt, vanillaPod, veganMilk, walnuts];

let step1 = 'So first preheat the oven to 180 degrees and cover an oven tray with baking paper.';
let step2 = 'The next step would be to heat up 150 gram of chocolate until its completely melted. You can do this' +
    ' with an microwave or a waterbath.';
let step3 = 'Sieve the 170 gram flour and 5 teaspoons cocoa powder into a large bowl.';
let step4 = 'Add the 180 gram of sugar and a pinch of the sea salt.';
let step5 = 'Halve the vanilla pod lengthways, scrape out the seeds and add them to the bowl.';
let step6 = 'Stir in the 5 tablespoons oil, the 230 milliliters vegan milk and the melted chocolate until everything' +
    ' is combined nicely.';
let step7 = 'Roughly chop the remaining 50 gram of chocolate and 150 gram of walnuts, and stir it in!';
let step8 = 'Wow, we nearly finished! Pour the mixture into the prepared oven tray and spread it out evenly.' +
    ' Sprinkle over the remaining walnuts and place this beauty in the hot oven! I´ll remind you in 20 minutes.';
let steps = [step1, step2, step3, step4, step5, step6, step7, step8];
//recipe
let chocolateBrownies = new Recipe('chocolate brownies', ingredients, steps, 20);
//counter
let currentStep = 0;
function getNextStep() {
    let nextStep = currentStep++;
    if (nextStep < chocolateBrownies.steps.length) {
        currentStep++;
        return chocolateBrownies.steps[nextStep]
    }
}
function getCurrentStep() {
    return chocolateBrownies.steps[currentStep];
}
function getLastStep() {
    let lastStep = currentStep--;
    if (lastStep >= 0) {
        currentStep--;
        return chocolateBrownies.steps[lastStep]
    }
}
/**
 * Handling incoming messages at /hook +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */
restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        let speech = 'empty speech';

        if (req.body) {
            let requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                    speech += chocolateBrownies.name;
                }

                //If an action was invoked in api.ai
                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
                    speech += ' ' + chocolateBrownies.name;
                }
            }
        }

        console.log('result: ', speech);

        /* Returned value */
        /*
         * contextOut: Such contexts are activated after intent completion.
         * example: "contextOut": [{"name":"weather","lifespan":2, "parameters":{"city":"Rome"}}]
         *
         * followupEvent: Event name and optional parameters sent from the web service to API.AI.
         * example: {"followupEvent":{"name":"<event_name>","data":{"<parameter_name>":"<parameter_value>"}}}
         */
        return res.json({
            speech: speech,
            displayText: speech,
            source: 'babsi-webhook'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});