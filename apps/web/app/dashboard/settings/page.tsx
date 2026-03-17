import { Settings } from "lucide-react"

const SettingsPage = () => {
  return (
    <div className="px-4 py-6 md:px-8 md:py-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
        <Settings size={28} className="text-zinc-600" />
      </div>
      <h2 className="text-white font-semibold text-lg mb-1">Settings</h2>
      <p className="text-zinc-500 text-sm">Coming soon</p>
    </div>
  )
}

export default SettingsPage
