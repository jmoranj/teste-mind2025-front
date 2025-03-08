'use client'
interface ModalProps {
  isOpen: boolean
  closeModal: (value: boolean) => void
  children: React.ReactNode
}
export default function Modal({ closeModal, children, isOpen }: ModalProps) {
  return (
    <div
      className={`flex fixed top-0 left-0 right-0 bottom-0 z-50 justify-center items-center ${isOpen ? 'flex' : 'hidden'}`}
    >
      <div
        className={`absolute inset-0 bg-black opacity-50 ${isOpen ? 'opacity-50' : ''}`}
      ></div>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative rounded-lg shadow border-1 bg-[#0d132b] ">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
            <h3 className="text-lg font-semibold text-white">Preencha</h3>
            <button
              onClick={() => closeModal(false)}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
          <div className="p-4 md:p-5">{children}</div>
        </div>
      </div>
    </div>
  )
}
