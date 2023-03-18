import { Card } from 'semantic-ui-react'

function ProductList ({ products }) {
  function mapProductsToItem (products) {
    return products.map(product => ({
      header: product.name,
      image: product.mediaUrl,
      meta: `$${product.price}`,
      color: 'teal',
      fluid: true,
      childKey: product._id,
      href: `/product?_id=${product._id}`
    }))
  }
  return <Card.Group itemsPerRow={3} centered items={mapProductsToItem(products)}></Card.Group>
}

export default ProductList
