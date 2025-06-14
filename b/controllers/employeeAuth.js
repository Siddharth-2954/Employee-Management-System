const Employee = require('../models/Employee'); // Adjust path if needed

// Get all employees
const getEmployeesByUser = async (req, res) => {
  try {
    // Ensure `userId` is available in the request
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    const userId = req.user.userId; // Authenticated user's ID

    // Fetch employees associated with the logged-in user
    const employees = await Employee.find({ userId });

    res.status(200).json({
      message: "Employees retrieved successfully",
      data: employees,
    });
  } catch (error) {
    console.error("Error retrieving employees:", error);
    res.status(500).json({
      error: "Failed to retrieve employees.",
      details: error.message,
    });
  }
};


// Get single employee by ID
const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const employee = await Employee.findOne({ _id: id, userId });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found or access denied.' });
    }
    res.status(200).json({ data: employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Failed to fetch employee.' });
  }
};

// Add new employee
const addEmployee = async (req, res) => {
  try {
    const { name, position, department, email, salary } = req.body;

    // Ensure `userId` is available in the request
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    const userId = req.user.userId; // Authenticated user's ID

    // Validate required fields
    if (!name || !position || !department) {
      return res.status(400).json({ 
        error: 'Missing required fields. Name, position, and department are required.' 
      });
    }

    // Create employee object
    const employeeData = {
      name: name.trim(),
      position: position.trim(),
      department: department.trim(),
      dateOfJoining: new Date(),
      status: 'Active',
      userId, // Associate employee with the logged-in user
    };

    // Add optional fields if provided
    if (email && email.trim()) {
      employeeData.email = email.trim().toLowerCase();
    }
    if (salary) {
      const parsedSalary = parseFloat(salary);
      if (!isNaN(parsedSalary) && parsedSalary >= 0) {
        employeeData.salary = parsedSalary;
      }
    }

    // Save the new employee
    const newEmployee = new Employee(employeeData);
    const savedEmployee = await newEmployee.save();

    res.status(201).json({ 
      message: 'Employee added successfully', 
      data: savedEmployee 
    });
  } catch (error) {
    console.error('Error adding employee:', error);

    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'An employee with this email already exists. Please use a different email address.' 
      });
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors.join(', ')
      });
    }

    res.status(500).json({ 
      error: 'Failed to add employee.',
      details: error.message 
    });
  }
};


// Update employee by ID
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const employee = await Employee.findOne({ _id: id, userId });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found or access denied.' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id, 
      req.body,
      { 
        new: true,
        runValidators: true,
      }
    );
    
    res.status(200).json({ 
      message: 'Employee updated successfully', 
      data: updatedEmployee 
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(400).json({ 
      error: 'Failed to update employee.',
      details: error.message 
    });
  }
};

// Delete employee by ID
const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const employee = await Employee.findOne({ _id: id, userId });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found or access denied.' });
    }

    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee.' });
  }
};

module.exports = {
  getEmployeesByUser,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
