import React, { useEffect, useState } from 'react'

export default function Home() {
  const [sdkReady, setSdkReady] = useState(false)
  const [user, setUser] = useState<{ username: string; wallet_address: string } | null>(null)

  useEffect(() => {
    const loadPiSdk = async () => {
      const scriptAlreadyExists = document.getElementById('pi-sdk')

      const initPi = async () => {
        if (window.Pi && window.Pi.init) {
          try {
            await window.Pi.init({
              version: '2.0',
              sandbox: true,
              appId: 'test-accdbdb15ea84aac',
            })
            console.log('✅ Pi SDK inizializzato con successo')
            setSdkReady(true)
          } catch (err) {
            console.error('❌ Errore init:', err)
          }
        } else {
          console.error('❌ Pi non disponibile su window')
        }
      }

      if (!scriptAlreadyExists) {
        const script = document.createElement('script')
        script.src = 'https://sdk.minepi.com/pi-sdk.js'
        script.id = 'pi-sdk'
        script.async = true
        script.onload = initPi
        document.body.appendChild(script)
      } else {
        initPi()
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const auth = await window.Pi.authenticate(scopes, (payment: any) => {
        console.log('💰 Pagamento incompleto:', payment)
      })

      console.log('✅ Login OK:', auth)
      setUser(auth.user)
    } catch (err) {
      console.error('❌ Errore login:', err)
    }
  }

  const handlePayment = async () => {
    if (!window.Pi || !user) return

    try {
      const paymentData = {
        amount: "1",
        memo: "Pagamento test",
        metadata: { type: "test" },
        developerApproved: true,
        developerCompleted: true,
      }

      await window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("🟡 Pronto per approvazione:", paymentId)
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("🟢 Completato:", paymentId, txid)
        },
        onCancel: (paymentId: string) => {
          console.warn("🔴 Annullato:", paymentId)
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          console.error("❌ Errore pagamento:", error)
        }
      })
    } catch (err) {
      console.error("❌ Errore createPayment:", err)
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>🎮 Pi Game</h1>

      {!user ? (
        <>
          <p>Accedi con il tuo account Pi</p>
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
        </>
      ) : (
        <>
          <p>
            Utente: <strong>{user.username}</strong><br />
            Wallet: <strong>{user.wallet_address}</strong>
          </p>
          <button
            onClick={handlePayment}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Invia 1 Pi (test)
          </button>
        </>
      )}
    </div>
  )
}
