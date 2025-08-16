export default function CourseLessonPage({ params }: { params: { lessonId: string } }) {
  return (
    <div>
      <h1>Course Lesson Page</h1>
      <p>Lesson ID: {params.lessonId}</p>
    </div>
  )
}