import ProductList from "./components/ProductList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">      
      <ProductList />

      <footer className="w-full text-center py-4">
        <p>© 2024 All rights reserved</p>
      </footer>
    </main>
  );
}