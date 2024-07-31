import {FastifyInstance} from "fastify";
import {checkAuthorizationTokenExists} from "../middlewares/check-authorization-token-exists";
import {string, z} from "zod";
import {randomUUID} from "node:crypto";
import {knex} from "../database";


export async function mealsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', checkAuthorizationTokenExists)

    app.post('/', async (request, reply) => {
        const createMealBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            isOnDiet: z.boolean()
        })

        const {name, description, isOnDiet} = createMealBodySchema.parse(request.body)

        const authorizationToken = request.cookies.authorizationToken;

        const user = await knex('users').where({authorization_token: authorizationToken}).first();

        if (!user) {
            return reply.status(403).send()
        }

        await knex('meals').insert({
            name,
            description,
            isOnDiet,
            userId: user.id,
            mealId: randomUUID()
        })

        return reply.status(201).send()
    })

    app.get('/', async (request, reply) => {
        const {authorizationToken} = request.cookies
        const user = await knex('users').where({authorization_token: authorizationToken}).first();

        if (!user) {
            return reply.status(403).send()
        }

        const meals = await knex('meals').where({userId: user.id});

        if (!meals) {
            return reply.status(404).send()
        }

        return reply.status(200).send({meals})
    })

    app.get('/:mealId', async (request, reply) => {
        const {authorizationToken} = request.cookies

        const user = await knex('users').where({authorization_token: authorizationToken}).first();

        if (!user) {
            return reply.status(403).send()
        }

        const getMealParamsSchema = z.object({
            mealId: string().uuid()
        })

        const {mealId} = getMealParamsSchema.parse(request.params)

        const meal = await knex('meals')
            .where({
                userId: user.id,
                mealId: mealId,
            })
            .first();

        if (!meal) {
            return reply.status(404).send()
        }

        return reply.status(200).send({meal})
    })

    app.put('/:mealId', async (request, reply) => {
        const {authorizationToken} = request.cookies

        const user = await knex('users').where({authorization_token: authorizationToken}).first();

        if (!user) {
            return reply.status(403).send()
        }

        const updateMealParamsSchema = z.object({
            mealId: string().uuid()
        })

        const {mealId} = updateMealParamsSchema.parse(request.params)

        const updateMealBodySchema = z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            isOnDiet: z.boolean().optional()
        })

        const {name, description, isOnDiet} = updateMealBodySchema.parse(request.body)

        const mealInformations = await knex('meals').where({userId: user.id, mealId: mealId}).first();

        if (!mealInformations) {
            return reply.status(404).send({message: 'Meal not found'});
        }

        const updatedMeal = {
            name: name ?? mealInformations.name,
            description: description ?? mealInformations.description,
            isOnDiet: isOnDiet ?? mealInformations.isOnDiet
        }

        await knex('meals').where({userId: user.id, mealId: mealId}).first().update(updatedMeal)

        return reply.status(200).send({message: "Meal successfully updated"});
    })

    app.delete('/:mealId', async (request, reply) => {

        const {authorizationToken} = request.cookies;

        const user = await knex('users').where({authorization_token: authorizationToken}).first();

        if (!user) {
            return reply.status(403).send()
        }

        const updateMealParamsSchema = z.object({
            mealId: string().uuid()
        })

        const {mealId} = updateMealParamsSchema.parse(request.params)

        const meal = await knex('meals').where({userId: user.id, mealId: mealId}).first()

        if (!meal) {
            return reply.status(404).send()
        }

        await knex('meals').where({userId: user.id, mealId: mealId}).first().delete()

        return reply.status(204).send();
    })
}