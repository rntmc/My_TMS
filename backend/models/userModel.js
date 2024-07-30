import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User", "Carrier"], 
  },
  active: {
    type: Boolean,
    default: true // Default value is true for active
  }
}, {
  timestamps: true
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
};

userSchema.pre('save', async function (next) {//pre: do sth before it's saved in the db
  if (!this.isModified('password')) { //mongoose middleware. If we are not dealing with pw we are moving on
    next()
  }

  const salt = await bcrypt.genSalt(10); //hashing pw before it's saved to db
  this.password = await bcrypt.hash(this.password, salt)
}) 

const User = mongoose.model("User", userSchema)

export default User;