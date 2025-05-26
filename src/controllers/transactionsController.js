import {sql} from '../config/db.js'

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId}
      ORDER BY created_at DESC;
    `
    res.status(200).json(transactions)
  } catch (error) {
    console.log("Error getting the transactions", error)
    res.status(500).json({ message: "Internal Server Error" })
  }

}

export async function createTransaction(req, res) {

  // title, amount, category, user_id
  try {
    const { title, amount, category, user_id } = req.body
    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *;
    `
    // console.log(transaction)
    res.status(201).json(transaction[0])

  } catch (error) {
    console.log("Error in creating the transaction:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params
    if (Number.isNaN(Number(id))) {
      res.status(400).json({ message: "Invalid transaction id" })
    }

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id}
      RETURNING *;
    `
    if (result.length === 0) {
      res.status(404).json({ message: "Transaction not found" })
    } else {
      res.status(200).json({ message: "Transaction deleted successfully" })
    }

  } catch (error) {
    console.log("Error deleting the transaction", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export async function getSummaryByUserId(req, res){
  try {
    const { userId } = req.params;
    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as balance
      FROM transactions WHERE user_id = ${userId};
    `

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as income
      FROM transactions WHERE user_id = ${userId} AND amount > 0;
    `

    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as expense
      FROM transactions WHERE user_id = ${userId} AND amount < 0;
    `

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    })

  } catch (error) {
    console.log("Error getting the summary", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}