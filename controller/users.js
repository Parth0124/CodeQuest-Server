import mongoose from "mongoose";
import User from '../model/auth.js'; // Assuming 'auth.js' exports the 'users' model as 'User'

export const getallusers = async (req, res) => {
    try {
        const allusers = await User.find();
        const alluserdetails = allusers.map(user => ({
            _id: user._id,
            name: user.name,
            about: user.about,
            tags: user.tags,
            joinedon: user.joinedon,
        }));
        res.status(200).json(alluserdetails);
    } catch (error) {
        console.error("Error fetching all users:", error.message);
        res.status(404).json({ message: error.message });
    }
};

export const updateprofile = async (req, res) => {
    const { id } = req.params;
    const { name, about, tags } = req.body;
    
    try {
        const updatedProfile = await User.findByIdAndUpdate(
            id,
            { $set: { name, about, tags } },
            { new: true } // Return the updated document
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedProfile); // Return updated profile
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

