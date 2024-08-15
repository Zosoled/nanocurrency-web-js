import Ed25519 from '../ed25519'
import NanoAddress from '../nano-address'
import Convert from '../util/convert'
import Curve25519 from '../util/curve25519'

export default class Box {

	static readonly NONCE_LENGTH = 24

	static async encrypt(message: string, address: string, privateKey: string) {
		if (!message) {
			throw new Error('No message to encrypt')
		}

		const publicKey = NanoAddress.addressToPublicKey(address)
		const { privateKey: convertedPrivateKey, publicKey: convertedPublicKey } = new Ed25519().convertKeys({
			privateKey,
			publicKey,
		})

		const { randomBytes } = await import ('crypto')
		const nonce = Convert.hex2ab(randomBytes(this.NONCE_LENGTH).toString('hex'))
		const encrypted = new Curve25519().box(
			Convert.decodeUTF8(message),
			nonce,
			Convert.hex2ab(convertedPublicKey),
			Convert.hex2ab(convertedPrivateKey),
		)

		const full = new Uint8Array(nonce.length + encrypted.length)
		full.set(nonce)
		full.set(encrypted, nonce.length)

		return Buffer.from(full).toString('base64')
	}

	static decrypt(encrypted: string, address: string, privateKey: string) {
		if (!encrypted) {
			throw new Error('No message to decrypt')
		}

		const publicKey = NanoAddress.addressToPublicKey(address)
		const { privateKey: convertedPrivateKey, publicKey: convertedPublicKey } = new Ed25519().convertKeys({
			privateKey,
			publicKey,
		})

		const decodedEncryptedMessageBytes = new Uint8Array(Buffer.from(encrypted, 'base64'))
		const nonce = decodedEncryptedMessageBytes.slice(0, this.NONCE_LENGTH)
		const encryptedMessage = decodedEncryptedMessageBytes.slice(this.NONCE_LENGTH, encrypted.length)

		const decrypted = new Curve25519().boxOpen(
			encryptedMessage,
			nonce,
			Convert.hex2ab(convertedPublicKey),
			Convert.hex2ab(convertedPrivateKey),
		)

		if (!decrypted) {
			throw new Error('Could not decrypt message')
		}

		return Convert.encodeUTF8(decrypted)
	}
}
