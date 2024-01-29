import { FunctionComponent } from "react";
import Vending from "./modules/Vending";
import Sampler from "./modules/Sampler";
import { SwitchViewProps } from "./types/home.types";
import { Viewer } from "../Common/Interactions/types/interactions.types";
import MakePost from "../Common/Wavs/modules/MakePost";
import AllPosts from "../Common/Wavs/modules/AllPosts";
const SwitchView: FunctionComponent<SwitchViewProps> = ({
  dispatch,
  viewer,
  allPosts,
  enabledCurrencies,
  setMediaLoading,
  handleGetMoreCollections,
  moreCollectionsLoading,
  setDropDownDateSort,
  searchOpen,
  searchResults,
  setDropDownPriceSort,
  handleSearch,
  handleSearchChoose,
  dropDownDateSort,
  dropDownPriceSort,
  graphData,
  statsLoading,
  setCanvas,
  canvas,
  postsLoading,
  hasMore,
  fetchMore,
  address,
  collect,
  mirror,
  like,
  mainPost,
  mainPostLoading,
  hasMoreComments,
  commentors,
  commentsLoading,
  openComment,
  comment,
  commentDescription,
  textElement,
  handleCommentDescription,
  commentLoading,
  caretCoord,
  mentionProfiles,
  profilesOpen,
  handleMentionClick,
  handleKeyDownDelete,
  handleLensSignIn,
  openConnectModal,
  lensProfile,
  profile,
  mediaLoading,
  quickProfiles,
  profileCollections,
  searchProfiles,
  profilesFound,
  profilesOpenSearch,
  fetchMoreSearch,
  hasMoreSearch,
  setProfilesOpenSearch,
  setProfilesFound,
  preElement,
  setOpenMirrorChoice,
  openMirrorChoice,
  router,
  history,
  filters,
  collectionInfo,
  collectionsLoading,
  mainMediaLoading,
  interactionsLoading,
  postCollectGif,
  fetchMoreComments,
  setMainOpenMirrorChoice,
  setOpenComment,
  openMainMirrorChoice,
  mainInteractionsLoading,
  setMainMediaLoading,
}): JSX.Element => {
  switch (viewer) {
    case Viewer.Collect:
      return (
        <Vending
          collectionInfo={collectionInfo}
          filters={filters}
          setDropDownDateSort={setDropDownDateSort}
          searchOpen={searchOpen}
          searchResults={searchResults}
          setDropDownPriceSort={setDropDownPriceSort}
          handleGetMoreCollections={handleGetMoreCollections}
          handleSearch={handleSearch}
          handleSearchChoose={handleSearchChoose}
          dropDownDateSort={dropDownDateSort}
          dropDownPriceSort={dropDownPriceSort}
          collectionsLoading={collectionsLoading}
          moreCollectionsLoading={moreCollectionsLoading}
          dispatch={dispatch}
          router={router}
        />
      );

    case Viewer.Sampler:
      return (
        <Sampler
          graphData={graphData}
          statsLoading={statsLoading}
          setCanvas={setCanvas}
          canvas={canvas}
        />
      );

    case Viewer.Chat:
      return (
        <div className="relative w-full h-full mid:h-[50.2rem] xl:h-[47.8rem] gap-3 flex items-start justify-center pt-10 overflow-y-scroll">
          <div className="relative w-3/4 h-fit flex flex-col items-start justify-start gap-4">
            <div className="relative w-full h-full flex flex-col items-start justify-center gap-3">
              <MakePost
                dispatch={dispatch}
                lensProfile={lensProfile}
                address={address}
              />
              <AllPosts
                interactionsLoading={interactionsLoading}
                enabledCurrencies={enabledCurrencies}
                hasMoreComments={hasMoreComments}
                history={history}
                mainMediaLoading={mainMediaLoading}
                mainPost={mainPost}
                postsLoading={postsLoading}
                mainPostLoading={mainPostLoading}
                router={router}
                commentors={commentors}
                profile={profile}
                commentsLoading={commentsLoading}
                profileCollections={profileCollections}
                fetchMoreComments={fetchMoreComments}
                postCollectGif={postCollectGif}
                mainInteractionsLoading={mainInteractionsLoading}
                setMainMediaLoading={setMainMediaLoading}
                setMainOpenMirrorChoice={setMainOpenMirrorChoice}
                setMediaLoading={setMediaLoading}
                setOpenComment={setOpenComment}
                openMainMirrorChoice={openMainMirrorChoice}
                dispatch={dispatch}
                allPosts={allPosts}
                hasMore={hasMore}
                fetchMore={fetchMore}
                address={address!}
                openMirrorChoice={openMirrorChoice}
                setOpenMirrorChoice={setOpenMirrorChoice}
                comment={comment}
                like={like}
                collect={collect}
                mediaLoading={mediaLoading}
                mirror={mirror}
                commentDescription={commentDescription}
                textElement={textElement}
                handleCommentDescription={handleCommentDescription}
                commentLoading={commentLoading}
                caretCoord={caretCoord}
                mentionProfiles={mentionProfiles}
                profilesOpen={profilesOpen}
                handleMentionClick={handleMentionClick}
                handleKeyDownDelete={handleKeyDownDelete}
                commentOpen={openComment}
                handleLensSignIn={handleLensSignIn}
                openConnectModal={openConnectModal}
                lensProfile={lensProfile}
                quickProfiles={quickProfiles}
                searchProfiles={searchProfiles}
                profilesFound={profilesFound}
                profilesOpenSearch={profilesOpenSearch}
                fetchMoreSearch={fetchMoreSearch}
                hasMoreSearch={hasMoreSearch}
                setProfilesOpenSearch={setProfilesOpenSearch}
                setProfilesFound={setProfilesFound}
                preElement={preElement}
              />
            </div>
          </div>
        </div>
      );

    default:
      return <></>;
  }
};

export default SwitchView;
