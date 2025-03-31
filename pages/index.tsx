import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const [sdkReady, setSdkReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadPiSdk = async () => {
      const script = document.createElement('script')
      script.src = 'https://sdk.minepi.com/pi-sdk.js'
      script.id = 'pi-sdk'
      script.async = true
      script.onload = async () => {
        console.log('✅ Pi SDK caricato')
        await window.Pi.init({
          version: "2.0",
          sandbox: true,
          appId: "test-accdbdb15ea84aac"
        })
        console.log('✅ Pi SDK inizializzato con successo')
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!window.Pi) loadPiSdk()
    else setSdkReady(true)
  }, [])

  const handleLogin = async () => {
    if (!sdkReady) return alert("⏳ Pi SDK non pronto!")

    try {
      const scopes = ['username', 'payments', 'wallet_address']
      const auth = await window.Pi.authenticate(scopes, (payment) => {
        console.log('💰 Pagamento incompleto:', payment)
      })

      if (auth && auth.user) {
        console.log('✅ Login OK:', auth)
        localStorage.setItem('piUser', JSON.stringify(auth.user))
        router.push('/payment')
      } else {
        console.error('❌ Login fallito')
      }
    } catch (err) {
      console.error('❌ Errore login:', err)
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>🎮 Login con Pi</h2>
      <p>Accedi per continuare al pagamento</p>
      <button
        onClick={handleLogin}
        disabled={!sdkReady}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: sdkReady ? 'pointer' : 'not-allowed'
        }}
      >
        Login con Pi
      </button>
    </div>
  )
}
