"use server";

import Residence from "@/models/residenceModel";
import connectDB from "@/config/mongodb";

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