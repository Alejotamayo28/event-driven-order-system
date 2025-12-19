import { Order } from "@domain/entities/Order";
import type { OrderRepository } from "@domain/repositories/OrderRepository";
import { pool } from "../config/config";

export class PostgreOrderRepository implements OrderRepository {
	async findById(id: string): Promise<Order | null> {
		const client = await pool.connect();
		try {
			const result = await client.query("SELECT * FROM orders WHERE id = $1", [id]);
			if (result.rows.length === 0) {
				return null;
			}
			const row = result.rows[0];
			return new Order(
				row.id,
				row.customer_id,
				row.items, // Assuming items are stored as JSONB
				row.total_amount,
				row.status,
				row.created_at,
				row.updated_at
			);
		} finally {
			client.release();
		}
	}

	async findByCustomerId(customerId: string): Promise<Order[]> {
		const client = await pool.connect();
		try {
			const result = await client.query("SELECT * FROM orders WHERE customer_id = $1", [customerId]);
			return result.rows.map(
				(row) =>
					new Order(
						row.id,
						row.customer_id,
						row.items, // Assuming items are stored as JSONB
						row.total_amount,
						row.status,
						row.created_at,
						row.updated_at
					)
			);
		} finally {
			client.release();
		}
	}

	async save(order: Order): Promise<void> {
		const client = await pool.connect();
		try {
			const { id, customerId, items, totalAmount, status, createdAt, updatedAt } = order;
			await client.query(
				`INSERT INTO orders (id, customer_id, items, total_amount, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           customer_id = EXCLUDED.customer_id,
           items = EXCLUDED.items,
           total_amount = EXCLUDED.total_amount,
           status = EXCLUDED.status,
           updated_at = EXCLUDED.updated_at
         RETURNING *`,
				[id, customerId, JSON.stringify(items), totalAmount, status, createdAt, updatedAt]
			);
		} finally {
			client.release();
		}
	}

	async update(order: Order): Promise<void> {
		this.save(order);
	}

	async delete(id: string): Promise<void> {
		const client = await pool.connect();
		try {
			await client.query("DELETE FROM orders WHERE id = $1", [id]);
		} finally {
			client.release();
		}
	}
}
