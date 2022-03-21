import React from 'react';
import ReactDOM from 'react-dom';

import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

import App from './App';

// const network = clusterApiUrl('mainnet-beta'); // devnet/testnet/mainnet-beta
const network = clusterApiUrl('devnet'); // devnet/testnet/mainnet-beta
const wallets = [new PhantomWalletAdapter()]; // 対応ウォレット

ReactDOM.render(
  <React.StrictMode>
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
