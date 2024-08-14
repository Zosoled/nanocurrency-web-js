import BigNumber from 'bignumber.js'

import AddressGenerator from './lib/address-generator'
import AddressImporter, { Account, Wallet } from './lib/address-importer'
import BlockSigner, { BlockData, ReceiveBlock, RepresentativeBlock, SendBlock, SignedBlock } from './lib/block-signer'
import Box from './lib/box'
import NanoAddress from './lib/nano-address'
import NanoConverter from './lib/nano-converter'
import Signer from './lib/signer'
import Convert from './lib/util/convert'

const wallet = {

	/**
	 * Generate a new Nano cryptocurrency wallet
	 *
	 * This function generates a wallet from random entropy. Wallet includes
	 * a BIP39 mnemonic phrase in line with the Nano Ledger implementation and
	 * a seed, the account is derived using BIP32 deterministic hierarchial algorithm
	 * with input parameters 44'/165' and index 0.
	 *
	 * The Nano address is derived from the public key using standard Nano encoding.
	 * The address is prefixed with 'nano_'.
	 *
	 * Generation uses CryptoJS to generate random entropy by default. You can give your own entropy
	 * as a parameter and it will be used instead.
	 *
	 * An optional seed password can be used to encrypt the mnemonic phrase so the seed
	 * cannot be derived correctly without the password. Recovering the wallet without the
	 * password is not possible.
	 *
	 * @param {string} [entropy] - (Optional) 64 byte hexadecimal string entropy to be used instead of generating it
	 * @param {string} [seedPassword] - (Optional) seed password
	 * @returns {Wallet} The wallet
	 */
	generate: async (entropy?: string, seedPassword?: string): Promise<Wallet> => {
		return await AddressGenerator.generateWallet(entropy, seedPassword)
	},

	/**
	 * Generate a new Nano cryptocurrency wallet
	 *
	 * This function generates a legacy wallet from a random seed. Wallet includes
	 * a mnemonic phrase and a seed, the account is derived from the seed at index 0.
	 *
	 * The Nano address is derived from the public key using standard Nano encoding.
	 * The address is prefixed with 'nano_'.
	 *
	 * Generation uses CryptoJS to generate random seed by default. You can give your own seed
	 * as a parameter and it will be used instead.
	 *
	 * @param {string} [seed] - (Optional) 64 byte hexadecimal string seed to be used instead of generating it
	 * @returns {Wallet} The wallet
	 */
	generateLegacy: async (seed?: string): Promise<Wallet> => {
		return await AddressGenerator.generateLegacyWallet(seed)
	},

	/**
	 * Import a Nano cryptocurrency wallet from a mnemonic phrase
	 *
	 * This function imports a wallet from a mnemonic phrase. Wallet includes the mnemonic phrase,
	 * a seed derived with BIP39 standard and an account derived using BIP32 deterministic hierarchial
	 * algorithm with input parameters 44'/165' and index 0.
	 *
	 * The Nano address is derived from the public key using standard Nano encoding.
	 * The address is prefixed with 'nano_'.
	 *
	 * @param {string} mnemonic - The mnemonic phrase. Words are separated with a space
	 * @param {string} [seedPassword] - (Optional) seed password
	 * @throws Throws an error if the mnemonic phrase doesn't pass validations
	 * @returns {Wallet} The wallet
	 */
	fromMnemonic: async (mnemonic: string, seedPassword?: string): Promise<Wallet> => {
		return await AddressImporter.fromMnemonic(mnemonic, seedPassword)
	},

	/**
	 * Import a Nano cryptocurrency wallet from a legacy mnemonic phrase
	 *
	 * This function imports a wallet from an old Nano mnemonic phrase. Wallet includes the mnemonic
	 * phrase, a seed which represents the mnemonic and an account derived from the seed at index 0.
	 *
	 * The Nano address is derived from the public key using standard Nano encoding.
	 * The address is prefixed with 'nano_'.
	 *
	 * @param {string} mnemonic - The mnemonic phrase. Words are separated with a space
	 * @throws Throws an error if the mnemonic phrase doesn't pass validations
	 * @returns {Wallet} The wallet
	 */
	fromLegacyMnemonic: async (mnemonic: string): Promise<Wallet> => {
		return await AddressImporter.fromLegacyMnemonic(mnemonic)
	},

	/**
	 * Import a Nano cryptocurrency wallet from a seed
	 *
	 * This function imports a wallet from a seed. Wallet includes the seed and an account derived using
	 * BIP39 standard and an account derived using BIP32 deterministic hierarchial algorithm with input
	 * parameters 44'/165' and index 0.
	 *
	 * The Nano address is derived from the public key using standard Nano encoding.
	 * The address is prefixed with 'nano_'.
	 *
	 * @param {string} seed - The seed
	 * @returns {Wallet} The wallet, without the mnemonic phrase because it's not possible to infer backwards
	 */
	fromSeed: async (seed: string): Promise<Wallet> => {
		return await AddressImporter.fromSeed(seed)
	},

	/**
	 * Import Nano cryptocurrency accounts from a legacy hex seed
	 *
	 * This function imports a wallet from a seed. The private key is derived from the seed using
	 * simply a blake2b hash function. The public key is derived from the private key using the ed25519 curve
	 * algorithm.
	 *
	 * The Nano address is derived from the public key using standard Nano encoding.
	 * The address is prefixed with 'nano_'.
	 *
	 * @param {string} seed - The seed
	 * @returns {Wallet} The wallet
	 */
	fromLegacySeed: async (seed: string): Promise<Wallet> => {
		return await AddressImporter.fromLegacySeed(seed)
	},

	/**
	 * Derive accounts for the seed
	 *
	 * This function derives Nano accounts with the BIP32 deterministic hierarchial algorithm
	 * from the given seed with input parameters 44'/165' and indexes based on the from and to
	 * parameters.
	 *
	 * @param {string} seed - The seed
	 * @param {number} from - The start index
	 * @param {number} to - The end index
	 * @returns {Account[]} a list of accounts
	 */
	accounts: async (seed: string, from: number, to: number): Promise<Account[]> => {
		const wallet = await AddressImporter.fromSeed(seed, from, to)
		return wallet.accounts
	},

	/**
	 * Derive accounts for the legacy hex seed
	 *
	 * This function derives Nano accounts with the given seed with indexes
	 * based on the from and to parameters.
	 *
	 * @param {string} seed - The seed
	 * @param {number} from - The start index
	 * @param {number} to - The end index
	 * @returns {Account[]} a list of accounts
	 */
	legacyAccounts: async (seed: string, from: number, to: number): Promise<Account[]> => {
		const wallet = await AddressImporter.fromLegacySeed(seed, from, to)
		return wallet.accounts
	},

}

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

const tools = {

	/**
	 * Convert Nano values
	 *
	 * Possible units are RAW, NANO, MRAI, KRAI, RAI
	 *
	 * @param {string | BigNumber} input The input value
	 * @param {string} inputUnit The unit of the input value
	 * @param {string} outputUnit The unit you wish to convert to
	 * @returns {string} The converted value
	 */
	convert: (input: string | BigNumber, inputUnit: string, outputUnit: string): string => {
		return NanoConverter.convert(input, inputUnit, outputUnit)
	},

	/**
	 * Sign any strings with the user's private key
	 *
	 * @param {string} privateKey The private key to sign with
	 * @param {...string} input Data to sign
	 * @returns {string} The signature
	 */
	sign: (privateKey: string, ...input: string[]): string => {
		const data = input.map(Convert.stringToHex)
		return Signer.sign(privateKey, ...data)
	},

	/**
	 * Verifies the signature of any input string
	 *
	 * @param {string} publicKey The public key to verify with
	 * @param {string} signature The signature to verify
	 * @param {...string} input Data to verify
	 * @returns {boolean} valid or not
	 */
	verify: (publicKey: string, signature: string, ...input: string[]): boolean => {
		const data = input.map(Convert.stringToHex)
		return Signer.verify(publicKey, signature, ...data)
	},

	/**
	 * Verifies the signature of any input string
	 *
	 * @param {string} publicKey The public key to verify with
	 * @param {BlockData} block The block to verify
	 * @returns {boolean} valid or not
	 */
	verifyBlock: (publicKey: string, block: BlockData): boolean => {
		const preamble = 0x6.toString().padStart(64, '0')
		return Signer.verify(publicKey, block.signature,
				preamble,
				NanoAddress.nanoAddressToHexString(block.account),
				block.previous,
				NanoAddress.nanoAddressToHexString(block.representative),
				Convert.dec2hex(block.balance, 16).toUpperCase(),
				block.link)
	},

	/**
	 * Validate a Nano address
	 *
	 * @param {string} input The address to validate
	 * @returns {boolean} valid or not
	 */
	validateAddress: (input: string): boolean => {
		return NanoAddress.validateNanoAddress(input)
	},

	/**
	 * Validate mnemonic words
	 *
	 * @param {string} input The address to validate
	 * @returns {boolean} valid or not
	 */
	validateMnemonic: async (input: string): Promise<boolean> => {
		return await AddressImporter.validateMnemonic(input)
	},

	/**
	 * Convert a Nano address to a public key
	 *
	 * @param {string} input Nano address to convert
	 * @returns {string} the public key
	 */
	addressToPublicKey: (input: string): string => {
		return NanoAddress.addressToPublicKey(input)
	},

	/**
	 * Convert a public key to a Nano address
	 *
	 * @param {string} input Public key to convert
	 * @returns {string} the nano address
	 */
	publicKeyToAddress: (input: string): string => {
		return NanoAddress.deriveAddress(input)
	},

	/**
	 * Hash a string or array of strings with blake2b
	 *
	 * @param {string | string[]} input string to hash
	 * @returns {string} hashed string
	 */
	blake2b: (input: string | string[]): string => {
		if (Array.isArray(input)) {
			return Convert.ab2hex(Signer.generateHash(input.map(Convert.stringToHex)))
		} else {
			return Convert.ab2hex(Signer.generateHash([Convert.stringToHex(input)]))
		}
	},

}

const box = {

	/**
	 * Encrypt a message using a Nano address private key for
	 * end-to-end encrypted messaging.
	 *
	 * Encrypts the message using the recipient's public key,
	 * the sender's private key and a random nonce generated
	 * inside the library. The message can be opened with the
	 * recipient's private key and the sender's public key by
	 * using the decrypt method.
	 *
	 * @param {string} message string to encrypt
	 * @param {string} address nano address of the recipient
	 * @param {string} privateKey private key of the sender
	 * @returns {string} encrypted message encoded in Base64
	 */
	encrypt: (message: string, address: string, privateKey: string): string => {
		return Box.encrypt(message, address, privateKey)
	},

	/**
	 * Decrypt a message using a Nano address private key.
	 *
	 * Decrypts the message by using the sender's public key,
	 * the recipient's private key and the nonce which is included
	 * in the encrypted message.
	 *
	 * @param {string} encrypted string to decrypt
	 * @param {string} address nano address of the sender
	 * @param {string} privateKey private key of the recipient
	 * @returns {string} decrypted message encoded in UTF-8
	 */
	decrypt: (encrypted: string, address: string, privateKey: string): string => {
		return Box.decrypt(encrypted, address, privateKey)
	}

}

export {
	wallet,
	block,
	tools,
	box,
}
