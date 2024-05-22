const { default: mongoose } = require("mongoose");
const Student = require("../Models/ModelsPage");
const passport = require("passport");
const User = require("../Models/UserModel");

exports.poststudent = async (req, res) => {
  const { name, subject, marks } = req.body;
  console.log(name, subject, typeof marks);
  try {
    let student = await Student.findOne({ name, subject });
    if (student) {
      student.marks = marks;
      await student.save();
      res.json({ updated: true });
    } else {
      student = new Student({ name, subject, marks });
      await student.save();
      res.json({ updated: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllData = (req, res) => {
  Student.find()
    .then((data) => res.json(data))
    .catch((err) =>
      res.status(404).json({ message: "Data not found", error: err.message })
    );
};

exports.postUpdateData = (req, res) => {
  const { id } = req.params; // Assuming the student ID is passed in the URL params
  const { name, subject, marks } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid ID" });
  }

  Student.findByIdAndUpdate(
    { _id: id },
    { name, subject, marks },
    { new: true }
  )
    .then((updatedStudent) => {
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json({
        message: "Student updated successfully",
        student: updatedStudent,
      });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Failed to update student", error: err.message })
    );
};

exports.deleteData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid ID" });
  }

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.status(200).json({
      message: "Student deleted successfully",
      student: deletedStudent,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete student", error: error.message });
  }
};

exports.signup = (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      passport.authenticate("local")(req, res, () => {
        res.status(200).json({ message: "Signup successful" });
      });
    }
  );
};

exports.login = (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: err.message });
      return res.status(200).json({ message: "Login successful" });
    });
  })(req, res);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json({ message: "Logout successful" });
  });
};
