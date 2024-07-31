import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {app} from "../src/app";
import {execSync} from "node:child_process";
import request from "supertest";

describe('tests', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('user tests', () => {
        beforeEach(() => {
            execSync('yarn knex migrate:latest')
        })
        afterEach(() => {
            execSync('yarn knex migrate:rollback --all')
        })

        it("Should be able to create a user", async () => {
            await request(app.server).post('/users').send({
                email: 'user@mail.com',
                password: 'password123',
                name: 'Dummy'
            }).expect(201)
        })

        it("Should be able to get user infos", async () => {
            const createUserResponse = await request(app.server).post('/users').send({
                email: 'user@mail.com',
                password: 'password123',
                name: 'Dummy'
            }).expect(201)

            const cookies = createUserResponse.get('Set-Cookie')

            const getUserInfoResponse = await request(app.server).get('/users').set('Cookie', cookies).expect(200)

            expect(getUserInfoResponse.body.user).toEqual(expect.objectContaining({
                email: 'user@mail.com',
                name: 'Dummy'
            }))
        })

        it("Should be able to update the user data", async () => {
            const createUserResponse = await request(app.server).post('/users').send({
                email: 'user@mail.com',
                password: 'password123',
                name: 'Dummy'
            }).expect(201)

            const cookies = createUserResponse.get('Set-Cookie')

            await request(app.server).put('/users').send({
                email: 'user@newMail.com',
                name: "New Name"
            }).set('Cookie', cookies).expect(200, {message: 'User updated successfully'})

            const getUserInfoResponse = await request(app.server).get('/users').set('Cookie', cookies).expect(200)

            expect(getUserInfoResponse.body.user).toEqual(expect.objectContaining({
                email: 'user@newMail.com',
                name: 'New Name'
            }))
        })

        it("Should be able to delete an user", async () => {
            const createUserResponse = await request(app.server).post('/users').send({
                email: 'user@mail.com',
                password: 'password123',
                name: 'Dummy'
            }).expect(201)

            const cookies = createUserResponse.get('Set-Cookie')

            await request(app.server).delete('/users').set('Cookie', cookies).expect(204)

            await request(app.server).get('/users').set('Cookie', cookies).expect(404)
        })
    })

    describe('meals tests', () => {
        beforeEach(() => {
            execSync('yarn knex migrate:latest')
        })

        afterEach(() => {
            execSync('yarn knex migrate:rollback --all')
        })

        it('should be able to register a meal', async () => {

            const createUserResponse = await request(app.server).post('/users').send({
                email: 'user@mail.com',
                password: 'password123',
                name: 'Dummy'
            }).expect(201)

            const cookies = createUserResponse.get('Set-Cookie')

            await request(app.server).post('/meals').send({
                name: "Some meal name",
                description: "Some description",
                isOnDiet: true
            }).set('Cookie', cookies).expect(201)
        });

        it('should be able to list all meals', async () => {

            const createUserResponse = await request(app.server).post('/users').send({
                email: 'user@mail.com',
                password: 'password123',
                name: 'Dummy'
            }).expect(201)

            const cookies = createUserResponse.get('Set-Cookie')

            await request(app.server).post('/meals').send({
                name: "Some meal name",
                description: "Some description",
                isOnDiet: true
            }).set('Cookie', cookies).expect(201)

            const getMealsResponse = await request(app.server).get('/meals').set('Cookie', cookies).expect(200)

            expect(getMealsResponse.body.meals).toEqual([
                expect.objectContaining({
                    name: "Some meal name",
                    description: "Some description",
                    isOnDiet: 1
                })
            ])
        });

        it('should be able to list an specific meal', async () => {
            const createUserResponse = await request(app.server)
                .post('/users')
                .send({
                    email: 'user@mail.com',
                    password: 'password123',
                    name: 'Dummy'
                }).expect(201)

            const cookies = createUserResponse.get('Set-Cookie')

            await request(app.server).post('/meals').send({
                name: "Some meal name",
                description: "Some description",
                isOnDiet: true
            }).set('Cookie', cookies).expect(201)

            const getMealsResponse = await request(app.server)
                .get('/meals').set('Cookie', cookies)
                .expect(200)


            expect(getMealsResponse.body.meals).toEqual([
                expect.objectContaining({
                    name: "Some meal name",
                    description: "Some description",
                    isOnDiet: 1
                })
            ])

            const getMealByIdResponse = await request(app.server)
                .get(`/meals/${getMealsResponse.body.meals[0].mealId}`)
                .set('Cookie', cookies)
                .expect(200)

            expect(getMealByIdResponse.body.meal).toEqual(expect.objectContaining({
                name: "Some meal name",
                description: "Some description",
                isOnDiet: 1
            }))
        })

        it('should be able to update an specific meal', async () => {

            const createUserResponse = await request(app.server)
                .post('/users')
                .send({
                    email: 'user@mail.com',
                    password: 'password123',
                    name: 'Dummy'
                }).expect(201)

            const cookies = createUserResponse.get('Set-Cookie')

            await request(app.server).post('/meals').send({
                name: "Some meal name",
                description: "Some description",
                isOnDiet: true
            }).set('Cookie', cookies).expect(201)

            const getMealsResponse = await request(app.server)
                .get('/meals').set('Cookie', cookies)
                .expect(200)


            expect(getMealsResponse.body.meals).toEqual([
                expect.objectContaining({
                    name: "Some meal name",
                    description: "Some description",
                    isOnDiet: 1
                })
            ])

            await request(app.server).put(`/meals/${getMealsResponse.body.meals[0].mealId}`).send({
                name: "Some new meal name",
                description: "Some new description",
                isOnDiet: false
            }).set('Cookie', cookies).expect(200)

            const getMealByIdResponse = await request(app.server)
                .get(`/meals/${getMealsResponse.body.meals[0].mealId}`)
                .set('Cookie', cookies)
                .expect(200)

            expect(getMealByIdResponse.body.meal).toEqual(expect.objectContaining({
                name: "Some new meal name",
                description: "Some new description",
                isOnDiet: 0
            }))

        })

        it('should be able to delete an specific meal', async () => {
            const createUserResponse = await request(app.server)
                .post('/users')
                .send({
                    email: 'user@mail.com',
                    password: 'password123',
                    name: 'Dummy'
                }).expect(201)

            const cookies = createUserResponse.get('Set-Cookie')

            await request(app.server).post('/meals').send({
                name: "Some meal name",
                description: "Some description",
                isOnDiet: true
            }).set('Cookie', cookies).expect(201)

            const getMealsResponse = await request(app.server)
                .get('/meals').set('Cookie', cookies)
                .expect(200)


            expect(getMealsResponse.body.meals).toEqual([
                expect.objectContaining({
                    name: "Some meal name",
                    description: "Some description",
                    isOnDiet: 1
                })
            ])

            await request(app.server).delete(`/meals/${getMealsResponse.body.meals[0].mealId}`).set('Cookie', cookies).expect(204)

            const getMealByIdResponse = await request(app.server)
                .get(`/meals/${getMealsResponse.body.meals[0].mealId}`)
                .set('Cookie', cookies)
                .expect(404)
        })
    })

    describe('metrics tests', () => {
        beforeEach(() => {
            execSync('yarn knex migrate:latest')
        })

        afterEach(() => {
            execSync('yarn knex migrate:rollback --all')
        })

        it('Should be able to get metrics', async () => {
            const createUserResponse = await request(app.server)
                .post('/users')
                .send({
                    email: 'user@mail.com',
                    password: 'password123',
                    name: 'Dummy'
                }).expect(201)

            const cookies = createUserResponse.get('Set-Cookie')

            await request(app.server).post('/meals').send({
                name: "Some meal name",
                description: "Some description",
                isOnDiet: true
            }).set('Cookie', cookies).expect(201)

            await request(app.server).post('/meals').send({
                name: "Some second meal name",
                description: "Some description",
                isOnDiet: true
            }).set('Cookie', cookies).expect(201)

            await request(app.server).post('/meals').send({
                name: "Some third meal name",
                description: "Some description",
                isOnDiet: true
            }).set('Cookie', cookies).expect(201)

            await request(app.server).post('/meals').send({
                name: "Some fourth meal name",
                description: "Some description",
                isOnDiet: false
            }).set('Cookie', cookies).expect(201)

            await request(app.server).post('/meals').send({
                name: "Some fifth meal name",
                description: "Some description",
                isOnDiet: true
            }).set('Cookie', cookies).expect(201)

            await request(app.server).post('/meals').send({
                name: "Some sixth meal name",
                description: "Some description",
                isOnDiet: true
            }).set('Cookie', cookies).expect(201)

            const getMetricsResponse = await request(app.server).get('/metrics').set('Cookie', cookies).expect(200)

            expect(getMetricsResponse.body.metrics).toEqual(expect.objectContaining({
                mealsQuantity: 6,
                onDietMealsQuantity: 5,
                outDietMealsQuantity: 1,
                bestSequence: 3,
                actualSequence: 2
            }))
        })
    })
})