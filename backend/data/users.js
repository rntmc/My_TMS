import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'User',
    email: 'user@email.com',
    password: bcrypt.hashSync('123456', 10),
    isUser: true,
  },
  {
    name: 'Admin',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Carrier',
    email: 'carrier@email.com',
    password: bcrypt.hashSync('123456', 10),
    isCarrier: true,
  },
]

export default users;