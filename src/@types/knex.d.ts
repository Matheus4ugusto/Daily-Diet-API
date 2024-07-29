declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            email: string,
            password: string,
            name: string,
            id: string,
            authorization_token: string,
            created_at: string,
        },
        meals: {
            userId: string,
            mealId: string,
            name: string,
            description: string,
            createdAt: string,
            isOnDiet: boolean,
        }
    }
}