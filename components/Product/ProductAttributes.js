import React from 'react'
import { Header, Button, Modal } from 'semantic-ui-react'
import baseUrl from '../../utils/baseUrl'
import axios from 'axios'
import { useRouter } from 'next/router'
import cookie from 'js-cookie'

function ProductAttributes ({ description, _id, user }) {
  const [modal, setModal] = React.useState(false)
  const router = useRouter()
  const isRoot = user && user.role === 'root'
  const isAdmin = user && user.role === 'admin'
  const isRootOrAdmin = isRoot || isAdmin

  return <>
    <Header as='h3'>About this product</Header>
    <p>{description}</p>
    {
      isRootOrAdmin && <>
        <Button
          icon='trash alternate outline'
          color='red'
          content='Delete Product'
          onClick={() => setModal(true)}
        />
        <Modal open={modal}>
          <Modal.Header>Confirm Delete</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to delete this product</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content='cancel'
              onClick={() => setModal(false)}
            />
            <Button
              negative
              icon='trash'
              labelPosition='right'
              content='Delete'
              onClick={async () => {
                const token = cookie.get('token')
                const url = `${baseUrl}/api/product`
                const payload = { params: { _id }, headers: { Authorization: token } }
                await axios.delete(url, payload)
                router.push('/')
              }}
            />
          </Modal.Actions>
        </Modal>
      </>
    }
  </>
}

export default ProductAttributes
