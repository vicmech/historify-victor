import { Database } from './types.js'
import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";
import { config } from '../config.js';

const dialect = new MysqlDialect({
    pool: createPool(config)
});

export const db = new Kysely<Database>({
    dialect
})
