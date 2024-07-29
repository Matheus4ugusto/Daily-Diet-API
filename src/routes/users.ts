import {FastifyInstance} from "fastify";
import {z} from "zod";
import {randomUUID} from "node:crypto";
import {knex} from "../database";
import {checkAuthorizationTokenExists} from "../middlewares/check-authorization-token-exists";

export async function usersRoutes(app: FastifyInstance) {
    app.post('/', async (request,
                         reply) => {
        const createUserBodySchema = z.object({
            email: z.string().email(),
            password: z.string(),
            name: z.string(),
        });

        const {email, password, name} = createUserBodySchema.parse(request.body);

        let {authorizationToken} = request.cookies

        if (!authorizationToken) {
            authorizationToken = randomUUID()

            reply.cookie('authorizationToken', authorizationToken, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30
            })
        }

        await knex('users').insert({
            email,
            password,
            name,
            id: randomUUID(),
            authorization_token: authorizationToken
        })

        return reply.status(201).send()
    })

    app.get('/', {preHandler: [checkAuthorizationTokenExists]}, async (request,
                                                                       reply) => {

        const {authorizationToken} = request.cookies

        const user = await knex('users').where({
            authorization_token: authorizationToken
        }).first()

        delete user.password

        return reply.status(200).send({user})
    })

    app.put('/', {preHandler: [checkAuthorizationTokenExists]}, async (request,
                                                                       reply) => {
        const {authorizationToken} = request.cookies;

        const updateUserBodySchema = z.object({
            email: z.string().email().nullable().optional(),
            password: z.string().nullable().optional(),
            name: z.string().nullable().optional(),
        });

        const {email, password, name} = updateUserBodySchema.parse(request.body);

        const userInformations = await knex('users').where({
            authorization_token: authorizationToken
        }).first();

        if (!userInformations) {
            return reply.status(404).send({message: 'User not found'});
        }

        const updatedUser = {
            name: name ?? userInformations.name,
            email: email ?? userInformations.email,
            password: password ?? userInformations.password,
        };

        await knex('users')
            .where({authorization_token: authorizationToken})
            .update(updatedUser);


        return reply.status(200).send({message: 'User updated successfully'});
    })

    app.delete('/', {preHandler: [checkAuthorizationTokenExists]}, async (request,
                                                                          reply) => {
        const {authorizationToken} = request.cookies

        await knex('users')
            .where({authorization_token: authorizationToken})
            .first()
            .delete()
            .then(() => {
                reply.clearCookie("authorizationToken");
            })


        return reply.status(204).send();

    })

    app.post('/login', async (request,
                              reply) => {

        const loginBodySchema = z.object({
            email: z.string().email(),
            password: z.string()
        })

        const {email, password} = loginBodySchema.parse(request.body);

        const authorizationToken = randomUUID()

        await knex('users').where({email, password}).first().update({
            authorization_token: authorizationToken
        }).then(() => {
            reply.cookie("authorizationToken", authorizationToken, {path: '/',}).status(200).send()
        })

    })

    app.post('/logout',
        {preHandler: [checkAuthorizationTokenExists]}, async (request,
                                                              reply) => {
            const {authorizationToken} = request.cookies;

            await knex('users')
                .where({authorization_token: authorizationToken})
                .first()
                .update({authorization_token: null})
                .then(() => {
                    reply.clearCookie("authorizationToken");
                })


            return reply.status(204).send();

        })
}