import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function NotFoundPage({ message = 'This page does not exist.' }: { message?: string }) {
  return (
    <>
      <h1 className="text-4xl leading-10 font-bold text-primary">Not found</h1>
      <p className="mt-4">{message}</p>
      <Link to="/" className={cn(buttonVariants(), 'mt-6 w-full font-semibold sm:w-auto')}>
        Browse programme
      </Link>
    </>
  )
}
