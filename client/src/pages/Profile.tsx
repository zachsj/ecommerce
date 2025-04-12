//MY ACCOUNT page, you see the UserInfo page if registered already or Regitration page if not

import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../lib/firebase";
import { store } from "../lib/store";
import Container from "../ui/Container";
import Registration from "../ui/Registration";
import UserInfo from "../ui/UserInfo";
import Loading from "../ui/Loading";

const Profile = () => { //Profile.tsx component shows user info if logged in and a registration form if not.
  const { currentUser, getUserInfo, isLoading } = store(); 
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => { //detects login/logout events and updates state accordingly.
      getUserInfo(user?.uid); // Fetch user data if logged in
    });
    return () => {
      unSub(); // Cleanup on unmount
    };
  }, [getUserInfo]);
  return (
    <Container> 
      {currentUser ? <UserInfo currentUser={currentUser} /> : <Registration />} {/* If the User is Logged In (currentUser exists) */}
      {/* If No User is Logged In (currentUser is null) The <Registration /> component is displayed instead */}
      {isLoading && <Loading />}  {/* If the user data is still being fetched, the <Loading /> component is shown. */}
    </Container>
  );
};

export default Profile;