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
  network,
}) {
  const eth = ethers.utils.formatEther(value);

  const abbreviate = (address) =>
    address.slice(0, 5) + "..." + address.slice(-4);

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
        className="border-2 border-white rounded-md px-5 py-2 text-white font-semibold font-gothic text-lg hover:bg-white hover:text-neutral-800 transition duration-300 ease-in-out w-36"
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

  let etherscanUrl;
  if (network.name === "homestead") {
    etherscanUrl = `https://etherscan.io/address/${address}`;
  } else {
    etherscanUrl = `https://${network.name}.etherscan.io/address/${address}`;
  }

  return (
    <div className="text-white text-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="mb-2">
          <div className="font-semibold font-gothic"> Contract Address </div>
          <div>
            <a href={etherscanUrl} className="underline text-sky-300">
              {abbreviate(address)}
            </a>{" "}
          </div>
        </div>
        <div className="mb-2">
          <div className="font-semibold font-gothic">
            {" "}
            Deployer Address (EOA){" "}
          </div>
          <div>
            {" "}
            <a href={etherscanUrl} className="underline text-sky-300">
              {abbreviate(deployer)}
            </a>{" "}
          </div>
        </div>
        <div className="mb-2">
          <div className="font-semibold font-gothic">
            {" "}
            Arbiter Address (EOA){" "}
          </div>
          <div>
            {" "}
            <a href={etherscanUrl} className="underline text-sky-300">
              {abbreviate(arbiter)}
            </a>{" "}
          </div>
        </div>
        <div className="mb-2">
          <div className="font-semibold font-gothic">
            {" "}
            Beneficiary Address (EOA)
          </div>
          <div>
            {" "}
            <a href={etherscanUrl} className="underline text-sky-300">
              {abbreviate(beneficiary)}
            </a>{" "}
          </div>
        </div>
        <div className="mb-2">
          <div className="font-semibold font-gothic"> Network </div>
          <div> {network.name} </div>
        </div>
        <div className="mb-2">
          <div className="font-semibold font-gothic"> Value </div>
          <div> {eth} ETH </div>
        </div>
      </div>
      <div className="text-end">{buttonOrMessage}</div>
    </div>
  );
}
