import { createRoot } from 'react-dom/client'
import Ejemplollaves from '../Ejemplollaves'
import Contador from '../Contador'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <>
    <Ejemplollaves />
    <Contador />
  </>
)