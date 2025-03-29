import React, { useEffect, useState } from 'react'

export default function Home() {
  const [sdkReady, setSdkReady] = useState(false)

  useEffect(() => {
    const loadPiSdk = async () => {
      const scriptAlreadyExists = document.getElementById('pi-sdk')
      if (!scriptAlreadyExists) {
        const script = document.createElement('script')
        script.src = 'https://sdk.minepi.com/pi-sdk.js'
        script.id = 'pi-sdk'
        script.async = true
        script.onload = async () => {
          console.log('✅ Pi SDK caricato')
          await initPiSdk()
        }
        document.body.appendChild(script)
      } else {
        await initPiSdk()
      }
    }

    const initPiSdk = async () => {
      if (window.Pi && window.Pi.init) {
        try {
          await window.Pi.init({ sandbox: true })
          console.log('✅ Pi SDK inizializzato con successo')
          setSdkReady(true)
        } catch (err) {
          console.error('❌ Errore durante init:', err)
        }
      } else {
        console.error('❌ Pi SDK non trovato in window')
      }
    }

    loadPiSdk()
  }, [])

  const handleLogin = async () => {
    if (!sdkReady) {
      alert('⏳ Attendi... Pi SDK non pronto!')
      return
    }

    try {
      const scopes = ['username', 'payments', 'wallet_address']
      const onIncompletePaymentFound = (payment) => {
        console.log('💰 Pagamento incompleto trovato:', payment)
      }

      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound)
      console.log('✅ Dati utente:', auth)
      alert(`Ciao ${auth.user.username}, wallet: ${auth.user.wallet_address}`)
    } catch (err) {
      console.error('❌ Errore durante il login:', err)
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>🎮 Gioco Pi Network</h1>
      <p>Accedi con il tuo account Pi per iniziare a giocare.</p>
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
