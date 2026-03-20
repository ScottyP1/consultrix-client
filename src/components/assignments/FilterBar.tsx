import { LuFilter } from 'react-icons/lu'

const FilterBar = ({
  options,
  selectedFilter,
  onFilterChange,
}: {
  options: readonly string[]
  selectedFilter: string
  onFilterChange: (value: string) => void
}) => {

  return (
    <div className="flex gap-4 items-center">
      <span className="flex items-center gap-2">
        Filter: <LuFilter size={20} />
      </span>
      {options.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onFilterChange(item)}
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
