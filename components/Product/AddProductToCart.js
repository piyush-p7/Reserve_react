import React from 'react'
import { Input } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import axios from 'axios'
import baseUrl from '../../utils/baseUrl'
import cookie from 'js-cookie'
import catchError from '../../utils/catchErrors'

function AddProductToCart ({ user, productId }) {
  const [quantity, setQuantity] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    let timeout
    if (success) {
      timeout = setTimeout(() => setSuccess(false), 3000)
    }
    // if user change to another router, component can be unmout so we must return function cancel timeout
    return () => {
      clearTimeout(timeout)
    }
  }, [success])

  return <Input
    type='number'
    min='1'
    placeholder='Quantity'
    value={quantity}
    onChange={e => setQuantity(Number(e.target.value))}
    action={
      user && success ? {
        color: 'blue',
        content: 'Item added!',
        icon: 'plus cart',
        disabled: true
      }
        : user ? {
          color: 'orange',
          content: 'Add To Cart',
          icon: 'plus cart',
          loading,
          disabled: loading,
          onClick: async () => {
            try {
              setLoading(true)
              const url = `${baseUrl}/api/cart`
              const payload = { quantity, productId }
              const token = cookie.get('token')
              const headers = { headers: { Authorization: token } }
              await axios.put(url, payload, headers)
              setSuccess(true)
            } catch (error) {
              catchError(error, window.alert)
            } finally {
              setLoading(false)
            }
          }
        } : {
          color: 'blue',
          content: 'Sign up to purchase',
          icon: 'signup',
          onClick: () => router.push('/signup')
        }}
  />
}

export default AddProductToCart
