/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import { ethers } from "ethers";
import styles from "@/styles/Wallet.module.css";
import { useEffect, Fragment } from "react";
import { useWalletContext } from "@/context";

declare global {
  interface Window {
    ethereum: any; //TODO: fix type
  }
}

export default function Home() {
  const {
    balance,
    handleGetAddressNft,
    handleGetAddressToken,
    defaultAddress,
    listOfNFt,
    listOfToken
  } = useWalletContext();
  useEffect(() => {
    handleGetAddressNft();
    handleGetAddressToken();
  }, [defaultAddress]);
  console.log(listOfNFt)
  return (
    <>
      <Head>
        <title>{defaultAddress?.parse} Wallet</title>
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <h2>WalletViewer</h2>
          <div>
            <p>Wallet: {defaultAddress?.parse}</p>
            <p>Balance: {balance}</p>
          </div>
        </header>
        <section className={styles.block}>
          <div>
            <p>BlockHash: {listOfNFt?.blockHash}</p>
            <p>Count: {listOfNFt?.totalCount}</p>
          </div>
          <div className={styles.imagesRow}>
            {listOfNFt?.ownedNfts?.map((nft: any, index: number) => (
              <Fragment key={index}>
                <img src={nft?.media?.[0]?.raw} alt={nft?.title} width={200} height={200} />
              </Fragment>
            ))}
          </div>
        </section>
        <section className={styles.block}>
          <div>
            <p>Address: {listOfToken?.result?.address}</p>
          </div>
          <ul className={styles.imagesRow}>
            {listOfToken?.result?.tokenBalances?.map((token: any, index: number) => (
              <li key={index}>
                <p>Token Name: {token?.contractAddress}</p>
                <p>balance: {ethers.utils.formatEther(token?.tokenBalance)}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
