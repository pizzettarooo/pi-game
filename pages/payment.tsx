import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function PaymentPage() {
  const [user, setUser] = useState<{ username: string; wallet_address: string } | null>(null)
  const router = useRouter()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const savedUser = localStorage.getItem('piUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      router.push('/login') // se non loggato, torna indietro
    }
  }, [])

  const handlePayment = async () => {
    if (!window.Pi || !user) return

    try {
      const paymentData = {
        amount: "1",
        memo: "Pagamento test",
        metadata: { type: "test" }
      }

      const onReadyForServerApproval = (paymentId: string) => {
        console.log("🟡 Pronto per approvazione:", paymentId)
      }

      const onReadyForServerCompletion = (paymentId: string, txid: string) => {
        console.log("🟢 Pronto per completamento:", paymentId, txid)
      }

      const onCancel = (paymentId: string) => {
        console.warn("🔴 Pagamento annullato:", paymentId)
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onError = (error: any) => {
        console.error("❌ Errore pagamento:", error)
      }

      await window.Pi.createPayment(paymentData, {
        onReadyForServerApproval,
        onReadyForServerCompletion,
        onCancel,
        onError
      })
    } catch (err) {
      console.error("❌ Errore createPayment:", err)
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>💸 Pagamento</h1>
      {user && (
        <p>
          Utente: <strong>{user.username}</strong><br />
          Wallet: <strong>{user.wallet_address}</strong>
        </p>
      )}

      <button
        onClick={handlePayment}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#2196F3',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Invia 1 Pi (test)
      </button>
    </div>
  )
}
