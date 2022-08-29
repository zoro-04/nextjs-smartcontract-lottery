import { useWeb3Contract } from "react-moralis";
import { abi, contracAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LoteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chaiId = parseInt(chainIdHex);
    const raffleAddress = chaiId in contracAddresses ? contracAddresses[chaiId][0] : null;
    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumplayers] = useState("0");
    const [recentWinner, setrecentWinner] = useState("0");

    const dispatch = useNotification();

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    });

    // const {
    //     runContractFunction: enterRaffle,
    //     // data: enterTxResponse,
    //     isLoading,
    //     isFetching,
    // } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: raffleAddress,
    //     functionName: "enterRaffle",
    //     msgValue: entranceFee,
    //     params: {},
    // })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });
    const { runContractFunction: getNumberOfPlayer } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayer",
        params: {},
    });
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    });

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        const numPlayersFromCall = (await getNumberOfPlayer()).toString();
        const recentWinnerFromCall = await getRecentWinner();
        setEntranceFee(entranceFeeFromCall);
        setNumplayers(numPlayersFromCall);
        setrecentWinner(recentWinnerFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async (tx) => {
        await tx.wait(1);
        handleNewNotification(tx);
        updateUI();
    };

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notifiction",
            position: "topR",
            icon: "bell",
        });
    };
    return (
        <div>
            <p>Hi from LoteryEntrance!</p>
            {raffleAddress ? (
                <div className="">
                    <button
                        className="bg-blue-500 hover:bg-slate-500 text-white font-bold py-1 px-2 rounded ml-auto"
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            });
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <p>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</p>
                    <p>Players: {numPlayers}</p>
                    <p>Recent Winner: {recentWinner}</p>
                </div>
            ) : (
                <div>No Raffle Address deteched!!</div>
            )}
        </div>
    );
}
