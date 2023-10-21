import { useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RecaptchaVerifier, getAuth } from "firebase/auth";
import app from './firebase.config';
import { contex } from './authContex';


function App() {
  const { recaptcha } = useContext(contex)
  const callApi = () => {
    fetch('http://localhost:3000/send')
      .then(response => response.json())
      .then(data => console.log(data));

  }

  const auth = getAuth(app)

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

  return (
    <>
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
        <p>nodemailer test button</p>
        <button onClick={callApi} className="btn">click</button>
      </div>
    </>
  )
}

export default App
