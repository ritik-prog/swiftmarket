import React from "react";
import Sidebar from "../../components/profile-ui/Sidebar";
import withAuth from "../../hoc/withAuth";

const Profile = () => {
  return (
    <div>
      <Sidebar />
    </div>
  );
};

export default withAuth(Profile);
