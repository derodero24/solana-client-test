import { useEffect } from 'react';

import * as spl from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import * as web3 from '@solana/web3.js';

export default function App(): JSX.Element {
  const { connection } = useConnection();
  const wallet = useWallet();

  const getNftOwner = (mintAddress: string): Promise<string> => {
    return connection
      .getTokenLargestAccounts(new web3.PublicKey(mintAddress))
      .then(res => {
        const tokenAccount = res.value[0].address;
        return connection.getParsedAccountInfo(tokenAccount);
      })
      .then(res => {
        const data = res.value?.data as web3.ParsedAccountData;
        const ownerAddress = data.parsed.info.owner;
        return ownerAddress;
      });
  };

  const createSplToken = async (decimals: number, amount: number) => {
    if (!wallet.publicKey) {
      console.log('Please connect a wallet before.');
      return;
    }

    // Generate/Get keys
    const mint = web3.Keypair.generate();
    const associatedTokenAddress = await spl.getAssociatedTokenAddress(
      mint.publicKey,
      wallet.publicKey
    );

    // Transaction for creating NFT
    const transaction = new web3.Transaction().add(
      // create mint account
      web3.SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: spl.MINT_SIZE,
        lamports: await spl.getMinimumBalanceForRentExemptMint(connection),
        programId: spl.TOKEN_PROGRAM_ID,
      }),
      // init mint account
      spl.createInitializeMintInstruction(
        mint.publicKey, // mint pubkey
        decimals, // decimals
        wallet.publicKey, // mint authority
        wallet.publicKey // freeze authority
      ),
      // create associated-token-account
      spl.createAssociatedTokenAccountInstruction(
        wallet.publicKey, // payer
        associatedTokenAddress, // associated-token-address
        wallet.publicKey, // owner
        mint.publicKey // mint
      ),
      // mint to
      spl.createMintToInstruction(
        mint.publicKey, // mint
        associatedTokenAddress, // receiver
        wallet.publicKey, // mint authority
        amount // amount
      )
    );

    // Transaction実行
    console.log('sending a transaction...');
    const signature = await wallet.sendTransaction(transaction, connection, {
      signers: [mint],
    });
    await connection.confirmTransaction(signature, 'processed');
    console.log('successfully create SPL tokens');
  };

  const onGetNftOwner = async () => {
    // create and mint 100 new tokens
    // Owner of "Degen Ape #1506" (only at Mainnet-beta)
    const address = 'HgDxaNFdq5HExHm2am6UfvVeiCTWdT6J5UzVu4NQR9MN';
    getNftOwner(address).then(res => console.log('owner:', res));
  };

  const onCreateSplToken = async () => {
    // create and mint 100 new tokens
    const decimals = 9;
    const amount = 100 * 10 ** decimals;
    await createSplToken(decimals, amount);
  };

  if (!wallet.publicKey) {
    return (
      <>
        <WalletMultiButton />
        <WalletDisconnectButton />
      </>
    );
  } else {
    return (
      <>
        <button onClick={onGetNftOwner}>Get Owner Test</button>
        <button onClick={onCreateSplToken}>Create SPL Token</button>
      </>
    );
  }
}
