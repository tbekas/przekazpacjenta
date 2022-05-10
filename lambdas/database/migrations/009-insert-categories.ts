import { Kysely, sql } from 'kysely';
import categories from './009-categories.json';

async function up(db: Kysely<any>): Promise<void> {
  const categoriesValues = categories.map(({ id, pl, en, ...rest }) => ({
    id: sql`uuid(${id})`,
    pl: sql`to_jsonb(${JSON.stringify(pl)})`,
    en: sql`to_jsonb(${JSON.stringify(en)})`,
    ...rest,
  }));

  await db.insertInto('category').values(categoriesValues).execute();
}

async function down(db: Kysely<any>): Promise<void> {
  await db
    .deleteFrom('category')
    .where(
      'id',
      'in',
      categories.map(({ id }) => sql`uuid(${id})`)
    )
    .execute();
}

export default { up, down };
