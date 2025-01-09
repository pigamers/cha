const Entity = require('../models/entity.models');

exports.getEntity = async (req, res) => {
    try {
        // Use the new getHierarchicalData method we created in the model
        const hierarchicalData = await Entity.getHierarchicalData();

        if (!hierarchicalData || hierarchicalData.length === 0) {
            return res.status(404).json({ message: "No entities found in the database." });
        }

        res.status(200).json(hierarchicalData);
    } catch (error) {
        console.error("Error fetching entities:", error.message);
        res.status(500).json({
            message: "An error occurred while retrieving entities. Please try again later.",
            error: error.message
        });
    }
}

exports.postEntity = async (req, res) => {
    const { name, designation, parent, expanded = true } = req.body; // Changed parentId to parent

    console.log('Received request body:', req.body); // Debug log

    // Ensure required fields are provided
    if (!name || !designation) {
        return res.status(400).json({
            message: "Name and designation are required fields."
        });
    }

    try {
        // Prevent multiple names
        
        // Prevent adding more than one CEO
        if (designation === "CEO") {
            const existingCEO = await Entity.findOne({ designation: "CEO" });
            if (existingCEO) {
                return res.status(400).json({
                    message: "There can only be one CEO. An entity with the 'CEO' designation already exists."
                });
            }
        }

        // Validate if parent is provided and if parent entity exists
        let parentEntity = null;
        if (parent) { // Changed parentId to parent
            parentEntity = await Entity.findById(parent); // Changed parentId to parent
            if (!parentEntity) {
                return res.status(404).json({
                    message: "Parent entity not found. Please provide a valid parent ID."
                });
            }

            // Validate hierarchy
            const hierarchyValidation = validateHierarchy(parentEntity.designation, designation);
            if (!hierarchyValidation.isValid) {
                return res.status(400).json({
                    message: hierarchyValidation.message
                });
            }
        }

        // Create a new entity with expanded property
        const newEntity = new Entity({
            name,
            designation,
            parent: parent || null, // Changed parentId to parent
            expanded,
            children: []
        });

        console.log('Creating new entity:', newEntity); // Debug log

        // Save the new entity to the database
        await newEntity.save();

        // If the entity has a parent, add this entity to the parent's 'children' array
        if (parent && parentEntity) { // Changed parentId to parent
            await Entity.findByIdAndUpdate(parent, { // Changed parentId to parent
                $push: { children: newEntity._id }
            });
        }

        // Fetch the updated hierarchical data
        const updatedHierarchy = await Entity.getHierarchicalData();

        res.status(201).json({
            message: "Entity created successfully.",
            entity: newEntity,
            updatedHierarchy
        });
    } catch (error) {
        console.error("Error creating entity:", error);
        res.status(500).json({
            message: "An error occurred while creating the entity. Please try again later.",
            error: error.message
        });
    }
};


// Helper function to validate hierarchy
function validateHierarchy(parentDesignation, childDesignation) {
    const hierarchyRules = {
        "CEO": ["Manager"],
        "Manager": ["Head of the Department"],
        "Head of the Department": ["Shift Supervisor"],
        "Shift Supervisor": ["Worker"],
        "Worker": []
    };

    const allowedChildren = hierarchyRules[parentDesignation] || [];
    const isValid = allowedChildren.includes(childDesignation);

    return {
        isValid,
        message: isValid ?
            "Valid hierarchy" :
            `Only ${allowedChildren.join(", ")} can be added under ${parentDesignation}.`
    };
}

exports.getParent = async (req, res) => {
    try {
        // This will find all entities in the database
        const allEntities = await Entity.find({})
            .select('name _id') // Remove the minus sign before _id to include it
            .lean()
            .then(results => results.map(doc => ({
                _id: doc._id,
                name: doc.name
            })));

        res.status(200).json(allEntities);
    } catch (error) {
        console.error("Error fetching entities:", error.message);
        res.status(500).json({
            message: "An error occurred while retrieving entities. Please try again later.",
            error: error.message
        });
    }
}




