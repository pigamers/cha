const mongoose = require('mongoose');

const entitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    designation: { 
        type: String, 
        required: true,
        enum: ['CEO', 'Manager', 'Head of the Department', 'Shift Supervisor', 'Worker'], // Validated designations
    },
    parent: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Entity', 
        default: null 
    }, // Reference to parent entity (for hierarchical structure)
    children: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Entity' 
    }] // Subordinates of the entity
});

// Add an index for faster lookups of designations
entitySchema.index({ designation: 1 });

// Create a model for Entity
const Entity = mongoose.model('Entity', entitySchema);

module.exports = Entity;
