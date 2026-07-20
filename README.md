# Srvivr Wallet

**Only wallets that want to survive will onboard with CLVRBRIDGE.**

Srvivr is the open-source reference wallet that demonstrates CLVRBRIDGE integration in 30 minutes. Every trade routes through 21 providers to find the best price. Clone it. Deploy it. Survive.

> 75–85% of crypto wallets don't make it past Year 3. The #1 killer? Not being able to monetize. Srvivr Wallet exists to show you how to fix that.

> This wallet is running on a demo API key. Want your own? Start a free 90-day pilot. Go to clvrbridge.com



## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/clvrbridge/srvivr-wallet.git
cd srvivr-wallet

# 2. Install dependencies
npm install

# 3. Set your API key
cp .env.local.example .env.local
# Edit .env.local and add your CLVRBRIDGE API key

# 4. Run the dev server
npm run dev
