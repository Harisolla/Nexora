/**
 * NEXORA — Product Sort
 * Sort dropdown for the product catalogue.
 */
export default function ProductSort({ value, onChange }) {
  const options = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Top Rated' },
    { value: 'name-asc', label: 'Name: A–Z' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <label
        htmlFor="product-sort"
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-text-secondary)',
          whiteSpace: 'nowrap',
        }}
      >
        Sort by
      </label>
      <select
        id="product-sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
        style={{ width: 'auto', minWidth: '160px', cursor: 'pointer' }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

