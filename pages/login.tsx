import { useEffect, useState } from 'react'

export default function LoginTest() {
  const [sdkReady, setSdkReady] = useState(false)

  useEffect(() => {
    const initPi = async () => {
      try {
        await window.Pi.init({
          version: '2.0',
          sandbox: true,
          appId: 'test-accdbdb15ea84aac'
        })
        console.log('✅ Pi SDK inizializzato')
        setSdkReady(true)
      } catch (err) {
        console.error('❌ Errore init Pi SDK:', err)
      }
    }

    const loadPiSdk = () => {
      if (!document.getElementById('pi-sdk')) {
        const script = document.createElement('script')
        script.src = 'https://sdk.minepi.com/pi-sdk.js'
        script.id = 'pi-sdk'
        script.async = true
        script.onload = () => {
          console.log('📦 SDK caricato, avvio init...')
          initPi()
        }
        document.body.appendChild(script)
      } else {
        initPi()
      }
    }

    loadPiSdk()
  }, [])

  const handleLogin = async () => {
    console.log('👆 Login cliccato')
    if (!window.Pi || !window.Pi.authenticate) {
      console.error('❌ Pi SDK non disponibile in window')
      return
    }

    try {
      const scopes = ['username', 'payments', 'wallet_address']
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const auth = await window.Pi.authenticate(scopes, (payment: any) => {
        console.log('💰 Pagamento incompleto:', payment)
      })

      console.log('✅ Login completato:', auth)
      alert(`Benvenuto ${auth.user.username}, wallet: ${auth.user.wallet_address}`)
    } catch (err) {
      console.error('❌ Errore login:', err)
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>🔐 Test Login Pi SDK</h2>
      <button
        onClick={handleLogin}
        disabled={!sdkReady}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: sdkReady ? '#4CAF50' : '#aaa',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: sdkReady ? 'pointer' : 'not-allowed',
        }}
      >
        {sdkReady ? 'Login con Pi' : 'Inizializzo...'}
      </button>
    </div>
  )
}
