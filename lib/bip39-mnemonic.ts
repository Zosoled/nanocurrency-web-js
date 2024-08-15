import Convert from './util/convert'
import Util from './util/util'

export default class Bip39Mnemonic {

	/**
	 * Creates a BIP39 wallet
	 *
	 * @param {string} [entropy] - (Optional) the entropy to use instead of generating
	 * @returns {MnemonicSeed} The mnemonic phrase and a seed derived from the (generated) entropy
	 */
	static createWallet = async (entropy: string, password: string): Promise<MnemonicSeed> => {
		entropy ??= await this.randomHex(32)
		if (entropy.length !== 64 ) {
			throw new Error('Invalid entropy length, must be a 32 bit hexadecimal string')
		}
		if (!/^[0-9a-fA-F]+$/i.test(entropy)) {
			throw new Error('Entropy is not a valid hexadecimal string')
		}

		const mnemonic = await this.deriveMnemonic(entropy)
		const seed = await this.mnemonicToSeed(mnemonic, password)

		return {
			mnemonic,
			seed,
		}
	}

	/**
	 * Creates an old Nano wallet
	 *
	 * @param {string} seed - (Optional) the seed to be used for the wallet
	 * @returns {MnemonicSeed} The mnemonic phrase and a generated seed if none provided
	 */
	static createLegacyWallet = async (seed?: string): Promise<MnemonicSeed> => {
		seed ??= await this.randomHex(32)
		if (seed.length !== 64) {
			throw new Error('Invalid seed length, must be a 32 bit hexadecimal string')
		}
		if (!/^[0-9a-fA-F]+$/i.test(seed)) {
			throw new Error('Seed is not a valid hexadecimal string')
		}

		const mnemonic = await this.deriveMnemonic(seed)

		return {
			mnemonic,
			seed,
		}
	}

	static deriveMnemonic = async (entropy: string): Promise<string> => {
		const entropyBinary = Convert.hexStringToBinary(entropy)
		const entropySha256Binary = Convert.hexStringToBinary(await this.calculateChecksum(entropy))
		const entropyBinaryWithChecksum = entropyBinary.concat(entropySha256Binary)

		const { Bip39Words } = await import('./bip39-words')
		const mnemonicWords = []
		for (let i = 0; i < entropyBinaryWithChecksum.length; i += 11) {
			const nextWord: string = entropyBinaryWithChecksum.substring(i, i+11)
			mnemonicWords.push(Bip39Words[parseInt(nextWord, 2)])
		}

		return mnemonicWords.join(' ')
	}

	/**
	 * Validates a mnemonic phrase
	 *
	 * @param {string} mnemonic - The mnemonic phrase to validate
	 * @returns {boolean} Is the mnemonic phrase valid
	 */
	static validateMnemonic = async (mnemonic: string): Promise<boolean> => {
		const mnemonicArray = Util.normalizeUTF8(mnemonic).split(' ')
		if (mnemonicArray.length % 3 !== 0) {
			return false
		}

		const { Bip39Words } = await import('./bip39-words')
		const bits = mnemonicArray.map(word => {
			const wordIndex = Bip39Words.indexOf(word)
			if (wordIndex === -1) {
				return false
			}
			return (Convert.dec2bin(wordIndex)).padStart(11, '0')
		}).join('')

		const dividerIndex = Math.floor(bits.length / 33) * 32
		const entropyBits = bits.slice(0, dividerIndex)
		const checksumBits = bits.slice(dividerIndex)
		const entropyBytes = entropyBits.match(/(.{1,8})/g).map((bin: string) => parseInt(bin, 2))

		if (entropyBytes.length < 16) {
			return false
		}

		if (entropyBytes.length > 32) {
			return false
		}

		if (entropyBytes.length % 4 !== 0) {
			return false
		}

		const entropyHex = Convert.bytesToHexString(entropyBytes)
		const newChecksum = await this.calculateChecksum(entropyHex)
		const inputChecksum = Convert.binaryToHexString(checksumBits)

		if (parseInt(newChecksum, 16) != parseInt(inputChecksum, 16)) {
			return false
		}

		return true
	}

	/**
	 * Converts the mnemonic phrase to an old Nano seed
	 *
	 * @param {string} mnemonic Mnemonic phrase separated by spaces
	 */
	static mnemonicToLegacySeed = async (mnemonic: string): Promise<string> => {
		const { Bip39Words } = await import('./bip39-words')
		const wordArray = Util.normalizeUTF8(mnemonic).split(' ')
		const bits = wordArray.map((w: string) => {
			const wordIndex = Bip39Words.indexOf(w)
			if (wordIndex === -1) {
				return false
			}
			return (Convert.dec2bin(wordIndex)).padStart(11, '0')
		}).join('')

		const dividerIndex = Math.floor(bits.length / 33) * 32
		const entropyBits = bits.slice(0, dividerIndex)
		const entropyBytes = entropyBits.match(/(.{1,8})/g).map((bin: string) => parseInt(bin, 2))
		const entropyHex = Convert.bytesToHexString(entropyBytes)

		return entropyHex
	}

	/**
	 * Converts the mnemonic phrase to a BIP39 seed
	 *
	 * @param {string} mnemonic Mnemonic phrase separated by spaces
	 */
	static mnemonicToSeed = async (mnemonic: string, password: string): Promise<string> => {
		const normalizedMnemonic = Util.normalizeUTF8(mnemonic)
		const normalizedPassword = `mnemonic${Util.normalizeUTF8(password)}`

		const { pbkdf2 } = await import('crypto')
		// password, salt, iterations, keylen, digest
		return new Promise((resolve, reject) => {
			pbkdf2(
				normalizedMnemonic,
				normalizedPassword,
				2048,
				(512 / 8),
				'sha512',
				(err, key) => {
					if (!!err) reject(err)
					else resolve(key.toString('hex'))
				}
			)
		})
	}

	private static randomHex = async (length: number): Promise<string> => {
		const { randomBytes } = await import('crypto')
		return new Promise((resolve, reject) => {
			randomBytes(length, (err, buf) => {
				if (!!err) reject(err)
				else resolve(buf.toString('hex'))
			})
		})
	}

	private static calculateChecksum = async (entropyHex: string): Promise<string> => {
		const { createHash } = await import('crypto')
		return new Promise((resolve, reject) => {
			try {
				const entropySha256 = createHash('sha256').update(entropyHex, 'hex').digest('hex')
				resolve(entropySha256.substring(0, entropySha256.length / 32))
			} catch (err) {
				reject(err)
			}
		})
	}
}

interface MnemonicSeed {
	mnemonic: string,
	seed: string,
}
