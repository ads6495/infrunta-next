export default function CourseUnitPage({ params }: { params: { unitId: string } }) {
  return (
    <div>
      <h1>Course Unit Page</h1>
      <p>Unit ID: {params.unitId}</p>
    </div>
  )
}