import { useEffect } from "react";
import { useMoralis } from "react-moralis";

const ManualHeader = () => {
    const { enableWeb3, account, isWeb3Enabled, Moralis, isWeb3EnableLoading, deactivateWeb3 } =
        useMoralis();

    useEffect(() => {
        if (isWeb3Enabled) return;
        if (typeof window !== "undefined") {
            // enableWeb3()
        }
    }, [isWeb3Enabled]);

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            // Moralis.onAccountChanged
            console.log(`Account changed to ${account}`);
            if (account == null) {
                window.localStorage.removeItem("connected");
                deactivateWeb3();
                console.log("no account found");
            }
        });
        <Moralis></Moralis>;
    }, []);

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}....{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3();
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected");
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    );
};

export default ManualHeader;
