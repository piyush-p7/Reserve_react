import App from 'next/app'
import Layout from '../components/_App/Layout'
import { parseCookies, destroyCookie } from 'nookies'
import { redirectUser } from '../utils/auth'
import baseUrl from '../utils/baseUrl'
import axios from 'axios'
import Router from 'next/router'

class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    const { token } = parseCookies(ctx)
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    if (!token) {
      const isProtectedRoute = ctx.pathname === '/account' || ctx.pathname === '/create'
      if (isProtectedRoute) {
        redirectUser(ctx, '/login')
      }
    } else {
      try {
        const payload = { headers: { Authorization: token } }
        const url = `${baseUrl}/api/account`
        const res = await axios.get(url, payload)
        const user = res.data
        const isRoot = user.role === 'root'
        const isAdmin = user.role === 'admin'
        // if authenticated , but not of role 'admin' or 'root', redirect to '/create' page
        const isNotPermitted = !(isRoot || isAdmin) && ctx.pathname === '/create'
        if (isNotPermitted) {
          redirectUser(ctx, '/')
        }
        pageProps.user = user
      } catch (error) {
        console.error('Error getting current user', error)
        // 1) throw out invalid token
        destroyCookie(ctx, 'token')
        // 2) redirect to login
        redirectUser(ctx, '/login')
      }
    }

    return { pageProps }
  }

  componentDidMount () {
    window.addEventListener('storage', this.sycnLogout)
  }

  sycnLogout = (event) => {
    if (event.key === 'logout') {
      Router.push('/login')
    }
  }

  render () {
    const { Component, pageProps } = this.props
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    )
  }
}

export default MyApp
