import { Segment, Header, Button, Icon, Item, Message } from 'semantic-ui-react'
import { useRouter } from 'next/router'

function CartItemList ({ products, user, handleRemoveFromCart, success }) {
  const router = useRouter()

  function mapCartProductToItem (products) {
    return products.map(p => ({
      header: (
        <Item.Header as='a' onClick={() => router.push(`/product?_id=${p.product._id}`)}>{p.product.name}</Item.Header>
      ),
      image: p.product.mediaUrl,
      meta: `${p.quantity} x $${p.product.price}`,
      fluid: true,
      childKey: p.product._id,
      extra: (
        <Button
          basic
          icon='remove'
          floated='right'
          onClick={() => handleRemoveFromCart(p.product._id)}
        />
      )
    }))
  }

  if (success) {
    return (
      <Message 
        success
        header='Success!'
        content='Your order and payment has been accepted'
        icon='star outline'
      />
    )
  }

  if (products.length === 0) {
    return <Segment secondary inverted color='teal' textAlign='center' placeholder>
      <Header icon>
        <Icon name='shopping basket' />
        No product in your card. Add some!
      </Header>
      <div>
        {
          user
            ? <Button color='orange' onClick={() => router.push('/')}>View product</Button>
            : <Button color='blue' onClick={() => router.push('/login')}>Login to add product</Button>
        }
      </div>
    </Segment>
  }
  return <Item.Group divided items={mapCartProductToItem(products)} />
}

export default CartItemList
