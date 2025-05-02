import Footer from "../_components/footer";
import ProfileSidebar from "./_components/profile-sidebar";
import React from "react";

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}

const ProfileLayout: React.FC<ProfileLayoutProps> = async ({
  children,
  params,
}) => {
  const { lng } = await params;
  return (
    <React.Fragment>
      <div
        lang={lng}
        className="w-full flex justify-center mt-[100px] min-h-[1080px]"
      >
        <div className="w-[1200px] flex gap-[48px]">
          <ProfileSidebar />
          {children}
        </div>
      </div>
      <Footer lng={lng} />
    </React.Fragment>
  );
};

export default ProfileLayout;
