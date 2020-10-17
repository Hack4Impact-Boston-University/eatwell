export default Profile = ({ session }) => {
  return <p>{session.user.name}</p>;
};

export async function getServerSideProps({ req, res }) {
  // Get the user's session based on the request
  const session = await getSession(req);

  if (!session) {
    // If no user, redirect to login
    res.writeHead(307, { Location: '/login' });
    res.end();
    return { props: {} };
  }

  // If there is a user, return the current session
  return { props: { session } };
}