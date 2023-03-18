import React from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { Segment, Divider, Button } from 'semantic-ui-react'
import calculateCartTotal from '../../utils/calculateCartTotal'

function CartSummary ({ products, handleCheckout, success }) {
  const [cartAmount, setCartAmount] = React.useState(0)
  const [stripeAmount, setStripeAmount] = React.useState(0)
  const [isCartEmpty, setIsCartEmpty] = React.useState(false)
  React.useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products)
    setCartAmount(cartTotal)
    setStripeAmount(stripeTotal)
    setIsCartEmpty(products.length === 0)
  }, [products])

  return (
    <>
      <Divider />
      <Segment clearing size='large'>
        <strong>Sub total:</strong> ${cartAmount}
        <StripeCheckout
          name='React Reserve'
          amount={stripeAmount}
          image={products.length > 0 ? products[0].mediaUrl : ''}
          currency='USD'
          shippingAddress
          billingAddress
          zipCode
          stripeKey='pk_test_pxY05KqWdBcHbMqvLVv5Gsni00t9zlqPGO'
          token={handleCheckout}
          triggerEvent='onClick'
        >
          <Button
            icon='cart'
            disabled={isCartEmpty || success}
            color='teal'
            floated='right'
            content='Checkout'
          />
        </StripeCheckout>
      </Segment>
    </>
  )
}

export default CartSummary
