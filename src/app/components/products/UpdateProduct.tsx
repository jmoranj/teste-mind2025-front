import Product from '@/schemas/ProductsSchemas'
import Modal from './Modal'

interface UpdateProductsProps {
  item: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function UpdateProducts({
  //  item,
  isOpen,
  onClose,
}: UpdateProductsProps) {
  return (
    <Modal isOpen={isOpen} closeModal={onClose}>
      <form>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nome
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Digite o nome do produto"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Imagem do Produto
            </label>
            <input
              type="file"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Quantidade
            </label>
            <input
              type="number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Quantidade"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Valor unidade
            </label>
            <input
              type="number"
              step="0.01"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Preço"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Categoria
            </label>
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
              <option value="Saída">Saída</option>
              <option value="Entrada">Entrada</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Atualizar
        </button>
      </form>
    </Modal>
  )
}
