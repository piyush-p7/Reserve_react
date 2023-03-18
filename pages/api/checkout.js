import Stripe from 'stripe'
import uuidv4 from 'uuid/v4'
import jwt from 'jsonwebtoken'
import Cart from '../../models/Cart'
import Order from '../../models/Order'
import calculateCartTotal from '../../utils/calculateCartTotal'

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  const { paymentData } = req.body
  try {
    // verify and get user id from token
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    // find cart based on user id, populate it
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'products.product',
      model: 'Product'
    })
    // calculate cart totals again from cart products
    const { cartTotal, stripeTotal } = calculateCartTotal(cart.products)
    // get email for payment data, see if linked with existing Stripe customer
    const prevCustomer = await stripe.customers.list({
      email: paymentData.email,
      limit: 1
    })
    const isExistingCustomer = prevCustomer.data.length > 0
    // If not existing customer, create them base on their email
    let newCustomer
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentData.email,
        source: paymentData.id
      })
    }
    const customer = (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id
    // create change with total, send receipt email
    await stripe.charges.create({
      currency: 'usd',
      amount: stripeTotal,
      receipt_email: paymentData.email,
      customer,
      description: `Checkout | ${paymentData.email} | ${paymentData.id}`
    }, {
      idempotency_key: uuidv4()
    })
    // add order data to database
    await new Order({
      user: userId,
      email: paymentData.email,
      total: cartTotal,
      products: cart.products
    }).save()
    // clear product in cart
    await Cart.findOneAndUpdate(
      { _id: cart._id },
      { $set: { products: [] } }
    )
    // send back success (200) response
    res.status(200).send('Checkout successful!')
  } catch (error) {
    console.log(error)
    res.status(500).send('Error prossessing charge')
  }
}
