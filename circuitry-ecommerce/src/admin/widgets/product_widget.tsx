import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Pencil } from "@medusajs/icons"
import { Container } from "../components/container"
import { ActionMenu } from "../components/action_menu"

const ProductWidget = () => {
  return (
    <Container>
      <ActionMenu groups={[
        {
          actions: [
            {
              icon: <Pencil />,
              label: "Edit",
              onClick: () => {
                alert("You clicked the edit action!")
              },
            },
          ],
        },
      ]} />
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default ProductWidget