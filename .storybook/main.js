const path = require("path")

module.exports = {
    stories: ["../src/**/*.stories.mdx", "../src/**/stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        {
          name: '@storybook/addon-postcss',
          options: {
            postcssLoaderOptions: {
              implementation: require('postcss'),
            },
          },
        },
    ],
    // https://gist.github.com/justincy/b8805ae2b333ac98d5a3bd9f431e8f70#gistcomment-3687800

    // https://github.com/storybookjs/presets/issues/195
    // yarn remove sass-loader && yarn add sass-loader@10.1.1
    // yarn remove style-loader && yarn add style-loader@2.0.0 // still not working for me
    // yarn remove css-loader && yarn add css-loader@5.2.6
    webpackFinal: async (config) => {
        config.resolve.modules.push(`${process.cwd()}/src`)
        config.resolve.alias = {
            ...config.resolve.alias,
            "&": path.resolve(__dirname, "../src/components/domains/"),
            "&R": path.resolve(__dirname, "../src/components/domains/erp/"),
            "&A": path.resolve(__dirname, "../src/components/domains/assistencia/"),
            "&M": path.resolve(__dirname, "../src/components/domains/rastreamento/"),
            "@": path.resolve(__dirname, "../src/components/")
        }
        config.module.rules.push({
            test: /\.(sc|sa|c)ss$/,
            use: [
                "style-loader",
                {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1,
                        modules: {
                            auto: true,
                        },
                    },
                },
                "sass-loader",
                {
                    loader: "postcss-loader",
                    options: {
                        // it "compiles" when I omit these options but I didn't confirm whether the correct postcss
                        // version is imported when omiting this.. So having it here helps me sleep at night
                        implementation: require("postcss"),
                        postcssOptions: {
                            config: path.resolve(__dirname, "..", "postcss.config.js"),
                        },
                    },
                }
            ],
            include: path.resolve(__dirname, "..", "src")
        })
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack", "url-loader"],
            include: path.resolve(__dirname, "..", "src")
        })

        return config
    },
}