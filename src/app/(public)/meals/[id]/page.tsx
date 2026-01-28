'use client'
import { useParams, usePathname } from 'next/navigation'

const DynamicMeals = () => {
    const pathname = usePathname()
  const params = useParams()

  return (
    <div>
      <h1>DynamicMeals</h1>
      <h2>Pathname: {pathname}</h2>
      <h2>Dynamic Parameter: {params.id}</h2>
    </div>
  )
}

export default DynamicMeals