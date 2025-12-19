import { Pool } from "pg";

export const pool = new Pool({
	user: "user",
	host: "localhost",
	database: "order_db",
	password: "password",
	port: 5432,
});
