"use server";

import Bill from "@/models/billModel";
import Residence from "@/models/residenceModel";
import Category from "@/models/categoryModel";
import connectDB from "@/config/connectDB";
import { connect, Types } from "mongoose";

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

// returns 10 recent bills by user id
export async function getLatestBills(userId) {
  try {
    await connectDB();
    const data = await Bill.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
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
          status: 1
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
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const allMonths = await Bill.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          residenceId: new Types.ObjectId(residenceId),
          createdAt: {
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
    return allMonths;
  } catch (error) {
    return { error: error.message };
  }
}

// get total expenses /month for the past 6 months by userId and residenceId
export async function totalExpensesHalfYear(userId, residenceId) {
  try {
    await connectDB();
    const pastHalfYear = await Bill.aggregate([
      { 
        $match: {
          userId: new Types.ObjectId(userId),
          createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
          $group: {
              _id: {
                  residenceId: "$residenceId",
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" }
              },
              totalExpenses: { $sum: "$amount" }
          }
      },
      {
          $sort: { "_id.residenceId": 1, "_id.year": 1, "_id.month": 1 }
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
              year: "$_id.year",
              month: "$_id.month",
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
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const lastMonthExpenses = await Bill.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          residenceId: new Types.ObjectId(residenceId),
          createdAt: {
            $gte: startOfPreviousMonth,
            $lt: startOfCurrentMonth,
          },
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
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const currentMonthExpenses = await Bill.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          residenceId: new Types.ObjectId(residenceId),
          createdAt: {
            $gte: startOfCurrentMonth,
            $lt: startOfNextMonth
          }
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

/*// get all bills by userId and categoryId
export async function getBillsByUserAndCategory(userId, categoryId) {
  try {
    await connectDB();
    const bills = await Bill.find({ userId, categoryId });
    return bills;
  } catch (error) {
    return { error: error.message };
  }
}*/

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
    const updatedBill = await Bill.findOneAndUpdate(
      { _id: billData.id, userId: billData.userId },
      billData,
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