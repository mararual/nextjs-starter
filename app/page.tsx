export const metadata = {
  title: 'Next.js Starter',
  description: 'A modern Next.js starter template with TypeScript, ESLint, and Tailwind CSS',
}

export default function Home(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Next.js</h1>
        <p className="text-lg text-gray-600">A modern starter template with TypeScript and Tailwind CSS</p>
      </div>
    </main>
  )
}
