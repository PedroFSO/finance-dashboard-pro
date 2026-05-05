import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function AppToaster() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      closeOnClick
      pauseOnFocusLoss={false}
      theme="dark"
    />
  )
}
