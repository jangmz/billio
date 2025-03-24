"use server";

import Residence from "@/models/residenceModel";
import connectDB from "@/config/mongodb";
import mongoose from "mongoose";

// insert new residence
export async function insertResidence(residence) {
    try {
        await connectDB();
        const newResidence = new Residence(residence);
        const savedResidence = await newResidence.save();

        return savedResidence;
    } catch (error) {
        return { error: error.message };
    }
}

// retrieve user's residences
export async function getResidences(userId) {
    try {
        await connectDB();
        const residences = await Residence.find({ userId });

        return residences;
    } catch (error) {
        return { error: error.message };
    }
}

// retrieve residence data by id and userId
export async function getResidenceData(residenceId, userId) {
    try {
        await connectDB();
        const residence = await Residence.findOne({ _id: residenceId, userId });
        return residence
    } catch (error) {
        return { error: error.message };
    }
}

// update residence data by id and userId
export async function updateResidenceData(residenceId, userId, residenceData) {
    try {
        await connectDB();
        const updatedResidence = await Residence.findOneAndUpdate(
            { _id: residenceId, userId },
            residenceData,
            { new: true }
        );

        return updatedResidence;
    } catch (error) {
        return { error: error.message };
    }
}

// delete residence by ID
export async function deleteResidenceById(residenceId, userId) {
    try {
        await connectDB();
        const deletedResidence = await Residence.findOneAndDelete(
            { _id: residenceId, userId },
            { new: true }
        );
        return deletedResidence;
    } catch (error) {
        return { error: error.message };
    }
}

// aggregation pipeline -> for creating report
export async function getReport(userId, matchStage) {
    try {
        await connectDB();
        const report = await Residence.aggregate([
            // 1. filter residences for the user
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },

            // 2. Lookup categories for each residence
            {
                $lookup: {
                    from: "categories",
                    localField: "userId",
                    foreignField: "userId",
                    as: "categories",
                },
            },

            // 3. unwind categories array
            { $unwind: "$categories" },

            // 4. Lookup bills for each category
            {
                $lookup: {
                    from: "bills",
                    let: { categoryId: "$categories._id", residenceId: "$_id" },
                    pipeline: [
                        // alternative match -> "createdAt" converts to Date if it's a string
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$categoryId", "$$categoryId"] },
                                        { $eq: ["$residenceId", "$$residenceId"] },
                                        { 
                                            $gte: [
                                                { $cond: {
                                                    if: { $eq: [{ $type: "$createdAt" }, "string"] },
                                                    then: { $dateFromString: { dateString: "$createdAt" } },
                                                    else: "$createdAt"
                                                }},
                                                matchStage.createdAt.$gte
                                            ]
                                        },
                                        { 
                                            $lte: [
                                                { $cond: {
                                                    if: { $eq: [{ $type: "$createdAt" }, "string"] },
                                                    then: { $dateFromString: { dateString: "$createdAt" } },
                                                    else: "$createdAt"
                                                }},
                                                matchStage.createdAt.$lte
                                            ]
                                        }
                                    ],
                                },
                            },
                        }
                        /*
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$categoryId", "$$categoryId"] },
                                        { $eq: ["$residenceId", "$$residenceId"] },
                                    ],
                                },
                                ...matchStage
                            },
                        },
                        {
                            $project: {
                                amount: 1,
                                month: { $month: "createdAt" }, // extract month -> later change to dueDate
                                status: 1,
                                recurring: 1,
                            },
                        },*/
                    ],
                    as: "categories.bills",
                },
            },

            // 5. calculate total amount per category
            {
                $addFields: {
                    "categories.totalAmount": { $sum: "$categories.bills.amount" },
                },
            },

            // 6. group categories under their residence
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    address: { $first: "$address" },
                    categories: { $push: "$categories" },
                },
            },

            // 7. sort results
            { $sort: { name: 1 } },
        ]);
        return report;
    } catch (error) {
        return { error: error.message };
    }
}