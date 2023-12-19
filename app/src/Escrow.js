export default function Escrow({
	address,
	arbiter,
	beneficiary,
	value,
	handleApprove,
	approved
}) {
	return (
		<div className="existing-contract">

			<ul className="fields">
				{approved && "Latest Transaction"}
				<li>
					<div>Time stamp</div>
					<div>{Date().toString()}</div>
				</li>
				<li>
					<div> Arbiter </div>
					<div> {arbiter} </div>
				</li>
				<li>
					<div> Beneficiary </div>
					<div> {beneficiary} </div>
				</li>
				<li>
					<div> Value </div>
					<div> {value / Math.pow(10, 18)} ETH</div>
				</li>
				{<div
					className="button"
					id={address}
					onClick={(e) => {
						e.preventDefault();
						handleApprove();
					}}
				>
					Approve
				</div>
				}
			</ul>
		</div>
	);
}
