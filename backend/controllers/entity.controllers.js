const Entity = require('../models/entity.models');

exports.getEntity = async (req, res) => {
    try {
        // Fetch all entities, populate children, and sort by designation for hierarchy
        const entities = await Entity.find().populate('children').sort({ designation: 1 });
        res.status(200).json(entities);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.postEntity = async (req, res) => {
    const { name, designation, parentId } = req.body;

    try {
        // Prevent adding more than one CEO
        if (designation === "CEO") {
            const existingCEO = await Entity.findOne({ designation: "CEO" });
            if (existingCEO) {
                return res.status(400).json({ message: "There can only be one CEO." });
            }
        }

        // Create a new entity
        const newEntity = new Entity({
            name,
            designation,
            parent: parentId || null
        });

        await newEntity.save();

        // If the entity has a parent, add this entity to the parent's 'children' array
        if (parentId) {
            await Entity.findByIdAndUpdate(parentId, {
                $push: { children: newEntity._id }
            });
        }

        res.status(201).json(newEntity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
