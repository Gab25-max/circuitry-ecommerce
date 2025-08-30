import { 
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
  authenticate,
} from "@medusajs/framework/http"
import { z } from "zod"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { GetAdminReviewsSchema } from "../admin/reviews/route"
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/route"
import { GetStoreReviewsSchema } from "./store/products/[id]/reviews/route"

// ----------------- ADMIN -----------------

// Validator per creare una review lato admin
export const PostAdminCreateProductReview = z.object({
  product_id: z.string().min(1, "product_id obbligatorio"),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  user_id: z.string().optional(), // se vuoi legarlo a un utente specifico
})

// Schema per query lato admin
export const GetProductReviewsSchema = createFindParams()

// ----------------- STORE -----------------

// Validator per creare una review lato store
export const PostStoreReviewSchema = z.object({
  product_id: z.string().min(1, "product_id obbligatorio"),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export default defineMiddlewares({
  routes: [
    // --- ADMIN ROUTES ---
    {
      matcher: "/admin/product-reviews",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostAdminCreateProductReview),
      ],
    },
    {
      matcher: "/admin/product-reviews",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(
          GetProductReviewsSchema,
          {
            defaults: [
              "id",
              "product_id",
              "rating",
              "comment",
              "user_id",
            ],
            isList: true,
          }
        ),
      ],
    },
    {
      matcher: "/admin/products",
      method: ["POST"],
      additionalDataValidator: {
        review_id: z.string().optional(),
      },
    },

    // --- NEW ADMIN REVIEWS ROUTE ---
    {
      matcher: "/admin/reviews",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetAdminReviewsSchema, {
          isList: true,
          defaults: [
            "id",
            "title",
            "content",
            "rating",
            "product_id",
            "customer_id",
            "status",
            "created_at",
            "updated_at",
            "product.*",
          ],
        }),
      ],
    },

    {
      matcher: "/admin/reviews/status",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(PostAdminUpdateReviewsStatusSchema),
      ],
    },

    // --- STORE ROUTES ---
    {
      matcher: "/store/reviews",
      method: "POST",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        validateAndTransformBody(PostStoreReviewSchema),
      ],
    },
    {
      matcher: "/store/products/:id/reviews",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetStoreReviewsSchema, {
          isList: true,
          defaults: [
            "id", 
            "rating", 
            "title", 
            "first_name", 
            "last_name", 
            "content", 
            "created_at",
          ],
        }),
      ],
    },
  ],
})