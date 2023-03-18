import React from 'react'
import axios from 'axios'
import ProductList from '../components/Index/ProductList'
import ProductPagination from '../components/Index/ProductPagination'
import baseUrl from '../utils/baseUrl'

function Home ({ products, totalPages }) {
  return (
    <>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </>
  )
}

Home.getInitialProps = async ctx => {
  const page = ctx.query.page ? ctx.query.page : 1
  const size = 9
  const url = `${baseUrl}/api/products`
  const payload = { params: { page, size } }
  // fecth data from server
  const res = await axios.get(url, payload)
  return res.data
  // return res data as an object
  // note: this object will be merge with existing props
}

export default Home
