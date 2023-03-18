import React from 'react'
import { Segment } from 'semantic-ui-react'
import CartItemList from '../components/Cart/CartItemList'
import CartSummary from '../components/Cart/CartSummary'
import { parseCookies } from 'nookies'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import cookie from 'js-cookie'
import catchErrors from '../utils/catchErrors'

function Cart ({ products, user }) {
  const [cartProducts, setCartProducts] = React.useState(products)
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleRemoveFromCart = async (productId) => {
    const url = `${baseUrl}/api/cart`
    const token = cookie.get('token')
    const payload = {
      params: { productId },
      headers: { Authorization: token }
    }
    const res = await axios.delete(url, payload)
    setCartProducts(res.data)
  }

  const handleCheckout = async (paymentData) => {
    try {
      setLoading(true)
      const url = `${baseUrl}/api/checkout`
      const token = cookie.get('token')
      const payload = { paymentData }
      const headers = { headers: { Authorization: token } }
      await axios.post(url, payload, headers)
      setSuccess(true)
    } catch (error) {
      catchErrors(error, window.alert)
    } finally {
      setLoading(false)
    }
  }

  return <Segment loading={loading}>
    <CartItemList
      handleRemoveFromCart={handleRemoveFromCart}
      user={user}
      products={cartProducts}
      success={success}
    />
    <CartSummary
      handleCheckout={handleCheckout}
      products={cartProducts}
      success={success}
    />
  </Segment>
}

Cart.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx)
  if (!token) {
    return { products: [] }
  }
  const url = `${baseUrl}/api/cart`
  const payload = { headers: { Authorization: token } }
  const res = await axios.get(url, payload)
  return { products: res.data }
}

export default Cart
