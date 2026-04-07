import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

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
    <Card
      sx={{ maxWidth: 345, minWidth: 345, flexShrink: 0, bgcolor: '#333333' }}
    >
      <CardMedia sx={{ height: 140 }} image={image} title={title} />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ color: '#9f9f9f' }}
        >
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#9f9f9f' }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          component="a"
          href={buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Show Map
        </Button>
      </CardActions>
    </Card>
  )
}
