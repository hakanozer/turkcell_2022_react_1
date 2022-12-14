import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { URLEnum } from './RouterEnum'
import { userLoginService } from './service'
import { encrypt } from './util'

function Login() {

    useEffect(() => {
      console.log(navigator.userAgent);
    }, [])
    

    const navigate = useNavigate()

    const [remember, setRemember] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const userLogin = (evt:React.FormEvent) => {
        evt.preventDefault()
        userLoginService(email, password).then( res => {
            const user = res.data.user[0]
            if ( user.durum === true && user.bilgiler ) {
                const stBilgiler = JSON.stringify( user.bilgiler )
                sessionStorage.setItem('user', encrypt(stBilgiler))
                if ( remember ) {
                    localStorage.setItem('user', encrypt(stBilgiler) )
                }
                navigate(URLEnum.PRODUCT)
            }else {
                setError( user.mesaj )
            }
        }).catch( error => {
            setError( error.message )
        })
    }

  return (
    <>
        <Helmet>
            <title>User Login</title>
            <meta name="description" content="User Login Page"></meta>
            <link rel="icon" href="https://ffo3gv1cf3ir.merlincdn.net/static_lib/assetsv2/common/images/favicon.ico" />
        </Helmet>
        <div className='row'>
            <div className='col-sm-4'></div>
            <div className='col-sm-4'>
                <h2>User Login</h2>

                { error !== '' && 
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error!</strong> { error }
                    <button onClick={() => setError('')} type="button" className="btn-close"></button>
                    </div>
                }

                <form onSubmit={userLogin}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input onChange={(evt) => setEmail(evt.target.value) }  required type="email" className="form-control" id="exampleInputEmail1" />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input onChange={(evt) => setPassword(evt.target.value) } required type="password" className="form-control" id="exampleInputPassword1" />
                </div>
                <div className="mb-3 form-check">
                    <input onClick={() => setRemember(!remember)} type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Remember</label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
            <div className='col-sm-4'></div>
        </div>
    </>
  )
}

export default Login