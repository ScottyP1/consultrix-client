import { useState } from 'react'
import { LuFilter } from 'react-icons/lu'

const FilterBar = ({ options }: { options: readonly string[] }) => {
  const [selectedFilter, setSelectedFilter] = useState(options[0] ?? 'All')

  return (
    <div className="flex gap-4 items-center">
      <span className="flex items-center gap-2">
        Filter: <LuFilter size={20} />
      </span>
      {options.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setSelectedFilter(item)}
          className={`rounded-xl px-4 py-2 transition-colors ${
            selectedFilter === item
              ? 'bg-blue-600 text-white'
              : 'border text-slate-500'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
