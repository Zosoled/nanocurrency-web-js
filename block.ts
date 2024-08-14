import BlockSigner, { ReceiveBlock, RepresentativeBlock, SendBlock, SignedBlock } from './lib/block-signer'

const block = {

	/**
	 * Sign a send block with the input parameters
	 *
	 * For a send block, put your own address to the 'fromAddress' property and
	 * the recipient address to the 'toAddress' property.
	 * All the NANO amounts should be input in RAW format. The addresses should be
	 * valid Nano addresses. Fetch the current balance, frontier (previous block) and
	 * representative address from the network.
	 *
	 * The return value of this function is ready to be published to the network.
	 *
	 * NOTICE: Always fetch up-to-date account info from the network
	 *         before signing the block.
	 *
	 * @param {SendBlock} data The data for the block
	 * @param {string} privateKey Private key to sign the block
	 * @returns {SignedBlock} the signed block
	 */
	send: (data: SendBlock, privateKey: string): SignedBlock => {
		return BlockSigner.send(data, privateKey)
	},

	/**
	 * Sign a receive block with the input parameters
	 *
	 * For a receive block, put your own address to the 'toAddress' property.
	 * All the NANO amounts should be input in RAW format. The addresses should be
	 * valid Nano addresses. Fetch the current balance, frontier (previous block) and
	 * representative address from the network.
	 * Input the receive amount and transaction hash from the pending block.
	 *
	 * The return value of this function is ready to be published to the network.
	 *
	 * NOTICE: Always fetch up-to-date account info from the network
	 *         before signing the block.
	 *
	 * @param {ReceiveBlock} data The data for the block
	 * @param {string} privateKey Private key to sign the block
	 * @returns {SignedBlock} the signed block
	 */
	receive: (data: ReceiveBlock, privateKey: string): SignedBlock => {
		return BlockSigner.receive(data, privateKey)
	},

	/**
	 * Sign a representative change block with the input parameters
	 *
	 * For a change block, put your own address to the 'address' property.
	 * All the NANO amounts should be input in RAW format. The addresses should be
	 * valid Nano addresses. Fetch the current balance, previous block from the
	 * network. Set the new representative address
	 * as the representative.
	 *
	 * NOTICE: Always fetch up-to-date account info from the network
	 *         before signing the block.
	 *
	 * @param {RepresentativeBlock} data The data for the block
	 * @param {string} privateKey Private key to sign the block
	 * @returns {SignedBlock} the signed block
	 */
	representative: (data: RepresentativeBlock, privateKey: string): SignedBlock => {
		const block: SendBlock = {
			...data,
			fromAddress: data.address,
			amountRaw: '0',
			toAddress: 'nano_1111111111111111111111111111111111111111111111111111hifc8npp', // Burn address
		}
		return BlockSigner.send(block, privateKey)
	},
}

export default {...block}
