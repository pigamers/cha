const mongoose = require('mongoose');

// Define the schema for the Entity model
const entitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      enum: ['CEO', 'Manager', 'Head of the Department', 'Shift Supervisor', 'Worker'], // Validated designations
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entity',
      default: null,
    }, // Reference to parent entity (for hierarchical structure)
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entity',
      },
    ], // Subordinates of the entity
  },
  { timestamps: true } // To add createdAt and updatedAt fields automatically
);

// Middleware to check if multiple CEOs exist before saving
entitySchema.pre('save', async function (next) {
  if (this.designation === 'CEO') {
    const existingCEO = await this.constructor.findOne({ designation: 'CEO' });
    if (existingCEO && existingCEO._id.toString() !== this._id.toString()) {
      return next(new Error('There can only be one CEO in the organization.'));
    }
  }
  next();
});

// Indexing designations for faster queries (useful for finding all managers, etc.)
entitySchema.index({ designation: 1 });

// Virtual method to get the full name (helpful for debugging or UI display)
entitySchema.virtual('fullName').get(function () {
  return `${this.name} (${this.designation})`;
});

// Add a method to add children to a parent (helper for creating relationships)
entitySchema.methods.addChild = async function (childId) {
  if (!this.children.includes(childId)) {
    this.children.push(childId);
    await this.save();
  }
};

// Create a model for Entity
const Entity = mongoose.model('Entity', entitySchema);

module.exports = Entity;
