import AddressGenerator from '../address-generator'
import AddressImporter, { Account, Wallet } from '../address-importer'

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

export default {...wallet}
