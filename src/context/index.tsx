import ApiClient from "api";
import React, { createContext, useContext, useState } from "react";

export interface Address {
  parse: string;
  full: string;
}

export interface NFTs {
  blockHash: string;
  totalCount: number;
  ownedNfts: Array<any>;
}

export interface Tokens {
  jsonrpc: string;
  id: number;
  result: any;
}

interface WalletContext {
  addresses: Array<Address>;
  defaultAddress: Address | null;
  balance: string;
  handleBalance: (balance: string) => void;
  handleDefaultAddress: (Address: Address) => void;
  handleAddresses: (Addresses: Array<Address>) => void;
  handleGetAddressNft: (() => Promise<void>) | (() => void);
  handleGetAddressToken: (() => Promise<void>) | (() => void);
  listOfNFt: NFTs | null;
  listOfToken: Tokens | null;
}

export const WalletContext = createContext<WalletContext>({
  addresses: [],
  defaultAddress: null,
  balance: "",
  handleBalance: () => {},
  handleDefaultAddress: () => {},
  handleAddresses: () => {},
  handleGetAddressNft: () => {},
  handleGetAddressToken: () => {},
  listOfNFt: null,
  listOfToken: null,
});

const WalletProviderWrapper = ({ children }: { children: JSX.Element }) => {
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [balance, setBalance] = useState<string>("");
  const [addresses, setAddresses] = useState<Array<Address>>([]);
  const [listOfNFt, setListOfNFt] = useState<NFTs | null>(null);
  const [listOfToken, setListOfToken] = useState<Tokens | null>(null);

  const handleBalance = (balance: string) => {
    setBalance(balance);
  };

  const handleDefaultAddress = (Address: Address) => {
    setDefaultAddress(Address);
  };

  const handleAddresses = (Addresses: Array<Address>) => {
    setAddresses(Addresses);
  };

  const handleGetAddressNft = async () => {
    if (defaultAddress) {
      try {
        const res = await ApiClient.get(
          `/getNFTs/?owner=${defaultAddress?.full}`
        );
        return setListOfNFt(res?.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleGetAddressToken = async () => {
    if (defaultAddress) {
      try {
        const res = await ApiClient.post(
          `/`,
          {
            jsonrpc: "2.0",
            method: "alchemy_getTokenBalances",
            headers: {
              "Content-Type": "application/json",
            },
            params: [`${defaultAddress?.full}`, "erc20"],
            id: 42,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setListOfToken(res?.data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <WalletContext.Provider
      value={{
        balance,
        handleBalance,
        defaultAddress,
        addresses,
        handleDefaultAddress,
        handleAddresses,
        handleGetAddressNft,
        handleGetAddressToken,
        listOfNFt,
        listOfToken,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function useWalletContext() {
  return useContext(WalletContext);
}

export default WalletProviderWrapper;
