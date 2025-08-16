export default function PlayerPage({ params }: { params: { lessonId: string } }) {
  return (
    <div>
      <h1>Player Page</h1>
      <p>Lesson ID: {params.lessonId}</p>
    </div>
  )
}