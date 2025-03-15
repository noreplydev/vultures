import type { AppProps } from 'next/app'
import "./globals.css"

import { JetBrains_Mono } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const jetbrains = JetBrains_Mono({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return <div className={'h-screen w-screen ' + jetbrains.className}>
    <Component {...pageProps} />
  </div>
}