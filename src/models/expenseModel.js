const pool = require('../config/db.js');

const getAllExpenses = async () => {
    try {
        const result = await pool.query('SELECT * FROM expenses');
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const getExpenseById = async (expenseId) => {
    try {
        const result = await pool.query('SELECT * FROM expenses WHERE id = $1', [expenseId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const addExpense = async (expenseData) => {
    try {
        const { date, category, amount, description } = expenseData;
        const result = await pool.query(
            'INSERT INTO expenses (date, category, amount, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [date, category, amount, description]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const updateExpense = async (expenseId, expenseData) => {
    try {
        const { date, category, amount, description } = expenseData;
        const result = await pool.query(
            'UPDATE expenses SET date = $1, category = $2, amount = $3, description = $4 WHERE id = $5 RETURNING *',
            [date, category, amount, description, expenseId]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const deleteExpense = async (expenseId) => {
    try {
        const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [expenseId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllExpenses,
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense
};
