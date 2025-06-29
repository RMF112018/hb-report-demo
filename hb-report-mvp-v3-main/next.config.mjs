/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: async () => {
              const postcssTailwindcss = await import('@tailwindcss/postcss');
              const autoprefixer = await import('autoprefixer');
              return {
                plugins: [
                  postcssTailwindcss.default,
                  autoprefixer.default,
                ],
              };
            },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;