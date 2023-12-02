const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController.js'); 
console.log(expenseController);
const { authenticateToken } = require('../../middleware/auth');

// Get all expenses
router.get('/', authenticateToken, expenseController.getExpenses);

// Get a single expense by ID
router.get('/:expense_id', authenticateToken, expenseController.getExpenseById);

// Create a new expense
router.post('/', authenticateToken, expenseController.createExpense);

// Update an expense
router.put('/:expense_id', authenticateToken, expenseController.updateExpense);

// Delete an expense
router.delete('/:expense_id', authenticateToken, expenseController.deleteExpense);

module.exports = router;
