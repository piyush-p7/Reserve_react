import React from 'react'
import { Form, Input, TextArea, Button, Image, Header, Icon, Message } from 'semantic-ui-react'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import catchError from '../utils/catchErrors'

const INITIAL_PRODUCT = {
  name: '',
  price: '',
  media: '',
  description: ''
}

function CreateProduct () {
  const [product, setProduct] = React.useState(INITIAL_PRODUCT)
  const [mediaPreview, setMediaPreview] = React.useState('')
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [disabled, setDisabled] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    const isProduct = Object.values(product).every(el => Boolean(el))
    isProduct ? setDisabled(false) : setDisabled(true)
  }, [product])

  const handleChange = e => {
    const { name, value, files } = e.target
    if (name === 'media') {
      setProduct(prevState => ({ ...prevState, media: files[0] }))
      setMediaPreview(window.URL.createObjectURL(files[0]))
    } else {
      setProduct(prevState => ({ ...prevState, [name]: value }))
    }
  }

  const handleUploadImage = async () => {
    const data = new FormData()
    data.append('file', product.media)
    data.append('upload_preset', 'reactreserve')
    data.append('cloud_name', 'asoview')
    const res = await axios.post(process.env.CLOUDINARY_URL, data)
    const mediaUrl = res.data.url
    return mediaUrl
  }

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      setLoading(true)
      setError('')
      const mediaUrl = await handleUploadImage()
      const url = `${baseUrl}/api/product`
      const { name, price, description } = product
      const payload = { name, price, description, mediaUrl }
      await axios.post(url, payload)
      setProduct(INITIAL_PRODUCT)
      setSuccess(true)
    } catch (err) {
      catchError(err, setError)
      console.error('ERROR!', err)
    } finally {
      setLoading(false)
    }
  }

  return <>
    <Header as='h2' block>
      <Icon name='add' color='orange' />
      Create New Product
    </Header>
    <Form
      loading={loading}
      success={success}
      error={Boolean(error)}
      onSubmit={handleSubmit}
    >
      <Message
        error
        header='Oops!'
        content={error}
      />
      <Message
        success
        icon='check'
        header='Success!'
        content='Your product has been posted'
      />
      <Form.Group widths='equal'>
        <Form.Field
          control={Input}
          name='name'
          label='Name'
          placeholder='Name'
          value={product.name}
          onChange={handleChange}
        />
        <Form.Field
          control={Input}
          name='price'
          label='Price'
          placeholder='Price'
          min='0.00'
          step='0.01'
          type='number'
          value={product.price}
          onChange={handleChange}
        />
        <Form.Field
          control={Input}
          name='media'
          label='Media'
          accept='image/*'
          type='file'
          content='Select Image'
          onChange={handleChange}
        />
      </Form.Group>
      <Image src={mediaPreview} rounded centered size='small' />
      <Form.Field
        control={TextArea}
        name='description'
        label='Description'
        placeholder='Description'
        value={product.description}
        onChange={handleChange}
      />
      <Form.Field
        control={Button}
        disabled={disabled || loading}
        color='blue'
        icon='pencil alternate'
        content='Submit'
      />
    </Form>
  </>
}

export default CreateProduct
