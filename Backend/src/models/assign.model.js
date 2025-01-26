import mongoose from "mongoose";

const assignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { 
      type: Date, 
      required: true,
      validate: {
        validator: function(value) {
          return value > Date.now(); // Ensures the deadline is in the future
        },
        message: 'Deadline must be in the future.'
      }
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Make sure you have a 'User' model for this reference
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",  // Assuming you have a 'Client' model for client data (optional)
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // Automatically creates 'createdAt' and 'updatedAt'
);

const Assign = mongoose.model("Assign", assignSchema);

export default Assign;
