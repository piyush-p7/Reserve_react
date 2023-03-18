import User from '../../models/User'
import jwt from 'jsonwebtoken'
import connectDb from '../../utils/connectDb'

connectDb

export default async (req, res) => {
  try {
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    // get user not is current root user
    const users = await User.find({ _id: { $ne: userId } })
      .sort({
        name: 'asc'
      })
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(403).send('Please login again')
  }
}
