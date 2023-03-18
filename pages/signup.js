import React from 'react'
import { Button, Form, Icon, Segment, Message } from 'semantic-ui-react'
import Link from 'next/link'
import catchError from '../utils/catchErrors'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import { handleLogin } from '../utils/auth'

const INITIAL_USER = {
  name: '',
  email: '',
  password: ''
}

function Signup () {
  const [user, setUser] = React.useState(INITIAL_USER)
  const [disabled, setDisabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    const isUser = Object.values(user).every(e => Boolean(e))
    isUser ? setDisabled(false) : setDisabled(true)
  }, [user])

  const handleChange = e => {
    const { name, value } = e.target
    setUser(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const url = `${baseUrl}/api/signup`
      const payload = { ...user }
      const res = await axios.post(url, payload)
      handleLogin(res.data)
    } catch (err) {
      catchError(err, setError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Message
        attached
        icon='settings'
        color='teal'
        header='Get started'
        content='Create a new account'
      />
      <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
        <Message 
          error
          header='Oops!'
          content={error}
        />
        <Segment>
          <Form.Input
            fluid
            icon='user'
            iconPosition='left'
            label='Name'
            placeholder='Name'
            name='name'
            value={user.name}
            onChange={handleChange}
          />
          <Form.Input
            fluid
            icon='envelope'
            iconPosition='left'
            label='Email'
            placeholder='Email'
            name='email'
            value={user.email}
            onChange={handleChange}
          />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            label='Password'
            placeholder='Password'
            name='password'
            type='password'
            value={user.password}
            onChange={handleChange}
          />
          <Button
            icon='signup'
            type='submit'
            color='orange'
            content='Signup'
            disabled={disabled || loading}
          />
        </Segment>
      </Form>
      <Message attached='bottom' warning>
        <Icon name='help' />
        Existing user ? { ' ' }
        <Link href='/login'>
          <a>Log in Here</a>
        </Link>{ ' ' } instead.
      </Message>
    </>
  )
}

export default Signup
