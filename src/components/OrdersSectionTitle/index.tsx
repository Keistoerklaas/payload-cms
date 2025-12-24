type OrdersSectionTitleProps = {
  field?: {
    admin?: {
      custom?: {
        heading?: string
      }
    }
  }
}

const OrdersSectionTitle = ({ field }: OrdersSectionTitleProps) => (
  <div style={{ marginBottom: '0.75rem' }}>
    <h3 style={{ margin: 0 }}>{field?.admin?.custom?.heading ?? 'Bestelling'}</h3>
  </div>
)

export default OrdersSectionTitle
