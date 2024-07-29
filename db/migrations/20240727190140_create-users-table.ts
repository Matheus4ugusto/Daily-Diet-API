import type {Knex} from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', table => {
        table.string('email').unique().primary()
        table.string('password').notNullable()
        table.string('name').nullable()
        table.uuid('id').unique()
        table.uuid('authorization_token').nullable().unique()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}

