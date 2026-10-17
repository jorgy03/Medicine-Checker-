import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import About from './pages/About'
import DrugDetail from './pages/DrugDetail'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="drug/:rxcui" element={<DrugDetail />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
