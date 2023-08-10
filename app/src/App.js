import { ethers } from "ethers";
import { useEffect, useState, useCallback } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";
import EscrowData from "./artifacts/contracts/Escrow.sol/Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [isPending, setIsPending] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const [formData, setFormData] = useState({
    arbiter: "",
    beneficiary: "",
    eth: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleApprove = useCallback(
    async (escrowContractAddress) => {
      const escrowContract = new ethers.Contract(
        escrowContractAddress,
        EscrowData.abi,
        signer
      );
      escrowContract.on("Approved", () => {
        const escrowsData = localStorage.getItem("escrows");
        const parsedEscrows = JSON.parse(escrowsData);

        const updatedEscrows = parsedEscrows.map((contract) => {
          if (contract.address === escrowContract.address) {
            return {
              ...contract,
              value: "0",
              isApproved: true,
            };
          }
          return contract;
        });

        setEscrows(updatedEscrows);
        localStorage.setItem("escrows", JSON.stringify(updatedEscrows));
      });

      try {
        setIsPending(true);
        const approveTxn = await escrowContract.connect(signer).approve();
        const result = await approveTxn.wait();
        console.log("result", result);
      } catch (err) {
        console.log("ERROR", err);
        setIsFailed(true);
      }

      setIsPending(false);
    },
    [signer]
  );

  useEffect(() => {
    const storedEscrows = localStorage.getItem("escrows");
    if (storedEscrows) {
      const parsedEscrows = JSON.parse(storedEscrows);

      // Add the handleApprove method to each escrow object
      const escrowsWithMethods = parsedEscrows.map((escrow) => ({
        ...escrow,
        handleApprove: () => handleApprove(escrow.address),
      }));

      setEscrows(escrowsWithMethods);
    }
  }, [handleApprove]);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const { arbiter, beneficiary, eth } = formData;
    const value = ethers.utils.parseEther(eth);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      deployer: await signer.getAddress(),
      arbiter,
      beneficiary,
      value: value.toString(),
      isApproved: false,
      handleApprove: () => handleApprove(escrowContract.address),
    };

    setEscrows((prevEscrows) => {
      const newEscrows = [...prevEscrows, escrow];
      localStorage.setItem("escrows", JSON.stringify(newEscrows));
      return newEscrows;
    });
  }

  return (
    <div className="h-screen bg-swell-blue">
      <main className="p-10">
        <h1 className="text-center mb-10 text-6xl text-white font-cubano">
          Escrow Factory
        </h1>
        <div className="w-full md:w-3/4 xl:w-1/2 flex flex-col justify-center mx-auto">
          <div className="border border-gray-700 rounded-xl p-10 w-full bg-neutral-800 mb-5">
            <h1 className="text-center text-4xl mb-2 text-white font-cubano">
              {" "}
              Create Contract{" "}
            </h1>
            <div className="mb-3">
              <label className="text-white font-semibold text-xl font-gothic text-lg">
                Arbiter Address
              </label>

              <div>
                <input
                  type="text"
                  name="arbiter"
                  value={formData.arbiter}
                  onChange={handleChange}
                  className="w-full rounded-md border-none"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-white font-semibold text-xl font-gothic text-lg">
                Beneficiary Address
              </label>
              <div>
                <input
                  type="text"
                  name="beneficiary"
                  value={formData.beneficiary}
                  onChange={handleChange}
                  className="w-full rounded-md border-none"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-white font-semibold text-xl font-gothic text-lg">
                Deposit Amount of ETH
              </label>

              <div>
                <input
                  type="text"
                  name="eth"
                  value={formData.eth}
                  onChange={handleChange}
                  className="w-full rounded-md border-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                className="border-2 border-white rounded-md px-5 py-2 text-white font-semibold font-gothic text-lg hover:bg-white hover:text-neutral-800 transition duration-300 ease-in-out"
                id="deploy"
                onClick={(e) => {
                  e.preventDefault();

                  newContract();
                }}
              >
                Deploy
              </button>
            </div>
          </div>

          <div className="border border-gray-700 rounded-xl p-5 w-full bg-neutral-800 p-10">
            <h1 className="text-center text-4xl mb-2 text-white font-cubano">
              {" "}
              Deployed Contracts{" "}
            </h1>

            <div id="container">
              {escrows.map((escrow) => {
                return (
                  <Escrow
                    key={escrow.address}
                    {...escrow}
                    isPending={isPending}
                    isFailed={isFailed}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
