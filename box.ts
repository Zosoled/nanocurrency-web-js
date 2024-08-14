import Box from './lib/box'

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
	encrypt: async (message: string, address: string, privateKey: string): Promise<string> => {
		return await Box.encrypt(message, address, privateKey)
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

export default {...box}
