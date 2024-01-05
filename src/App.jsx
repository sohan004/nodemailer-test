import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RecaptchaVerifier, getAuth, signOut } from "firebase/auth";
import app from './firebase.config';
import { contex } from './authContex';
import axios from 'axios';

function App() {
  const { recaptcha } = useContext(contex)
  const callApi = () => {
    fetch('http://localhost:3000/send')
      .then(response => response.json())
      .then(data => console.log(data));

  }

  const clintId = '25373434296-busjiu3bjnq04o646d0qp81tk426rg1p.apps.googleusercontent.com'
  const secret = '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'

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      console.log('Received code:', code);
      getAccessToken(code);
    }
  }, []);

  const getAccessToken = (code) => {
    fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `code=${code}&client_id=${clintId}&client_secret=${secret}&redirect_uri=http://localhost:5173&grant_type=authorization_code`,
    })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          getUserInfo(data.access_token)
        }
      })
      .catch((err) => {
        console.log('access token get error', err)
      });
  }

  const getUserInfo = (token) => {


    fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.id) {
          console.log('User info:', data);
        }
      })
      .catch((err) => {
        console.log('user info get error', err)
      })
  }



  const [otp, setOtp] = useState('')
  const [number, setNumber] = useState('')
  const [otpConfirm, setOtpConfirm] = useState(null)

  const sendOtp = () => {

    recaptcha(number)
      .then((res) => {
        console.log(res)
        setOtpConfirm(res)
      })
      .catch((err) => {
        console.log(err)
      })

  }


  const verifyOtp = () => {
    otpConfirm.confirm(otp)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleGoogleLogin = () => {
    // Set the prompt parameter to 'select_account'
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=25373434296-busjiu3bjnq04o646d0qp81tk426rg1p.apps.googleusercontent.com&redirect_uri=http://localhost:5173&scope=profile%20email&response_type=code&prompt=select_account`;

    // Redirect to Google login
    window.location.href = authUrl;
  };

  return (
    <>
      <button onClick={handleGoogleLogin} className="btn">custom google login</button>

      <div className='firebase'>

        <input onChange={e => setNumber(e.target.value)} value={number} type="text" name="" id="" />
        <button onClick={sendOtp} className="btn ">otp send</button>


        <div>
          <input onChange={e => setOtp(e.target.value)} value={otp} type="text" name="" id="" />
          <button onClick={verifyOtp} className="btn ">verify</button>
        </div>
        <div id='recaptcha-container'></div>
      </div>

      <div className='nodemailer'>
        <div id='ggl-btn'>

        </div>

        <p>nodemailer test button</p>
        <button onClick={callApi} className="btn">click</button>
      </div>
    </>
  )
}

export default App
