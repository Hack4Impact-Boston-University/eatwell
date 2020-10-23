import Link from 'next/link'
import { useUser } from '../utils/auth/useUser'
import * as ui from '@material-ui/core'

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
        <ui.Button variant="outlined">
          <Link href='recipes/upload'>
              Upload
          </Link>
        </ui.Button>
        <ui.Button variant="outlined">
          <a onClick={() => logout()}>Log Out</a>
        </ui.Button>
      </div>
    </div>
  )
}

export default Profile