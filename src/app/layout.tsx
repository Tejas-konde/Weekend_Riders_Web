import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ManagerPanel from '@/components/ManagerPanel';

export const metadata: Metadata = {
  title: 'Weekend Riders – Sahyadri Trek Planner',
  description:
    'Premium guided treks through the ancient forts and pristine nature of the Sahyadri ranges. Book Harishchandragad, Torna, Rajgad, Rajmachi and more.',
  keywords: 'trekking, Sahyadri, Maharashtra, Harishchandragad, Torna, Rajgad, weekend trek, fort trek',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ManagerPanel />
      </body>
    </html>
  );
}
