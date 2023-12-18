import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer, arbiter) {
	signer = provider.getSigner(arbiter);
	const approveTxn = await escrowContract.connect(signer).approve();
	await approveTxn.wait();
}

function App() {
	const [escrows, setEscrows] = useState([]);
	const [account, setAccount] = useState();
	const [signer, setSigner] = useState();

	useEffect(() => {
		async function getAccounts() {
			const accounts = await provider.send('eth_requestAccounts', []);

			setAccount(accounts[0]);
			setSigner(provider.getSigner());
		}

		getAccounts();
	}, [account]);

	async function newContract() {
		const beneficiary = document.getElementById('beneficiary').value;
		const arbiter = document.getElementById('arbiter').value;
		const value = Number(document.getElementById('wei').value) * (Math.pow(10, 18));
		const escrowContract = await deploy(signer, arbiter, beneficiary, value);
		


		const escrow = {
			address: escrowContract.address,
			arbiter,
			beneficiary,
			value: value.toString(),
			handleApprove: async () => {
				escrowContract.on('Approved', () => {
					document.getElementById(escrowContract.address).className =
						'complete';
					document.getElementById(escrowContract.address).innerText =
						"✓ It's been approved!";
				});

				await approve(escrowContract, signer, arbiter);
			},
		};

		setEscrows([...escrows, escrow]);
	}

	return (
		<>
			<div className="contract">
				<h1> New Contract </h1>
				<label>
					Arbiter Address
					<input readOnly type="text" id="arbiter" value="0xB68BadBdb06a5cf52E9F760A2633accC3a3f02BE" />
					{/* value="0xB68BadBdb06a5cf52E9F760A2633accC3a3f02BE" sepolia */}
					{/* value="0xbDA5747bFD65F08deb54cb465eB87D40e51B197E" localnetwork */}
				</label>

				<label>
					Beneficiary Address
					<input readOnly type="text" id="beneficiary"  value="0xAFcB0DcBefB0CEd92BBC050E299d20adC544E486"/>
					{/* value="0xdD2FD4581271e230360230F9337D5c0430Bf44C0" = localnet */}
					{/* value="0xAFcB0DcBefB0CEd92BBC050E299d20adC544E486" = sepolia */}
				</label>

				<label>
					Deposit Amount (in Wei)
					<input readOnly type="text" id="wei" value="0.001" />
				</label>

				<div
					className="button"
					id="deploy"
					onClick={(e) => {
						e.preventDefault();

						newContract();
					}}
				>
					Deploy
				</div>
			</div>

			<div className="existing-contracts">
				<h1> Existing Contracts </h1>

				<div id="container">
					{escrows.map((escrow) => {
						return <Escrow key={escrow.address} {...escrow} />;
					})}
				</div>
			</div>
		</>
	);
}

export default App;
