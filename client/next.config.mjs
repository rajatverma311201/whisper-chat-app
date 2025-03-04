/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [], // Leave empty to allow no specific domains
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**", // Allows all HTTPS hosts
			},
			{
				protocol: "http",
				hostname: "**", // Allows all HTTP hosts (use with caution)
			},
		],
	},
	reactStrictMode: false,
};

export default nextConfig;
