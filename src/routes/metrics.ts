import {FastifyInstance} from "fastify";
import {checkAuthorizationTokenExists} from "../middlewares/check-authorization-token-exists";
import {knex} from "../database";

export async function metricRoutes(app: FastifyInstance) {

    app.addHook('preHandler', checkAuthorizationTokenExists)

    app.get('/', async (request, reply) => {
        const {authorizationToken} = request.cookies

        const user = await knex("users").where({authorization_token: authorizationToken}).first()

        if (!user) {
            return reply.status(401).send({message: "Not logged in"})
        }

        const allMeals = await knex('meals').where({userId: user.id})

        if (!allMeals) {
            return reply.status(404).send()
        }

        const onDietMeals = await knex('meals').where({userId: user.id, isOnDiet: true})

        const outDietMeals = await knex('meals').where({userId: user.id, isOnDiet: false})

        function calculateBestSequence(meals) {
            let actualSequence = 0;
            let bestSequence = 0;

            for (let i = 0; i < meals.length; i++) {
                if (meals[i].isOnDiet) {
                    actualSequence++;
                    bestSequence = Math.max(actualSequence, bestSequence);
                } else {
                    actualSequence = 0
                }
            }
            return bestSequence;
        }

        function calculateActualSequence(meals) {
            let actualSequence = 0;

            for (let i = meals.length - 1; i >= 0; i--) {
                if (meals[i].isOnDiet) {
                    actualSequence++;
                } else {
                    break
                }
            }
            return actualSequence;
        }

        const bestSequence = calculateBestSequence(allMeals)
        const actualSequence = calculateActualSequence(allMeals)

        const metrics = {
            mealsQuantity: allMeals.length,
            onDietMealsQuantity: onDietMeals.length,
            outDietMealsQuantity: outDietMeals.length,
            bestSequence,
            actualSequence
        }


        return reply.status(200).send({metrics})
    })
}