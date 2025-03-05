import ProductsContainer from './components/products/ProductsContainer'
import TransactionsContainer from './components/Transactions/TransactionsTable'

export default function Home() {
  return (
    <div>
      <TransactionsContainer />
      <ProductsContainer />
    </div>
  )
}
