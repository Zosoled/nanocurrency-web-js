import AddressImporter, { Wallet } from './address-importer.js'
import Bip39Mnemonic from './bip39-mnemonic.js'

export default class AddressGenerator {

	/**
	 * Generates a hierarchial deterministic BIP32/39/44 wallet
	 *
	 * @param {string} [entropy] - (Optional) Custom entropy if the caller doesn't want a default generated entropy
	 * @param {string} [seedPassword] - (Optional) Password for the seed
	 */
	static generateWallet = async (entropy?: string, seedPassword?: string): Promise<Wallet> => {
		const mnemonicSeed = await Bip39Mnemonic.createWallet(entropy, seedPassword)
		const wallet = await AddressImporter.fromSeed(mnemonicSeed.seed, 0, 0)
		return {
			...wallet,
			mnemonic: mnemonicSeed.mnemonic,
		}
	}

	/**
	 * Generates a legacy Nano wallet
	 */
	static generateLegacyWallet = async (seed?: string): Promise<Wallet> => {
		const mnemonicSeed = await Bip39Mnemonic.createLegacyWallet(seed)
		return await AddressImporter.fromLegacySeed(mnemonicSeed.seed, 0, 0, mnemonicSeed.mnemonic)
	}
}
