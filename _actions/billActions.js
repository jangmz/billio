"use server";

import Bill from "@/models/billModel";
import Residence from "@/models/residenceModel";
import Category from "@/models/categoryModel";
import connectDB from "@/config/mongodb";

// insert bill
export async function insertBill(billData) {
  try {
    await connectDB();

    const { userId, categoryId, residenceId } = billData;

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

/*// get all bills by userId and residenceId
export async function getBillsByUserAndResidence(userId, residenceId) {
  try {
    await connectDB();
    const bills = await Bill.find({ userId, residenceId });
    return bills
  } catch (error) {
    return { error: error.message };
  }
}*/

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