"use server";

import Bill from "@/models/billModel";
import connectDB from "@/config/mongodb";

// returns all bills by userId
export async function getBills(userId) {
  try {
    await connectDB();
    const data = await Bill.find({ userId });

    return data;
  } catch (error) {
    return { error: error.message };
  }
}

// insert bill
export async function insertBill(bill) {
  try {
    await connectDB();
    const newBill = new Bill(bill);
    const savedBill = await newBill.save();

    return savedBill;
  } catch (error) {
    return { error: error.message };
  }
}
