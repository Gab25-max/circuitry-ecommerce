import { Metadata } from "next"
import { sdk } from "@lib/sdk"
import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Medusa Store account.",
}

"use client" // include with Next.js 13+



export default function Login() {
  const loginWithGoogle = async () => {
    const result = await sdk.auth.login("customer", "google", {})

    if (typeof result === "object" && result.location) {
      // redirect to Google for authentication
      window.location.href = result.location

      return
    }
    
    if (typeof result !== "string") {
      // result failed, show an error
      alert("Authentication failed")
      return
    }

    // all subsequent requests are authenticated
    const { customer } = await sdk.store.customer.retrieve()

    console.log(customer)
  }

  return (
    <div>
      <button onClick={loginWithGoogle}>Login with Google</button>
    </div>
  )
}