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