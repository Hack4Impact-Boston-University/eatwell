import Link from 'next/link'
import { useUser } from '../utils/auth/useUser'

const Profile = () => {
  const { user, logout } = useUser()
  if (!user) {
    console.log("HERE")
    return (
      <div>
        <p>
          You are not signed in.
          <Link href={'/auth'}>
            <a>Sign in</a>
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <div>
        <p>You're signed in. Email: {user.email}</p>
        <p
          style={{
            display: 'inline-block',
            color: 'blue',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          onClick={() => logout()}
        >
          Log out
        </p>
      </div>
    </div>
  )
}

export default Profile