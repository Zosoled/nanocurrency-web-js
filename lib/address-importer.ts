import Bip32KeyDerivation from './bip32-key-derivation'
import Bip39Mnemonic from './bip39-mnemonic'
import Ed25519 from './ed25519'
import NanoAddress from './nano-address'
import Signer from './signer'
import Convert from './util/convert'

export default class AddressImporter {

	/**
	 * Import a wallet using a mnemonic phrase
	 *
	 * @param {string} mnemonic - The mnemonic words to import the wallet from
	 * @param {string} [seedPassword] - (Optional) The password to use to secure the mnemonic
	 * @returns {Wallet} - The wallet derived from the mnemonic phrase
	 */
	static fromMnemonic = async (mnemonic: string, seedPassword = ''): Promise<Wallet> => {
		const valid = await this.validateMnemonic(mnemonic)
		if (!valid) {
			throw new Error('Invalid mnemonic phrase')
		}

		const seed = await Bip39Mnemonic.mnemonicToSeed(mnemonic, seedPassword)
		const accounts = await this.accounts(seed, 0, 0)

		return {
			mnemonic,
			seed,
			accounts,
		}
	}

	/**
	 * Import a legacy wallet using a mnemonic phrase
	 *
	 * @param {string} mnemonic - The mnemonic words to import the wallet from
	 * @returns {Wallet} - The wallet derived from the mnemonic phrase
	 */
	static fromLegacyMnemonic = async (mnemonic: string): Promise<Wallet> => {
		const valid = await this.validateMnemonic(mnemonic)
		if (!valid) {
			throw new Error('Invalid mnemonic phrase')
		}

		const seed = await Bip39Mnemonic.mnemonicToLegacySeed(mnemonic)
		return await this.fromLegacySeed(seed, 0, 0, mnemonic)
	}

	/**
	 * Validate mnemonic words
	 *
	 * @param mnemonic {string} mnemonic - The mnemonic words to validate
	 */
	static validateMnemonic = async (mnemonic: string): Promise<boolean> => {
		return await Bip39Mnemonic.validateMnemonic(mnemonic)
	}

	/**
	 * Import a wallet using a seed
	 *
	 * @param {string} seed - The seed to import the wallet from
	 * @param {number} [from] - (Optional) The start index of the private keys to derive from
	 * @param {number} [to] - (Optional) The end index of the private keys to derive to
	 * @returns {Wallet} The wallet derived from the mnemonic phrase
	 */
	static fromSeed = async (seed: string, from = 0, to = 0): Promise<Wallet> => {
		if (seed.length !== 128) {
			throw new Error('Invalid seed length, must be a 128 byte hexadecimal string')
		}
		if (!/^[0-9a-fA-F]+$/i.test(seed)) {
			throw new Error('Seed is not a valid hexadecimal string')
		}

		const accounts = await this.accounts(seed, from, to)

		return {
			mnemonic: undefined,
			seed,
			accounts,
		}
	}


	/**
	 * Import a wallet using a legacy seed
	 *
	 * @param {string} seed - The seed to import the wallet from
	 * @param {number} [from] - (Optional) The start index of the private keys to derive from
	 * @param {number} [to] - (Optional) The end index of the private keys to derive to
	 * @returns {Wallet} The wallet derived from the seed
	 */
	static fromLegacySeed = async (seed: string, from: number = 0, to: number = 0, mnemonic?: string): Promise<Wallet> => {
		if (seed.length !== 64) {
			throw new Error('Invalid seed length, must be a 64 byte hexadecimal string')
		}
		if (!/^[0-9a-fA-F]+$/i.test(seed)) {
			throw new Error('Seed is not a valid hexadecimal string')
		}

		const accounts = await this.legacyAccounts(seed, from, to)
		return {
			mnemonic: mnemonic || await Bip39Mnemonic.deriveMnemonic(seed),
			seed,
			accounts,
		}
	}

	/**
	 * Derives BIP32 private keys
	 *
	 * @param {string} seed - The seed to use for private key derivation
	 * @param {number} from - The start index of private keys to derive from
	 * @param {number} to - The end index of private keys to derive to
	 */
	private static accounts = async (seed: string, from: number, to: number): Promise<Account[]> => {
		return new Promise((resolve, reject) => {
			try {
				const accounts = []
				for (let i = from; i <= to; i++) {
					const privateKey = Bip32KeyDerivation.derivePath(`44'/165'/${i}'`, seed).key
					const keyPair = new Ed25519().generateKeys(privateKey)
					const address = NanoAddress.deriveAddress(keyPair.publicKey)
					accounts.push({
						accountIndex: i,
						privateKey: keyPair.privateKey,
						publicKey: keyPair.publicKey,
						address,
					})
				}
				resolve(accounts)
			} catch (err) {
				reject(err)
			}
		})
	}

	/**
	 * Derives legacy private keys
	 *
	 * @param {string} seed - The seed to use for private key derivation
	 * @param {number} from - The start index of private keys to derive from
	 * @param {number} to - The end index of private keys to derive to
	 */
	private static legacyAccounts = async (seed: string, from: number, to: number): Promise<Account[]> => {
		const accounts: Account[] = []
		for (let i = from; i <= to; i++) {
			const privateKey = Convert.ab2hex(Signer.generateHash([ seed, Convert.dec2hex(i, 4) ]))
			const keyPair = new Ed25519().generateKeys(privateKey)
			const address = NanoAddress.deriveAddress(keyPair.publicKey)
			accounts.push({
				accountIndex: i,
				privateKey: keyPair.privateKey,
				publicKey: keyPair.publicKey,
				address,
			})
		}

		return accounts
	}

}

export interface Wallet {
	mnemonic: string
	seed: string
	accounts: Account[]
}

export interface Account {
	accountIndex: number
	privateKey: string
	publicKey: string
	address: string
}
