import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-light mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-light mb-4">Sidan hittades inte</h2>
        
        <p className="text-gray-300 mb-8">
          Sidan du letar efter finns inte. Den kan ha flyttats eller tagits bort.
        </p>
        
        <Link 
          href="/"
          className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Gå tillbaka till startsidan
        </Link>
      </div>
    </div>
  );
}
