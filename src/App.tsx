import SunInformation from './SunInformation'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Sun Information Dashboard
        </h1>
        <SunInformation />
      </div>
    </div>
  )
}

export default App
