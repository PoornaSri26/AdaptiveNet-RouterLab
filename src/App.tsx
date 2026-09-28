import GraphVisualizer from './components/GraphVisualizer'
import AlgorithmPanel from './components/AlgorithmPanel'
import ControlPanel from './components/ControlPanel'
import ParticleDrift from './components/ParticleDrift'
import ScanGridButton from './components/ScanGridButton'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import ToastContainer from './components/ToastContainer'
import './index.css'

function AppContent() {
  const { theme } = useTheme()

  return (
    <div className={`h-screen w-screen flex flex-col relative overflow-hidden ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <ParticleDrift 
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        density={250}
        speed={35}
        dotSize={4}
        linkDistance={180}
        hover={120}
        linkThickness={0.8}
      />
      
      <div className="relative z-10 flex flex-col h-full fade-in">
        <header className="glass-panel border-b border-yellow-600/30 p-3 md:p-6 gold-glow">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-lg md:text-4xl font-bold gold-gradient-text mb-1 md:mb-2">AdaptiveNet RouterLab</h1>
              <p className={`text-xs md:text-base font-light ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Next-Generation Network Routing Simulator</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              <ScanGridButton
                label="EXPLORE"
                addIcon={true}
                icon={{
                  type: "lucide",
                  icon: "ArrowRight",
                  size: 16,
                  color: "#FFD700",
                  hoverColor: "#FFA500",
                  side: "left",
                  padding: 6,
                }}
                colors={{
                  fill: "rgba(0, 0, 0, 0.5)",
                  hoverFill: "rgba(0, 0, 0, 0.7)",
                  textColor: "#FFD700",
                  hoverTextColor: "#FFA500",
                }}
                scan={{
                  color: "#FFD700",
                  speed: 50,
                }}
                border={{
                  borderWidth: 1.5,
                  borderStyle: "solid",
                  borderColor: "rgba(255, 215, 0, 0.4)",
                }}
                rounded={6}
                padding="10px 16px"
                font={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: "0.5px",
                }}
                glitchIntensity={1}
                link="https://github.com/PoornaSri26/AdaptiveNet-RouterLab"
                newTab={true}
                style={{ height: "44px" }}
              />
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden p-4 md:p-5">
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 h-full">
            <div className="w-full md:w-80 flex-shrink-0">
              <ControlPanel />
            </div>
            
            <div className="flex-1 flex flex-col gap-4 md:gap-5 min-w-0">
              <GraphVisualizer />
              <AlgorithmPanel />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
