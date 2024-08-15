export default class Convert {

	/**
	 * Convert a string (UTF-8 encoded) to a byte array
	 *
	 * @param {String} str UTF-8 encoded string
	 * @return {Uint8Array} Byte array
	 */
	static str2bin(str: string): Uint8Array {
		str = str.replace(/\r\n/g, '\n')
		const bin = new Uint8Array(str.length * 3)
		let p = 0
		for (let i = 0, len = str.length; i < len; i++) {
			const c = str.charCodeAt(i)
			if (c < 128) {
				bin[p++] = c
			} else if (c < 2048) {
				bin[p++] = (c >>> 6) | 192
				bin[p++] = (c & 63) | 128
			} else {
				bin[p++] = (c >>> 12) | 224
				bin[p++] = ((c >>> 6) & 63) | 128
				bin[p++] = (c & 63) | 128
			}
		}
		return bin.subarray(0, p)
	}

	/**
	 * Convert a byte array to a UTF-8 encoded string
	 *
	 * @param {Uint8Array} arr Byte array
	 * @return {string} UTF-8 encoded string
	 */
	static encodeUTF8 = (arr: Uint8Array): string => {
		const s = []
		for (let i = 0; i < arr.length; i++) {
			s.push(String.fromCharCode(arr[i]))
		}
		return decodeURIComponent(escape(s.join('')))
	}

	/**
	 * Convert a UTF-8 encoded string to a byte array
	 *
	 * @param {string} str UTF-8 encoded string
	 * @return {Uint8Array} Byte array
	 */
	static decodeUTF8 = (str: string): Uint8Array => {
		if (typeof str !== 'string') {
			throw new TypeError('expected string')
		}
		const d = unescape(encodeURIComponent(str))
		const b = new Uint8Array(d.length)
		for (let i = 0; i < d.length; i++) {
			b[i] = d.charCodeAt(i)
		}
		return b
	}

	/**
	 * Convert Array of 8 bytes (int64) to hex string
	 *
	 * @param {Uint8Array} bin Array of bytes
	 * @return {String} Hex encoded string
	 */
	static ab2hex = (buf: ArrayBuffer): string => {
		return Array.prototype.map.call(new Uint8Array(buf), x => (`00${x.toString(16)}`).slice(-2)).join('')
	}

	/**
	 * Convert hex string to array of 8 bytes (int64)
	 *
	 * @param {String} bin Array of bytes
	 * @return {Uint8Array} Array of 8 bytes (int64)
	 */
	static hex2ab = (hex: string): Uint8Array => {
		const ab = []
		for (let i = 0; i < hex.length; i += 2) {
			ab.push(parseInt(hex.substring(i, i+2), 16))
		}
		return new Uint8Array(ab)
	}

	/**
	 * Convert a decimal number to hex string
	 *
	 * @param {String} str Decimal to be converted
	 * @param {Number} bytes Length of the output to be padded
	 * @returns Hexadecimal string representation of the inputed decimal
	 */
	static dec2hex = (str: number | string, bytes: number): string => {
		const decimals = str.toString().split('')
		const sum = []
		let hex = []
		let i: number
		let s: number

		while (decimals.length) {
			s = 1 * +decimals.shift()
			for (i = 0; s || i < sum.length; i++) {
				s += (sum[i] || 0) * 10
				sum[i] = s % 16
				s = (s - sum[i]) / 16
			}
		}

		while (sum.length) {
			hex.push(sum.pop().toString(16))
		}

		let joined = hex.join('')

		if (joined.length % 2 != 0) {
			joined = `0${joined}`
		}

		if (bytes > joined.length / 2) {
			const diff = bytes - joined.length / 2
			for (let i = 0; i < diff; i++) {
				joined = `00${joined}`
			}
		}

		return joined
	}

	static dec2bin = (dec: number): string => {
		return (dec >>> 0).toString(2)
	}

	static bytesToHexString = (bytes: number[]): string => {
		return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('')
	}

	static hexStringToBinary = (hex: string): string => {
		return [...hex].map(c => (Convert.dec2bin(parseInt(c, 16))).padStart(4, '0')).join('')
	}

	static binaryToHexString = (bin: string): string => {
		return parseInt(bin, 2).toString(16)
	}

	static stringToHex = (str: string): string => {
		return [...str].map(c => c.charCodeAt(0).toString(16)).join('')
	}

}
