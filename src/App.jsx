import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RecaptchaVerifier, getAuth, signOut } from "firebase/auth";
import app from './firebase.config';
import { contex } from './authContex';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

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
    const token = setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        console.log('Received code:', code);
        // getAccessToken(code);
      }
    }, 1000);

    return () => clearTimeout(token);
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
    const currentUrl = window.location.origin;
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=25373434296-busjiu3bjnq04o646d0qp81tk426rg1p.apps.googleusercontent.com&redirect_uri=${currentUrl}&scope=profile%20email&response_type=code&prompt=select_account`;

    // Redirect to Google login
    window.location.href = authUrl;
  };

  const sedFile = e => {
    const file = e.target.files[0]
    console.log(file)
    const formData = new FormData()
    formData.append('image', file)
    fetch('http://localhost:3000/file-upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }

  const fetchImageAsBase64 = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generateVCF = (name, phone, email, socialLinks, image) => {
    let vCard = `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${name}\r\nTEL;TYPE=CELL:${phone}\r\nEMAIL;TYPE=Email:${email}`;

    vCard += `\r\nURL;TYPE=Website:www.galiver.shop`;
    vCard += `\r\nURL;TYPE=Facebook:https://www.facebook.com/profile.php?id=100056995762123`;


    vCard += `\r\nADR;TYPE=address:;;${'dhaka, bangladesh'};`;

    vCard += `\r\nPHOTO;ENCODING=b;TYPE=JPEG:${image.split(',')[1]}`;

    vCard += `\r\nEND:VCARD`;
    return vCard;
  };

  const saveContact = async () => {
    const imageBase64 = await fetchImageAsBase64('https://api.motoviewhub.com/api/media?name=491408377-1719517832247-sohan-formal.png');
    const vcfContent = generateVCF(
      'Sohan',
      '+1234567890',
      'aryansohan@gmail.com',
      ['https://motoviewhub.com/', 'https://www.facebook.com/profile.php?id=100056995762123'],
      imageBase64
    );
    const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Sohan.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <>
      <button
        onClick={saveContact}
      >save contact</button>


      <button onClick={handleGoogleLogin} className="btn">custom google login</button>

      <GoogleOAuthProvider clientId={clintId}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log('Decoded JWT:', decoded);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>

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



        <div>
          <input onChange={sedFile} type="file" name="" id="" />
        </div>
      </div>
    </>
  )
}

export default App
