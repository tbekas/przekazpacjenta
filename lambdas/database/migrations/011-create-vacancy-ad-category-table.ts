import { Kysely, sql } from 'kysely';

async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('vacancyAdCategory')
    .addColumn('vacancyAdId', 'uuid', (col) => col.notNull().references('vacancyAd.id'))
    .addColumn('categoryId', 'uuid', (col) => col.notNull().references('category.id'))
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('vacancyAdCategoryPK', ['vacancyAdId', 'categoryId'])
    .execute();
}

async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('vacancyAdCategory').execute();
}

export default { up, down };