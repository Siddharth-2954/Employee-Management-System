const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true, // Allow optional emails without breaking unique constraints
      validate: {
        validator: function (email) {
          return email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : true;
        },
        message: "Invalid email format",
      },
    },
    position: {
      type: String,
      required: [true, "Employee position is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Employee department is required"],
      trim: true,
    },
    salary: {
      type: Number,
      min: [0, "Salary cannot be negative"],
      default: 0, // Default salary is 0
    },
    dateOfJoining: {
      type: Date,
      default: Date.now, // Automatically sets the date of joining
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"], // Only allow these values
      default: "Active", // Default status is "Active"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
  }
);

// Indexes for efficient query performance
employeeSchema.index({ userId: 1, email: 1 }, { unique: true, sparse: true }); // Combined index for unique user-employee email

// Middleware to enforce unique email for each user
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("email") || !this.email) return next();

  try {
    const existingEmployee = await mongoose.model("Employee").findOne({
      email: this.email,
      userId: this.userId,
      _id: { $ne: this._id }, // Exclude the current document in updates
    });

    if (existingEmployee) {
      throw new Error("This email is already associated with an employee for the user.");
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware to enforce positive salary during updates
employeeSchema.pre("save", function (next) {
  if (this.salary < 0) {
    return next(new Error("Salary cannot be negative."));
  }
  next();
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
