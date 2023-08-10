import { ethers } from "ethers";

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
  isApproved,
  deployer,
  isPending,
  isFailed,
}) {
  const eth = ethers.utils.formatEther(value);

  let buttonOrMessage;

  if (isFailed) {
    buttonOrMessage = <div>Transaction failed. Please try again.</div>;
  } else if (isPending) {
    buttonOrMessage = <div>Transaction pending...</div>;
  } else if (isApproved) {
    buttonOrMessage = (
      <div>Arbiter has dispersed funds to the beneficiary!</div>
    );
  } else {
    buttonOrMessage = (
      <button
        type="button"
        className="border-2 border-white rounded-md px-5 py-2 text-white font-semibold font-gothic text-lg hover:bg-white hover:text-neutral-800 transition duration-300 ease-in-out"
        id={address}
        onClick={(e) => {
          e.preventDefault();
          handleApprove();
        }}
      >
        Approve
      </button>
    );
  }
  return (
    <div className="text-white text-lg">
      <ul>
        <li>
          <div className="font-semibold font-gothic"> Contract Address </div>
          <div> {address} </div>
        </li>
        <li>
          <div className="font-semibold font-gothic"> Deployer Address </div>
          <div> {deployer} </div>
        </li>
        <li>
          <div className="font-semibold font-gothic">
            {" "}
            Arbiter Address (EOA){" "}
          </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div className="font-semibold font-gothic">
            {" "}
            Beneficiary Address (EOA)
          </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div className="font-semibold font-gothic"> Value </div>
          <div> {eth} ETH </div>
        </li>
        <div className="text-end">{buttonOrMessage}</div>
      </ul>
    </div>
  );
}
