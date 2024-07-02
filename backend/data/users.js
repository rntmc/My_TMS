import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Renato',
    email: 'renato@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Carrier',
    email: 'carrier@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
]

export default users;