import Range from './components/Range'
export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>
        <h1 className="text-3xl">
          Exercise
          <sup className="rounded-full text-white h-6 w-6 inline-block text-center overflow-hidden p-4 text-sm">
            <span className="h-full w-full flex items-center justify-center">
              1
            </span>
          </sup>
        </h1>
      </header>
      <div className='max-w-6xl mx-auto w-full'>
        <Range />
      </div>
    </div>
  );
}
