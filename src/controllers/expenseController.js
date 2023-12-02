const ExpenseModel = require('../models/expenseModel.js'); // Adjust the path as necessary

// Helper function to send error responses
const sendErrorResponse = (res, error) => {
    if (error.name === 'ValidationError') { // Replace with your validation error name, if different
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getExpenses = async (req, res) => {
    try {
        const expenses = await ExpenseModel.getAllExpenses();
        res.json(expenses);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

const getExpenseById = async (req, res) => {
    try {
        const expenseId = req.params.expense_id; 
        const expense = await ExpenseModel.getExpenseById(expenseId);
        if (expense) {
            res.json(expense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

const createExpense = async (req, res) => {
    try {
        // Add input validation here
        const newExpense = await ExpenseModel.addExpense(req.body);
        res.status(201).json(newExpense);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

const updateExpense = async (req, res) => {
    try {
        // Add input validation here
        const expenseId = req.params.expense_id;
        const updatedExpense = await ExpenseModel.updateExpense(expenseId, req.body);
        if (updatedExpense) {
            res.json(updatedExpense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.expense_id;
        const deletedExpense = await ExpenseModel.deleteExpense(expenseId);
        if (deletedExpense) {
            res.json({ message: 'Expense successfully deleted' });
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

module.exports = {
    getExpenses,
    getExpenseById, 
    createExpense,
    updateExpense,
    deleteExpense
};
