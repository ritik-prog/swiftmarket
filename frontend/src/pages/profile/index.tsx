import React from "react";
import Sidebar from "../../components/profile-ui/Sidebar";
import withAuth from "../../hoc/withAuth";
import FloatingButton from "../../components/common/FloatingButton";

const Profile = () => {
  return (
    <div>
      <Sidebar />
      <FloatingButton />
    </div>
  );
};

export default withAuth(Profile);
