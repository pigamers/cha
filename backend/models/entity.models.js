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
      enum: ['CEO', 'Manager', 'Head of the Department', 'Shift Supervisor', 'Worker'],
    },
    expanded: {
      type: Boolean,
      default: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entity',
      default: null,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entity',
      },
    ],
  },
  { timestamps: true }
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

entitySchema.index({ designation: 1 });

// Helper method to transform the data into the required format
entitySchema.statics.getHierarchicalData = async function() {
  // First, get all entities with populated children
  const entities = await this.find({})
    .populate({
      path: 'children',
      populate: {
        path: 'children'
      }
    });

  // Function to transform entity into required format
  const transformEntity = (entity) => {
    const transformed = {
      label: `${entity.name} (${entity.designation})`,
      expanded: entity.expanded
    };

    if (entity.children && entity.children.length > 0) {
      transformed.children = entity.children.map(child => transformEntity(child));
    }

    return transformed;
  };

  // Get root level entities (those without parents)
  const rootEntities = entities.filter(entity => !entity.parent);
  
  // Transform the data
  return rootEntities.map(entity => transformEntity(entity));
};

// Add a method to add children to a parent
entitySchema.methods.addChild = async function (childId) {
  if (!this.children.includes(childId)) {
    this.children.push(childId);
    await this.save();
  }
};

const Entity = mongoose.model('Entity', entitySchema);

module.exports = Entity;
