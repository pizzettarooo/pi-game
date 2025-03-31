import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const [sdkReady, setSdkReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadPiSdk = async () => {
      if (!document.getElementById('pi-sdk')) {
        const script = document.createElement('script')
        script.src = 'https://sdk.minepi.com/pi-sdk.js'
        script.id = 'pi-sdk'
        script.async = true
        script.onload = initPiSdk
        document.body.appendChild(script)
      } else {
        initPiSdk()
      }
    }

    const initPiSdk = async () => {
      if (window.Pi && window.Pi.init) {
        try {
          await window.Pi.init({
            version: "2.0",
            appId: "test-accdbdb15ea84aac"
          })
          console.log('✅ Pi SDK inizializzato')
          setSdkReady(true)
        } catch (err) {
          console.error('❌ Errore init Pi SDK:', err)
        }
      }
    }

    loadPiSdk()
  }, [])

  const handleLogin = async () => {
    if (!sdkReady) return alert('Pi SDK non pronto!')

    try {
      const scopes = ['username', 'payments', 'wallet_address']
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onIncompletePaymentFound = (payment: any) => {
        console.log('💰 Pagamento incompleto:', payment)
      }

      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound)
      console.log('✅ Login OK:', auth)

      localStorage.setItem('piUser', JSON.stringify(auth.user))
      router.push('/payment')
    } catch (err) {
      console.error('❌ Errore login:', err)
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>🎮 Login con Pi</h1>
      <p>Accedi per continuare al pagamento</p>
      <button
        onClick={handleLogin}
        disabled={!sdkReady}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: sdkReady ? '#4CAF50' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: sdkReady ? 'pointer' : 'not-allowed'
        }}
      >
        {sdkReady ? 'Login con Pi' : 'Inizializzo...'}
      </button>
    </div>
  )
}
