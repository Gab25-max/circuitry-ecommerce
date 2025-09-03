import Medusa from "@medusajs/js-sdk"
import { 
  liteClient as algoliasearch, 
  LiteClient as SearchClient,
} from "algoliasearch/lite"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
  
/*
import Medusa from "@medusajs/js-sdk"

let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const result = await sdk.auth.login(
  "customer",
  "emailpass",
  {
    email: "customer@gmail.com",
    password: "supersecret"
  }
)

if (typeof result !== "string") {
  alert("Authentication requires additional steps")
  // replace with the redirect logic of your application
  window.location.href = result.location
  return
}

// customer is now authenticated
// all subsequent requests will use the token in the header
const { customer } = await sdk.store.customer.retrieve()*/

export const searchClient: SearchClient = {
  ...(algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "", 
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || ""
  )),
  search: async (params) => {
    const request = Array.isArray(params) ? params[0] : params
    const query = "params" in request ? request.params?.query : 
      "query" in request ? request.query : ""

    if (!query) {
      return {
        results: [
          {
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            hitsPerPage: 0,
            processingTimeMS: 0,
            query: "",
            params: "",
          },
        ],
      }
    }

    return await sdk.client.fetch(`/store/products/search`, {
      method: "POST",
      body: {
        query,
      },
    })
  },
}