import Error from 'next/error'

export default function UnauthorizedPage() {
  return <Error statusCode={401} />
}
