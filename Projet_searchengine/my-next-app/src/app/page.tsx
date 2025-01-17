import SearchInput from './components/SearchInput'
import SearchResults from './components/SearchResults'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Patent Search Engine</h1>
      <SearchInput />
      <SearchResults />
    </main>
  )
}

