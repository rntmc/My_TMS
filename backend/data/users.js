import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'User',
    email: 'user@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: "User",
  },
  {
    name: 'Admin',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: "Admin",
  },
  {
    name: 'Carrier',
    email: 'carrier@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: "Carrier",
  },
]

export default users;