import BreadCrumb from "./_components/breadcrumb";
import Content from "./_components/content";
import Title from "./_components/title";
import { sampleContent } from "./_data/sample-content";
import React from "react";

interface ProfileProps {
  params: {
    profile: string[];
    lng: string;
  };
}

export default async function Profile({ params }: ProfileProps) {
  const { profile, lng } = params;

  // Parse the profile parts from the catch-all route
  const part = profile[0];
  const chapter = profile[1];
  const section = profile[2];

  return (
    <React.Fragment>
      <div className="flex flex-col w-[800px] gap-[32px] pb-[100px]">
        <BreadCrumb />
        <div className="flex flex-col gap-[16px]">
          <Title>Major Settlement Areas</Title>
          <Content lng={lng} content={sampleContent} />
        </div>
      </div>
    </React.Fragment>
  );
}
