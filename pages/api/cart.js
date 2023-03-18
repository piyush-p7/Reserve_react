import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import Cart from '../../models/Cart'
import connectDb from '../../utils/connectDb'
import log from '../../utils/getLog'

connectDb()

const { ObjectId } = mongoose.Types

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      await handleGetRequest(req, res)
      break
    case 'PUT':
      await handlePutRequest(req, res)
      break
    case 'DELETE':
      await handleDeleteRequest(req, res)
      break
    default:
      res.status(405).send(`Method ${req.method} not allowed`)
  }
}

async function handleGetRequest (req, res) {
  if (!('authorization' in req.headers)) {
    return res.status(401).send('No authorization token!')
  }
  try {
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    // log(`userId: ${userId}`)
    // log(`req.headers.authorization: ${req.headers.authorization}`)
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'products.product',
      model: 'Product'
    })
    console.log('cart', cart)
    // log(`cart: ${cart}`)
    res.status(200).json(cart.products)
  } catch (error) {
    // log(error)
    console.log('err', error)
    res.status(403).send('Please login again')
  }
}

async function handlePutRequest (req, res) {
  const { quantity, productId } = req.body
  if (!('authorization' in req.headers)) {
    return res.status(401).send('No authorization token!')
  }
  try {
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    // get user cart based on userId
    const cart = await Cart.findOne({ user: userId })
    // check if product already exists in cart
    const productExists = cart.products.some(doc => ObjectId(productId).equals(doc.product))
    // if so, increment quantity
    if (productExists) {
      await Cart.findOneAndUpdate(
        { _id: cart._id, 'products.product': productId },
        { $inc: { 'products.$.quantity': quantity } }
      )
    } else {
      // if not, add new product with given quantity
      const newProduct = { quantity, product: productId }
      await Cart.findOneAndUpdate(
        { _id: cart._id },
        { $addToSet: { products: newProduct } }
      )
    }
    res.status(200).send('Cart updated')
  } catch (error) {
    res.status(403).send('Please login again')
  }
}

async function handleDeleteRequest (req, res) {
  const { productId } = req.query
  if (!('authorization' in req.headers)) {
    return res.status(401).send('No authorization token!')
  }
  try {
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate({
      path: 'products.product',
      model: 'Product'
    })
    res.status(200).json(cart.products)
  } catch (error) {
    res.status(403).send('Please login again')
  }
}
