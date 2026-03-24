import './globals.css'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Image from 'next/image'
import 'nextra-theme-docs/style.css'
import { League_Spartan } from "next/font/google";
import Link from 'next/link'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { SupabaseAuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/toaster'

const leagueSpartan = League_Spartan({
  variable: '--font-logo',
  subsets: ['latin'],
})
 
export const metadata = {
  title: 'Hasfy Docs',
  description: 'Documentation officielle de Hasfy.',
}
 
const navbar = (
  <Navbar
    logo={
        <div className="flex items-center gap-3 text-white my-2">
          <Image src="/hasfy-logo.svg" alt="LogoHasfy" width={40} height={40}/>
          <span className="text-3xl font-medium text-foreground font-logo">Hasfy</span>
        </div>
    }
  />
)
const footer = <Footer>{new Date().getFullYear()} © Hasfy.</Footer>
 
export default async function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      dir="ltr"
      suppressHydrationWarning
    >
      <Head color={{
        hue: 0,
        saturation: 12,
        lightness: 100,
      }}>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SupabaseAuthProvider>
            <Layout
              navbar={navbar}
              pageMap={await getPageMap()}
              docsRepositoryBase="https://github.com/HasfyFR/Hasfy-Docs/tree/main"
              footer={footer}
            >
              {children}
            </Layout>
            <Toaster />
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}