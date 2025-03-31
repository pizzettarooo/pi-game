import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function PaymentPage() {
  const [user, setUser] = useState<{ username: string; wallet_address: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem('piUser')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      console.log("📦 Utente salvato:", parsedUser)
      setUser(parsedUser)
    } else {
      router.push('/login')
    }
  }, [router])

  const handlePayment = async () => {
    if (!window.Pi || !user) return

    try {
      const paymentData = {
        amount: "1",
        memo: "Pagamento test",
        metadata: { type: "test" },
        developerApproved: true,
        developerCompleted: true
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
        onError: (error: any) => {
          console.error("❌ Errore:", error)
        }
      })
    } catch (err) {
      console.error("❌ Errore createPayment:", err)
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>💸 Pagamento</h1>
      {user ? (
        <>
          <p>
            Utente: <strong>{user.username}</strong><br />
            Wallet: <strong>{user.wallet_address}</strong>
          </p>
          <button
            onClick={handlePayment}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Invia 1 Pi (test)
          </button>
        </>
      ) : (
        <p>⏳ Caricamento utente...</p>
      )}
    </div>
  )
}
