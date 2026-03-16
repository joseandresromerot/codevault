import { signIn } from "@/lib/auth"
import { Github } from "lucide-react"

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">CodeVault</h1>
          <p className="mt-2 text-zinc-400">Your personal code snippet manager</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-4">
          <h2 className="text-lg font-semibold text-white text-center">Sign in</h2>

          <form
            action={async () => {
              "use server"
              await signIn("github", { redirectTo: "/dashboard" })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-2.5 px-4 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <Github size={20} />
              Continue with GitHub
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
