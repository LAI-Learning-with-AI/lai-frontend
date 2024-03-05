import { useAuth0 } from "@auth0/auth0-react";
import './profile.css'

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  console.log(import.meta.env.VITE_AUTH0_DOMAIN + '...')

  if (!isAuthenticated)
    return (
        <div className='goleft'>
            <p>not auth</p>
        </div>
    )

  console.log(user);

  return (
    isAuthenticated && user && (
      <div className='goleft'>
        <p>hello</p>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

export default Profile;