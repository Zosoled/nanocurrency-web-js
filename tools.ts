import BigNumber from 'bignumber.js'

import AddressImporter from './lib/address-importer'
import { BlockData } from './lib/block-signer'
import NanoAddress from './lib/nano-address'
import NanoConverter from './lib/nano-converter'
import Signer from './lib/signer'
import Convert from './lib/util/convert'

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

export default {...tools}
