/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import Image from "next/image";
import useInput from "../hooks/useInput";
import { useState } from "react";
import React from "react";

const Home: NextPage = () => {
  const [userStoryPrompt, setUserStoryPrompt] = useState("");
  const [createStory, setCreateStory] = useState(false);

  const {
    inputValue: userPrompt,
    valueHandler: userPromptHandler,
    reset: resetUserPrompt,
  } = useInput(() => true, "");

  const storyPromptHandler = () => {
    setUserStoryPrompt(userPrompt);
    resetUserPrompt();
    setCreateStory(true);
  };
  const storyHandler = () => {
    setUserStoryPrompt("");
    setCreateStory(false);
  };

  return (
    <>
      <Head>
        <title>AI Image Story</title>
        <meta name="description" content="AI Image and story creator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            AI <span className="text-[hsl(280,100%,70%)]">Image</span> Story
          </h1>
          <div className="flex flex-col gap-2">
            {createStory ? (
              <div className="flex items-center gap-6">
                {userStoryPrompt.trim().length > 0 ? (
                  <ImageStory userStoryPrompt={userStoryPrompt} />
                ) : null}
                <button
                  onClick={storyHandler}
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                >
                  Create Image Story
                </button>
              </div>
            ) : (
              <div className="mb-3 w-[652px]">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label mb-2 inline-block text-white"
                >
                  Create Story
                </label>
                <textarea
                  value={userPrompt}
                  onChange={userPromptHandler}
                  className="
        form-control
        border-grey
        m-0
        block
        min-h-[75px]
        w-full
        rounded
        border
        border-solid
        bg-white/30 bg-clip-padding
        px-3 py-1.5 text-base
        font-normal
        text-white
        transition
        ease-in-out
        focus:border-[#CC66FF] focus:bg-white/25 focus:text-white focus:outline-none
      "
                  id="exampleFormControlTextarea1"
                  placeholder=""
                ></textarea>
                <button
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                  onClick={storyPromptHandler}
                >
                  Create Image Story
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            {/* <AuthShowcase /> */}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const ImageStory = ({ userStoryPrompt }: { userStoryPrompt: string }) => {
  let imageStory = {} as any;
  if (userStoryPrompt.trim().length > 0) {
    imageStory = api.example.imageStory.useQuery({
      message: userStoryPrompt,
    });
  }

  return (
    <div className="flex">
      {imageStory?.data && (
        <>
          <Image
            src={imageStory?.data?.message.image}
            width={256}
            height={256}
            alt={imageStory?.data?.message.story.subTitle}
            className="w-full"
          />
          <div>
            <div className="text-left text-4xl font-extrabold text-white">
              {imageStory?.data?.message?.story?.title}
            </div>
            <div className="text-left text-2xl font-extrabold text-white">
              {imageStory?.data?.message?.story?.subTitle}
            </div>
            <div className="text-left font-extrabold text-white">
              {imageStory?.data?.message?.story?.description}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
