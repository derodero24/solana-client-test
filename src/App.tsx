import { useEffect } from 'react';

import * as anchor from '@project-serum/anchor';
import * as web3 from '@solana/web3.js';

export default function App(): JSX.Element {
  const generatePublickeyFromBs58 = (base58Address: string): web3.PublicKey => {
    const pubkeyBuffer = anchor.utils.bytes.bs58.decode(base58Address);
    const generatedPubkey = new web3.PublicKey(pubkeyBuffer);
    return generatedPubkey;
  };

  useEffect(() => {
    // How to use
    const address = '3ME9Uv8NaWG5cwPnTtoSxzy9haaFAxKcVjpCLRUiDyod'; // string
    const pubkey = generatePublickeyFromBs58(address); // web3.PublicKey
    console.log(pubkey.toBase58());
  }, []);

  return <div>Hello World</div>;
}
