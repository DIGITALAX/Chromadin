import { useSelector } from "react-redux";
import IndexingModal from "./Indexer";
import Collect from "./Collect";
import Purchase from "./Purchase";
import useControls from "../../Video/hooks/useControls";
import { RootState } from "@/redux/store";
import { useAccount } from "wagmi";
import useConnect from "../../SideBar/hooks/useConnect";
import FollowerOnly from "./FollowerOnly";
import useFollowers from "../../Interactions/hooks/useFollowers";
import Claim from "./Claim";
import ImageLarge from "./ImageLarge";
import Error from "./Error";
import Success from "./Success";

const Modals = () => {
  const indexingModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const collectModal = useSelector(
    (state: RootState) => state.app.modalReducer
  );
  const purchaseModal = useSelector(
    (state: RootState) => state.app.purchaseReducer
  );
  const successModal = useSelector(
    (state: RootState) => state.app.successReducer
  );
  const errorModal = useSelector((state: RootState) => state.app.errorReducer);
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const collectModuleValues = useSelector(
    (state: RootState) => state.app.postCollectReducer
  );
  const followersModal = useSelector(
    (state: RootState) => state.app.followerOnlyReducer
  );
  const claimModal = useSelector(
    (state: RootState) => state.app.noHandleReducer
  );
  const mainImage = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value?.media
  );
  const imageViewer = useSelector(
    (state: RootState) => state.app.imageViewerReducer
  );
  const {
    profile,
    followProfile,
    followLoading,
    approved,
    approveCurrency: approveFollowCurrency,
  } = useFollowers();
  const {
    collectInfoLoading,
    approvalLoading,
    collectCommentLoading,
    approveCurrency,
    collectVideo,
  } = useControls();
  const { address } = useAccount();
  const { handleLensSignIn } = useConnect();
  return (
    <>
      {purchaseModal?.open && (
        <Purchase
          collectInfoLoading={collectInfoLoading}
          approvalLoading={approvalLoading}
          address={address}
          collectModuleValues={collectModuleValues}
          lensProfile={lensProfile}
          collectComment={collectVideo}
          collectLoading={collectCommentLoading[purchaseModal?.index!]}
          approveCurrency={approveCurrency}
          handleLensSignIn={handleLensSignIn}
          commentId={purchaseModal?.id}
        />
      )}
      {followersModal?.open && (
        <FollowerOnly
          profile={profile}
          followProfile={followProfile}
          followLoading={followLoading}
          approved={approved}
          approveCurrency={approveFollowCurrency}
        />
      )}
      {collectModal?.open && <Collect message={collectModal?.message} />}
      {claimModal?.value && <Claim />}
      {imageViewer.value && <ImageLarge mainImage={mainImage!} />}
      {errorModal.value && <Error />}
      {successModal.open && <Success media={successModal.media} />}
      {indexingModal?.value && (
        <IndexingModal message={indexingModal?.message} />
      )}
    </>
  );
};

export default Modals;
