export default function MediaCard({
  image,
  title,
  description,
  buttonUrl,
}: {
  image: string
  title: string
  description: string
  buttonUrl: string
}) {
  return (
    <div
      style={{
        maxWidth: 345,
        minWidth: 345,
        flexShrink: 0,
        background: '#333',
      }}
    >
      <div
        style={{
          height: 140,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
        }}
        role="img"
        aria-label={title}
      />
      <div style={{ padding: 16 }}>
        <div style={{ color: '#9f9f9f', fontSize: '1.25rem', fontWeight: 500 }}>
          {title}
        </div>
        <div style={{ color: '#9f9f9f' }}>{description}</div>
      </div>
      <div style={{ padding: 8 }}>
        <a href={buttonUrl} target="_blank" rel="noopener noreferrer">
          Show Map
        </a>
      </div>
    </div>
  )
}
