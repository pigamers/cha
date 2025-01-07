const Entity = require('../models/entity.models');

exports.getEntity = async (req, res) => {
    try {
        // Fetch all entities, populate children, and sort by designation for hierarchy
        const entities = await Entity.find().populate('children').sort({ designation: 1 });

        if (!entities || entities.length === 0) {
            return res.status(404).json({ message: "No entities found in the database." });
        }

        res.status(200).json(entities);
    } catch (error) {
        console.error("Error fetching entities:", error.message);
        res.status(500).json({
            message: "An error occurred while retrieving entities. Please try again later.",
            error: error.message
        });
    }
}

exports.postEntity = async (req, res) => {
  const { name, designation, parentId } = req.body;

  // Ensure required fields are provided
  if (!name || !designation) {
    return res.status(400).json({
      message: "Name and designation are required fields."
    });
  }

  try {
    // Prevent adding more than one CEO
    if (designation === "CEO") {
      const existingCEO = await Entity.findOne({ designation: "CEO" });
      if (existingCEO) {
        return res.status(400).json({
          message: "There can only be one CEO. An entity with the 'CEO' designation already exists."
        });
      }
    }

    // Validate if parentId is provided and if parent entity exists
    let parentEntity = null;
    if (parentId) {
      parentEntity = await Entity.findById(parentId);
      if (!parentEntity) {
        return res.status(404).json({
          message: "Parent entity not found. Please provide a valid parent ID."
        });
      }

      console.log('Parent Entity:', parentEntity); // Debugging

      // Check if the parent is of correct designation to accept a child
      if (parentEntity.designation === "CEO" && designation !== "Manager") {
        return res.status(400).json({
          message: "Only Managers can be added under the CEO."
        });
      }
      if (parentEntity.designation === "Manager" && designation !== "Head of the Department") {
        return res.status(400).json({
          message: "Only Head of the Department can be added under Managers."
        });
      }
      if (parentEntity.designation === "Head of the Department" && designation !== "Shift Supervisor") {
        return res.status(400).json({
          message: "Only Shift Supervisors can be added under Heads of the Department."
        });
      }
      if (parentEntity.designation === "Shift Supervisor" && designation !== "Worker") {
        return res.status(400).json({
          message: "Only Workers can be added under Shift Supervisors."
        });
      }
    }

    // Create a new entity
    const newEntity = new Entity({
      name,
      designation,
      parent: parentId || null
    });

    // Save the new entity to the database
    await newEntity.save();

    // If the entity has a parent, add this entity to the parent's 'children' array
    if (parentId && parentEntity) {
      await Entity.findByIdAndUpdate(parentId, {
        $push: { children: newEntity._id }
      });
    }

    res.status(201).json({
      message: "Entity created successfully.",
      entity: newEntity
    });
  } catch (error) {
    console.error("Error creating entity:", error);
    res.status(500).json({
      message: "An error occurred while creating the entity. Please try again later.",
      error: error.message
    });
  }
};




