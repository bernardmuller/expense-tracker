import React, { useState } from "react";

import ExpenseItem from "./ExpenseItem";
import ExpenseFilter from "./ExpenseFilter";
import Card from "../UI/Card";

import "./Expenses.css";

const Expenses = ({ expenses }) => {
  const [expenseFilter, setExpenseFilter] = useState("2019");

  const expenseFilterHandler = (year) => {
    setExpenseFilter(year);
    console.log(`In Expenses component: ${expenseFilter}`);
  };

  return (
    <div>
      <Card className="expenses">
        <ExpenseFilter
          onSelectExpenseFilter={expenseFilterHandler}
          filteredYear={expenseFilter}
        />
        {expenses.map((expense) => (
          <ExpenseItem
            title={expense.title}
            amount={expense.amount}
            date={expense.date}
          />
        ))}
      </Card>
    </div>
  );
};

export default Expenses;
