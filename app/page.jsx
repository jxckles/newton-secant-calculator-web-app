import { Header } from '@/components/header';
import { NumericalMethodsApp } from '@/components/numerical-methods-app';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <NumericalMethodsApp />
      </main>
      <Footer />
    </div>
  );
}