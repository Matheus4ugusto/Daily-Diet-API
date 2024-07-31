import type {Knex} from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', table => {
        table.string('userId').nullable()
        table.uuid('mealId').unique().nullable()
        table.string('name').notNullable()
        table.text('description').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.boolean('isOnDiet').nullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}

