import React, { useState } from "react";
import "./NewExpense.css";
import ExpenseForm from "./ExpenseForm";

const NewExpense = (props) => {
  const [showForm, setShowForm] = useState(false);

  const saveExpenseDataHandler = (enteredExpenseData) => {
    const expenseData = {
      ...enteredExpenseData,
      id: Math.random().toString(),
    };
    props.onAddExpense(expenseData);
  };

  const newExpenseButtonHandler = () => {
    setShowForm(true);
  };

  const newExpenseCancelHandler = (e) => {    
    setShowForm(false);
  };
  
  return (
    <div className="new-expense">      
        {!showForm && <button onClick={newExpenseButtonHandler} >Add New Expense</button>}        
        {showForm && <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} cancelButtonClicked = {newExpenseCancelHandler} />}
    </div>
  );
};

export default NewExpense;
