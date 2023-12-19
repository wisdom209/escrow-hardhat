import { ethers, utils } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer, arbiter) {
	try {
		signer = provider.getSigner(arbiter);
		const approveTxn = await escrowContract.connect(signer).approve();
		await approveTxn.wait();
	} catch (error) {
		console.log(error);
	}

}

function App() {
	const [escrows, setEscrows] = useState([]);
	const [account, setAccount] = useState();
	const [signer, setSigner] = useState();
	const [doneTx, setDoneTx] = useState([]);

	useEffect(() => {
		try {
			async function getAccounts() {
				const accounts = await provider.send('eth_requestAccounts', []);
				setAccount(accounts[0]);
				setSigner(provider.getSigner());
			}

			localStorage.clear();
			getAccounts();

			let rowData = localStorage.getItem("data");
			if (rowData)
				setDoneTx(JSON.parse(rowData));
		} catch (error) {
			alert(error.message)
		}

	}, [account]);

	async function newContract() {
		const beneficiary = document.getElementById('beneficiary').value;
		const arbiter = document.getElementById('arbiter').value;
		const value = utils.parseEther(document.getElementById('wei').value);
		const escrowContract = await deploy(signer, arbiter, beneficiary, value);


		const escrow = {
			approved: false,
			address: escrowContract.address,
			arbiter,
			beneficiary,
			value: value.toString(),
			handleApprove: async () => {
				try {
					escrowContract.on('Approved', () => {
						document.getElementById(escrowContract.address).className =
							'complete';
						document.getElementById(escrowContract.address).innerText =
							"✓ It's been approved!";
						setDoneTx([...doneTx, { address: escrowContract.address, arbiter, value }])
						localStorage.setItem("data", JSON.stringify([...doneTx, { address: escrowContract.address, beneficiary, value, time: new Date() }]));
					});

					await approve(escrowContract, signer, arbiter);
					escrow.approved = true;
				} catch (error) {
					alert(error.message)
				}
			},
		};

		setEscrows([...escrows, escrow]);
		localStorage.setItem("data", JSON.stringify(escrows));
	}

	return (
		<div>
			<main>
				<div className="contract">
					<h1> Contract </h1>
					<label>
						Arbiter Address
						<input type="text" id="arbiter" />
					</label>

					<label>
						Beneficiary Address
						<input type="text" id="beneficiary" />
					</label>

					<label>
						Deposit Amount (in Eth)
						<input type="text" id="wei" />
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
			</main>
			<div className='details'>
				<h2 style={{ color: 'white' }}>Previous Transactions</h2>
				<div>
					{doneTx.map((v, i) =>
						<details>
							<summary>Transaction {i + 1} {v.time}</summary>
							<ul key={i}>
								<li>FROM: {v.address}</li>
								<li>TO: {v.beneficiary}</li>
								<li>VALUE: {utils.formatEther(v.value)} ETH</li>
							</ul>
						</details>)
					}
				</div>
			</div>
		</div>

	);
}

export default App;
