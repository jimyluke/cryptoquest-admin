import RerenderNft from '../../components/rerender-nft/RerenderNft';
import UploadIpfs from '../../components/upload-ipfs/UploadIpfs';
import UpdateSolanaMetadata from '../../components/update-solana-metadata/UpdateSolanaMetadata';

const UpdateNft = () => {
  return (
    <div className="update-nft">
      <RerenderNft />
      <UploadIpfs />
      <UpdateSolanaMetadata />
    </div>
  );
};

export default UpdateNft;
