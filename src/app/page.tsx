import TransactionsContainer from './components/Layout/BalanceTransactions'
import ProductsContainer from './components/products/ProductsContainer'

export default function Home() {
  return (
    <div>
      <TransactionsContainer />
      <ProductsContainer />
    </div>
  )
}
