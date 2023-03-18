import Product from '../../models/Product'
import Cart from '../../models/Cart'
import Order from '../../models/Order'
import connectDb from '../../utils/connectDb'
import jwt from 'jsonwebtoken'

connectDb()

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      await handleGetRequest(req, res)
      break
    case 'POST':
      await handlePostRequest(req, res)
      break
    case 'DELETE':
      await handleDeleteRequest(req, res)
      break
    default:
      res.status(405).send(`Method ${req.method} not allowed!`)
      break
  }
}

async function handleGetRequest (req, res) {
  const { _id } = req.query
  const product = await Product.findOne({ _id })
  res.status(200).json(product)
}

async function handlePostRequest (req, res) {
  const { name, price, description, mediaUrl } = req.body
  if (!name || !price || !description || !mediaUrl) {
    return res.status(422).send('Product missing one or more fidld')
  }
  const product = await new Product({
    name,
    price,
    mediaUrl,
    description
  }).save()
  res.status(201).json(product)
}

async function handleDeleteRequest (req, res) {
  const { _id } = req.query
  try {
    // 1) Delete product by id
    await Product.findOneAndRemove({ _id })
    // 2) Remove product from all carts, referenced as 'product'
    await Cart.updateMany(
      { 'products.product': _id },
      { $pull: { products: { product: _id } } }
    )
    // remove product in order history
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    await Order.find({ user: userId }).updateMany(
      { 'products.product': _id },
      { $pull: { products: { product: _id } } }
    )
    // const isExistProductInOrder = await Order.find({ user: userId }, { products: { $exists: true } });
    // console.log('isExistProductInOrder', isExistProductInOrder)

    res.status(204).json({})
  } catch (error) {
    console.log(error)
    res.status(500).send('Error deleting product')
  }
}
