"use server";

import Bill from "@/models/billModel";
import Residence from "@/models/residenceModel";
import Category from "@/models/categoryModel";
import connectDB from "@/config/connectDB";
import { connect, Types } from "mongoose";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getLastNMonths(months, currentMonthIndex, n) {
  const result = [];

  for (let i = 0; i < n; i++) {
    let idx = (currentMonthIndex - i + 12) % 12;
    result.push(months[idx]);
  }
  return result;
}

// insert bill
export async function insertBill(billData) {
  try {
    await connectDB();

    const { userId, categoryId, residenceId } = billData;

    //console.log("Data for DB query");
    //console.log("User:", userId); //ok
    //console.log("Residence:", residenceId); //ok
    //console.log("Category:", categoryId); //ok

    // validate residence and category ownership
    const residence = await Residence.findOne({ _id: residenceId, userId });
    const category = await Category.findOne({ _id: categoryId, userId });

    if (!residence) throw new Error("Residence does not belong to the user");
    if (!category) throw new Error("Category does not belong to the user");

    // insert bill
    const newBill = new Bill(billData);
    const savedBill = await newBill.save();

    return savedBill;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

// returns all bills by userId
export async function getUserBills(userId) {
  try {
    await connectDB();
    const data = await Bill.find({ userId });
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

// returns recent bills by user id and limited by number provided
export async function getLatestBills(userId, billsLimit) {
  try {
    await connectDB();
    const data = await Bill.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      { $limit: billsLimit },
      { $lookup: {
        from: "residences",
        localField: "residenceId",
        foreignField: "_id",
        as: "residence"
      }},
      { $unwind: "$residence" },
      { $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }},
      { $unwind: "$category" },
      { $project: {
          _id: 1,
          dueDate: 1,
          residence: "$residence.name",
          category: "$category.name",
          amount: 1,
          status: 1,
          forMonth: 1,
      }}
    ]);
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

// get all expenses for current and past months -> grouped by month, inside month grouped by category
export async function allMonthsBills(userId, residenceId) {
  try {
    await connectDB();

    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const currentYear = now.getFullYear();

    const allMonths = await Bill.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          residenceId: new Types.ObjectId(residenceId),
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      }, 
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: {
            month: "$forMonth", 
            year: "$forYear",
            category: "$category.name"
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: { month: "$_id.month", year: "$_id.year" }, 
          categories: {
            $push: {
              category: "$_id.category",
              totalAmount: { $round: ["$totalAmount", 2] },
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          categories: 1,
        }
      },
      {
        $addFields: {
          monthIndex: {
            $indexOfArray: [
              [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ],
            "$month"
            ]
          }
        }
      }, {
        $sort: { year: -1, monthIndex: -1 }
      }, {
        $project: {
          monthIndex:0
        }
      }
    ]);
    return allMonths;
  } catch (error) {
    return { error: error.message };
  }
}

// get total expenses /month for the past 6 months by userId and residenceId
export async function totalExpensesHalfYear(userId, residenceId) {
  try {
    await connectDB();

    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const last6Months = getLastNMonths(months, currentMonthIndex - 1, 6);

    const pastHalfYear = await Bill.aggregate([
      { 
        $match: {
          userId: new Types.ObjectId(userId),
          forMonth: { $in: last6Months },
        }
      },
      {
          $group: {
              _id: {
                  residenceId: "$residenceId",
                  forMonth: "$forMonth",
                  forYear: "$forYear",
              },
              totalExpenses: { $sum: "$amount" }
          }
      },
      {
          $sort: { "_id.residenceId": 1, "_id.forYear": 1, "_id.forMonth": 1 }
      },
      {
          $lookup: {
              from: "residences",
              localField: "_id.residenceId",
              foreignField: "_id",
              as: "residence"
          }
      },
      { $unwind: "$residence" },
      {
        $group: {
          _id: "$_id.residenceId",
          residence: { $first: "$residence.name" },
          expenses: {
            $push: {
              forMonth: "$_id.forMonth",
              forYear: "$_id.forYear",
              totalExpenses: { $round: ["$totalExpenses", 2] }
            }
          }
        }
      },
      {
        $project: {
            _id: 0,
            residence: 1,
            expenses: 1
        }
      }
    ]);
    return pastHalfYear;
  } catch (error) {
    return { error: error.message };
  }
}

// get expenses for current and past 2 months -> grouped by month, inside month grouped by category
export async function threeMonthsBills(userId, residenceId) {
  try {
    await connectDB();

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfThreeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const threeMonthsExpenses = await Bill.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          residenceId: new Types.ObjectId(residenceId),
          createdAt: {
            $gte: startOfThreeMonthsAgo,
            $lt: startOfCurrentMonth
          }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      }, 
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            category: "$category.name"
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          categories: {
            $push: {
              category: "$_id.category",
              totalAmount: { $round: ["$totalAmount", 2] },
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          categories: 1,
        }
      },
      {
        $sort: { month: -1 }
      }
    ]);
    return threeMonthsExpenses;
  } catch (error) {
    return { error: error.message };
  }
}

// get last months bills -> grouped by category
export async function lastMonthExpenses(userId, residenceId) {
  try {
    await connectDB();

    const now = new Date();
    const year = months[now.getMonth() - 1] === "December" ? now.getFullYear() - 1 : now.getFullYear();
    
    const lastMonthExpenses = await Bill.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          residenceId: new Types.ObjectId(residenceId),
          forMonth: months[now.getMonth() - 2],
          forYear: year,
        },
      },  
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$category.name",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: { $round: ["$totalAmount", 2] },
        },
      },
      {
        $sort: { category: 1 },
      },
    ]);

    return lastMonthExpenses;
  } catch (error) {
    return { error: error.message };
  }
}

// get bills for current month -> grouped by categories
export async function currentMonthBills(userId, residenceId) {
  try {
    await connectDB();

    const now = new Date();
    const year = months[now.getMonth() - 1] === "December" ? now.getFullYear() - 1 : now.getFullYear();

    const currentMonthExpenses = await Bill.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          residenceId: new Types.ObjectId(residenceId),
          forMonth: months[now.getMonth() - 1],
          forYear: year,
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        }
      },
      {
        $unwind: "$category"
      },
      {
        $group: {
          _id: "$category.name",
          totalAmount: {$sum: "$amount"}
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: {$round: ["$totalAmount", 2]}
        }
      },
      {
        $sort: {category: 1}
      }
    ]);

    return currentMonthExpenses;
  } catch (error) {
    return {error: error.message};
  }
}

// get bill data by id and userid
export async function getBillByIdAndUser(billId, userId) {
  try {
    await connectDB();
    const bill = await Bill.findOne({ _id: billId, userId });
    return bill;
  } catch (error) {
    return { error: error.message };
  }
}

// update bill data by id and userid
export async function updateBill(billData) {
  try {
    await connectDB();

    // remove id and userId from the update object
    const { id, userId, ...fieldsToUpdate } = billData;
    const updatedBill = await Bill.findOneAndUpdate(
      { _id: billData.id, userId: billData.userId },
      { $set: fieldsToUpdate },
      { new: true }
    );
    
    return updatedBill;
  } catch (error) {
    return { error: error.message };
  }
}

// delete bill data by id and userid
export async function deleteBill(billId, userId) {
  try {
    await connectDB();
    const deletedBill = await Bill.findOneAndDelete({ _id: billId, userId });
    return deletedBill;
  } catch (error) {
    return { error: error.message };
  }
}