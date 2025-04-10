import { Urbanist } from 'next/font/google'
import './globals.css'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import { ThemeProvider } from 'next-themes'
import ScrollToTop from '@/components/ScrollToTop'
import Aoscompo from '@/utils/aos'
import GlobalSearch from '@/components/Layout/GlobalSearch'
import AuthProvider from '@/components/Auth/AuthProvider'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { UserProvider } from '@/contexts/UserContext'
import { CartProvider } from '@/contexts/CartContext'
import CartSidebar from '@/components/Cart/CartSidebar'

const font = Urbanist({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className}`}>
        <AuthProvider>
          <NotificationProvider>
            <UserProvider>
              <CartProvider>
                <ThemeProvider
                  attribute="class"
                  enableSystem={true}
                  defaultTheme="system">
                  <Aoscompo>
                    <Header />
                    <GlobalSearch />
                    {children}
                    <Footer />
                    <CartSidebar />
                  </Aoscompo>
                  <ScrollToTop />
                </ThemeProvider>
              </CartProvider>
            </UserProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
