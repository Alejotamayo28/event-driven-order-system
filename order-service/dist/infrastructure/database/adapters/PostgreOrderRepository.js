"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreOrderRepository = void 0;
const pg_1 = require("pg");
const Order_1 = require("@domain/entities/Order");
const pool = new pg_1.Pool({
    user: 'user',
    host: 'localhost',
    database: 'order_db',
    password: 'password',
    port: 5432,
});
class PostgreOrderRepository {
    async findById(id) {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM orders WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return null;
            }
            const row = result.rows[0];
            return new Order_1.Order(row.id, row.customer_id, row.items, row.total_amount, row.status, row.created_at, row.updated_at);
        }
        finally {
            client.release();
        }
    }
    async findByCustomerId(customerId) {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM orders WHERE customer_id = $1', [customerId]);
            return result.rows.map(row => new Order_1.Order(row.id, row.customer_id, row.items, row.total_amount, row.status, row.created_at, row.updated_at));
        }
        finally {
            client.release();
        }
    }
    async save(order) {
        const client = await pool.connect();
        try {
            const { id, customerId, items, totalAmount, status, createdAt, updatedAt } = order;
            const result = await client.query(`INSERT INTO orders (id, customer_id, items, total_amount, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           customer_id = EXCLUDED.customer_id,
           items = EXCLUDED.items,
           total_amount = EXCLUDED.total_amount,
           status = EXCLUDED.status,
           updated_at = EXCLUDED.updated_at
         RETURNING *`, [id, customerId, JSON.stringify(items), totalAmount, status, createdAt, updatedAt]);
            const row = result.rows[0];
            return new Order_1.Order(row.id, row.customer_id, row.items, row.total_amount, row.status, row.created_at, row.updated_at);
        }
        finally {
            client.release();
        }
    }
    async update(order) {
        return this.save(order);
    }
    async delete(id) {
        const client = await pool.connect();
        try {
            await client.query('DELETE FROM orders WHERE id = $1', [id]);
        }
        finally {
            client.release();
        }
    }
}
exports.PostgreOrderRepository = PostgreOrderRepository;
//# sourceMappingURL=PostgreOrderRepository.js.map